import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api/ApiClient';
import { useCredits } from '../../context/CreditContext';
import { FaCheckCircle, FaFileInvoice } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

function CheckoutSuccessPage() {
	const [searchParams] = useSearchParams();
	const { refreshCredits } = useCredits();
	const navigate = useNavigate();
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const paymentId = searchParams.get('payment_id');
	const status = searchParams.get('status');

	// Update window size on resize
	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const {
		data: purchaseDetails,
		isLoading: paymentDetailsLoading,
		error: paymentError,
	} = apiClient.billing.useGetPaymentDetails(paymentId, {
		enabled: !!paymentId && status === 'succeeded',
		onSuccess: async () => {
			if (refreshCredits) {
				await refreshCredits();
			}
		},
	});

	const { mutateAsync: downloadInvoice } = apiClient.billing.useDownloadInvoice();

	const loading = paymentDetailsLoading;
	const error = paymentError
		? 'Unable to verify your payment. Please contact support.'
		: !paymentId || status !== 'succeeded'
			? 'Invalid payment information.'
			: null;

	const handleContinue = () => {
		navigate('/'); // Navigate back to the main app
	};

	const handleDownloadInvoice = async () => {
		try {
			// Download invoice from the API
			const response = await downloadInvoice(paymentId);

			// Process the response based on its format
			if (response) {
				// Case 1: Response is a direct URL string (http or blob)
				if (
					typeof response === 'string' &&
					(response.startsWith('http') || response.startsWith('blob'))
				) {
					// Open the URL in a new tab
					window.open(response, '_blank');
				}
				// Case 2: Response contains a URL property
				else if (response.url) {
					// Open the URL in a new tab
					window.open(response.url, '_blank');
				}
				// Case 3: Response contains raw data that needs processing
				else if (response.data) {
					// Create a blob from the data
					const blob = new Blob([response.data], { type: 'application/pdf' });
					// Create a URL for the blob
					const url = URL.createObjectURL(blob);
					// Create a download link
					const link = document.createElement('a');
					link.href = url;
					link.download = `invoice-${paymentId}.pdf`;
					// Append to body, click, and clean up
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					URL.revokeObjectURL(url);
				}
			}
		} catch (err) {
			// Log error and show user-friendly message
			console.error('Failed to download invoice:', err);
			alert('Failed to download invoice. Please try again later.');
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center p-4 bg-background'>
				<div className='w-full max-w-md p-6 bg-card rounded-lg shadow-lg'>
					<h1 className='text-2xl font-bold text-center mb-4 text-foreground'>
						Verifying Your Purchase
					</h1>
					<div className='flex justify-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center p-4 bg-background'>
				<div className='w-full max-w-md p-6 bg-card rounded-lg shadow-lg'>
					<h1 className='text-2xl font-bold text-center text-destructive mb-4'>Payment Error</h1>
					<p className='text-center mb-6 text-foreground'>{error}</p>
					<button
						onClick={handleContinue}
						className='w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors'
					>
						Return to App
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex flex-col items-center justify-center p-4 bg-background'>
			{/* Confetti effect for successful payment */}
			<Confetti
				width={windowSize.width}
				height={windowSize.height}
				numberOfPieces={500}
				recycle={false}
				colors={['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0']}
			/>

			<div className='w-full max-w-md p-6 bg-card rounded-lg shadow-lg border border-border'>
				<div className='flex justify-center text-success mb-4'>
					<FaCheckCircle
						size={60}
						className='text-green-600 dark:text-green-400'
					/>
				</div>
				<h1 className='text-2xl font-bold text-center mb-4 text-foreground'>Payment Successful!</h1>

				{purchaseDetails && (
					<div className='mb-6'>
						<div className='flex justify-between py-2 border-b border-border'>
							<span className='text-muted-foreground'>Payment ID:</span>
							<span className='font-medium text-foreground'>{purchaseDetails.payment_id}</span>
						</div>
						<div className='flex justify-between py-2 border-b border-border'>
							<span className='text-muted-foreground'>Amount:</span>
							<span className='font-medium text-foreground'>
								${purchaseDetails.total_amount.toFixed(2)} {purchaseDetails.currency}
							</span>
						</div>
						<div className='flex justify-between py-2 border-b border-border'>
							<span className='text-muted-foreground'>Status:</span>
							<span className='font-medium text-green-600 dark:text-green-400'>
								{purchaseDetails.status}
							</span>
						</div>
						<div className='flex justify-between py-2 border-b border-border'>
							<span className='text-muted-foreground'>Date:</span>
							<span className='font-medium text-foreground'>
								{new Date(purchaseDetails.created_at).toLocaleDateString()}
							</span>
						</div>
						{purchaseDetails.metadata && purchaseDetails.metadata.credits && (
							<div className='flex justify-between py-2 border-b border-border'>
								<span className='text-muted-foreground'>Credits Added:</span>
								<span className='font-medium text-foreground'>
									{purchaseDetails.metadata.credits}
								</span>
							</div>
						)}
						{purchaseDetails.payment_method && (
							<div className='flex justify-between py-2'>
								<span className='text-muted-foreground'>Payment Method:</span>
								<span className='font-medium text-foreground'>
									{purchaseDetails.payment_method}
								</span>
							</div>
						)}
					</div>
				)}

				<div className='flex flex-col space-y-3'>
					{/* Download invoice button - commented out
					<button
						onClick={handleDownloadInvoice}
						className='flex items-center justify-center py-2 px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg transition-colors shadow-sm hover:shadow-md'
					>
						<FaFileInvoice className='mr-2' /> Download Invoice
					</button>
					*/}

					<button
						onClick={handleContinue}
						className='py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors'
					>
						Continue to App
					</button>
				</div>
			</div>
		</div>
	);
}

export default CheckoutSuccessPage;
