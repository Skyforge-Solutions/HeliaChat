import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api/ApiClient';
import Welcome from '../chat/message/Welcome';
import ChatInput from '../chat/ChatInput';

const HomePage = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { mutate: createSession } = apiClient.chat.useCreateSession({
		onSuccess: (data) => {
			navigate(`/chat/${data.id}`);
		}
	});

	const handleNewChat = () => {
		createSession({ name: "New Chat" });
	};

	const handleSendMessage = (content, file = null) => {
		if (content.trim()) {
			createSession({ 
				name: content.length > 30 ? content.substring(0, 30) + '...' : content,
				initialMessage: content
			});
		}
	};

	return (
		<div className='h-full flex flex-col items-center justify-between p-6 bg-background'>
			
				<Welcome />

			
			
			<div className='w-full max-w-3xl mt-auto mb-6'>
				<ChatInput onSendMessage={handleSendMessage} disabled={false} />
			</div>
		</div>
	);
};

export default HomePage;
