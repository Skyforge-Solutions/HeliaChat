import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api/ApiClient';

const CreditContext = createContext();

export function CreditProvider({ children }) {
	const [credits, setCredits] = useState(0);

	// Use the React Query hook directly
	const {
		data: creditData,
		isLoading: loading,
		refetch: refetchCredits,
		isFetching,
	} = apiClient.billing.useGetCredits({
		onSuccess: (data) => {
			if (data) {
				setCredits(data);
			}
		},
		onError: (error) => {
			console.error('Failed to load credits:', error);
		},
	});

	// Save credits to localStorage as backup whenever they change
	useEffect(() => {
		if (!loading && credits) {
			localStorage.setItem('heliaCredits', credits.toString());
		}
	}, [credits, loading]);

	// Effect to get credit data when loading is complete
	useEffect(() => {
		if (!loading && creditData) {
			setCredits(creditData.credits_remaining);
		}
	}, [loading, creditData]);

	// Use one credit (for sending a message)
	const useCredit = async () => {
		if (credits > 0) {
			// Optimistically update the UI
			setCredits((prev) => prev - 1);

			// We'd need to add this endpoint to the API client
			// For now, we're just returning true since we updated locally
			// Ideally, we'd call something like:
			// await apiClient.billing.useConsumeCredit().mutateAsync();
			return true;
		}
		return false; // No credits available
	};

	// Refresh credit balance from the server
	const refreshCredits = async () => {
		try {
			const { data } = await refetchCredits();
			if (data) {
				setCredits(data.credits_remaining);
			}
			return data;
		} catch (error) {
			console.error('Failed to refresh credits:', error);
			throw error;
		}
	};

	return (
		<CreditContext.Provider
			value={{
				credits,
				loading: loading || isFetching,
				useCredit,
				refreshCredits,
			}}
		>
			{children}
		</CreditContext.Provider>
	);
}

export function useCredits() {
	const context = useContext(CreditContext);
	if (!context) {
		throw new Error('useCredits must be used within a CreditProvider');
	}
	return context;
}
