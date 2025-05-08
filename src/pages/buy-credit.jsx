import React, { useState, useEffect } from 'react';
import { FiCheck, FiAlertCircle, FiCreditCard, FiRefreshCw, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';
import apiClient from '../services/api/ApiClient';

export default function BuyCreditsPage() {
	const navigate = useNavigate();
	const [selectedPackage, setSelectedPackage] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const { user } = useAuth();
	const { credits, refreshCredits, loading } = useCredits();

	const { useGetPlans } = apiClient.billing;
	const { data: creditPackages = [], isLoading } = useGetPlans({
		onSuccess: (data) => {
			if (data && data.length > 0) {
				// Set default selected package to the popular one or the first one
				const popularPlan = data.find((plan) => plan.popular);
				setSelectedPackage(popularPlan ? popularPlan.id : data[0].id);
			}
		},
		onError: (error) => {
			console.error('Failed to load plans:', error);
			setError('Failed to load credit packages. Please try again later.');
		},
	});

	const { mutate: createCheckout, isPending } = apiClient.billing.useCreateCheckout({
		onSuccess: (data) => {
			console.log(data, 'data');
			if (data && data.payment_link) {
				console.log(data, 'data');
				window.location.href = data.payment_link;
			} else {
				setError('Failed to create checkout. Please try again later.');
			}
		},
		onError: (error) => {
			console.error('Failed to create checkout:', error);
			setError('Failed to create checkout. Please try again later.');
		},
	});

	const handlePurchase = async (packageId) => {
		setSelectedPackage(packageId);
		const pkg = creditPackages.find((p) => p.id === packageId);

		try {
			// Create checkout session directly using the mutate function
			createCheckout(packageId);

			// Note: The redirect is handled in the onSuccess callback of createCheckout

			// If we reach here, it means no redirect happened yet
			// For demo purposes, we'll show success after a delay
		} catch (err) {
			setError('Payment processing failed. Please try again.');
		}
	};

	if (isLoading) {
		return (
			<div className='min-h-screen bg-background text-foreground pt-16 sm:pt-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
					<div className='text-center mb-8'>
						<div className='h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse'></div>
						<div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse'></div>
						<div className='h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse'></div>
					</div>

					{/* Skeleton for current balance */}
					<div className='bg-card border border-border rounded-lg p-6 mb-10 max-w-md mx-auto'>
						<div className='flex justify-between items-center'>
							<div className='w-32 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
							<div className='w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
						</div>
					</div>

					{/* Skeleton for credit packages */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8'>
						{[1, 2, 3].map((item) => (
							<div
								key={item}
								className='bg-card border border-border rounded-xl overflow-hidden'
							>
								<div className='p-6'>
									<div className='h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse'></div>
									<div className='h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse'></div>
									<div className='h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse'></div>
									<div className='space-y-2 mb-6'>
										{[1, 2, 3].map((feature) => (
											<div
												key={feature}
												className='h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse'
											></div>
										))}
									</div>
									<div className='h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background text-foreground pt-16 sm:pt-20'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-0 sm:pt-0'>
				<div className='text-center mb-8 sm:mb-12'>
					<img
						src={logo}
						alt='HeliaChat Logo'
						className='h-10 sm:h-12 mx-auto mb-4'
					/>
					<h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>Buy Credits</h1>
					<p className='text-muted-foreground mt-2 max-w-xl mx-auto text-sm sm:text-base'>
						Purchase credits to continue your conversations with Helia.
					</p>
				</div>

				{/* Current balance with Payment History Link */}
				<div className='bg-card border border-border rounded-lg p-5 sm:p-6 mb-4 max-w-md mx-auto shadow-sm hover:shadow-md transition-shadow duration-300'>
					<div className='flex justify-between items-center'>
						<div>
							<h2 className='text-lg font-medium flex items-center'>
								<FiCreditCard className='mr-2 text-primary' />
								Current Balance
							</h2>
							<p className='text-muted-foreground text-sm'>Available credits</p>
						</div>
						<div className='text-right'>
							<div className='flex items-center'>
								<span className='text-3xl font-bold text-primary'>{credits}</span>
								<button
									onClick={() => refreshCredits()}
									className='ml-2 p-1 text-muted-foreground hover:text-primary transition-colors '
									title='Refresh credits'
								>
									<FiRefreshCw
										size={16}
										className={`text-primary ${loading ? 'animate-spin' : ''}`}
									/>
								</button>
							</div>
							<p className='text-sm text-muted-foreground'>credits</p>
						</div>
					</div>
				</div>

				{/* Payment History Link */}
				<div className='text-center mb-8 sm:mb-10'>
					<button
						onClick={() => navigate('/payment-history')}
						className='inline-flex items-center text-primary hover:text-primary/80 hover:underline transition-colors'
					>
						<FiFileText className='mr-1.5' />
						View Payment History
					</button>
				</div>

				{error && (
					<div className='bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded-lg flex items-center mb-6 max-w-md mx-auto shadow'>
						<FiAlertCircle className='mr-2 flex-shrink-0' />
						<span>{error}</span>
					</div>
				)}

				{success && (
					<div className='bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg flex items-center mb-6 max-w-md mx-auto shadow'>
						<FiCheck className='mr-2 flex-shrink-0' />
						<span>Payment successful! Your credits have been added to your account.</span>
					</div>
				)}

				{/* Credit packages */}
				<div className='flex flex-wrap gap-4 sm:gap-6 mb-8 md:mx-20'>
					{creditPackages.map((pkg) => (
						<div
							key={pkg.id}
							className={`bg-card border rounded-xl overflow-hidden transition-all duration-300 flex-1 min-w-[280px] ${
								selectedPackage === pkg.id
									? 'border-primary shadow-lg transform scale-[1.02]'
									: 'border-border hover:border-primary/50 hover:shadow-md hover:scale-[1.01]'
							}`}
						>
							{pkg.popular && (
								<div className='bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium'>
									Most Popular
								</div>
							)}
							<div className='p-5 sm:p-6'>
								<h3 className='text-xl font-bold'>{pkg.name}</h3>
								<div className='mt-2 mb-4'>
									<span className='text-2xl sm:text-3xl font-bold'>${pkg.price}</span>
									{pkg.originalPrice && (
										<span className='text-muted-foreground line-through ml-2'>
											${pkg.originalPrice}
										</span>
									)}
								</div>
								<p className='text-primary font-medium mb-4 flex items-center'>
									<FiCreditCard className='mr-1.5' />
									{pkg.credits} credits
								</p>
								<ul className='space-y-2 mb-6'>
									{pkg.features &&
										pkg.features.map((feature, index) => (
											<li
												key={index}
												className='flex items-start'
											>
												<FiCheck className='text-green-500 mr-2 flex-shrink-0 mt-0.5' />
												<span className='text-sm'>{feature}</span>
											</li>
										))}
									{!pkg.features && pkg.description && (
										<li className='flex items-start'>
											<FiCheck className='text-green-500 mr-2 flex-shrink-0 mt-0.5' />
											<span className='text-sm'>{pkg.description}</span>
										</li>
									)}
								</ul>
								<button
									onClick={() => handlePurchase(pkg.id)}
									disabled={isPending}
									className={`w-full py-2.5 px-4 rounded-md font-medium text-center transition-colors ${
										isPending && selectedPackage === pkg.id
											? 'bg-muted text-muted-foreground cursor-not-allowed'
											: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow'
									}`}
								>
									{isPending && selectedPackage === pkg.id ? (
										<span className='flex items-center justify-center'>
											<svg
												className='animate-spin -ml-1 mr-2 h-4 w-4'
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
											Processing...
										</span>
									) : (
										`Purchase for $${pkg.price}`
									)}
								</button>
							</div>
						</div>
					))}
				</div>

				<div className='text-center mt-8 text-sm text-muted-foreground'>
					<p className='mb-2'>Secure payment processing with Dodo Payment</p>
					<p>
						Need help? Contact our support team at{' '}
						<a
							href='mailto:support@heliachat.com'
							className='text-primary hover:underline'
						>
							support@heliachat.com
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
