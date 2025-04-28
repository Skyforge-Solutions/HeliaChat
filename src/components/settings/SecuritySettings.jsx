import React, { useState } from 'react';
import { FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import apiClient from '../../services/api/ApiClient';
import { useAuth } from '../../context/AuthContext';

function ChangeEmailForm({ user }) {
	const [email, setEmail] = useState(user?.email || '');
	const [currentPassword, setCurrentPassword] = useState('');
	const [otp, setOtp] = useState('');
	const [showOtpForm, setShowOtpForm] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	const requestEmailChange = apiClient.auth.useRequestEmailChange({
		onSuccess: () => setShowOtpForm(true),
		onError: (err) => setError(err.response?.data?.message || 'Failed to request email change'),
	});

	const verifyEmailChange = apiClient.auth.useVerifyEmailChange({
		onSuccess: () => {
			setSuccess(true);
			setShowOtpForm(false);
			setOtp('');
			setCurrentPassword('');
			setTimeout(() => setSuccess(false), 3000);
		},
		onError: (err) => setError(err.response?.data?.message || 'Failed to verify email change'),
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		setError('');
		if (showOtpForm) {
			verifyEmailChange.mutate(otp);
		} else {
			requestEmailChange.mutate({ newEmail: email, currentPassword });
		}
	};

	return (
		<section className='bg-card p-6 rounded-lg border border-border mb-10'>
			<h3 className='text-xl font-semibold mb-4'>Change Email</h3>
			<form
				onSubmit={handleSubmit}
				className='space-y-4'
			>
				{success && (
					<div className='bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded flex items-center'>
						<FiCheckCircle className='mr-2' />
						Email updated successfully!
					</div>
				)}
				{error && (
					<div className='bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded flex items-center'>
						<FiAlertCircle className='mr-2' />
						{error}
					</div>
				)}
				{!showOtpForm ? (
					<>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-foreground mb-1'
							>
								New Email Address
							</label>
							<input
								type='email'
								id='email'
								name='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
								required
								placeholder='Enter your new email address'
							/>
						</div>
						<div>
							<label
								htmlFor='current-password-email'
								className='block text-sm font-medium text-foreground mb-1'
							>
								Current Password
							</label>
							<input
								type='password'
								id='current-password-email'
								name='current-password-email'
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
								required
								placeholder='Enter your current password'
							/>
						</div>
					</>
				) : (
					<div>
						<label
							htmlFor='otp'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Verification Code
						</label>
						<input
							type='text'
							id='otp'
							name='otp'
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
							required
							placeholder='Enter the verification code sent to your new email'
						/>
						<p className='text-xs text-muted-foreground mt-1'>
							Check your new email for the verification code
						</p>
					</div>
				)}
				<div className='flex justify-end'>
					<button
						type='submit'
						disabled={requestEmailChange.isPending || verifyEmailChange.isPending}
						className='px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center'
					>
						{requestEmailChange.isPending || verifyEmailChange.isPending ? (
							<svg
								className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
						) : (
							<FiSave className='mr-2' />
						)}
						{showOtpForm
							? requestEmailChange.isPending || verifyEmailChange.isPending
								? 'Verifying...'
								: 'Verify Email'
							: requestEmailChange.isPending
								? 'Sending...'
								: 'Continue'}
					</button>
				</div>
			</form>
		</section>
	);
}

function ChangePasswordForm() {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	const updatePassword = apiClient.auth.useUpdatePassword({
		onSuccess: () => {
			setSuccess(true);
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
			setTimeout(() => setSuccess(false), 3000);
		},
		onError: (err) => setError(err.response?.data?.message || 'Failed to update password'),
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		setError('');
		if (newPassword !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}
		if (newPassword.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}
		updatePassword.mutate({ currentPassword, newPassword });
	};

	return (
		<section className='bg-card p-6 rounded-lg border border-border'>
			<h3 className='text-xl font-semibold mb-4'>Change Password</h3>
			<form
				onSubmit={handleSubmit}
				className='space-y-4'
			>
				{success && (
					<div className='bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded flex items-center'>
						<FiCheckCircle className='mr-2' />
						Password updated successfully!
					</div>
				)}
				{error && (
					<div className='bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded flex items-center'>
						<FiAlertCircle className='mr-2' />
						{error}
					</div>
				)}
				<div>
					<label
						htmlFor='current-password'
						className='block text-sm font-medium text-foreground mb-1'
					>
						Current Password
					</label>
					<input
						type='password'
						id='current-password'
						name='current-password'
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						required
						placeholder='Enter your current password'
					/>
				</div>
				<div>
					<label
						htmlFor='new-password'
						className='block text-sm font-medium text-foreground mb-1'
					>
						New Password
					</label>
					<input
						type='password'
						id='new-password'
						name='new-password'
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						required
						placeholder='Enter your new password'
					/>
				</div>
				<div>
					<label
						htmlFor='confirm-password'
						className='block text-sm font-medium text-foreground mb-1'
					>
						Confirm New Password
					</label>
					<input
						type='password'
						id='confirm-password'
						name='confirm-password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						required
						placeholder='Confirm your new password'
					/>
					<p className='text-xs text-muted-foreground mt-1'>
						Password must be at least 8 characters long
					</p>
				</div>
				<div className='flex justify-end'>
					<button
						type='submit'
						disabled={updatePassword.isPending}
						className='px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center'
					>
						{updatePassword.isPending ? (
							<svg
								className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
						) : (
							<FiSave className='mr-2' />
						)}
						{updatePassword.isPending ? 'Updating...' : 'Save Password'}
					</button>
				</div>
			</form>
		</section>
	);
}

export default function SecuritySettings() {
	const { user } = useAuth();
	return (
		<div className='max-w-xl mx-auto space-y-10'>
			<ChangeEmailForm user={user} />
			<ChangePasswordForm />
		</div>
	);
}
