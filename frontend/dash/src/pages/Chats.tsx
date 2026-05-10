import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { AllChatsSection } from '../components/chats/AllChatsSection';
import { LiveChats } from '../components/chats/LiveChats';
import { HumanHandoff } from '../components/chats/HumanHandoff';
import { useChatbot } from '../context/ChatbotContext';

export const Chats: React.FC = () => {
  const { selectedChatbot } = useChatbot();
  return (
    <MainLayout title={`Chats: ${selectedChatbot}`} showBreadcrumbs={true}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8 h-full">
        <div className="flex-none">
          <AllChatsSection />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-none mb-8">
          <LiveChats />
          <HumanHandoff />
        </div>
      </div>
    </MainLayout>
  );
};
