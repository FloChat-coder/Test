import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HandoffQueueItem {
  id: number | string;
  question: string;
  date: string;
  users: number;
}



export const HumanHandoff: React.FC = () => {
  const [queue, setQueue] = useState<HandoffQueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/handoff/inbox');
      if (!res.ok) throw new Error('Failed to fetch handoff queue');
      const data = await res.json();
      setQueue(data);
      setCurrentIndex(0);
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswer('');
      setError(null);
      setSuccess(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setAnswer('');
      setError(null);
      setSuccess(null);
    }
  };

  const handleResolve = async () => {
    if (!answer.trim()) {
      setError("Please provide an answer.");
      return;
    }
    
    setResolving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch('/api/handoff/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cluster_id: queue[currentIndex].id,
          answer: answer
        })
      });
      
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to resolve handoff');
      }
      
      setSuccess("Successfully resolved and notified users!");
      setAnswer("");
      
      // Remove the resolved item from the queue after a brief delay
      setTimeout(() => {
        const updatedQueue = [...queue];
        updatedQueue.splice(currentIndex, 1);
        setQueue(updatedQueue);
        if (currentIndex >= updatedQueue.length && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
        setSuccess(null);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Error resolving handoff');
    } finally {
      setResolving(false);
    }
  };

  const currentItem = queue[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface-glass backdrop-blur-xl border border-tertiary-container/30 rounded-xl overflow-hidden shadow-sm flex flex-col relative h-full min-h-[400px]"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tertiary-container to-tertiary-fixed-dim opacity-50"></div>
      
      <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-tertiary-container w-5 h-5 fill-tertiary-container/20" />
          <h2 className="font-heading-md text-[16px] text-text-primary">Human Handoff Queue</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0 || queue.length === 0}
            className="px-2 py-1 bg-surface-container border border-border-subtle rounded text-text-muted hover:text-text-primary hover:bg-surface-glass-hover disabled:opacity-50 transition-colors font-label-sm text-[11px] flex items-center"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <span className="font-label-sm text-[11px] text-text-muted whitespace-nowrap">
            {queue.length > 0 ? `${currentIndex + 1} of ${queue.length}` : '0 of 0'}
          </span>
          <button 
            onClick={handleNext}
            disabled={currentIndex === queue.length - 1 || queue.length === 0}
            className="px-2 py-1 bg-surface-container border border-border-subtle rounded text-text-muted hover:text-text-primary hover:bg-surface-glass-hover disabled:opacity-50 transition-colors font-label-sm text-[11px] flex items-center"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto chat-scroll space-y-4 bg-surface-container-lowest/30 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted font-body-base text-[13px]">Loading queue...</p>
          </div>
        ) : queue.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted font-body-base text-[13px]">Queue is empty. Great job!</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem?.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="bg-surface-container rounded-lg p-4 border border-border-subtle mb-4">
                <p className="font-label-sm text-[11px] text-text-muted uppercase tracking-wider mb-2">Pending Question Cluster</p>
                <p className="font-body-base text-[14px] text-text-primary leading-relaxed">{currentItem?.question}</p>
              </div>

              <div className="flex justify-center my-4">
                <span className="font-label-sm text-[11px] text-tertiary-fixed-dim bg-tertiary-container/10 px-3 py-1 rounded-full border border-tertiary-container/20 text-center">
                  {currentItem?.users} user(s) waiting • {new Date(currentItem?.date || '').toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="p-4 border-t border-border-subtle bg-surface-dim mt-auto shrink-0 flex flex-col gap-3">
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-[12px] bg-red-400/10 p-2.5 rounded-lg border border-red-400/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-[12px] bg-green-400/10 p-2.5 rounded-lg border border-green-400/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>{success}</p>
          </div>
        )}
        <textarea 
          className="w-full bg-surface-container border border-border-subtle rounded-lg p-3 font-body-base text-[13px] text-text-primary resize-none focus:outline-none focus:border-tertiary-container/50 transition-colors placeholder:text-text-muted"
          rows={3}
          placeholder="Type your answer here to resolve and notify users..."
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          disabled={resolving || queue.length === 0}
        />
        <button 
          onClick={handleResolve}
          disabled={resolving || !answer.trim() || queue.length === 0}
          className="w-full py-2.5 bg-surface-container border border-tertiary-container/50 hover:bg-tertiary-container/10 transition-colors rounded-lg font-label-sm text-label-sm text-tertiary-fixed-dim flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-surface-container"
        >
          {resolving ? 'Resolving...' : 'Resolve & Notify Users'}
        </button>
      </div>
    </motion.div>
  );
};
