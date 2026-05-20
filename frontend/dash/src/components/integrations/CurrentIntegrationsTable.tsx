import React from 'react';
import { LucideIcon, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface CurrentIntegration {
  id: string;
  serviceName: string;
  connectionName: string;
  dateModified: string;
  dateAdded: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

interface CurrentIntegrationsTableProps {
  integrations: CurrentIntegration[];
  onDelete?: (id: string) => void;
}

export const CurrentIntegrationsTable: React.FC<CurrentIntegrationsTableProps> = ({ integrations, onDelete }) => {
  return (
    <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-2xl overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-border-subtle bg-zinc-950/50 text-sm font-bold text-slate-50">
              <th className="px-6 py-4 font-bold">Service</th>
              <th className="px-6 py-4 font-bold">Connection Name</th>
              <th className="px-6 py-4 font-bold">Date Modified</th>
              <th className="px-6 py-4 font-bold">Date Added</th>
              <th className="px-6 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-primary divide-y divide-border-subtle/50">
            {integrations.map((integration, idx) => {
              const Icon = integration.icon;
              return (
                <motion.tr 
                  key={integration.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * idx }}
                  className="hover:bg-surface-glass-hover transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="size-8 rounded flex items-center justify-center"
                        style={{ backgroundColor: integration.iconBgColor, color: integration.iconColor }}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      <span className="font-medium">{integration.serviceName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{integration.connectionName}</td>
                  <td className="px-6 py-4 text-text-muted">{integration.dateModified}</td>
                  <td className="px-6 py-4 text-text-muted">{integration.dateAdded}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDelete && onDelete(integration.id)}
                      className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
