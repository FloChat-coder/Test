import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Lead, LeadStatus } from '../../data/mockLeads';
import { motion, AnimatePresence } from 'motion/react';

interface LeadTableProps {
  leads: Lead[];
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, selectedLeadId, onSelectLead }) => {
  const renderStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 font-label-sm text-label-sm border border-blue-500/20">New</span>;
      case 'Qualified':
        return <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-label-sm text-label-sm border border-emerald-500/20">Qualified</span>;
      case 'Contacted':
        return <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 font-label-sm text-label-sm border border-amber-500/20">Contacted</span>;
    }
  };

  return (
    <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl flex flex-col h-[750px] shadow-indigo-500/10">
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="sticky top-0 bg-surface-dim z-10">
            <tr className="border-b border-border-subtle">
              <th className="p-4 w-12"><input type="checkbox" className="rounded bg-surface-container-low border-border-subtle text-primary focus:ring-primary-container/50" /></th>
              <th className="p-4 font-label-sm text-label-sm text-text-muted">Lead Info</th>
              <th className="p-4 font-label-sm text-label-sm text-text-muted">Source</th>
              <th className="p-4 font-label-sm text-label-sm text-text-muted">Status</th>
              <th className="p-4 font-label-sm text-label-sm text-text-muted">Date</th>
              <th className="p-4 font-label-sm text-label-sm text-text-muted w-12"></th>
            </tr>
          </thead>
          <tbody className="text-body-base">
            <AnimatePresence>
              {leads.map((lead, idx) => {
                const isSelected = lead.id === selectedLeadId;
                return (
                  <motion.tr 
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onSelectLead(lead.id)}
                    className={`border-b border-border-subtle transition-all duration-300 cursor-pointer group ${
                      isSelected 
                        ? 'bg-primary/10 border-l-4 border-l-primary hover:bg-primary/20' 
                        : 'hover:bg-surface-glass-hover border-l-4 border-l-transparent'
                    }`}
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded bg-surface-container-low border-border-subtle text-primary focus:ring-primary-container/50" 
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="p-4 flex items-center gap-3 min-w-[200px]">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center text-text-muted font-heading-md">
                        {lead.avatarUrl ? (
                          <img src={lead.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          lead.initials
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading-md text-text-primary text-[15px] font-semibold truncate">{lead.name}</div>
                        <div className="text-text-muted text-[13px] truncate">{lead.email}</div>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface-variant whitespace-nowrap">{lead.source}</td>
                    <td className="p-4 whitespace-nowrap">{renderStatusBadge(lead.status)}</td>
                    <td className="p-4 text-on-surface-variant whitespace-nowrap">{lead.date}</td>
                    <td className="p-4 text-text-muted hover:text-text-primary transition-colors">
                      <button onClick={(e) => { e.stopPropagation(); }} className="p-1 rounded hover:bg-surface-glass-hover">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-border-subtle flex items-center justify-between mt-auto bg-surface-dim shrink-0">
        <button className="px-3 py-1.5 rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-glass-hover transition-colors font-label-sm text-label-sm active:scale-95">Prev</button>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-label-sm text-label-sm flex items-center justify-center border border-primary/20 transition-colors">1</button>
          <button className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-glass-hover font-label-sm text-label-sm flex items-center justify-center transition-colors">2</button>
          <button className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-glass-hover font-label-sm text-label-sm flex items-center justify-center transition-colors">3</button>
        </div>
        <button className="px-3 py-1.5 rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-glass-hover transition-colors font-label-sm text-label-sm active:scale-95">Next</button>
      </div>
    </div>
  );
};
