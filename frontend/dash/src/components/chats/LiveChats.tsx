import React from 'react';
import { motion } from 'motion/react';

interface LiveChat {
  id: string;
  initials: string;
  name: string;
  timeActive: string;
  topic: string;
  isRecent?: boolean;
}

const MOCK_LIVE_CHATS: LiveChat[] = [
  { id: '1', initials: 'MC', name: 'Michael Chen', timeActive: '05:21', topic: 'API Integration Error 401', isRecent: true },
  { id: '2', initials: 'AW', name: 'Alice Wong', timeActive: '02:45', topic: 'Billing Inquiry' },
  { id: '3', initials: 'JD', name: 'John Doe', timeActive: '00:12', topic: 'Product Demo Request' },
];

export const LiveChats: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl overflow-hidden shadow-sm flex flex-col h-full"
    >
      <div className="p-6 border-b border-border-subtle flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="font-heading-md text-heading-md text-text-primary">Live Chats</h2>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <span className="font-label-sm text-label-sm text-text-muted bg-surface-container px-2 py-1 rounded-md border border-border-subtle">
          {MOCK_LIVE_CHATS.length} Active
        </span>
      </div>
      
      <div className="p-0 overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="py-3 px-6 font-label-sm text-label-sm text-text-muted font-medium">User</th>
              <th className="py-3 px-6 font-label-sm text-label-sm text-text-muted font-medium">Time Active</th>
              <th className="py-3 px-6 font-label-sm text-label-sm text-text-muted font-medium">Topic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {MOCK_LIVE_CHATS.map((chat, idx) => (
              <motion.tr 
                key={chat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="hover:bg-surface-glass-hover transition-colors cursor-pointer"
              >
                <td className="py-3 px-6 font-body-base text-body-base text-text-primary flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center border border-border-subtle text-[10px] shrink-0">
                    {chat.initials}
                  </div>
                  <span className="truncate">{chat.name}</span>
                </td>
                <td className={`py-3 px-6 font-label-sm text-label-sm ${chat.isRecent ? 'text-primary' : 'text-text-muted'}`}>
                  {chat.timeActive}
                </td>
                <td className="py-3 px-6 font-body-base text-body-base text-text-muted truncate max-w-[150px]">
                  {chat.topic}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
