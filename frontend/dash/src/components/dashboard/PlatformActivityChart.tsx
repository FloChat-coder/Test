import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TIMEFRAMES = [
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '3m', label: '3M' },
];

export const PlatformActivityChart: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('7d');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface-glass border border-border-subtle backdrop-blur-xl rounded-xl p-6 mb-8 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/10"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-heading-md text-heading-md text-on-surface">Platform Activity</h3>
          <p className="font-label-sm text-label-sm text-text-muted">Messages handled by AI vs Human over time</p>
        </div>
        <div className="flex gap-2 bg-surface-container/50 p-1 rounded-lg border border-border-subtle">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setActiveTimeframe(tf.id)}
              className={`px-3 py-1 rounded-md font-label-sm text-label-sm transition-colors relative z-10 ${
                activeTimeframe === tf.id ? 'text-on-surface shadow-sm' : 'text-text-muted hover:text-on-surface'
              }`}
            >
              {activeTimeframe === tf.id && (
                <motion.div
                  layoutId="active-timeframe"
                  className="absolute inset-0 bg-surface-glass rounded-md -z-10"
                />
              )}
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[300px] w-full rounded-lg bg-surface-container-lowest/50 border border-border-subtle/50 relative flex items-end px-4 pb-4">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between px-4 py-4 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-px bg-border-subtle/30" />
          ))}
        </div>

        {/* SVG Chart Line (Decorative) */}
        <AnimatePresence mode="popLayout">
          <motion.svg
            key={activeTimeframe}
            initial={{ opacity: 0, scaleY: 0.9 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full origin-bottom" 
            preserveAspectRatio="none" 
            viewBox="0 0 100 100"
          >
            <path 
              className="vector-effect-non-scaling-stroke drop-shadow-[0_0_8px_rgba(128,131,255,0.4)]" 
              d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,20" 
              fill="none" 
              stroke="url(#gradientPrimary)" 
              strokeWidth="2" 
            />
            <path 
              className="vector-effect-non-scaling-stroke opacity-50" 
              d="M0,90 Q15,85 30,92 T60,80 T85,85 T100,75" 
              fill="none" 
              stroke="#4f46e5" 
              strokeDasharray="4" 
              strokeWidth="2" 
            />
            <defs>
              <linearGradient id="gradientPrimary" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#8083ff" />
                <stop offset="100%" stopColor="#c0c1ff" />
              </linearGradient>
            </defs>
          </motion.svg>
        </AnimatePresence>

        <div className="w-full flex justify-between text-[11px] text-text-muted z-10">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-container shadow-[0_0_8px_rgba(128,131,255,0.6)]"></div>
          <span className="font-label-sm text-label-sm text-on-surface">AI Handled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400 border-dashed"></div>
          <span className="font-label-sm text-label-sm text-text-muted">Human Handoff</span>
        </div>
      </div>
    </motion.div>
  );
};
