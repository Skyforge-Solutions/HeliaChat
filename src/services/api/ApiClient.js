import HttpClient from './HttpClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
import { useQuery, useMutation, useQueryClient, experimental_streamedQuery } from '@tanstack/react-query';

/**
 * API Client class to manage all API requests with React Query
 */
class ApiClient {
  constructor() {
    // Create different HTTP clients as needed
    this.authClient = new HttpClient(undefined, true);
    this.publicClient = new HttpClient();

    // Store query keys
    this.keys = {
      // Auth related keys
      profile: ['auth', 'profile'],
      // Chat related keys
      sessions: ['chat', 'sessions'],
      session: (id) => ['chat', 'sessions', id],
      history: (chatId) => ['chat', 'history', chatId],
    };
  }

  // Authentication related hooks
  auth = {
    // Register a new user
    useRegister: (options = {}) => {

      return useMutation({
        mutationFn: async (userData) => {
          const response = await this.publicClient.post('/api/auth/register', userData);
          return response.data;
        },
        onSuccess: (data, variables, context) => {
          if (options.onSuccess) options.onSuccess(data, variables, context);
        },
        ...options,
      });
    },

    // Login and get token
    useLogin: (options = {}) => {
      return useMutation({
        mutationFn: async ({ username, password }) => {
          // Note: This endpoint expects form data, not JSON
          const formData = new URLSearchParams();
          formData.append('username', username);
          formData.append('password', password);

          const response = await this.publicClient.post('/api/auth/token', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          return response.data;
        },
        ...options,
      });
    },

    // Get current user profile
    useGetProfile: (options = {}) => {
      return useQuery({
        queryKey: this.keys.profile,
        queryFn: async () => {
          const response = await this.authClient.get('/api/auth/me');
          return response.data;
        },
        ...options,
      });
    },
  };

  // Chat related hooks
  chat = {
    

    // Get all chat sessions
    useGetSessions: (options = {}) => {
      return useQuery({
        queryKey: this.keys.sessions,
        queryFn: async () => {
          const response = await this.authClient.get('/api/sessions');
          return response.data;
        },
        ...options,
      });
    },

    // Create a new chat session
    useCreateSession: (options = {}) => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async (data = { name: "New Chat" }) => {
          const response = await this.authClient.post(`/api/sessions?name=${encodeURIComponent(data.name)}`);
          return response.data;
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: this.keys.sessions });
          if (options.onSuccess) options.onSuccess(data, variables, context);
        },
        ...options,
      });
    },

    // Rename a chat session
    useRenameSession: (options = {}) => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async ({ chatId, name }) => {
          const response = await this.authClient.put(`/api/sessions/${chatId}?name=${encodeURIComponent(name)}`);
          return response.data;
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: this.keys.session(variables.chatId) });
          queryClient.invalidateQueries({ queryKey: this.keys.sessions });
          if (options.onSuccess) options.onSuccess(data, variables, context);
        },
        ...options,
      });
    },

    // Delete a chat session
    useDeleteSession: (options = {}) => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async (chatId) => {
          const response = await this.authClient.delete(`/api/sessions/${chatId}`);
          return response.data;
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: this.keys.sessions });
          if (options.onSuccess) options.onSuccess(data, variables, context);
        },
        ...options,
      });
    },

    // Get a specific chat session
    useGetSession: (chatId, options = {}) => {
      return useQuery({
        queryKey: this.keys.session(chatId),
        queryFn: async () => {
          const response = await this.authClient.get(`/api/sessions/${chatId}`);
          return response.data;
        },
        enabled: !!chatId,
        ...options,
      });
    },

    // Get chat history for a session
    useGetHistory: (chatId, options = {}) => {
      return useQuery({
        queryKey: this.keys.history(chatId),
        queryFn: async () => {
          const response = await this.authClient.get(`/api/history/${chatId}`);
          return response.data;
        },
        enabled: !!chatId,
      
        ...options,
      });
    },
  };

  // User profile related hooks
  users = {
    // Update user profile
    useUpdateProfile: (options = {}) => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async (userData) => {
          const response = await this.authClient.put('/api/users/me', userData);
          return response.data;
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: this.keys.profile });
          if (options.onSuccess) options.onSuccess(data, variables, context);
        },
        ...options,
      });
    },

    // Get user profile (same as auth.useGetProfile but with different endpoint)
    useGetProfile: (options = {}) => {
      return useQuery({
        queryKey: this.keys.profile,
        queryFn: async () => {
          const response = await this.authClient.get('/api/users/me');
          return response.data;
        },
        ...options,
      });
    },
  };
}

// Create and export a singleton instance
const apiClient = new ApiClient();

export default apiClient; 