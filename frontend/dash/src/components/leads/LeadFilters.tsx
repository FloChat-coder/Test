import React from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';

export const LeadFilters: React.FC = () => {
  return (
    <header className="mb-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display-xl text-display-xl text-text-primary tracking-tight">Leads</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-transparent border border-border-subtle rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-glass-hover transition-all shadow-indigo-500/10 active:scale-95">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg font-label-sm text-label-sm text-bg-base hover:shadow-indigo-500/30 transition-all flex items-center gap-2 active:scale-95">
            <Plus className="w-[18px] h-[18px]" />
            Add Lead
          </button>
        </div>
      </div>
      
      <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-indigo-500/10">
        <div className="flex flex-col md:flex-row lg:items-center gap-4 flex-1">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-[18px] h-[18px]" />
            <input
              type="text"
              className="w-full bg-surface-container-low border border-border-subtle rounded-lg py-2 pl-10 pr-4 text-body-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all shadow-indigo-500/10"
              placeholder="Search leads..."
            />
          </div>
          
          <div className="relative w-full md:w-48">
            <select className="w-full appearance-none bg-surface-container-low border border-border-subtle rounded-lg py-2 pl-4 pr-10 text-body-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all shadow-indigo-500/10">
              <option>Status: All</option>
              <option>New</option>
              <option>Qualified</option>
              <option>Contacted</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-[18px] h-[18px]" />
          </div>
          
          <div className="relative w-full md:w-48">
            <select className="w-full appearance-none bg-surface-container-low border border-border-subtle rounded-lg py-2 pl-4 pr-10 text-body-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all shadow-indigo-500/10">
              <option>Source: All</option>
              <option>Website</option>
              <option>Chatbot</option>
              <option>Referral</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-[18px] h-[18px]" />
          </div>
        </div>
        
        <div className="text-on-surface-variant font-label-sm text-label-sm whitespace-nowrap">
          Showing 5 of 128 Leads
        </div>
      </div>
    </header>
  );
};
