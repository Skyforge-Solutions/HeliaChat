import React from 'react';

interface LoadingProps {
	size?: 'small' | 'medium' | 'large';
	fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', fullScreen = true }) => {
	// Determine the size of the spinner
	const sizeClasses = {
		small: 'h-6 w-6 border-2',
		medium: 'h-12 w-12 border-3',
		large: 'h-16 w-16 border-4',
	};

	// The spinner component
	const Spinner = () => (
		<div className={`relative ${sizeClasses[size]}`}>
			<div className='absolute inset-0 rounded-full border-t-primary border-b-primary animate-spin'></div>
		</div>
	);

	// If fullScreen, render a full-screen loading overlay
	if (fullScreen) {
		return (
			<div className='fixed inset-0 flex items-center justify-center z-50 bg-background '>
				<div className='flex flex-col items-center'>
					<Spinner />
					<p className='mt-4 text-primary font-medium animate-pulse'>Loading...</p>
				</div>
			</div>
		);
	}

	// Otherwise, render just the spinner
	return (
		<div className='flex items-center justify-center p-4'>
			<Spinner />
		</div>
	);
};

export default Loading;
