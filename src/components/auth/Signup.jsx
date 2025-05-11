import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck, FiX, FiX as FiClose } from 'react-icons/fi';
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
	const [showTerms, setShowTerms] = useState(false);
	const [showPrivacy, setShowPrivacy] = useState(false);
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

	// Modal component for Terms and Privacy
	const Modal = ({ isOpen, onClose, title, children }) => {
		if (!isOpen) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
				<div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-auto">
					<div className="p-4 border-b border-input flex justify-between items-center">
						<h2 className="text-xl font-semibold text-foreground">{title}</h2>
						<button onClick={onClose} className="text-muted-foreground hover:text-foreground">
							<FiClose size={20} />
						</button>
					</div>
					<div className="p-6 text-foreground">
						{children}
					</div>
					<div className="p-4 border-t border-input flex justify-end">
						<button
							onClick={onClose}
							className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		);
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
							<button
								type='button'
								onClick={() => setShowTerms(true)}
								className='text-primary hover:text-primary/90 underline'
							>
								Terms of Service
							</button>{' '}
							and{' '}
							<button
								type='button'
								onClick={() => setShowPrivacy(true)}
								className='text-primary hover:text-primary/90 underline'
							>
								Privacy Policy
							</button>
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
			</div>

			{/* Terms of Service Modal */}
			<Modal
				isOpen={showTerms}
				onClose={() => setShowTerms(false)}
				title="Terms of Service"
			>
				<div className="space-y-4">
					<h3 className="text-lg font-medium">1. Acceptance of Terms</h3>
					<p>
						By accessing and using the HeliaChat service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
					</p>

					<h3 className="text-lg font-medium">2. Description of Service</h3>
					<p>
						HeliaChat provides a chat platform that enables users to interact with AI assistants for various purposes. The Service is provided "as is" and "as available" without warranties of any kind.
					</p>

					<h3 className="text-lg font-medium">3. User Accounts</h3>
					<p>
						To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
					</p>

					<h3 className="text-lg font-medium">4. User Content</h3>
					<p>
						Users may submit content through the Service. You retain ownership of your content, but grant HeliaChat a license to use, modify, and display that content as needed to provide the Service.
					</p>

					<h3 className="text-lg font-medium">5. Prohibited Activities</h3>
					<p>
						Users are prohibited from using the Service for any illegal purposes, harassment, distribution of malware, or any activity that could disrupt the Service.
					</p>

					<h3 className="text-lg font-medium">6. Termination</h3>
					<p>
						HeliaChat reserves the right to terminate or suspend your account without prior notice for violations of these Terms or for any other reason.
					</p>

					<h3 className="text-lg font-medium">7. Changes to Terms</h3>
					<p>
						HeliaChat reserves the right to modify these Terms at any time. We will provide notice of significant changes through the Service.
					</p>

					<h3 className="text-lg font-medium">8. Disclaimer</h3>
					<p>
						This is a mock Terms of Service document created for demonstration purposes only. It is not legally binding.
					</p>
				</div>
			</Modal>

			{/* Privacy Policy Modal */}
			<Modal
				isOpen={showPrivacy}
				onClose={() => setShowPrivacy(false)}
				title="Privacy Policy"
			>
				<div className="space-y-4">
					<h3 className="text-lg font-medium">1. Information We Collect</h3>
					<p>
						HeliaChat collects certain personal information when you register for and use our Service, including but not limited to: your name, email address, and usage data.
					</p>

					<h3 className="text-lg font-medium">2. How We Use Your Information</h3>
					<p>
						We use your information to provide and improve our Service, customize your experience, communicate with you, and for analytical purposes to enhance our platform.
					</p>

					<h3 className="text-lg font-medium">3. Data Storage and Security</h3>
					<p>
						Your data is stored securely on our servers. We implement industry-standard security measures to protect your personal information from unauthorized access.
					</p>

					<h3 className="text-lg font-medium">4. Sharing Your Information</h3>
					<p>
						We do not sell your personal information to third parties. We may share anonymized data for analytical purposes or as required by law.
					</p>

					<h3 className="text-lg font-medium">5. Cookies and Tracking</h3>
					<p>
						HeliaChat uses cookies and similar technologies to enhance your experience and collect information about how you use our Service.
					</p>

					<h3 className="text-lg font-medium">6. Your Rights</h3>
					<p>
						You have the right to access, correct, and delete your personal information. You may also opt out of certain data collection practices.
					</p>

					<h3 className="text-lg font-medium">7. Changes to Privacy Policy</h3>
					<p>
						We may update this Privacy Policy periodically. We will notify you of significant changes through the Service.
					</p>

					<h3 className="text-lg font-medium">8. Disclaimer</h3>
					<p>
						This is a mock Privacy Policy document created for demonstration purposes only. It is not legally binding.
					</p>
				</div>
			</Modal>
		</div>
	);
}
