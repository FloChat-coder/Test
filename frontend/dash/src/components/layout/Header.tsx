import React, { useState } from 'react';
import { Search, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export interface HeaderProps {
  title?: string;
  showBreadcrumbs?: boolean;
  isCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', showBreadcrumbs = false, isCollapsed = false }) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header 
      className="bg-bg-base/80 backdrop-blur-sm border-b border-border-subtle h-16 fixed top-0 right-0 z-40 shadow-indigo-500/10 flex justify-between items-center px-8 transition-all duration-300"
      style={{ width: isCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)' }}
    >
      <div className="flex-1 flex items-center">
        {showBreadcrumbs && (
          <div className="flex items-center gap-2 mr-6 shrink-0">
            <span className="text-text-muted text-sm font-medium">Workspace</span>
            <ChevronRight className="text-text-muted w-4 h-4" />
            <span className="text-text-primary text-sm font-semibold">{title}</span>
          </div>
        )}
        <div className="relative w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-[18px] h-[18px]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full border border-border-subtle rounded-lg py-1.5 pl-10 pr-4 font-body-base text-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent placeholder-text-muted transition-all duration-300 bg-surface-container-low"
            placeholder={showBreadcrumbs ? "Search..." : "Search analytics..."}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/settings">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-glass-hover transition-all duration-200"
          >
            <Settings className="w-[20px] h-[20px]" />
          </motion.button>
        </Link>
      </div>
    </header>
  );
};
