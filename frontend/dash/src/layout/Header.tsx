import React, { useState } from 'react';
import { Search, Bell, CircleUser } from 'lucide-react';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="bg-bg-base/80 backdrop-blur-sm border-b border-border-subtle h-16 fixed top-0 right-0 z-40 shadow-indigo-500/10 flex justify-between items-center px-8 w-[calc(100%-256px)]">
      <div className="flex-1 flex items-center">
        <div className="relative w-64 group relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-[18px] h-[18px]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full border border-border-subtle rounded-full py-1.5 pl-10 pr-4 font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent placeholder-text-muted transition-all duration-300 bg-surface-container-low"
            placeholder="Search analytics..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-glass-hover transition-all duration-200"
        >
          <Bell className="w-[20px] h-[20px]" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-glass-hover transition-all duration-200"
        >
          <CircleUser className="w-[20px] h-[20px]" />
        </motion.button>
        
        <div className="h-6 w-px bg-border-subtle mx-2" />
        
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="py-1.5 px-4 rounded-lg border border-border-subtle text-primary font-label-sm text-label-sm hover:bg-surface-glass-hover transition-all duration-300 bg-surface-container-high"
        >
          Test Bot
        </motion.button>
      </div>
    </header>
  );
};
