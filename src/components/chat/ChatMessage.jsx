import { FiCopy, FiVolume2, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useState } from 'react';

export default function ChatMessage({ message }) {
	const isUser = message.role === 'user';
	const [vote, setVote] = useState(null); // 'up' | 'down' | null
	const isStreaming = message.isStreaming;

	const copyToClipboard = () => navigator.clipboard.writeText(message.content);
	const readAloud = () => {
		if ('speechSynthesis' in window) {
			const utter = new SpeechSynthesisUtterance(message.content);
			// Set a faster speech rate
			utter.rate = 1.5;
			// Cancel any ongoing speech before starting new one
			speechSynthesis.cancel();
			speechSynthesis.speak(utter);
		}
	};

	const toggleUp = () => setVote(vote === 'up' ? null : 'up');
	const toggleDown = () => setVote(vote === 'down' ? null : 'down');

	return (
		<div className={`py-4 ${isUser ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-900'} ${isStreaming ? 'animate-pulse pb-10' : ''}`}>
			<div className='max-w-3xl mx-auto px-4'>
				<div className='flex items-start gap-4'>
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
							isUser
								? 'bg-primary  text-primary-800 dark:text-primary-100'
								: 'bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-100'
						}`}
					>
						{isUser ? 'U' : 'A'}
					</div>

					<div className='flex-1'>
						<p className='font-medium text-gray-900 dark:text-white'>{isUser ? 'You' : 'Helia'}</p>
						<div className='mt-1 text-gray-700 dark:text-gray-300 prose dark:prose-invert'>
							{message.content}
							{isStreaming && (
								<span className="inline-block ml-1 animate-pulse">▋</span>
							)}
							{!isUser && !isStreaming && (
								<div className='mt-2 flex gap-3 text-gray-500 dark:text-gray-400 text-sm'>
									<button
										onClick={copyToClipboard}
										className='hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
									>
										<FiCopy />
									</button>
									<button
										onClick={readAloud}
										className='hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
									>
										<FiVolume2 />
									</button>
									<button
										onClick={toggleUp}
										className={`${vote === 'up' ? 'text-teal-600 dark:text-teal-400' : 'hover:text-gray-700 dark:hover:text-gray-200'} transition-colors`}
									>
										<FiThumbsUp />
									</button>
									<button
										onClick={toggleDown}
										className={`${vote === 'down' ? 'text-red-600 dark:text-red-400' : 'hover:text-gray-700 dark:hover:text-gray-200'} transition-colors`}
									>
										<FiThumbsDown />
									</button>
								</div>
							)}
						</div>

						{/* Display image attachment if present */}
						{message.image && (
							<div className='mt-3 inline-block'>
								<img
									src={message.image}
									alt='Attachment'
									className='max-h-64 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm'
								/>
							</div>
						)}
						
						{/* Display user's image if present */}
						{ message.image_url && (
							<div className='mt-2 inline-block'>
								<img
									src={message.image_url}
									alt='Attachment'
									className='max-h-48 rounded-md border border-gray-200 dark:border-gray-700'
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
