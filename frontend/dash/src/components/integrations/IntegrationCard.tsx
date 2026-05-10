import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

export interface IntegrationCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  onAddIntegration?: () => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
  onAddIntegration,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(128,131,255,0.05)' }}
      className="bg-surface-glass backdrop-blur-xl border border-border-subtle p-6 rounded-2xl flex flex-col gap-5 transition-all duration-300 group"
    >
      <div className="flex items-center gap-4">
        <div 
          className="size-10 rounded-lg flex items-center justify-center shrink-0" 
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-text-primary">{name}</h3>
      </div>
      
      <p className="text-text-muted text-sm line-clamp-2 min-h-[40px]">
        {description}
      </p>
      
      <button 
        onClick={onAddIntegration}
        className="w-full py-2.5 mt-auto bg-surface-glass border border-border-subtle rounded-lg text-text-primary text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all duration-300 active:scale-[0.98]"
      >
        + Add Integration
      </button>
    </motion.div>
  );
};
