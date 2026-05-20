import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

export interface IntegrationCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  comingSoon?: boolean;
  connected?: boolean;
  onAddIntegration?: () => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
  comingSoon,
  connected,
  onAddIntegration,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={comingSoon ? undefined : { y: -4, boxShadow: '0 10px 25px -5px rgba(128,131,255,0.05)' }}
      className={`bg-surface-glass backdrop-blur-xl border border-border-subtle p-6 rounded-2xl flex flex-col gap-5 transition-all duration-300 group ${comingSoon ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div
          className="size-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-text-primary">{name}</h3>
        {comingSoon && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-wider uppercase border border-amber-500/20">
            Coming Soon
          </span>
        )}
        {connected && !comingSoon && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/20">
            Connected
          </span>
        )}
      </div>

      <p className="text-text-muted text-sm line-clamp-2 min-h-[40px]">
        {description}
      </p>

      <button
        onClick={comingSoon ? undefined : onAddIntegration}
        disabled={comingSoon}
        className={`w-full py-2.5 mt-auto rounded-lg text-sm font-medium transition-all duration-300 ${
          comingSoon
            ? 'bg-surface-container-high border border-border-subtle text-text-muted cursor-not-allowed'
            : 'bg-surface-glass border border-border-subtle text-text-primary hover:border-primary hover:bg-primary/5 active:scale-[0.98]'
        }`}
      >
        {comingSoon ? 'Coming Soon' : '+ Add Integration'}
      </button>
    </motion.div>
  );
};
