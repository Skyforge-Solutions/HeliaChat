import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api/ApiClient';
import { FiArrowLeft, FiFileText, FiCreditCard } from 'react-icons/fi';

function PaymentHistoryPage() {
	const navigate = useNavigate();
	const [selectedPayment, setSelectedPayment] = useState(null);

	// Fetch payment history using the API
	const { data: purchases, isLoading, isError, error } = apiClient.billing.useGetPurchases();

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const formatCurrency = (amount, currency = 'USD') => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 2,
		}).format(amount / 100); // Assuming amount is in cents
	};

	const formatStatus = (status) => {
		switch (status.toLowerCase()) {
			case 'succeeded':
				return <span className='text-green-600 dark:text-green-400 font-medium'>Succeeded</span>;
			case 'pending':
				return <span className='text-amber-600 dark:text-amber-400 font-medium'>Pending</span>;
			case 'failed':
				return <span className='text-red-600 dark:text-red-400 font-medium'>Failed</span>;
			default:
				return <span className='text-muted-foreground'>{status}</span>;
		}
	};

	return (
		<div className='min-h-screen bg-background text-foreground pt-16 sm:pt-20'>
			<div className='max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-0 sm:pt-0'>
				<div className='mb-6 flex items-center justify-between'>
					<div className='flex items-center'>
						<button
							onClick={() => navigate('/buy-credit')}
							className='mr-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors'
							aria-label='Go back'
						>
							<FiArrowLeft />
						</button>
						<h1 className='text-2xl sm:text-3xl font-bold'>Payment History</h1>
					</div>
					<button
						onClick={() => navigate('/buy-credit')}
						className='bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md font-medium transition-colors'
					>
						<FiCreditCard className='inline mr-2' />
						Buy Credits
					</button>
				</div>

				{isLoading ? (
					<div className='w-full h-64 flex items-center justify-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
					</div>
				) : isError ? (
					<div className='text-center py-8'>
						<p className='text-destructive mb-4'>Failed to load payment history</p>
						<p className='text-muted-foreground'>{error?.message || 'Please try again later'}</p>
					</div>
				) : purchases?.length === 0 ? (
					<div className='text-center py-16 border border-dashed border-border rounded-lg'>
						<FiFileText className='mx-auto text-muted-foreground h-12 w-12 mb-4' />
						<h2 className='text-xl font-semibold mb-2'>No payment history yet</h2>
						<p className='text-muted-foreground mb-6'>You haven't made any purchases yet.</p>
						<button
							onClick={() => navigate('/buy-credit')}
							className='bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md font-medium transition-colors'
						>
							Buy Credits
						</button>
					</div>
				) : (
					<div className='bg-card border border-border rounded-lg shadow-sm overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='bg-muted'>
									<tr>
										<th className='px-6 py-3 text-left text-sm font-medium text-muted-foreground'>
											Date
										</th>
										<th className='px-6 py-3 text-left text-sm font-medium text-muted-foreground'>
											Transaction ID
										</th>
										<th className='px-6 py-3 text-left text-sm font-medium text-muted-foreground'>
											Amount
										</th>
										<th className='px-6 py-3 text-left text-sm font-medium text-muted-foreground'>
											Credits
										</th>
										<th className='px-6 py-3 text-left text-sm font-medium text-muted-foreground'>
											Status
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-border'>
									{purchases.map((purchase) => (
										<tr
											key={purchase.id}
											className='hover:bg-muted/50 transition-colors'
										>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>
												{formatDate(purchase.created_at)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-mono text-muted-foreground'>
												{purchase.id.substring(0, 12)}...
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
												{formatCurrency(purchase.amount_cents, purchase.currency)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>{purchase.credits}</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>
												{formatStatus(purchase.status)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default PaymentHistoryPage;
