import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export interface Bot {
    id: number;
    name: string;
    theme_color: string;
    icon_url: string;
    status: string;
    created_at: string;
}

type ChatbotContextType = {
  selectedChatbot: Bot | null;
  setSelectedChatbot: (bot: Bot) => void;
  chatbots: Bot[];
  refreshBots: () => void;
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatbots, setChatbots] = useState<Bot[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<Bot | null>(null);
  
  const refreshBots = async () => {
    try {
      const res = await apiFetch('/api/settings/bots');
      if (res.ok) {
        const data = await res.json();
        setChatbots(data);
        if (data.length > 0) {
            setSelectedChatbot(prev => data.find((b: Bot) => prev && b.id === prev.id) || data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch bots", err);
    }
  };

  useEffect(() => {
    refreshBots();
  }, []);

  return (
    <ChatbotContext.Provider value={{ selectedChatbot, setSelectedChatbot, chatbots, refreshBots }}>
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
