import React from 'react';
import { X, Mail, Phone, MessageSquare } from 'lucide-react';
import { Lead } from '../../data/mockLeads';

interface LeadDrawerProps {
  lead: Lead;
  onClose: () => void;
}

export const LeadDrawer: React.FC<LeadDrawerProps> = ({ lead, onClose }) => {
  return (
    <div className="bg-surface-glass/80 backdrop-blur-2xl border border-border-subtle rounded-xl shadow-2xl flex flex-col h-[750px] overflow-hidden relative">
      <div className="p-6 border-b border-border-subtle relative shrink-0">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-surface-glass-hover"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center mt-4">
          <div className="w-20 h-20 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary/20 shadow-indigo-500/10 mb-4 flex items-center justify-center text-text-muted font-heading-md text-2xl">
            {lead.avatarUrl ? (
              <img src={lead.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              lead.initials
            )}
          </div>
          <h2 className="font-heading-md text-heading-md text-text-primary mb-1">{lead.name}</h2>
          <div className="text-on-surface-variant text-body-base text-center">{lead.title}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <div className="flex items-center justify-center gap-4">
          <button className="w-12 h-12 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-text-primary hover:bg-surface-glass-hover hover:-translate-y-0.5 transition-all shadow-indigo-500/10" title="Email">
            <Mail className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-text-primary hover:bg-surface-glass-hover hover:-translate-y-0.5 transition-all shadow-indigo-500/10" title="Call">
            <Phone className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-text-primary hover:bg-surface-glass-hover hover:-translate-y-0.5 transition-all shadow-indigo-500/10" title="Chat History">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 flex flex-col gap-4 shadow-indigo-500/10">
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-text-muted">Phone</span>
            <span className="text-text-primary font-body-base text-body-base">{lead.phone}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-text-muted">Location</span>
            <span className="text-text-primary font-body-base text-body-base">{lead.location}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-text-muted">Source</span>
            <span className="text-text-primary font-body-base text-body-base">{lead.sourceDetail}</span>
          </div>
        </div>

        <div>
          <h3 className="font-heading-md text-[16px] text-text-primary mb-4">Recent Activity</h3>
          <div className="relative pl-6 border-l border-border-subtle flex flex-col gap-6 ml-2">
            {lead.activities.map((activity) => (
              <div key={activity.id} className="relative">
                <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-surface ${activity.isRecent ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                <div className="font-label-sm text-label-sm text-text-primary">{activity.message}</div>
                <div className="text-text-muted text-[12px] mt-0.5">{activity.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border-subtle bg-surface-container-lowest shrink-0">
        <div className="flex gap-2">
          <input 
            type="text"
            className="flex-1 bg-surface-container-low border border-border-subtle rounded-lg px-3 py-2 text-body-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all shadow-indigo-500/10" 
            placeholder="Add a note..." 
          />
          <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-label-sm text-label-sm hover:bg-primary/20 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
