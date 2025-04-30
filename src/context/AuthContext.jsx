import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register, logout as logoutService } from '../services/authService';

import apiClient from '../services/api/ApiClient';
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState({
		isAuthenticated: false,
		user: null,
		loading: true
	});
	const { data: profile, isLoading: isProfileLoading } = apiClient.auth.useGetProfile();
	
	useEffect(() => {
		if (profile) {
			setAuthState({
				isAuthenticated: true,
				user: profile,
				loading: false
			});
		}
	}, [profile]);

	const login = async (email, password) => {
		try {
			const data = await loginService(email, password);
			const userData = {
				name: data.user_name,
				token: data.access_token,
				refreshToken: data.refresh_token,
			};
			localStorage.setItem('heliaUser', JSON.stringify(userData));
			setAuthState({
				isAuthenticated: true,
				user: userData,
				loading: false
			});
			return userData;
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
