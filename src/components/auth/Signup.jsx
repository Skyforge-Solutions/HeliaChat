import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { register, verifyEmail } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useSignup } from '../../context/SignupContext';
import { useCredits } from '../../context/CreditContext';

export default function Signup() {
	const { login } = useAuth();
	const { signupStep, setSignupStep, signupData, updateSignupData, resetSignup } = useSignup();
	const { resetCredits } = useCredits();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [otp, setOtp] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState({
		score: 0,
		hasMinLength: false,
		hasUppercase: false,
		hasNumber: false,
		hasSpecial: false,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Check password strength
		if (name === 'password') {
			const strength = {
				hasMinLength: value.length >= 8,
				hasUppercase: /[A-Z]/.test(value),
				hasNumber: /[0-9]/.test(value),
				hasSpecial: /[^A-Za-z0-9]/.test(value),
			};

			// Calculate score (0-4)
			const score = Object.values(strength).filter(Boolean).length;

			setPasswordStrength({
				...strength,
				score,
			});
		}
	};

	const getPasswordStrengthColor = () => {
		const { score } = passwordStrength;
		if (score === 0) return 'bg-gray-200 dark:bg-gray-700';
		if (score === 1) return 'bg-red-500';
		if (score === 2) return 'bg-orange-500';
		if (score === 3) return 'bg-yellow-500';
		if (score === 4) return 'bg-green-500';
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Form validation
		if (!formData.name || !formData.email || !formData.password) {
			setError('Please fill in all required fields');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (passwordStrength.score < 3) {
			setError('Please create a stronger password');
			return;
		}
		setError('');
		setIsLoading(true);

		try {
			const response = await register({
				name: formData.name,
				email: formData.email,
				password: formData.password,
			});
			// Store signup data in context
			updateSignupData({
				name: formData.name,
				email: formData.email,
				password: formData.password,
			});

			// Move to verification step
			setSignupStep(2);
		} catch (err) {
			setError(err.message || 'Failed to create account. Please try again.');
			console.error('Signup error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyEmail = async (e) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);
		try {
			await verifyEmail(signupData.email, otp);

			// Initialize credits for the new user
			resetCredits();

			login(signupData.email, signupData.password);

			resetSignup();
		} catch (err) {
			setError(err.message || 'Failed to verify email. Please try again.');
			console.error('Verification error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	if (signupStep === 2) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background p-4'>
				<div className='w-full max-w-md'>
					<div className='text-center mb-8'>
						<img
							src={logo}
							alt='HeliaChat Logo'
							className='h-12 mx-auto mb-4'
						/>
						<h1 className='text-2xl font-bold text-foreground'>Verify your email</h1>
						<p className='text-muted-foreground mt-2'>
							We've sent a verification code to {signupData.email}
						</p>
					</div>

					{error && (
						<div className='bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4'>
							{error}
						</div>
					)}

					<form
						onSubmit={handleVerifyEmail}
						className='space-y-4'
					>
						<div>
							<label
								htmlFor='otp'
								className='block text-sm font-medium text-foreground mb-1'
							>
								Verification Code <span className='text-destructive'>*</span>
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FiMail className='text-muted-foreground' />
								</div>
								<input
									id='otp'
									type='text'
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									className='block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder='Enter verification code'
									disabled={isLoading}
									required
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
									isLoading ? 'opacity-70 cursor-not-allowed' : ''
								}`}
								disabled={isLoading}
							>
								{isLoading ? 'Verifying...' : 'Verify Email'}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			<div className='w-full max-w-md'>
				<div className='text-center mb-8'>
					<img
						src={logo}
						alt='HeliaChat Logo'
						className='h-12 mx-auto mb-4'
					/>
					<h1 className='text-2xl font-bold text-foreground'>Create your account</h1>
					<p className='text-muted-foreground mt-2'>Start your journey with HeliaChat</p>
				</div>

				{error && (
					<div className='bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4'>
						{error}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Full Name <span className='text-destructive'>*</span>
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<FiUser className='text-muted-foreground' />
							</div>
							<input
								id='name'
								name='name'
								type='text'
								value={formData.name}
								onChange={handleChange}
								className='block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
								placeholder='John Doe'
								disabled={isLoading}
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Email <span className='text-destructive'>*</span>
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<FiMail className='text-muted-foreground' />
							</div>
							<input
								id='email'
								name='email'
								type='email'
								value={formData.email}
								onChange={handleChange}
								className='block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
								placeholder='you@example.com'
								disabled={isLoading}
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Password <span className='text-destructive'>*</span>
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<FiLock className='text-muted-foreground' />
							</div>
							<input
								id='password'
								name='password'
								type={showPassword ? 'text' : 'password'}
								value={formData.password}
								onChange={handleChange}
								className='block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
								placeholder='••••••••'
								disabled={isLoading}
								required
							/>
							<button
								type='button'
								className='absolute inset-y-0 right-0 pr-3 flex items-center'
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<FiEyeOff className='text-muted-foreground hover:text-foreground' />
								) : (
									<FiEye className='text-muted-foreground hover:text-foreground' />
								)}
							</button>
						</div>

						{/* Password strength indicator */}
						<div className='mt-2'>
							<div className='w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
								<div
									className={`h-full ${getPasswordStrengthColor()}`}
									style={{ width: `${passwordStrength.score * 25}%` }}
								></div>
							</div>
							<ul className='mt-2 grid grid-cols-2 gap-1 text-xs text-foreground'>
								<li className='flex items-center'>
									{passwordStrength.hasMinLength ? (
										<FiCheck className='text-green-500 mr-1' />
									) : (
										<FiX className='text-muted-foreground mr-1' />
									)}
									At least 8 characters
								</li>
								<li className='flex items-center'>
									{passwordStrength.hasUppercase ? (
										<FiCheck className='text-green-500 mr-1' />
									) : (
										<FiX className='text-muted-foreground mr-1' />
									)}
									Uppercase letter
								</li>
								<li className='flex items-center'>
									{passwordStrength.hasNumber ? (
										<FiCheck className='text-green-500 mr-1' />
									) : (
										<FiX className='text-muted-foreground mr-1' />
									)}
									Number
								</li>
								<li className='flex items-center'>
									{passwordStrength.hasSpecial ? (
										<FiCheck className='text-green-500 mr-1' />
									) : (
										<FiX className='text-muted-foreground mr-1' />
									)}
									Special character
								</li>
							</ul>
						</div>
					</div>

					<div>
						<label
							htmlFor='confirmPassword'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Confirm Password <span className='text-destructive'>*</span>
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<FiLock className='text-muted-foreground' />
							</div>
							<input
								id='confirmPassword'
								name='confirmPassword'
								type={showPassword ? 'text' : 'password'}
								value={formData.confirmPassword}
								onChange={handleChange}
								className='block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
								placeholder='••••••••'
								disabled={isLoading}
								required
							/>
						</div>
					</div>

					<div className='flex items-center'>
						<input
							id='terms'
							name='terms'
							type='checkbox'
							className='h-4 w-4 text-primary focus:ring-primary border-input rounded'
							required
						/>
						<label
							htmlFor='terms'
							className='ml-2 block text-sm text-foreground'
						>
							I agree to the{' '}
							<a
								href='#'
								className='text-primary hover:text-primary/90'
							>
								Terms of Service
							</a>{' '}
							and{' '}
							<a
								href='#'
								className='text-primary hover:text-primary/90'
							>
								Privacy Policy
							</a>
						</label>
					</div>

					<div>
						<button
							type='submit'
							className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
								isLoading ? 'opacity-70 cursor-not-allowed' : ''
							}`}
							disabled={isLoading}
						>
							{isLoading ? 'Creating account...' : 'Sign up'}
						</button>
					</div>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-muted-foreground'>
						Already have an account?{' '}
						<Link
							to='/login'
							className='font-medium text-primary hover:text-primary'
						>
							Sign in
						</Link>
					</p>
				</div>

				<div className='mt-8'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-input'></div>
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 bg-background text-muted-foreground'>Or sign up with</span>
						</div>
					</div>

					<div className='mt-6 flex justify-center'>
						<button
							type='button'
							className='w-full max-w-xs inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-secondary'
						>
							<svg
								className='h-5 w-5'
								fill='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									d='M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z'
									fill='#EA4335'
								/>
								<path
									d='M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z'
									fill='#4285F4'
								/>
								<path
									d='M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z'
									fill='#FBBC05'
								/>
								<path
									d='M12.0001 24.0001C15.2401 24.0001 17.9651 22.935 19.9451 21.095L16.0801 18.095C15.0051 18.82 13.6201 19.25 12.0001 19.25C8.8701 19.25 6.2151 17.14 5.2701 14.295L1.2801 17.39C3.2551 21.31 7.3101 24.0001 12.0001 24.0001Z'
									fill='#34A853'
								/>
							</svg>
							<span className='ml-2'>Sign up with Google</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
