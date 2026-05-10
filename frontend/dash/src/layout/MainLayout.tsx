import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 p-8 relative z-10 min-h-screen">
        {children}
      </main>
    </>
  );
};
