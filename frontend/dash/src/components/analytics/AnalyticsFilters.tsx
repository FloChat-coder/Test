import React, { useState } from 'react';
import { Calendar, ChevronDown, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalyticsFiltersProps {
  onApplyCompare: (metrics: string[]) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  customDateRange: { start: string; end: string } | null;
  setCustomDateRange: (range: { start: string; end: string } | null) => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ 
  onApplyCompare, dateRange, setDateRange, customDateRange, setCustomDateRange 
}) => {
  const [compareMode, setCompareMode] = useState(false);
  const [showCompareDropdown, setShowCompareDropdown] = useState(false);
  const [selectedToCompare, setSelectedToCompare] = useState<string[]>(['messages', 'tokens']);
  
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const toggleCompare = (val: string) => {
    setSelectedToCompare(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }

  const handleApply = () => {
    onApplyCompare(selectedToCompare);
    setShowCompareDropdown(false);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-heading-md text-[28px] font-bold text-text-primary tracking-tight mb-1">Analytics Overview</h1>
        <p className="font-body-base text-body-base text-text-muted">Track bot performance and token usage across your workspace.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Filter */}
        <div className="relative">
          <div 
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 bg-surface-container border border-border-subtle rounded-lg px-3 py-1.5 hover:border-primary/30 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-text-muted" />
            <span className="font-label-sm text-label-sm text-text-primary">
              {dateRange === 'Custom' && customDateRange?.start && customDateRange?.end 
                ? `${customDateRange.start} to ${customDateRange.end}` 
                : dateRange === 'Custom' ? 'Custom Range' : dateRange}
            </span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </div>
          
          <AnimatePresence>
            {showDateDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-10 right-0 bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl p-2 shadow-xl z-50 w-64"
              >
                {['Today', 'Last 7 Days', 'Last 30 Days'].map((range) => (
                  <div 
                    key={range}
                    onClick={() => {
                        setDateRange(range);
                        setCustomDateRange(null);
                        setShowDateDropdown(false);
                    }}
                    className={`px-3 py-2 hover:bg-surface-glass-hover rounded-lg cursor-pointer text-sm font-medium ${dateRange === range ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    {range}
                  </div>
                ))}
                
                <div className="border-t border-border-subtle mt-2 pt-2 px-3 pb-1">
                    <div className="text-sm font-medium mb-3 text-text-muted">Custom Range</div>
                    <div className="flex flex-col gap-2">
                        <input 
                            type="date" 
                            name="start"
                            value={customDateRange?.start || ''}
                            onChange={(e) => {
                                setDateRange('Custom');
                                setCustomDateRange({ start: e.target.value, end: customDateRange?.end || '' });
                            }}
                            className="bg-surface-container-low border border-border-subtle rounded-md px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                        />
                        <input 
                            type="date" 
                            name="end"
                            value={customDateRange?.end || ''}
                            onChange={(e) => {
                                setDateRange('Custom');
                                setCustomDateRange({ start: customDateRange?.start || '', end: e.target.value });
                            }}
                            className="bg-surface-container-low border border-border-subtle rounded-md px-2 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                        />
                        <button 
                            onClick={() => setShowDateDropdown(false)}
                            className="mt-2 w-full py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-sm hover:bg-primary/20 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Compare */}
        <div className="relative">
          <label className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.preventDefault()}>
            <div className="relative" onClick={() => {
                const newMode = !compareMode;
                setCompareMode(newMode);
                if(newMode) setShowCompareDropdown(true);
                else {
                    setShowCompareDropdown(false);
                    onApplyCompare(['messages', 'tokens']);
                }
            }}>
              <div className={`block w-10 h-6 rounded-full border transition-colors ${compareMode ? 'bg-primary/20 border-primary/30' : 'bg-surface-container border-border-subtle'}`}></div>
              <div className={`absolute left-1 top-1 bg-primary w-4 h-4 rounded-full transition transform ${compareMode ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="font-label-sm text-label-sm text-text-muted" onClick={() => {
                if(compareMode) setShowCompareDropdown(!showCompareDropdown);
            }}>Compare</span>
          </label>

          <AnimatePresence>
            {compareMode && showCompareDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-10 right-0 bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-xl p-4 shadow-xl z-50 w-56 flex flex-col gap-3"
              >
                <div className="text-sm font-semibold mb-1">Compare Metrics</div>
                {[
                  { id: 'messages', label: 'Total Messages', color: 'bg-primary' },
                  { id: 'tokens', label: 'Tokens Consumed', color: 'bg-secondary' },
                  { id: 'escalation', label: 'Human Escalation', color: 'bg-tertiary' },
                  { id: 'resolution', label: 'Avg. Resolution', color: 'bg-emerald-400' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                    <div 
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedToCompare.includes(opt.id) ? 'bg-primary border-primary text-bg-base' : 'border-border-subtle'}`}
                      onClick={(e) => {
                          e.preventDefault();
                          toggleCompare(opt.id);
                      }}
                    >
                      {selectedToCompare.includes(opt.id) && <Check className="w-3 h-3" />}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${opt.color}`}></div>
                    <span 
                      className="text-sm"
                      onClick={(e) => {
                          e.preventDefault();
                          toggleCompare(opt.id);
                      }}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
                
                <button 
                  onClick={handleApply}
                  className="mt-2 w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm hover:bg-primary/20 transition-colors"
                >
                  View
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-glass text-text-primary font-label-sm text-label-sm hover:bg-surface-glass-hover transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};
