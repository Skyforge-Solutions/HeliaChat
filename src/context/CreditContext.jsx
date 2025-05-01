import { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_CREDITS = 100; // Default number of credits for new users
const CreditContext = createContext();

export function CreditProvider({ children }) {
	const [credits, setCredits] = useState(0);
	const [loading, setLoading] = useState(true);

	// Load credits from localStorage on initialization
	useEffect(() => {
		const loadCredits = () => {
			const storedCredits = localStorage.getItem('heliaCredits');
			if (storedCredits !== null) {
				setCredits(parseInt(storedCredits, 10));
			}
			setLoading(false);
		};

		loadCredits();
	}, []);

	// Save credits to localStorage whenever they change
	useEffect(() => {
		if (!loading) {
			localStorage.setItem('heliaCredits', credits.toString());
		}
	}, [credits, loading]);

	// Add credits to a user account
	const addCredits = (amount) => {
		setCredits((prev) => prev + amount);
	};

	// Use one credit (for sending a message)
	const useCredit = () => {
		if (credits > 0) {
			setCredits((prev) => prev - 1);
			return true; // Successfully used a credit
		}
		return false; // No credits available
	};

	// Reset credits to default (for new users)
	const resetCredits = () => {
		setCredits(DEFAULT_CREDITS);
	};

	return (
		<CreditContext.Provider
			value={{
				credits,
				loading,
				addCredits,
				useCredit,
				resetCredits,
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
