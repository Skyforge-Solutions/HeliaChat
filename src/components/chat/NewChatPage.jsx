import React, { useRef, useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ChatInput from './ChatInput';
import Welcome from './message/Welcome';
import apiClient from '../../services/api/ApiClient';
import { usePendingMessage } from '../../context/PendingMessageContext';

const NewChatPage = () => {
	const outletContext = useOutletContext();
	const sidebarCollapsed = outletContext?.sidebarCollapsed || false;
	const messagesEndRef = useRef(null);
	const [isAiResponding, setIsAiResponding] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [chatId, setChatId] = useState(null);
	const navigate = useNavigate();
	const { setPendingMessage } = usePendingMessage();

	// Simulate progress for smoother loading experience
	useEffect(() => {
		let interval;
		if (isSubmitting) {
			interval = setInterval(() => {
				setLoadingProgress(prev => {
					// Slowly increase to 90%, the final 10% will happen on success
					const newProgress = prev + (90 - prev) * 0.1;
					return newProgress > 89 ? 89 : newProgress;
				});
			}, 100);
		} else {
			setLoadingProgress(0);
		}
		return () => clearInterval(interval);
	}, [isSubmitting]);

	const { mutate: createSession } = apiClient.chat.useCreateSession({
		onSuccess: (data) => {
			// Complete the progress bar before navigating
			setLoadingProgress(100);
			setChatId(data.id);
			setTimeout(() => {
				navigate(`/chat/${data.id}`);
				setIsSubmitting(false);
			}, 300); // Short delay for visual feedback
		},
		onError: () => {
			setIsSubmitting(false);
			setIsAiResponding(false);
			setLoadingProgress(0);
		}
	});

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSendMessage = async (content, file = null, modelId = null) => {
		// Show animation that it's working
		setIsSubmitting(true);
		setIsAiResponding(true);
		setLoadingProgress(10); // Start with some progress
		
		// Create a new chat session with the first few words of the prompt as the name
		const sessionName = content.length > 30 ? content.substring(0, 30) + '...' : content;
		createSession({ name: sessionName });
		
		// Set the pending message before creating the session
		setPendingMessage({ content, file, modelId, chatId });
	};

	return (
		<div className='flex flex-col h-full bg-background'>
			{isSubmitting && (
				<div className="fixed top-0 left-0 right-0 h-1 z-50">
					<div 
						className="h-full bg-primary transition-all duration-300 ease-out"
						style={{ width: `${loadingProgress}%` }}
					></div>
				</div>
			)}
			<div className='flex-1 overflow-y-auto pt-14 pb-20'>
				{!isSubmitting && <Welcome />}
				{isSubmitting && (
					<div className='flex flex-col items-center justify-center mt-8 transition-opacity duration-300'>
						<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
						<p className='mt-4 text-primary font-medium animate-pulse'>
							Creating your chat session...
						</p>
						<p className='text-sm text-muted-foreground mt-2 max-w-md text-center'>
							Your message will be sent as soon as the chat is ready
						</p>
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
					isDisabled={isAiResponding}
					placeholder={isSubmitting ? "Creating chat..." : "Send a message"}
				/>
			</div>
		</div>
	);
};

export default NewChatPage;
