import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './index';

/**
 * Create a custom query hook
 * @param {string} endpoint - API endpoint
 * @param {Array|Function} queryKey - Query key or function returning query key
 * @param {Object} options - Additional options for useQuery
 * @param {boolean} authenticated - Whether to use authenticated client
 * @returns {Object} Query hook result
 */
export const useCustomQuery = (endpoint, queryKey, options = {}, authenticated = true) => {
  const client = authenticated ? apiClient.authClient : apiClient.publicClient;

  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      const response = await client.get(endpoint);
      return response.data;
    },
    ...options,
  });
};

/**
 * Create a custom mutation hook
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional options for useMutation
 * @param {Array|Function} invalidateQueries - Query keys to invalidate on success
 * @param {boolean} authenticated - Whether to use authenticated client
 * @returns {Object} Mutation hook result
 */
export const useCustomMutation = (
  endpoint,
  options = {},
  invalidateQueries = [],
  authenticated = true
) => {
  const queryClient = useQueryClient();
  const client = authenticated ? apiClient.authClient : apiClient.publicClient;

  return useMutation({
    mutationFn: async (data) => {
      const response = await client.post(endpoint, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate queries if specified
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach(key => {
          queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
        });
      }

      // Call original onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * Create a PUT mutation hook
 */
export const useCustomPutMutation = (
  endpoint,
  options = {},
  invalidateQueries = [],
  authenticated = true
) => {
  const queryClient = useQueryClient();
  const client = authenticated ? apiClient.authClient : apiClient.publicClient;

  return useMutation({
    mutationFn: async (data) => {
      const response = await client.put(endpoint, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach(key => {
          queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
        });
      }

      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * Create a PATCH mutation hook
 */
export const useCustomPatchMutation = (
  endpoint,
  options = {},
  invalidateQueries = [],
  authenticated = true
) => {
  const queryClient = useQueryClient();
  const client = authenticated ? apiClient.authClient : apiClient.publicClient;

  return useMutation({
    mutationFn: async (data) => {
      const response = await client.patch(endpoint, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach(key => {
          queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
        });
      }

      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * Create a DELETE mutation hook
 */
export const useCustomDeleteMutation = (
  endpoint,
  options = {},
  invalidateQueries = [],
  authenticated = true
) => {
  const queryClient = useQueryClient();
  const client = authenticated ? apiClient.authClient : apiClient.publicClient;

  return useMutation({
    mutationFn: async (id) => {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const response = await client.delete(url);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach(key => {
          queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
        });
      }

      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}; 