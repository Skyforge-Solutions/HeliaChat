import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../services/api/ApiClient';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/logo.svg';

const ResetPassword = () => {
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [success, setSuccess] = useState(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get('token');
	const [localError, setLocalError] = useState('');

	// Use the React Query mutation
	const {
		mutate: verifyReset,
		isPending,
		error,
	} = apiClient.auth.useVerifyPasswordReset({
		onSuccess: () => {
			setSuccess(true);
			setTimeout(() => navigate('/login'), 2000);
		},
	});

	useEffect(() => {
		if (!token) setLocalError('Invalid or missing reset token');
	}, [token]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLocalError('');
		if (newPassword !== confirmPassword) {
			setLocalError('Passwords do not match');
			return;
		}
		if (newPassword.length < 6) {
			setLocalError('Password must be at least 6 characters long');
			return;
		}
		verifyReset({ token, newPassword });
	};

	if (!token) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background p-4'>
				<div className='w-full max-w-md'>
					<div className='text-center mb-8'>
						<img
							src={logo}
							alt='HeliaChat Logo'
							className='h-12 mx-auto mb-4'
						/>
						<h1 className='text-2xl font-bold text-foreground'>Reset Password</h1>
					</div>
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
						Invalid or missing reset token. Please request a new password reset link.
					</div>
					<div className='text-center'>
						<Link
							to='/forgot-password'
							className='font-medium text-primary hover:text-primary'
						>
							Request New Reset Link
						</Link>
					</div>
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
					<h1 className='text-2xl font-bold text-foreground'>Set New Password</h1>
					<p className='text-muted-foreground mt-2'>Please enter your new password below.</p>
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
						<p>Password reset successful! Redirecting to login...</p>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className='space-y-4'
					>
						{(localError || error) && (
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
								{localError || error?.response?.data?.message || error?.message}
							</div>
						)}

						<div>
							<label
								htmlFor='new-password'
								className='block text-sm font-medium text-foreground mb-1'
							>
								New Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FiLock className='text-muted-foreground' />
								</div>
								<input
									id='new-password'
									name='new-password'
									type={showPassword ? 'text' : 'password'}
									required
									className='block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder='••••••••'
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									disabled={isPending}
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

						<div>
							<label
								htmlFor='confirm-password'
								className='block text-sm font-medium text-foreground mb-1'
							>
								Confirm Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FiLock className='text-muted-foreground' />
								</div>
								<input
									id='confirm-password'
									name='confirm-password'
									type={showPassword ? 'text' : 'password'}
									required
									className='block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder='••••••••'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
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
								{isPending ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
