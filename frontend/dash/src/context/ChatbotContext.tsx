import React, { createContext, useState, useContext, ReactNode } from 'react';

type ChatbotContextType = {
  selectedChatbot: string;
  setSelectedChatbot: (bot: string) => void;
  chatbots: string[];
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedChatbot, setSelectedChatbot] = useState('Default Support Bot');
  const chatbots = ['Default Support Bot', 'Sales Assistant', 'Lead Gen Bot'];

  return (
    <ChatbotContext.Provider value={{ selectedChatbot, setSelectedChatbot, chatbots }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
