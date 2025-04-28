import React from 'react';

interface LoadingProps {
	size?: 'small' | 'medium' | 'large';
	fullScreen?: boolean;
	text?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
	size = 'medium', 
	fullScreen = true,
	text = 'Helia is launching...'
}) => {
	// Determine the size of the spinner and text with enhanced dimensions
	const sizeClasses = {
		small: 'h-8 w-8',
		medium: 'h-16 w-16',
		large: 'h-24 w-24',
	};
	
	const textSizes = {
		small: 'text-base',
		medium: 'text-xl',
		large: 'text-2xl',
	};

	// The enhanced Helia logo spinner component
	const HeliaSpinner = () => (
		<div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
			{/* Circle with "HA" text and improved animation */}
			<div className="absolute inset-0 rounded-full bg-orange-500 animate-pulse flex items-center justify-center shadow-lg shadow-orange-300/50">
				<span className="text-white font-bold" style={{ fontSize: `calc(${size === 'small' ? '1' : size === 'medium' ? '1.5' : '2'}rem)` }}>
					HA
				</span>
			</div>
		</div>
	);

	// If fullScreen, render a full-screen loading overlay with enhanced visuals
	if (fullScreen) {
		return (
			<div className='fixed inset-0 flex items-center justify-center z-50 bg-background backdrop-blur-sm'>
				<div className='flex flex-col items-center p-12 '>
					<HeliaSpinner />
					<p className={`mt-6 text-foreground font-semibold ${textSizes[size]}`}>
						{text}
					</p>
					<div className="mt-4 flex space-x-2">
						<span className="h-3 w-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
						<span className="h-3 w-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
						<span className="h-3 w-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
					</div>
				</div>
			</div>
		);
	}

	// Otherwise, render just the spinner with enhanced minimal text
	return (
		<div className='flex flex-col items-center justify-center p-6'>
			<HeliaSpinner />
			<p className={`mt-4 text-foreground font-medium ${textSizes[size]}`}>
				{text}
			</p>
		</div>
	);
};

export default Loading;
