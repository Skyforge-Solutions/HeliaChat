import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register, logout as logoutService, getProfile } from '../services/authService';

import apiClient from '../services/api/ApiClient';
import { useCredits } from './CreditContext';
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState({
		isAuthenticated: false,
		user: null,
		loading: true
	});
	const { data: profile, isLoading: isProfileLoading } = apiClient.auth.useGetProfile();
	const { refreshCredits } = useCredits();
	
	useEffect(() => {
		if (profile) {
			setAuthState({
				isAuthenticated: true,
				user: profile,
				loading: false
			});
		}
		else if (!isProfileLoading) {
			setAuthState({
				isAuthenticated: false,
				user: null,
				loading: false
			});
		}
	}, [profile, isProfileLoading]);

	const login = async (email, password) => {
		try {
			const data = await loginService(email, password);
					const userData = {
						name: data.user_name,
						token: data.access_token,
						refreshToken: data.refresh_token,
					};

					localStorage.setItem('heliaUser', JSON.stringify(userData));
					const user = await getProfile();
					setAuthState({
						isAuthenticated: true,
						user: user,
				loading: false,
			});
			
			if (refreshCredits ) {
				await refreshCredits();
			}

			return data;
		} catch (error) {
			throw error;
		}
	};

	const signup = async (userData) => {
		try {
			const response = await register(userData);
			return response;
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		try {
			logoutService(); // Call the logout service
			localStorage.removeItem('heliaUser');
			setAuthState({
				isAuthenticated: false,
				user: null,
				loading: false
			});
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: authState.isAuthenticated,
				user: authState.user,
				loading: isProfileLoading || authState.loading,
				isProfileLoading,
				login,
				signup,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
