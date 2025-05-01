import { useState, useCallback } from 'react';

export const useChatMessage = (chatId) => {
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = useCallback(async ({ sessionId, content, file, modelId }) => {
    // Handle image attachment
    let imageUrl = null;
    if (file) {
      imageUrl = URL.createObjectURL(file);
    }

    // Add user message to UI immediately
    const userMessageId = Date.now().toString();
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: content,
      image_url: imageUrl,
      timestamp: new Date().toISOString(),
    };

    // Add to local chat history
    setChatHistory((prev) => [...prev, userMessage]);

    // Start AI response process
    setIsAiResponding(true);

    const messageId = Date.now().toString() + Math.random().toString();
    setStreamingMessageId(messageId);
    setIsStreaming(true);

    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth'}/api/chat/send`;
      console.log('Sending request to:', url);

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('chat_id', sessionId);
      if (modelId) formData.append('model_id', modelId);
      formData.append('message', content);
      if (file) formData.append('image', file);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('heliaUser'))?.token || JSON.parse(sessionStorage.getItem('heliaUser'))?.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      let receivedText = '';

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        let processedChunk = chunk;

        // Process the chunk to remove 'data: ' prefix
        if (processedChunk.startsWith('data: ')) {
          processedChunk = processedChunk.substring(6);
        }

        // Handle cases where multiple SSE messages are in one chunk
        if (processedChunk.includes('data: ')) {
          const parts = processedChunk.split('data: ');
          processedChunk = parts.join('');
        }

        // Skip "END" message which signals the end of the stream
        if (processedChunk !== 'END' && !processedChunk.includes('event: end')) {
          receivedText += processedChunk;
        }

        setStreamingText(receivedText);
      }

      // Add the complete AI response to chat history
      const aiMessage = {
        id: messageId,
        role: 'assistant',
        content: receivedText,
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setChatHistory((prev) => [
        ...prev,
        {
          id: messageId,
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsAiResponding(false);
      setIsStreaming(false);
      setStreamingText('');
      setStreamingMessageId(null);
    }
  }, []);

  return {
    isAiResponding,
    isStreaming,
    streamingText,
    streamingMessageId,
    chatHistory,
    setChatHistory,
    sendMessage,
  };
}; 