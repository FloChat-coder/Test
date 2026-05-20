import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBreadcrumbs?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title, showBreadcrumbs }) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isSidebarHovered) {
      collapseTimeoutRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, 2000);
    } else {
      setIsCollapsed(false);
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    }
    return () => {
      if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
    };
  }, [isSidebarHovered]);

  return (
    <>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <Sidebar 
        isCollapsed={isCollapsed} 
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      />
      <Header title={title} showBreadcrumbs={showBreadcrumbs} isCollapsed={isCollapsed} />
      <main className={`transition-all duration-300 mt-16 p-8 relative z-10 min-h-[calc(100vh-4rem)] ${isCollapsed ? 'ml-[80px]' : 'ml-[256px]'}`}>
        {children}
      </main>
    </>
  );
};
