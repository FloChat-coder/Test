import React, { useMemo } from 'react';
import { MessageSquare, Activity, Headset, Timer, TrendingUp, TrendingDown } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';

interface AnalyticsKPIsProps {
    days: number;
    metrics?: any;
}

export const AnalyticsKPIs: React.FC<AnalyticsKPIsProps> = ({ days, metrics }) => {
    const { selectedChatbot } = useChatbot();

    let messagesStr, tokensStr, escalationStr, avgResFormatted, isResolutionRate = false;

    if (!metrics) {
        messagesStr = "0";
        tokensStr = "0";
        escalationStr = "0%";
        avgResFormatted = "0%";
    } else {
        messagesStr = metrics.total_messages >= 1000 ? `${(metrics.total_messages / 1000).toFixed(1)}k` : metrics.total_messages.toString();
        tokensStr = metrics.total_tokens >= 1000000 ? `${(metrics.total_tokens / 1000000).toFixed(1)}M` : metrics.total_tokens >= 1000 ? `${(metrics.total_tokens / 1000).toFixed(1)}k` : metrics.total_tokens.toString();
        escalationStr = `${metrics.handoff_rate.toFixed(1)}%`;
        avgResFormatted = `${metrics.resolution_rate.toFixed(1)}%`;
        isResolutionRate = true;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-border-subtle rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-indigo-500/10 hover:border-primary/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="font-label-sm text-label-sm text-text-muted">Total Messages</span>
                    <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div className="relative z-10">
                    <div className="font-metric-lg text-metric-lg text-text-primary mb-2">{messagesStr}</div>
                    <div className="flex items-center gap-1 text-emerald-400 font-label-sm text-label-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+12.5% vs prev period</span>
                    </div>
                </div>
                <svg className="absolute bottom-0 left-0 w-full h-16 opacity-20 text-primary group-hover:opacity-40 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 30">
                    <path d="M0,30 Q10,15 20,20 T40,10 T60,15 T80,5 T100,10 L100,30 Z" fill="currentColor"></path>
                </svg>
            </div>
            
            <div className="bg-white/[0.03] backdrop-blur-xl border border-border-subtle rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-indigo-500/10 hover:border-secondary/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="font-label-sm text-label-sm text-text-muted">Tokens Consumed</span>
                    <Activity className="w-5 h-5 text-secondary" />
                </div>
                <div className="relative z-10">
                    <div className="font-metric-lg text-metric-lg text-text-primary mb-2">{tokensStr}</div>
                    <div className="flex items-center gap-1 text-emerald-400 font-label-sm text-label-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+4.2% vs prev period</span>
                    </div>
                </div>
                <svg className="absolute bottom-0 left-0 w-full h-16 opacity-20 text-secondary group-hover:opacity-40 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 30">
                    <path d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,15 L90,5 L100,8 L100,30 Z" fill="currentColor"></path>
                </svg>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-border-subtle rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-indigo-500/10 hover:border-error/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="font-label-sm text-label-sm text-text-muted">Human Escalation</span>
                    <Headset className="w-5 h-5 text-tertiary" />
                </div>
                <div className="relative z-10">
                    <div className="font-metric-lg text-metric-lg text-text-primary mb-2">{escalationStr}</div>
                    <div className="flex items-center gap-1 text-rose-400 font-label-sm text-label-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+1.1% vs prev period</span>
                    </div>
                </div>
                <svg className="absolute bottom-0 left-0 w-full h-16 opacity-20 text-error group-hover:opacity-40 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 30">
                    <path d="M0,30 Q20,25 40,28 T80,15 T100,20 L100,30 Z" fill="currentColor"></path>
                </svg>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-border-subtle rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-indigo-500/10 hover:border-emerald-400/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="font-label-sm text-label-sm text-text-muted">{isResolutionRate ? 'Resolution Rate' : 'Avg. Resolution'}</span>
                    <Timer className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="relative z-10">
                    <div className="font-metric-lg text-metric-lg text-text-primary mb-2">{avgResFormatted}</div>
                    <div className="flex items-center gap-1 text-emerald-400 font-label-sm text-label-sm">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>-12s vs prev period</span>
                    </div>
                </div>
                <svg className="absolute bottom-0 left-0 w-full h-16 opacity-20 text-emerald-400 group-hover:opacity-40 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 30">
                    <path d="M0,10 Q20,15 40,10 T80,25 T100,20 L100,30 L0,30 Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>
    );
};
