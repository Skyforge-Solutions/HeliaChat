import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { login: authLogin } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			setError('Please fill in all fields');
			return;
		}

		setError('');
		setIsLoading(true);

		try {
			const data = await authLogin(email, password);
			// schema of the AuthResponse from backend
			// access_token: str
			// token_type: str = "bearer"
			// user_name: str
			
		} catch (err) {
			setError(err.message || 'Failed to login. Please check your credentials.');
			console.error('Login error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			<div className='w-full max-w-md'>
				<div className='text-center mb-8'>
					<img
						src={logo}
						alt='HeliaChat Logo'
						className='h-12 mx-auto mb-4'
					/>
					<h1 className='text-2xl font-bold text-foreground'>Welcome back</h1>
					<p className='text-muted-foreground mt-2'>Sign in to your account</p>
				</div>

				{error && (
					<div className='bg-destructive/20 border border-destructive text-destructive font-medium px-4 py-3 rounded-md mb-4 dark:bg-destructive/30 dark:border-red-500 dark:text-red-400 flex items-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='mr-2'
						>
							<circle
								cx='12'
								cy='12'
								r='10'
							></circle>
							<line
								x1='12'
								y1='8'
								x2='12'
								y2='12'
							></line>
							<line
								x1='12'
								y1='16'
								x2='12.01'
								y2='16'
							></line>
						</svg>
						{error}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Email
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<FiMail className='text-muted-foreground' />
							</div>
							<input
								id='email'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
								placeholder='you@example.com'
								disabled={isLoading}
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Password
						</label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<FiLock className='text-muted-foreground' />
							</div>
							<input
								id='password'
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
								placeholder='••••••••'
								disabled={isLoading}
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
					</div>

					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<input
								id='remember-me'
								type='checkbox'
								className='h-4 w-4 text-primary focus:ring-primary border-input rounded'
							/>
							<label
								htmlFor='remember-me'
								className='ml-2 block text-sm text-foreground'
							>
								Remember me
							</label>
						</div>
						<a
							href='/forgot-password'
							className='text-sm font-medium text-primary hover:text-primary'
						>
							Forgot password?
						</a>
					</div>

					<div>
						<button
							type='submit'
							className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
								isLoading ? 'opacity-70 cursor-not-allowed' : ''
							}`}
							disabled={isLoading}
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-muted-foreground'>
						Don't have an account?{' '}
						<Link
							to='/signup'
							className='font-medium text-primary hover:text-primary'
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
