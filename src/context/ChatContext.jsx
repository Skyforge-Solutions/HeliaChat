import { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      return JSON.parse(savedSessions);
    }
    // Initialize with a default session
    return [
      {
        id: 'default-session',
        name: 'New Chat',
        timestamp: new Date().toISOString(),
        messages: []
      }
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return sessions[0]?.id || null;
  });

  // Save sessions to localStorage whenever they change
  const saveSessionsToStorage = (updatedSessions) => {
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
  };

  // Add a new message to the current chat session
  const addMessage = (message) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [...session.messages, message]
        };
      }
      return session;
    });
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
  };

  // Create a new chat session
  const createNewSession = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      name: 'New Chat',
      timestamp: new Date().toISOString(),
      messages: []
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setCurrentSessionId(newSession.id);
    saveSessionsToStorage(updatedSessions);
  };

  // Switch to a different chat session
  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  // Delete a chat session
  const deleteSession = (sessionId) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    
    // If the current session is deleted, switch to the first available session
    if (sessionId === currentSessionId && updatedSessions.length > 0) {
      setCurrentSessionId(updatedSessions[0].id);
    } else if (updatedSessions.length === 0) {
      // If no sessions remain, create a new one
      createNewSession();
    }
    
    saveSessionsToStorage(updatedSessions);
  };

  // Rename a chat session
  const renameSession = (sessionId, newName) => {
    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          name: newName
        };
      }
      return session;
    });
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
  };

  // Clear all chat sessions
  const clearAllSessions = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      name: 'New Chat',
      timestamp: new Date().toISOString(),
      messages: []
    };
    setSessions([newSession]);
    setCurrentSessionId(newSession.id);
    saveSessionsToStorage([newSession]);
  };

  // Get the current chat session
  const currentSession = sessions.find(session => session.id === currentSessionId) || null;

  return (
    <ChatContext.Provider value={{
      sessions,
      currentSession,
      currentSessionId,
      switchSession,
      createNewSession,
      addMessage,
      deleteSession,
      renameSession,
      clearAllSessions
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}