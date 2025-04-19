import { useRef, useEffect, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Welcome from './message/Welcome';
import { getAIResponse } from '../../services/aiService';

export default function ChatArea({ sidebarCollapsed }) {
  const { currentSession, addMessage } = useChat();
  const messagesEndRef = useRef(null);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState(null);
 
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, streamingText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content, file = null) => {
    // Handle image attachment
    let imageData = file ? URL.createObjectURL(file) : null;
    
    // Add user message
    addMessage({
      id: Date.now(),
      role: 'user',
      content,
      image: imageData,
      timestamp: new Date().toISOString()
    });

    // Start AI response process
    handleAiResponse(content);
  };

  const handleAiResponse = (userMessage) => {
    // Disable input while AI is "responding"
    setIsAiResponding(true);

    // Prepare AI response
    const aiResponseId = Date.now() + 1;
    const aiResponse = getAIResponse(userMessage);
    
    // Add empty message that will be streamed
    addMessage({
      id: aiResponseId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    });
    
    // Set the ID of the message being streamed
    setStreamingMessageId(aiResponseId);
    
    // Stream the response character by character
    streamResponseText(aiResponse, aiResponseId);
  };

  const streamResponseText = (text, messageId) => {
    let index = 0;
    const streamInterval = setInterval(() => {
      if (index < text.length) {
        setStreamingText(text.substring(0, index + 1));
        index++;
      } else {
        // Finish streaming
        clearInterval(streamInterval);
        setStreamingMessageId(null);
        setStreamingText('');
        setIsAiResponding(false);
        
        // Update the message with the complete response
        addMessage({
          id: messageId,
          role: 'assistant',
          content: text,
          timestamp: new Date().toISOString()
        });
      }
    }, 15); // Adjust speed here
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <div className="flex-1 overflow-y-auto pt-14 pb-20">
        {currentSession?.messages.length === 0 ? (
          <Welcome />
        ) : (
          <>
            {currentSession?.messages.map((message) => (
              <div key={message.id}>
                {/* For regular messages or completed streaming messages */}
                {message.id !== streamingMessageId && (
                  <ChatMessage message={message} />
                )}
                
                {/* For the currently streaming message */}
                {message.id === streamingMessageId && (
                  <ChatMessage 
                    message={{
                      ...message,
                      content: streamingText
                    }}
                  />
                )}
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ${
        sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
      }`}>
        <ChatInput onSendMessage={handleSendMessage} isDisabled={isAiResponding} />
      </div>
    </div>
  );
}