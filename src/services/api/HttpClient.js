import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

/**
 * Enhanced HTTP client with comprehensive error handling and request/response interceptors.
 */
class HttpClient {
  /**
   * Creates a new HttpClient instance
   * @param {string} baseURL - Base URL for API requests
   * @param {boolean} auth - Whether to use authentication
   * @param {Object} options - Additional configuration options
   */
  constructor(baseURL, auth = false, options = {}) {
    const {
      timeout = 30000,
      defaultHeaders = {},
    } = options;

    this.pendingRequests = new Map();
    this.isRefreshing = false;
    this.refreshSubscribers = [];

    this.client = axios.create({
      baseURL: baseURL || API_URL,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
      },
      timeout,
      withCredentials: !!options.withCredentials,
    });

    if (auth) {
      this.setupAuthInterceptors();
    }

    // Setup request and response interceptors
    this.setupRequestInterceptors();
    this.setupResponseInterceptors();
  }

  /**
   * Sets up authentication interceptors for adding tokens to requests
   */
  setupAuthInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Gets the authentication token from storage
   * @returns {string|null} The authentication token
   */
  getAuthToken() {
    try {
      return `${JSON.parse(localStorage.getItem('heliaUser'))?.token || JSON.parse(sessionStorage.getItem('heliaUser'))?.token}`;
    } catch (error) {
      console.error('Error accessing token storage:', error);
      return null;
    }
  }

  /**
   * Gets the refresh token from storage
   * @returns {string|null} The refresh token
   */
  getRefreshToken() {
    try {
      return JSON.parse(localStorage.getItem('heliaUser'))?.refreshToken ||
        JSON.parse(sessionStorage.getItem('heliaUser'))?.refreshToken;
    } catch (error) {
      console.error('Error accessing refresh token storage:', error);
      return null;
    }
  }

  /**
   * Updates the stored tokens
   * @param {Object} tokenData - The new token data
   */
  updateTokens(tokenData) {
    try {
      // Update in localStorage if token exists there
      const localUser = localStorage.getItem('heliaUser');
      if (localUser) {
        const userData = JSON.parse(localUser);
        userData.token = tokenData.access_token;
        userData.refreshToken = tokenData.refresh_token;
        localStorage.setItem('heliaUser', JSON.stringify(userData));
      }

      // Update in sessionStorage if token exists there
      const sessionUser = sessionStorage.getItem('heliaUser');
      if (sessionUser) {
        const userData = JSON.parse(sessionUser);
        userData.token = tokenData.access_token;
        userData.refreshToken = tokenData.refresh_token;
        sessionStorage.setItem('heliaUser', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error updating tokens in storage:', error);
    }
  }

  /**
   * Refreshes the access token using the refresh token
   * @returns {Promise<string>} The new access token
   */
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_URL}/api/auth/token/refresh`, {
        refresh_token: refreshToken
      });

      const { access_token, refresh_token } = response.data;
      this.updateTokens({ access_token, refresh_token });

      return access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Clear tokens on refresh failure
      localStorage.removeItem('heliaUser');
      sessionStorage.removeItem('heliaUser');
      throw error;
    }
  }

  /**
   * Subscribe to token refresh
   * @param {Function} callback - Function to call when token is refreshed
   */
  onTokenRefreshed(callback) {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify all subscribers that token has been refreshed
   * @param {string} token - The new token
   */
  notifyTokenRefreshed(token) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Sets up request interceptors for tracking and deduplication
   */
  setupRequestInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        // Generate a unique request ID
        const requestId = `${config.method}:${config.url}:${Date.now()}`;
        config.requestId = requestId;

        // Track pending requests
        this.pendingRequests.set(requestId, { timestamp: Date.now() });

        // Add request start time for performance tracking
        config.metadata = { startTime: new Date() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Sets up response interceptors for error handling
   */
  setupResponseInterceptors() {
    this.client.interceptors.response.use(
      (response) => {
        // Calculate request duration
        const { config } = response;
        const endTime = new Date();
        const duration = endTime - config.metadata.startTime;

        // Clean up tracking
        if (config.requestId) {
          this.pendingRequests.delete(config.requestId);
        }

        return response;
      },
      async (error) => {
        const { config } = error;

        // If no config exists, this is not a request error
        if (!config) {
          console.error('Request configuration error:', error.message);
          return Promise.reject(error);
        }

        // Get request tracking info
        const requestId = config.requestId;

        // Clean up tracking
        if (requestId) {
          this.pendingRequests.delete(requestId);
        }

        // Handle token refresh for 401 errors
        if (error.response && error.response.status === 401 && !config._retry) {
          if (this.isRefreshing) {
            // Wait for the token to be refreshed
            return new Promise((resolve, reject) => {
              this.onTokenRefreshed(token => {
                // Replace the expired token and retry
                config.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(config));
              });
            });
          }

          config._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.isRefreshing = false;

            // Update the request with the new token
            config.headers.Authorization = `Bearer ${newToken}`;

            // Notify all the subscribers about the new token
            this.notifyTokenRefreshed(newToken);

            // Retry the original request
            return this.client(config);
          } catch (refreshError) {
            this.isRefreshing = false;
            // If refresh fails, proceed with normal error handling
            await this.handleResponseError(error);
            return Promise.reject(error);
          }
        }

        // Handle different error types
        if (error.response) {
          await this.handleResponseError(error);
        } else if (error.request) {
          // Network error or no response
          console.error('Network error - no response received:', error.request);
        } else {
          // Error in request configuration
          console.error('Request configuration error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Handles response errors based on status code
   * @param {Error} error - The error with response
   */
  async handleResponseError(error) {
    const { status, data } = error.response;
    const { url, method } = error.config;

    switch (status) {
      case 400:
        // Bad request
        console.error('Bad request:', data);
        break;

      case 401:
        // Handle unauthorized
        console.error('Unauthorized access:', url);

        // Clear tokens
        try {
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
        } catch (e) {
          console.error('Error clearing auth tokens:', e);
        }
        break;

      case 403:
        // Handle forbidden
        console.error('Access forbidden:', url);
        break;

      case 404:
        // Handle not found
        console.error('Resource not found:', url);
        break;

      case 422:
        // Validation errors
        console.error('Validation error:', data);
        break;

      case 429:
        // Rate limiting
        console.error('Rate limit exceeded:', url);
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Handle server errors
        console.error(`Server error (${status}):`, url);
        break;

      default:
        // Handle other status codes
        console.error(`HTTP error ${status}:`, url);
        break;
    }
  }

  /**
   * Cancels all pending requests
   */
  cancelPendingRequests() {
    this.pendingRequests.forEach((info, requestId) => {
      console.log(`Cancelling request: ${requestId}`);
    });
    this.pendingRequests.clear();
  }

  /**
   * Makes a GET request
   * @param {string} url - The URL to request
   * @param {Object} config - Additional axios config
   * @returns {Promise} The response
   */
  async get(url, config = {}) {
    try {
      return await this.client.get(url, this.prepareConfig(config));
    } catch (error) {
      this.handleMethodError('GET', url, null, error);
      throw error;
    }
  }

  /**
   * Makes a POST request
   * @param {string} url - The URL to request
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config
   * @returns {Promise} The response
   */
  async post(url, data = {}, config = {}) {
    try {
      return await this.client.post(url, data, this.prepareConfig(config));
    } catch (error) {
      this.handleMethodError('POST', url, data, error);
      throw error;
    }
  }

  /**
   * Makes a PUT request
   * @param {string} url - The URL to request
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config
   * @returns {Promise} The response
   */
  async put(url, data = {}, config = {}) {
    try {
      return await this.client.put(url, data, this.prepareConfig(config));
    } catch (error) {
      this.handleMethodError('PUT', url, data, error);
      throw error;
    }
  }

  /**
   * Makes a PATCH request
   * @param {string} url - The URL to request
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config
   * @returns {Promise} The response
   */
  async patch(url, data = {}, config = {}) {
    try {
      return await this.client.patch(url, data, this.prepareConfig(config));
    } catch (error) {
      this.handleMethodError('PATCH', url, data, error);
      throw error;
    }
  }

  /**
   * Makes a DELETE request
   * @param {string} url - The URL to request
   * @param {Object} config - Additional axios config
   * @returns {Promise} The response
   */
  async delete(url, config = {}) {
    try {
      return await this.client.delete(url, this.prepareConfig(config));
    } catch (error) {
      this.handleMethodError('DELETE', url, null, error);
      throw error;
    }
  }

  /**
   * Prepares the config object with default options
   * @param {Object} config - The config to prepare
   * @returns {Object} The prepared config
   */
  prepareConfig(config) {
    // Add any default configurations here
    return {
      ...config,
      // Add request ID or other metadata
      metadata: {
        ...(config.metadata || {}),
        clientTimestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Handles errors from specific HTTP methods
   * @param {string} method - The HTTP method
   * @param {string} url - The URL requested
   * @param {Object} data - The data sent (if any)
   * @param {Error} error - The error that occurred
   */
  handleMethodError(method, url, data, error) {
    // Log method-specific errors
    console.error(`${method} request to ${url} failed:`, error.message);
  }
}

export default HttpClient;