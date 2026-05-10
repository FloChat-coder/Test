import React from 'react';
import { Bot, Headset, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';

type FeedType = 'bot' | 'human' | 'qualified';

interface FeedItem {
  id: string;
  type: FeedType;
  title: string;
  timeInfo: string;
  description: string;
}

const MOCK_FEED: FeedItem[] = [
  {
    id: '1',
    type: 'bot',
    title: 'Bot handled pricing query',
    timeInfo: 'Just now',
    description: 'Successfully routed to Enterprise pricing page.',
  },
  {
    id: '2',
    type: 'human',
    title: 'Human handoff requested',
    timeInfo: '2 mins ago',
    description: 'User requested to speak with a technical sales rep.',
  },
  {
    id: '3',
    type: 'qualified',
    title: 'Lead qualified',
    timeInfo: '15 mins ago',
    description: "Captured contact info for 'Mike Williams'.",
  },
];

export const LiveActivityFeed: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-surface-glass border border-border-subtle backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/10 flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading-md text-heading-md text-on-surface flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Activity Feed
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {MOCK_FEED.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              {item.type === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(128,131,255,0.2)]">
                  <Bot className="w-[16px] h-[16px]" />
                </div>
              )}
              {item.type === 'human' && (
                <div className="w-8 h-8 rounded-full bg-surface-bright border border-border-subtle flex items-center justify-center text-on-surface-variant">
                  <Headset className="w-[16px] h-[16px]" />
                </div>
              )}
              {item.type === 'qualified' && (
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <BadgeCheck className="w-[16px] h-[16px]" />
                </div>
              )}
              
              {index !== MOCK_FEED.length - 1 && (
                <div className="w-px h-full bg-border-subtle/50 my-1"></div>
              )}
            </div>
            
            <div className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-label-sm text-label-sm text-on-surface">{item.title}</span>
                <span className="text-[11px] text-text-muted">{item.timeInfo}</span>
              </div>
              <p className="text-[13px] text-text-muted bg-surface-container-low/50 p-2 rounded-lg border border-border-subtle/30">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
