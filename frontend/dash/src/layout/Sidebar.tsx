import React from 'react';
import { Bot, Plus, Activity, Inbox, Blocks, Users, Settings } from 'lucide-react';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { icon: Activity, label: 'Analytics', active: true },
  { icon: Inbox, label: 'Inbox', active: false },
  { icon: Blocks, label: 'Integrations', active: false },
  { icon: Users, label: 'Leads', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export const Sidebar: React.FC = () => {
  return (
    <nav className="bg-surface-container-lowest border-r border-border-subtle w-64 fixed left-0 top-0 h-full flex flex-col py-6 z-50">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot className="text-white w-[20px] h-[20px]" />
        </div>
        <div>
          <h1 className="font-display-xl text-heading-md text-primary">FloChat</h1>
          <p className="font-label-sm text-label-sm text-text-muted">AI Command Center</p>
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-label-sm text-label-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-[18px] h-[18px]" />
          New Chatbot
        </motion.button>
      </div>
      
      <ul className="flex-1 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item, idx) => (
          <li key={idx}>
            <a
              href="#"
              className={`flex items-center gap-3 px-4 py-3 font-label-sm text-label-sm rounded-r-lg transition-all duration-200 border-l-4 ${
                item.active
                  ? 'text-primary bg-primary-container/10 border-primary scale-[0.98]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-glass-hover border-transparent rounded-lg'
              }`}
            >
              <item.icon className="w-[20px] h-[20px]" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      
      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-glass border border-border-subtle hover:bg-surface-glass-hover transition-colors cursor-pointer">
          <img
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-border-subtle object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-gfJSOnsaOAtY2D5EzSo8n7dX-idA_94UIsd2IQ6ejN_-2MO-6qXt9WULYvcMgBI00NFzPqIYr-wsoQIWybnwSuIgILqjokurULC5khfYU4ZgF84z8-PlT3fbASTm5XoZ28tLT9x1R28K6zIie9LhtScqUlkYs2xdsshXeeKBXgHEYNZ3PXwfTMeFx0O0SqIaDgexxeynWM8X_GM2blf9APWma8Bxpl4IzElr6R86XW-6QaMJJSJYIDKSz1G--w4CQfHQuCxyk9Y"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="font-label-sm text-label-sm text-on-surface truncate">Admin User</p>
            <p className="text-[11px] text-text-muted truncate">admin@flochat.ai</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
