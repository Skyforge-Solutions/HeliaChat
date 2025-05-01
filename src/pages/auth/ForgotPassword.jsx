import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api/ApiClient';
import { FiMail } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	// Use the React Query mutation
	const {
		mutate: requestReset,
		isPending,
		error,
	} = apiClient.auth.useRequestPasswordReset({
		onSuccess: () => setSuccess(true),
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		setSuccess(false);
		requestReset(email);
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
					<h1 className='text-2xl font-bold text-foreground'>Reset your password</h1>
					<p className='text-muted-foreground mt-2'>
						Enter your email address and we'll send you a link to reset your password.
					</p>
				</div>

				{success ? (
					<div className='bg-green-100 border border-green-400 text-green-700 font-medium px-4 py-3 rounded-md mb-4 flex items-center'>
						<svg
							className='h-5 w-5 text-green-500 mr-2'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
								clipRule='evenodd'
							/>
						</svg>
						<p>
							If that email exists, a reset link was sent. Please check your inbox.
						</p>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className='space-y-4'
					>
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
								{error?.response?.data?.message ||
									error.message ||
									'An error occurred while sending the reset link'}
							</div>
						)}

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
									name='email'
									type='email'
									autoComplete='email'
									required
									className='block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder='you@example.com'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isPending}
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								disabled={isPending}
								className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
									isPending ? 'opacity-70 cursor-not-allowed' : ''
								}`}
							>
								{isPending ? 'Sending...' : 'Send Reset Link'}
							</button>
						</div>

						<div className='text-center mt-4'>
							<Link
								to='/login'
								className='font-medium text-primary hover:text-primary'
							>
								Back to Login
							</Link>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default ForgotPassword;
