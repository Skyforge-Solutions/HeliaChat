import { createContext, useContext, useState } from 'react';

const SignupContext = createContext();

export function SignupProvider({ children }) {
	const [signupStep, setSignupStep] = useState(1); // 1: initial form, 2: verification
	const [signupData, setSignupData] = useState({
		name: '',
		email: '',
		password: '',
	});

	const updateSignupData = (data) => {
		setSignupData((prev) => ({ ...prev, ...data }));
	};

	const resetSignup = () => {
		setSignupStep(1);
		setSignupData({
			name: '',
			email: '',
			password: '',
		});
	};

	return (
		<SignupContext.Provider
			value={{
				signupStep,
				setSignupStep,
				signupData,
				updateSignupData,
				resetSignup,
			}}
		>
			{children}
		</SignupContext.Provider>
	);
}

export function useSignup() {
	const context = useContext(SignupContext);
	if (!context) {
		throw new Error('useSignup must be used within a SignupProvider');
	}
	return context;
}
