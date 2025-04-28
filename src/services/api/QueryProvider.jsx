import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: 1,
		},
		mutations: {
			retry: 0,
		},
	},
});

// Export queryClient for direct access if needed
export { queryClient };

// Provider component to wrap the app
const QueryProvider = ({ children }) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
