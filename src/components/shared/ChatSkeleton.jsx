import React from 'react';

export default function ChatSkeleton() {
	return (
		<div className='flex flex-col gap-6 px-4 py-8 animate-pulse max-w-3xl mx-auto'>
			{[...Array(4)].map((_, i) => (
				<div
					key={i}
					className="flex justify-start"
				>
					<div className='flex items-start gap-4'>
						<div className='w-10 h-10 rounded-full bg-muted flex-shrink-0' />
						<div
							className={`rounded-2xl rounded-tl-none bg-muted w-64 h-16 sm:w-[450px] sm:h-24 md:w-[500px]`}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
