import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, Plus, LayoutDashboard, MessageSquare, Puzzle, Users, Activity, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useChatbot } from '../context/ChatbotContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'Analytics', path: '/analytics' },
  { icon: MessageSquare, label: 'Chats', path: '/chats' },
  { icon: Puzzle, label: 'Integrations', path: '/integrations' },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: SettingsIcon, label: 'AI Settings', path: '/ai-settings' },
];

export interface SidebarProps {
  isCollapsed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onMouseEnter, onMouseLeave }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedChatbot, setSelectedChatbot, chatbots } = useChatbot();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`bg-surface-container-lowest border-r border-border-subtle fixed left-0 top-0 h-full flex flex-col py-6 z-50 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[256px]'}`}
    >
      <div className={`mb-8 flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'px-0 justify-center' : 'px-6'}`}>
        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot className="text-white w-[20px] h-[20px]" />
        </div>
        <div className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <h1 className="font-display-xl text-heading-md text-primary">FloChat</h1>
          <p className="font-label-sm text-label-sm text-text-muted">Workspace</p>
        </div>
      </div>

      <div className={`mb-6 relative transition-all duration-300 ${isCollapsed ? 'px-3' : 'px-4'}`} ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full p-2.5 rounded-xl bg-surface-container-low border border-border-subtle cursor-pointer hover:bg-surface-glass-hover transition-colors flex shadow-sm ${isCollapsed ? 'justify-center border-transparent bg-transparent hover:bg-surface-container-high' : 'flex-col gap-1'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 shrink-0 rounded-md bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-primary/20 flex items-center justify-center">
                <Bot className="w-[14px] h-[14px] text-primary" />
              </div>
              <div className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                <span className="font-label-sm text-[13px] text-text-primary text-ellipsis">{selectedChatbot}</span>
              </div>
            </div>
            <div className={`shrink-0 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-4 opacity-100'}`}>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isDropdownOpen && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[calc(100%+8px)] left-4 mr-4 right-4 bg-[#1b1b23] border border-border-subtle rounded-xl shadow-2xl overflow-hidden z-[100] py-2 flex flex-col backdrop-blur-xl"
            >
              <div className="px-3 pb-2 pt-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Your Chatbots</div>
              <div className="flex flex-col max-h-[200px] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-surface-variant scrollbar-track-transparent">
                {chatbots.map(bot => (
                  <div
                    key={bot}
                    onClick={() => {
                      setSelectedChatbot(bot);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-3 py-2 mx-1.5 rounded-lg text-[13px] font-body-base cursor-pointer flex items-center gap-2 transition-colors
                      ${bot === selectedChatbot ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-glass hover:text-text-primary'}
                    `}
                  >
                    <Bot className="w-4 h-4 opacity-70" />
                    <span className="truncate">{bot}</span>
                  </div>
                ))}
              </div>
              <div className="px-2 pt-2 mt-1 border-t border-border-subtle border-opacity-50">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[13px] font-label-sm text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm"
                >
                  <Plus className="w-[16px] h-[16px]" />
                  Add Chatbot
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ul className="flex-1 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item, idx) => (
          <li key={idx}>
            <NavLink
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) => `flex items-center gap-3 py-3 font-label-sm text-label-sm transition-all duration-200 border-l-4 ${isActive
                ? 'text-primary bg-primary-container/10 border-primary scale-[0.98] rounded-r-lg'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-glass-hover border-transparent rounded-lg'
                } ${isCollapsed ? 'px-0 justify-center' : 'px-4'}`}
            >
              <item.icon className="w-[20px] h-[20px] shrink-0" />
              <div className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                {item.label}
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
