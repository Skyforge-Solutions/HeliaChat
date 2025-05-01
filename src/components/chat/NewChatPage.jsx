import React, { useRef, useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ChatInput from './ChatInput';
import Welcome from './message/Welcome';
import apiClient from '../../services/api/ApiClient';
import { usePendingMessage } from '../../context/PendingMessageContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCredits } from '../../context/CreditContext';
import { FiCreditCard } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewChatPage = () => {
	const outletContext = useOutletContext();
	const sidebarCollapsed = outletContext?.sidebarCollapsed || false;
	const messagesEndRef = useRef(null);
	const [isAiResponding, setIsAiResponding] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [chatId, setChatId] = useState(null);
	const navigate = useNavigate();
	const { setPendingMessage } = usePendingMessage();
	const queryClient = useQueryClient();
	const { credits } = useCredits();

	// Smooth loading progress animation
	useEffect(() => {
		let interval;
		if (isLoading) {
			interval = setInterval(() => {
				setLoadingProgress(prev => {
					// Gradually increase to 90%, final 10% on completion
					const newProgress = prev + (90 - prev) * 0.1;
					return newProgress > 89 ? 89 : newProgress;
				});
			}, 100);
		} else {
			setLoadingProgress(0);
		}
		return () => clearInterval(interval);
	}, [isLoading]);

	const { mutate: createSession } = apiClient.chat.useCreateSession({
		onSuccess: (data) => {
			// Complete the progress bar before navigating
			setLoadingProgress(100);
			setChatId(data.id);
			
			queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
			setTimeout(() => {
				navigate(`/chat/${data.id}`);
				setIsLoading(false);
			}, 300); // Short delay for visual feedback
		},
		onError: () => {
			setIsLoading(false);
			setIsAiResponding(false);
			setLoadingProgress(0);
		}
	});

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSendMessage = async (content, file = null, modelId = null) => {
		// Check if user has credits before creating a new chat
		if (credits <= 0) {
			return;
		}
		
		// Show loading animation
		setIsLoading(true);
		setIsAiResponding(true);
		setLoadingProgress(10); // Start with initial progress
		
		// Create a new chat with the message content as the name
		const chatName = content.length > 30 ? content.substring(0, 30) + '...' : content;
		createSession({ name: chatName });
		
		// Store the message to be sent once chat is created
		setPendingMessage({ content, file, modelId, chatId });
	};

	return (
		<div className='flex flex-col h-full bg-background'>
			{isLoading && (
				<div className="fixed top-0 left-0 right-0 h-1 z-50">
					<div 
						className="h-full bg-primary transition-all duration-300 ease-out"
						style={{ width: `${loadingProgress}%` }}
					></div>
				</div>
			)}
			<div className='flex-1 overflow-y-auto pt-14 pb-20'>
				{!isLoading && <Welcome />}
				{isLoading && (
					<div className='flex flex-col items-center justify-center mt-8 transition-opacity duration-300 h-[50vh]'>
						<p className='mt-4 text-primary font-medium animate-pulse'>
							Initializing conversation...
						</p>
						<p className='text-sm text-muted-foreground mt-2 max-w-md text-center'>
							Your message is being processed and will be sent shortly
						</p>
						<div className="mt-4 flex flex-col items-center">
							<div className="flex space-x-2 mb-3">
								<div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
								<div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
								<div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
							</div>
							<p className="text-xs text-muted-foreground max-w-md text-center">
								This may take a moment as we prepare your AI assistant to provide the most relevant response
							</p>
						</div>
					</div>
				)}
				
				<div ref={messagesEndRef} />
			</div>
			<div
				className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ${
					sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
				}`}
			>
				<ChatInput
					onSendMessage={handleSendMessage}

					isDisabled={isAiResponding || credits <= 0}
					placeholder={isLoading ? "Starting conversation..." : credits <= 0 ? "You've used all your credits" : "Send a message"}
				/>
			</div>
		</div>
	);
};

export default NewChatPage;
