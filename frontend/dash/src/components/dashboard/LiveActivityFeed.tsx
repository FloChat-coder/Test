import React, { useState, useEffect } from 'react';
import { Bot, Headset, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { apiFetch } from '../../utils/api';

type FeedType = 'bot' | 'human' | 'qualified';

interface FeedItem {
  id: string;
  type: FeedType;
  title: string;
  timeInfo: string;
  description: string;
}

export const LiveActivityFeed: React.FC = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    const fetchFeed = () => {
      apiFetch('/api/dashboard/activity-feed')
        .then(res => res.json())
        .then(data => {
            if (!data.error && Array.isArray(data)) {
                setFeed(data);
            }
        })
        .catch(console.error);
    };

    // Initial fetch
    fetchFeed();

    // Poll every 10 seconds for live updates
    const interval = setInterval(fetchFeed, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-surface-glass border border-border-subtle backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/10 flex flex-col h-full min-h-[350px]"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading-md text-heading-md text-on-surface flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Activity Feed
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {feed.length === 0 ? (
            <div className="text-center text-text-muted font-body-base py-8">
                No recent activity.
            </div>
        ) : (
            feed.map((item, index) => (
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
                  
                  {index !== feed.length - 1 && (
                    <div className="w-px h-full bg-border-subtle/50 my-1 min-h-[20px]"></div>
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
            ))
        )}
      </div>
    </motion.div>
  );
};
