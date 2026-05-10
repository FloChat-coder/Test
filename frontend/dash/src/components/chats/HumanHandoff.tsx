import React, { useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Headset } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HandoffQueueItem {
  id: string;
  context: string;
  messages: { sender: 'user' | 'bot'; text: string }[];
  reason: string;
}

const MOCK_QUEUE: HandoffQueueItem[] = [
  {
    id: '1',
    context: 'User is frustrated with automated responses regarding a refund request for invoice #INV-2023-441.',
    reason: 'Bot triggered handoff due to negative sentiment',
    messages: [
      { sender: 'bot', text: 'I can help you review our refund policy. Refunds are typically processed within 5-7 business days for eligible accounts.' },
      { sender: 'user', text: 'I don\'t want the policy, I want to talk to a real person. This is my third time asking!' },
    ]
  },
  {
    id: '2',
    context: 'User needs technical assistance with custom REST API integration.',
    reason: 'Bot confidence below threshold for technical query',
    messages: [
      { sender: 'user', text: 'How do I pass the custom metadata object in the webhook payload?' },
      { sender: 'bot', text: 'Our webhooks support JSON payloads. Let me connect you with a technical specialist for advanced implementation details.' },
    ]
  }
];

export const HumanHandoff: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = MOCK_QUEUE[currentIndex];

  const handleNext = () => {
    if (currentIndex < MOCK_QUEUE.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface-glass backdrop-blur-xl border border-tertiary-container/30 rounded-xl overflow-hidden shadow-sm flex flex-col relative h-full min-h-[400px]"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tertiary-container to-tertiary-fixed-dim opacity-50"></div>
      
      <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-tertiary-container w-5 h-5 fill-tertiary-container/20" />
          <h2 className="font-heading-md text-[16px] text-text-primary">Human Handoff Queue</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-2 py-1 bg-surface-container border border-border-subtle rounded text-text-muted hover:text-text-primary hover:bg-surface-glass-hover disabled:opacity-50 transition-colors font-label-sm text-[11px] flex items-center"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <span className="font-label-sm text-[11px] text-text-muted whitespace-nowrap">{currentIndex + 1} of {MOCK_QUEUE.length}</span>
          <button 
            onClick={handleNext}
            disabled={currentIndex === MOCK_QUEUE.length - 1}
            className="px-2 py-1 bg-surface-container border border-border-subtle rounded text-text-muted hover:text-text-primary hover:bg-surface-glass-hover disabled:opacity-50 transition-colors font-label-sm text-[11px] flex items-center"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto chat-scroll space-y-4 bg-surface-container-lowest/30 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="bg-surface-container rounded-lg p-3 border border-border-subtle mb-4">
              <p className="font-label-sm text-[11px] text-text-muted uppercase tracking-wider mb-1">Issue Context</p>
              <p className="font-body-base text-[13px] text-text-primary">{currentItem.context}</p>
            </div>

            {currentItem.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${msg.sender === 'user' ? 'bg-surface-container-high rounded-tr-sm' : 'bg-surface-glass rounded-tl-sm'} rounded-2xl p-3 border border-border-subtle max-w-[85%]`}>
                  <p className="font-body-base text-[13px] text-text-primary">{msg.text}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-center my-4">
              <span className="font-label-sm text-[11px] text-tertiary-fixed-dim bg-tertiary-container/10 px-3 py-1 rounded-full border border-tertiary-container/20 text-center">
                {currentItem.reason}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-border-subtle bg-surface-dim mt-auto shrink-0">
        <button className="w-full py-2.5 bg-surface-container border border-tertiary-container/50 hover:bg-tertiary-container/10 transition-colors rounded-lg font-label-sm text-label-sm text-tertiary-fixed-dim flex items-center justify-center gap-2">
          <Headset className="w-4 h-4" />
          Takeover Chat as Human
        </button>
      </div>
    </motion.div>
  );
};
