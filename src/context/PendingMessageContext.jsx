import React, { createContext, useContext, useState, useCallback } from 'react';

const PendingMessageContext = createContext(undefined);

export const PendingMessageProvider = ({ children }) => {
	const [pendingMessage, setPendingMessage] = useState(null);

	const clearPendingMessage = useCallback(() => {
		setPendingMessage(null);
	}, []);

	return (
		<PendingMessageContext.Provider
			value={{
				pendingMessage,
				setPendingMessage,
				clearPendingMessage,
			}}
		>
			{children}
		</PendingMessageContext.Provider>
	);
};

export const usePendingMessage = () => {
	const context = useContext(PendingMessageContext);
	if (context === undefined) {
		throw new Error('usePendingMessage must be used within a PendingMessageProvider');
	}
	return context;
};
