import React from 'react';
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

export interface MetricCardProps {
  title: string;
  value: string;
  trend: number; // positive or negative percentage
  icon: LucideIcon;
  sparklineColorClass: string; // e.g., 'text-primary-container'
  sparklineBgClass: string; // e.g., 'from-transparent via-primary-container/20 to-transparent'
  sparklineData: string; // SVG path data
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  sparklineColorClass,
  sparklineBgClass,
  sparklineData,
}) => {
  const isPositive = trend >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-surface-glass border border-border-subtle backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:bg-surface-glass-hover hover:shadow-indigo-500/10 group"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="font-label-sm text-label-sm text-text-muted">{title}</p>
        <span className={`${sparklineColorClass} text-[20px] bg-current/10 p-1.5 rounded-lg border border-current/20`}>
          <Icon className="w-[20px] h-[20px] text-current" />
        </span>
      </div>
      
      <p className="font-metric-lg text-metric-lg text-on-surface mb-2">{value}</p>
      
      <div className="flex items-center gap-2">
        <span className={`${isPositive ? 'text-emerald-400' : 'text-rose-400'} font-label-sm text-label-sm flex items-center`}>
          {isPositive ? <ArrowUp className="w-[14px] h-[14px]" /> : <ArrowDown className="w-[14px] h-[14px]" />}
          {Math.abs(trend)}%
        </span>
        <span className="text-text-muted text-[12px]">vs last week</span>
      </div>
      
      {/* Sparkline */}
      <div className={`mt-4 h-10 w-full rounded bg-gradient-to-r ${sparklineBgClass} relative overflow-hidden`}>
        <svg className="absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 20">
          <path 
            className={`${sparklineColorClass} vector-effect-non-scaling-stroke drop-shadow-[0_0_4px_currentColor]`}
            d={sparklineData}
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
          />
        </svg>
      </div>
    </motion.div>
  );
};
