import React, { useState } from 'react';
import { Filter, Search, MessageSquare, Smartphone, User, MoreVertical, Bot, PlusCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ChatStatus = 'Resolved' | 'Active';
type ChatSource = 'Website' | 'WhatsApp';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface ChatSession {
  id: string;
  name: string;
  source: ChatSource;
  status: ChatStatus;
  preview: string;
  date: string;
  messages: ChatMessage[];
}

const MOCK_CHATS: ChatSession[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    source: 'Website',
    status: 'Resolved',
    preview: 'Thank you for the help, everything is working now.',
    date: '10:42 AM',
    messages: [
      { id: 'm1', sender: 'user', text: 'Thank you for the help, everything is working now.', time: '10:42 AM' }
    ],
  },
  {
    id: '2',
    name: 'Michael Chen',
    source: 'WhatsApp',
    status: 'Active',
    preview: 'I need help setting up the API integration.',
    date: 'Just now',
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi, I need help setting up the API integration. I keep getting a 401 error.', time: '10:45 AM' },
      { id: 'm2', sender: 'bot', text: 'Hello Michael! A 401 error usually indicates an issue with authentication. Could you please verify that you are including your API key in the \'Authorization\' header as a Bearer token?', time: '10:45 AM' },
      { id: 'm3', sender: 'user', text: 'Yes, I\'m passing it like this: `Authorization: Bearer my_key_here`. It was working yesterday.', time: '10:47 AM' },
    ],
  },
  {
    id: '3',
    name: 'Emma Davis',
    source: 'Website',
    status: 'Resolved',
    preview: 'Where can I find the pricing details?',
    date: 'Yesterday',
    messages: [
      { id: 'm1', sender: 'user', text: 'Where can I find the pricing details?', time: 'Yesterday' }
    ],
  },
];

export const AllChatsSection: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  const selectedChat = MOCK_CHATS.find((c) => c.id === selectedChatId);

  const filteredChats = MOCK_CHATS.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl overflow-hidden shadow-indigo-500/10 flex flex-col min-h-[600px] h-full">
      <div className="grid grid-cols-12 h-full flex-grow">
        
        {/* Left: Chat List */}
        <div className={`col-span-12 ${selectedChat ? 'lg:col-span-7 border-r border-border-subtle' : 'lg:col-span-12'} flex flex-col h-full bg-surface/50 transition-all duration-300`}>
          <div className="p-6 border-b border-border-subtle space-y-4 shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="font-heading-md text-heading-md text-text-primary">All Chats</h2>
              <button className="bg-surface-glass border border-border-subtle rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-surface-glass-hover transition-colors">
                <Filter className="w-4 h-4" />
                <span className="font-label-sm text-label-sm">Filters</span>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container border border-border-subtle rounded-lg pl-9 pr-4 py-2 font-body-base text-body-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-opacity-50"
                  placeholder="Search conversations..."
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <select className="flex-1 sm:flex-none bg-surface-container border border-border-subtle rounded-lg px-3 py-2 font-label-sm text-label-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 bg-opacity-50 min-w-[130px]">
                  <option>Date: Newest</option>
                  <option>Date: Oldest</option>
                </select>
                <select className="flex-1 sm:flex-none bg-surface-container border border-border-subtle rounded-lg px-3 py-2 font-label-sm text-label-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 bg-opacity-50 min-w-[140px]">
                  <option>All Integrations</option>
                  <option>WhatsApp</option>
                  <option>Website</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto chat-scroll min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-dim z-10">
                <tr>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-text-muted uppercase tracking-wider font-medium">Name</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-text-muted uppercase tracking-wider font-medium">Status</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-text-muted uppercase tracking-wider font-medium hidden sm:table-cell">Preview</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-text-muted uppercase tracking-wider font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                <AnimatePresence>
                  {filteredChats.map((chat, idx) => {
                    const isSelected = selectedChatId === chat.id;
                    const SourceIcon = chat.source === 'WhatsApp' ? Smartphone : MessageSquare;
                    
                    return (
                      <motion.tr
                        key={chat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedChatId(chat.id)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected 
                            ? 'bg-primary-container/10 border-l-2 border-primary hover:bg-primary-container/20' 
                            : 'hover:bg-surface-glass-hover border-l-2 border-transparent'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-border-subtle shrink-0">
                              <MessageSquare className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-body-base text-body-base text-text-primary truncate ${isSelected ? 'font-bold' : ''}`}>
                                {chat.name}
                              </p>
                              <p className="font-label-sm text-label-sm text-text-muted flex items-center gap-1">
                                <SourceIcon className="w-3 h-3" /> {chat.source}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap ${
                            chat.status === 'Active' 
                              ? 'bg-primary/20 border border-primary/30 text-primary' 
                              : 'bg-surface-container-high border border-border-subtle text-text-primary'
                          }`}>
                            {chat.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                          <p className="font-body-base text-body-base text-text-muted truncate max-w-[150px] md:max-w-[200px]">
                            {chat.preview}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <p className={`font-label-sm text-label-sm ${isSelected ? 'text-primary' : 'text-text-muted'}`}>
                            {chat.date}
                          </p>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <AnimatePresence mode="wait">
          {selectedChat && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="col-span-12 lg:col-span-5 flex flex-col h-full bg-surface-container-lowest/50 min-h-[400px]"
            >
              <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-dim shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-border-subtle shrink-0">
                    <User className="w-5 h-5 text-text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading-md text-[18px] leading-tight text-text-primary truncate">{selectedChat.name}</h3>
                    <p className="font-label-sm text-label-sm text-text-muted flex items-center gap-1 truncate">
                      {selectedChat.source === 'WhatsApp' ? <Smartphone className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                      {selectedChat.source} Integration
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="w-8 h-8 rounded-full bg-surface-glass border border-border-subtle flex items-center justify-center hover:bg-surface-glass-hover transition-colors text-text-muted hover:text-text-primary">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedChatId(null)}
                    className="w-8 h-8 rounded-full bg-surface-glass border border-border-subtle flex items-center justify-center hover:bg-surface-glass-hover transition-colors text-text-muted hover:text-text-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto chat-scroll space-y-6">
                {selectedChat.messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' ? (
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 flex-shrink-0 flex items-center justify-center border border-primary/30 mt-1">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-surface-glass backdrop-blur-md rounded-2xl rounded-tl-sm p-4 border border-primary/20 shadow-indigo-500/5">
                          <p className="font-body-base text-body-base text-text-primary">{msg.text}</p>
                          <p className="font-label-sm text-[11px] text-text-muted mt-2">{msg.time} • AI Assistant</p>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-[85%] bg-surface-container-high rounded-2xl rounded-tr-sm p-4 shadow-sm border border-border-subtle">
                        <p className="font-body-base text-body-base text-text-primary">{msg.text}</p>
                        <p className="font-label-sm text-[11px] text-text-muted mt-2 text-right">{msg.time}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-border-subtle bg-surface-dim shrink-0">
                <div className="relative flex items-end gap-2 bg-surface-container rounded-xl border border-border-subtle p-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                  <button className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg shrink-0">
                    <PlusCircle className="w-5 h-5" />
                  </button>
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 resize-none font-body-base text-body-base text-text-primary placeholder:text-text-muted min-h-[44px] max-h-[120px] py-2 chat-scroll focus:outline-none" 
                    placeholder="Type a message..." 
                    rows={1}
                  />
                  <button className="p-2 bg-primary text-on-primary rounded-lg hover:bg-primary-fixed transition-colors flex-shrink-0 flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2 px-2">
                  <p className="font-label-sm text-[12px] text-text-muted">Press Enter to send, Shift+Enter for new line</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
