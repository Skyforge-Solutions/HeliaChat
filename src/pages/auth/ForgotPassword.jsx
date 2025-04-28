import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api/ApiClient';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		setSuccess(false);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth'}/api/auth/password-reset/request`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email }),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to send reset link');
			}

			setSuccess(true);
		} catch (err) {
			setError(err.message || 'An error occurred while sending the reset link');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Reset your password
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Enter your email address and we'll send you a link to reset your password.
					</p>
				</div>

				{success ? (
					<div className='rounded-md bg-green-50 p-4'>
						<div className='flex'>
							<div className='flex-shrink-0'>
								<svg
									className='h-5 w-5 text-green-400'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<div className='ml-3'>
								<p className='text-sm font-medium text-green-800'>
									If that email exists, a reset link was sent. Please check your inbox.
								</p>
							</div>
						</div>
					</div>
				) : (
					<form
						className='mt-8 space-y-6'
						onSubmit={handleSubmit}
					>
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label
									htmlFor='email-address'
									className='sr-only'
								>
									Email address
								</label>
								<input
									id='email-address'
									name='email'
									type='email'
									autoComplete='email'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
									placeholder='Email address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>

						{error && (
							<div className='rounded-md bg-red-50 p-4'>
								<div className='flex'>
									<div className='flex-shrink-0'>
										<svg
											className='h-5 w-5 text-red-400'
											viewBox='0 0 20 20'
											fill='currentColor'
										>
											<path
												fillRule='evenodd'
												d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div className='ml-3'>
										<p className='text-sm font-medium text-red-800'>{error}</p>
									</div>
								</div>
							</div>
						)}

						<div>
							<button
								type='submit'
								disabled={isLoading}
								className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
							>
								{isLoading ? (
									<span className='absolute left-0 inset-y-0 flex items-center pl-3'>
										<svg
											className='animate-spin h-5 w-5 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
										>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
											></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											></path>
										</svg>
									</span>
								) : null}
								Send Reset Link
							</button>
						</div>

						<div className='text-sm text-center'>
							<Link
								to='/login'
								className='font-medium text-primary hover:text-primary-dark'
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
