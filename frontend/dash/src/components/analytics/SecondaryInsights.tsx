import React, { useMemo } from 'react';
import { FolderOpen, Cloud, Globe, FileText } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';

interface SecondaryInsightsProps {
    days: number;
}

export const SecondaryInsights: React.FC<SecondaryInsightsProps> = ({ days }) => {
    const { selectedChatbot } = useChatbot();
    const m = days / 30;
    
    const stats = useMemo(() => {
        const botName = selectedChatbot?.name || '';
        const botSeed = botName.length + (botName.charCodeAt(0) || 0);

        // adjust escalation reasons loosely based on days
        const v1 = (3.2 * m * (1 + (botSeed % 3) * 0.1)).toFixed(1);
        const v2 = (2.1 * m * (1 + (botSeed % 4) * 0.1)).toFixed(1);
        const v3 = (1.4 * m * (1 + (botSeed % 5) * 0.1)).toFixed(1);
        const v4 = (1.0 * m * (1 + (botSeed % 2) * 0.1)).toFixed(1);

        // adjust percentages based on pseudo random calculation from days
        const variance = ((days * 7 + botSeed) % 10) - 5; // -5 to +5
        
        // Knowledge Bases (Sum to 100)
        let k1 = 45 + variance;
        let k2 = 28 - Math.floor(variance / 2);
        let k3 = 15 - Math.floor(variance / 2);
        let k4 = 100 - k1 - k2 - k3;

        // Escalation Reasons (Sum to 100)
        let e1 = 42 - variance;
        let e2 = 27 + Math.floor(variance / 2);
        let e3 = 18 + Math.floor(variance / 2);
        let e4 = 100 - e1 - e2 - e3;

        return {
            v1, v2, v3, v4,
            k1, k2, k3, k4,
            e1, e2, e3, e4
        };
    }, [days, m]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 bg-white/[0.03] backdrop-blur-xl border border-border-subtle rounded-xl p-6 hover:shadow-indigo-500/5 transition-shadow duration-300">
                <h2 className="font-heading-md text-heading-md text-text-primary mb-6">Top Knowledge Bases</h2>
                <div className="space-y-5">
                    <div className="group">
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-body-base text-text-primary flex items-center gap-2">
                                <FolderOpen className="w-4 h-4 text-text-muted" />
                                Product Docs (Notion)
                            </span>
                            <span className="font-label-sm text-text-muted">{stats.k1}%</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-full rounded-full group-hover:bg-primary-fixed transition-colors shadow-[0_0_8px_rgba(192,193,255,0.4)]" style={{ width: `${stats.k1}%` }}></div>
                        </div>
                    </div>
                    <div className="group">
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-body-base text-text-primary flex items-center gap-2">
                                <Cloud className="w-4 h-4 text-text-muted" />
                                API Specs (G-Drive)
                            </span>
                            <span className="font-label-sm text-text-muted">{stats.k2}%</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-full rounded-full group-hover:bg-primary-fixed transition-colors opacity-80" style={{ width: `${stats.k2}%` }}></div>
                        </div>
                    </div>
                    <div className="group">
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-body-base text-text-primary flex items-center gap-2">
                                <Globe className="w-4 h-4 text-text-muted" />
                                Main Website Scraping
                            </span>
                            <span className="font-label-sm text-text-muted">{stats.k3}%</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-full rounded-full group-hover:bg-primary-fixed transition-colors opacity-60" style={{ width: `${stats.k3}%` }}></div>
                        </div>
                    </div>
                    <div className="group">
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-body-base text-text-primary flex items-center gap-2">
                                <FileText className="w-4 h-4 text-text-muted" />
                                Internal PDFs
                            </span>
                            <span className="font-label-sm text-text-muted">{stats.k4}%</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-full rounded-full group-hover:bg-primary-fixed transition-colors opacity-40" style={{ width: `${stats.k4}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Escalation Reasons */}
            <div className="col-span-1 lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-border-subtle rounded-xl p-6 hover:shadow-indigo-500/5 transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="font-heading-md text-heading-md text-text-primary">Escalation Reasons</h2>
                    <button className="text-primary font-label-sm text-label-sm hover:text-primary-fixed transition-colors">View Logs</button>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                        <div className="w-full sm:w-40 font-body-base text-text-primary text-sm truncate">Billing Issue</div>
                        <div className="flex-1 flex items-center gap-3 w-full">
                            <div className="h-6 bg-tertiary-container/30 border border-tertiary/20 rounded-md relative overflow-hidden group-hover:bg-tertiary-container/50 transition-colors" style={{ width: `${stats.e1}%` }}>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 font-label-sm text-[11px] text-tertiary-fixed">{stats.e1}% ({stats.v1}k)</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                        <div className="w-full sm:w-40 font-body-base text-text-primary text-sm truncate">Complex Tech Support</div>
                        <div className="flex-1 flex items-center gap-3 w-full">
                            <div className="h-6 bg-primary-container/20 border border-primary/20 rounded-md relative overflow-hidden group-hover:bg-primary-container/40 transition-colors" style={{ width: `${stats.e2}%` }}>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 font-label-sm text-[11px] text-primary-fixed">{stats.e2}% ({stats.v2}k)</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                        <div className="w-full sm:w-40 font-body-base text-text-primary text-sm truncate">Feature Request</div>
                        <div className="flex-1 flex items-center gap-3 w-full">
                            <div className="h-6 bg-primary-container/10 border border-primary/10 rounded-md relative overflow-hidden group-hover:bg-primary-container/20 transition-colors" style={{ width: `${stats.e3}%` }}>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 font-label-sm text-[11px] text-primary-fixed-dim">{stats.e3}% ({stats.v3}k)</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                        <div className="w-full sm:w-40 font-body-base text-text-primary text-sm truncate">Out of Scope / Unknown</div>
                        <div className="flex-1 flex items-center gap-3 w-full">
                            <div className="h-6 bg-surface-container-high border border-border-subtle rounded-md relative overflow-hidden group-hover:bg-surface-bright transition-colors" style={{ width: `${stats.e4}%` }}>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 font-label-sm text-[11px] text-text-muted">{stats.e4}% ({stats.v4}k)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
