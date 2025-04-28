import React, { useEffect } from 'react';
import SettingsPage from '../../pages/SettingsPage';

export default function SettingsModal({ onClose, initialData }) {
	// Close modal when clicking outside
	useEffect(() => {
		const handleBackdropClick = (e) => {
			if (e.target.classList.contains('backdrop')) {
				onClose();
			}
		};
		
		document.addEventListener('mousedown', handleBackdropClick);
		return () => document.removeEventListener('mousedown', handleBackdropClick);
	}, [onClose]);

	return (
		<div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4 dark:bg-black/50 backdrop'>
			<div className='bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-border'>
				<button
					type='button'
					className='absolute top-4 right-4 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1'
					onClick={onClose}
					aria-label="Close settings"
				>
					<svg
						className='w-6 h-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M6 18L18 6M6 6l12 12'
						></path>
					</svg>
				</button>
				<SettingsPage initialData={initialData} />
			</div>
		</div>
	);
}
