import React, { useRef, useEffect, useCallback, memo } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Welcome from './message/Welcome';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/api/ApiClient';
import { usePendingMessage } from '../../context/PendingMessageContext';
import { useChatMessage } from '../../hooks/useChatMessage';
import ChatSkeleton from '../shared/ChatSkeleton';

// Memoized chat message component
const MemoizedChatMessage = memo(({ message }) => (
	<div>
		<ChatMessage message={message} />
	</div>
));

// Chat messages container component
const ChatMessages = memo(
	({ chatHistory, isStreaming, streamingText, streamingMessageId, messagesEndRef }) => (
		<>
			{chatHistory?.map((message) => (
				<MemoizedChatMessage
					key={message.id}
					message={message}
				/>
			))}
			{isStreaming && streamingMessageId && (
				<MemoizedChatMessage
					key={`streaming-${streamingMessageId}`}
					message={{
						id: streamingMessageId,
						role: 'assistant',
						content: streamingText || '...',
						timestamp: new Date().toISOString(),
						isStreaming: true,
					}}
				/>
			)}
			<div ref={messagesEndRef} />
		</>
	)
);

// Component to handle pending messages
const PendingMessageHandler = memo(({ pendingMessage, chatId, sendMessage, setChatHistory }) => {
	useEffect(() => {
		// Only process if there's a pendingMessage, we have a chatId, and the message hasn't been sent yet
		if (pendingMessage && chatId && !pendingMessage.sent) {
			// Send message to the server
			sendMessage({
				sessionId: chatId,
				content: pendingMessage.content,
				file: pendingMessage.file,
				modelId: pendingMessage.modelId,
			});

			// Mark the pending message as sent
			pendingMessage.sent = true;
		}
	}, [pendingMessage, chatId, sendMessage, setChatHistory]);

	return null;
});

// Component to handle chat history fetching
const ChatHistoryFetcher = memo(({ chatId, pendingMessage, setChatHistory }) => {
	// Only fetch history when we have a valid chatId, not creating a new chat,
	// no pending message with a chatId, and pending message hasn't been sent
	const { data: fetchedChatHistory } = apiClient.chat.useGetHistory(chatId, {
		enabled: !!chatId && chatId !== 'new' && !pendingMessage?.chatId && !pendingMessage?.sent,
	});

	// Update chat history when data is received
	useEffect(() => {
		const shouldUpdateHistory =
			fetchedChatHistory && chatId !== 'new' && !pendingMessage?.chatId && !pendingMessage?.sent;

		if (shouldUpdateHistory) {
			setChatHistory(fetchedChatHistory);
		}
	}, [fetchedChatHistory, chatId, setChatHistory, pendingMessage]);

	return null;
});

// Auto-scroll component
const AutoScroller = memo(({ messagesEndRef, chatHistory, isStreaming, streamingText }) => {
	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messagesEndRef]);

	// Scroll when chat history changes
	useEffect(() => {
		scrollToBottom();
	}, [chatHistory, scrollToBottom]);

	// Scroll when streaming text updates
	useEffect(() => {
		if (isStreaming) {
			scrollToBottom();
		}
	}, [streamingText, isStreaming, scrollToBottom]);

	return null;
});

const ChatArea = ({ sidebarCollapsed }) => {
	const { chatId } = useParams();
	const messagesEndRef = useRef(null);
	const { pendingMessage } = usePendingMessage();

	const {
		isAiResponding,
		isStreaming,
		streamingText,
		streamingMessageId,
		chatHistory,
		setChatHistory,
		sendMessage,
	} = useChatMessage(chatId);

	// Get loading state for history
	const { isLoading: historyLoading } = apiClient.chat.useGetHistory(chatId, {
		enabled: !!chatId && chatId !== 'new' && !pendingMessage?.chatId,
	});

	// Handle sending new messages
	const handleSendMessage = useCallback(
		async (content, file = null, modelId = null) => {
			await sendMessage({
				sessionId: chatId,
				content,
				file,
				modelId,
			});
		},
		[chatId, sendMessage]
	);

	/**
	 * Determines what content to render based on current state
	 */
	const renderChatContent = () => {
		// If we have chat history (including pending messages), show it
		if (chatHistory?.length > 0) {
			return (
				<ChatMessages
					chatHistory={chatHistory}
					isStreaming={isStreaming}
					streamingText={streamingText}
					streamingMessageId={streamingMessageId}
					messagesEndRef={messagesEndRef}
				/>
			);
		}

		// If history is loading and we don't have pending messages, show skeleton
		if (historyLoading) {
			return <ChatSkeleton />;
		}

		// No history and not loading - show welcome screen if AI isn't responding
		if (!isAiResponding) {
			return <Welcome />;
		}

		// Default empty state
		return null;
	};

	return (
		<div className='flex flex-col h-full bg-background'>
			{/* Side effect handlers */}
			<PendingMessageHandler
				pendingMessage={pendingMessage}
				chatId={chatId}
				sendMessage={sendMessage}
				setChatHistory={setChatHistory}
			/>

			<ChatHistoryFetcher
				chatId={chatId}
				pendingMessage={pendingMessage}
				setChatHistory={setChatHistory}
			/>

			<AutoScroller
				messagesEndRef={messagesEndRef}
				chatHistory={chatHistory}
				isStreaming={isStreaming}
				streamingText={streamingText}
			/>

			{/* Main chat content area */}
			<div className='flex-1 overflow-y-auto pt-14 pb-20'>{renderChatContent()}</div>

			{/* Chat input */}
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
