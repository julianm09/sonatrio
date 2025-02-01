"use client";

import React, { createContext, useContext, useState } from "react";

interface MessageContextType {
	currentConversation: string | null;
	setCurrentConversation: (currentConversation: string | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [currentConversation, setCurrentConversation] = useState<
		string | null
	>(null);

	return (
		<MessageContext.Provider
			value={{ currentConversation, setCurrentConversation }}
		>
			{children}
		</MessageContext.Provider>
	);
};

export const useMessageContext = () => {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error(
			"useMessageContext must be used within an MessageContextProvider"
		);
	}
	return context;
};
