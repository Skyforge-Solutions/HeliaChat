import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Welcome from './message/Welcome';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/api/ApiClient';
import { usePendingMessage } from '../../context/PendingMessageContext';
import { useChatMessage } from '../../hooks/useChatMessage';
import ChatSkeleton from '../shared/ChatSkeleton';

const ChatArea = ({ sidebarCollapsed }) => {
	const { chatId } = useParams();
	const messagesEndRef = useRef(null);
	const { pendingMessage, clearPendingMessage, } = usePendingMessage();
	
	const pendingMessageProcessedRef = useRef(false);

	const {
		isAiResponding,
		isStreaming,
		streamingText,
		streamingMessageId,
		chatHistory,
		setChatHistory,
		sendMessage,
	} = useChatMessage(chatId);

	// Fetch chat history using apiClient only if it's not a new chat and there's no pending message
	const { data: fetchedChatHistory, isLoading: historyLoading } = apiClient.chat.useGetHistory(
		chatId,
		{
			enabled: !!chatId && chatId !== 'new' && !!!pendingMessage,
		}
	);

	// Update chat history when data is fetched
	useEffect(() => {
		if (fetchedChatHistory && chatId !== 'new' && !pendingMessage) {
			setChatHistory(fetchedChatHistory);
		}
	}, [fetchedChatHistory, chatId, setChatHistory, pendingMessage]);

	useEffect(() => {
		scrollToBottom();
	}, [chatHistory]);

	// Ensure scroll to bottom when streaming text updates
	useEffect(() => {
		if (isStreaming) {
			scrollToBottom();
		}
	}, [streamingText, isStreaming]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (pendingMessage && chatId && !pendingMessageProcessedRef.current) {
			// Set the ref to true to prevent duplicate processing
			pendingMessageProcessedRef.current = true;

			// Add the pending message to chat history first
			setChatHistory(prev => [
				...prev,
				{
					id: `pending-${Date.now()}`,
					role: 'user',
					content: pendingMessage.content,
					timestamp: new Date().toISOString(),
				}
			]);

			// Send the pending message to the server
			sendMessage({
				sessionId: chatId,
				content: pendingMessage.content,
				file: pendingMessage.file,
				modelId: pendingMessage.modelId,
			});

			// Clear the pending message after sending
			clearPendingMessage();
		}
	}, [pendingMessage, chatId, sendMessage, clearPendingMessage, setChatHistory]);

	// Reset the ref when chatId changes
	useEffect(() => {
		pendingMessageProcessedRef.current = false;
	}, [chatId]);

	const handleSendMessage = async (content, file = null, modelId = null) => {
		await sendMessage({
			sessionId: chatId,
			content,
			file,
			modelId,
		});
	};

	return (
		<div className='flex flex-col h-full bg-background'>
			<div className='flex-1 overflow-y-auto pt-14 pb-20'>
				{historyLoading ? (
					<ChatSkeleton />
				) : chatHistory?.length === 0 ? (
					!isAiResponding && <Welcome />
				) : (
					<>
						{chatHistory?.map((message) => (
							<div key={message.id}>
								<ChatMessage message={message} />
							</div>
						))}
						{isStreaming && streamingMessageId && (
							<div key={`streaming-${streamingMessageId}`}>
								<ChatMessage
									message={{
										id: streamingMessageId,
										role: 'assistant',
										content: streamingText || '...',
										timestamp: new Date().toISOString(),
										isStreaming: true,
									}}
								/>
							</div>
						)}
					</>
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
				/>
			</div>
		</div>
	);
};

export default ChatArea;
