import { useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import ChatArea from './ChatArea';
import NewChatPage from './NewChatPage';

const ChatPage = () => {
	const { chatId } = useParams();
	const { sidebarCollapsed } = useOutletContext() || { sidebarCollapsed: false };
	if (chatId === 'new') {
		return <NewChatPage />;
	}

	return (
		<ChatArea
			sidebarCollapsed={sidebarCollapsed}
			chatId={chatId}
		/>
	);
};

export default ChatPage;
