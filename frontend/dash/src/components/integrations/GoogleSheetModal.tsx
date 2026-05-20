import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Table, Link as LinkIcon } from 'lucide-react';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sheetUrl: string, range: string) => void;
  isSaving?: boolean;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSaving = false,
}) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [customRange, setCustomRange] = useState(false);
  const [endCell, setEndCell] = useState('Z100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl) return;
    
    // Default range is A1:Z100 if not custom
    const finalRange = customRange && endCell ? `A1:${endCell}` : 'A1:Z100';
    onSubmit(sheetUrl, finalRange);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-surface-base border border-border-subtle rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-surface-glass">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0F9D58]/10 text-[#0F9D58] rounded-lg">
                <Table className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-text-primary">Add Google Sheet</h2>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-surface-glass"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="sheetUrl" className="text-sm font-medium text-text-primary">
                Sheet URL or ID
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  id="sheetUrl"
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full bg-surface-glass border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={customRange}
                    onChange={(e) => setCustomRange(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-10 h-5 bg-surface-glass border border-border-subtle rounded-full peer peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                  <div className="absolute left-1 top-1 w-3 h-3 bg-text-muted rounded-full peer-checked:bg-white peer-checked:translate-x-5 transition-transform"></div>
                </div>
                <span className="text-sm font-medium text-text-primary group-hover:text-text-primary/80 transition-colors">
                  Custom Range
                </span>
              </label>

              <AnimatePresence>
                {customRange && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="flex items-center gap-3 bg-surface-glass p-3 rounded-lg border border-border-subtle"
                  >
                    <span className="text-sm text-text-muted font-medium">upto</span>
                    <input
                      type="text"
                      value={endCell}
                      onChange={(e) => setEndCell(e.target.value.toUpperCase())}
                      placeholder="W1000"
                      className="flex-1 bg-surface-base border border-border-subtle rounded-md py-1.5 px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                      required={customRange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-glass transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!sheetUrl || (customRange && !endCell) || isSaving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? 'Connecting...' : 'Connect Sheet'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
