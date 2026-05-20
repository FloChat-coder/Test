import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';

type LeadStatus = 'New' | 'Qualified' | 'Contacted';

interface Lead {
  id: string;
  initials: string;
  name: string;
  email: string;
  status: LeadStatus;
}

export const RecentLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    apiFetch('/api/leads/recent')
        .then(res => res.json())
        .then(data => {
            if (!data.error && Array.isArray(data)) {
                setLeads(data.map((l: any) => ({
                    id: l.id,
                    initials: l.initials,
                    name: l.name,
                    email: l.email,
                    status: l.status as LeadStatus
                })));
            }
        })
        .catch(console.error);
  }, []);

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return <span className="px-2 py-1 rounded-full bg-tertiary/10 text-tertiary text-[11px] font-semibold border border-tertiary/20">New</span>;
      case 'Qualified':
        return <span className="px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-[11px] font-semibold border border-emerald-400/20">Qualified</span>;
      case 'Contacted':
        return <span className="px-2 py-1 rounded-full bg-blue-400/10 text-blue-400 text-[11px] font-semibold border border-blue-400/20">Contacted</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-surface-container-high text-text-muted text-[11px] font-semibold border border-border-subtle">{status}</span>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface-glass border border-border-subtle backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/10"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading-md text-heading-md text-on-surface">Recent Leads</h3>
        <Link to="/leads" className="text-primary font-label-sm text-label-sm hover:underline transition-all">View All</Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle/50 text-text-muted font-label-sm text-label-sm">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="font-body-base text-body-base text-on-surface">
            {leads.length === 0 ? (
                <tr>
                    <td colSpan={3} className="py-8 text-center text-text-muted font-body-base">
                        No recent leads found.
                    </td>
                </tr>
            ) : (
                leads.map((lead, idx) => (
                  <motion.tr 
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="border-b border-border-subtle/30 last:border-0 hover:bg-surface-glass-hover transition-colors"
                  >
                    <td className="py-3 px-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-container font-semibold text-[13px]">
                        {lead.initials}
                      </div>
                      {lead.name}
                    </td>
                    <td className="py-3 px-2 text-text-muted">{lead.email}</td>
                    <td className="py-3 px-2">{getStatusBadge(lead.status)}</td>
                  </motion.tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
