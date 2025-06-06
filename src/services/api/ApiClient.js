import HttpClient from './HttpClient';
import axios from 'axios';

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
      // Billing related keys
      billingPlans: ['billing', 'plans'],
      billingCredits: ['billing', 'credits'],
      billingPurchases: ['billing', 'purchases'],
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

    // Request password reset
    useRequestPasswordReset: (options = {}) => {
      return useMutation({
        mutationFn: async (email) => {
          const response = await this.publicClient.post('/api/auth/password-reset/request', { email });
          return response.data;
        },
        ...options,
      });
    },

    // Verify password reset token and set new password
    useVerifyPasswordReset: (options = {}) => {
      return useMutation({
        mutationFn: async ({ token, newPassword }) => {
          const response = await this.publicClient.post('/api/auth/password-reset/verify', {
            token,
            new_password: newPassword,
          });
          return response.data;
        },
        ...options,
      });
    },

    // Update user password
    useUpdatePassword: (options = {}) => {
      return useMutation({
        mutationFn: async ({ currentPassword, newPassword }) => {
          const response = await this.authClient.patch('/api/auth/password', {
            current_password: currentPassword,
            new_password: newPassword,
          });
          return response.data;
        },
        ...options,
      });
    },

    // Request email change (Step 1)
    useRequestEmailChange: (options = {}) => {
      return useMutation({
        mutationFn: async ({ newEmail, currentPassword }) => {
          const response = await this.authClient.post('/api/auth/email/request', {
            new_email: newEmail,
            current_password: currentPassword,
          });
          return response.data;
        },
        ...options,
      });
    },

    // Verify email change with OTP (Step 2)
    useVerifyEmailChange: (options = {}) => {
      return useMutation({
        mutationFn: async (otp) => {
          const response = await this.authClient.post('/api/auth/email/verify', {
            otp,
          });
          return response.data;
        },
        ...options,
      });
    },

    // Delete user account
    useDeleteAccount: (options = {}) => {
      return useMutation({
        mutationFn: async (password) => {
          const response = await this.authClient.delete('/api/auth/me', {
            data: { password }
          });
          return response.data;
        },
        ...options,
      });
    },
  };

  // Chat related hooks
  chat = {
    // Delete all chat sessions
    useDeleteAllSessions: (options = {}) => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async () => {
          const response = await this.authClient.delete('/api/sessions');
          return response.data;
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: this.keys.sessions });
          if (options.onSuccess) options.onSuccess(data, variables, context);
        },
        ...options,
      });
    },

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

  // Billing related hooks
  billing = {
    // Get available credit plans
    useGetPlans: (options = {}) => {
      return useQuery({
        queryKey: this.keys.billingPlans,
        queryFn: async () => {
          const response = await this.authClient.get('/api/billing/plans');
          return response.data;
        },
        ...options,
      });
    },

    // Get user's credit balance
    useGetCredits: (options = {}) => {
      return useQuery({
        queryKey: this.keys.billingCredits,
        queryFn: async () => {
          const response = await this.authClient.get('/api/billing/credits');
          return response.data;
        },
        ...options,
      });
    },

    // Create checkout session
    useCreateCheckout: (options = {}) => {
      return useMutation({
        mutationFn: async (productId) => {
          const response = await this.authClient.post('/api/billing/create-checkout', {
            product_id: productId,
          });
          return response.data;
        },
        ...options,
      });
    },

    // Get purchase history
    useGetPurchases: (options = {}) => {
      return useQuery({
        queryKey: this.keys.billingPurchases,
        queryFn: async () => {
          const response = await this.authClient.get('/api/billing/purchases');
          return response.data;
        },
        ...options,
      });
    },



    // Get detailed information about a specific payment
    useGetPaymentDetails: (paymentId, options = {}) => {
      return useQuery({
        queryKey: ['billing', 'payment', paymentId],
        queryFn: async () => {
          const response = await this.authClient.get(`/api/billing/payments/${paymentId}`);
          return response.data;
        },
        enabled: !!paymentId,
        ...options,
      });
    },


    // Download invoice PDF for a specific payment
    useDownloadInvoice: (options = {}) => {
      return useMutation({
        mutationFn: async (paymentId) => {
          const response = await this.authClient.get(`/api/billing/download-invoice/${paymentId}`);
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