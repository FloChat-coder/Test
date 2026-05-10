import React, { useMemo } from 'react';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip,
    Legend
} from 'recharts';
import { useChatbot } from '../../context/ChatbotContext';

interface VolumeChartProps {
    activeMetrics: string[];
    days: number;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({ activeMetrics, days }) => {
    const { selectedChatbot } = useChatbot();
    
    // Generate data based on days
    const data = useMemo(() => {
        const result = [];
        const numPoints = days <= 1 ? 24 : Math.min(days, 30);
        const multiplier = days / 30;
        const botSeed = selectedChatbot.length + selectedChatbot.charCodeAt(0);

        for (let i = 0; i <= numPoints; i++) {
            const progress = i / numPoints;
            const pathModifier = Math.sin(progress * Math.PI * 4 + botSeed) * 5;
            
            // Labels logic
            let label = '';
            if (days <= 1) {
                label = `${i.toString().padStart(2, '0')}:00`;
            } else if (days <= 7) {
                const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                label = dayNames[i % 7];
            } else {
                label = `Day ${Math.floor(progress * days) + 1}`;
            }

            result.push({
                name: label,
                messages: Math.max(0, Math.floor((120 + pathModifier * 5 + Math.random() * 20) * multiplier * 1000)),
                tokens: Math.max(0, Math.floor((8000 + pathModifier * 200 + Math.random() * 1000) * multiplier)),
                escalation: Math.max(0, parseFloat((8.4 + Math.sin(progress * Math.PI * 6) * 1.5 + Math.random() * 0.5).toFixed(1))),
                resolution: Math.max(0, Math.floor(105 + Math.cos(progress * Math.PI * 4) * 15 + Math.random() * 5))
            });
        }
        return result;
    }, [days]);

    const MetricConfig = {
        messages: { label: 'Messages', color: '#c0c1ff', yAxisId: 'left', fill: true },
        tokens: { label: 'Tokens (x1000)', color: '#d0bcff', yAxisId: 'left', fill: false },
        escalation: { label: 'Escalation (%)', color: '#ffb783', yAxisId: 'right', fill: false },
        resolution: { label: 'Resolution (s)', color: '#34d399', yAxisId: 'right', fill: false }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-bright border border-border-subtle rounded-lg p-3 shadow-xl backdrop-blur-xl z-20 min-w-[200px]">
                    <div className="font-label-sm text-text-primary mb-2">{label}</div>
                    {payload.map((entry: any, index: number) => {
                        let valueStr = entry.value;
                        if (entry.dataKey === 'messages') valueStr = `${(entry.value / 1000).toFixed(1)}k Messages`;
                        if (entry.dataKey === 'tokens') valueStr = `${(entry.value / 1000).toFixed(1)}M Tokens`;
                        if (entry.dataKey === 'escalation') valueStr = `${entry.value}% Escalation`;
                        if (entry.dataKey === 'resolution') valueStr = `${Math.floor(entry.value / 60)}m ${entry.value % 60}s Avg. Res.`;

                        return (
                            <div key={index} className="flex items-center gap-2 font-body-base text-[13px] mb-1" style={{ color: entry.color }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                {valueStr}
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    const hasVolume = activeMetrics.includes('messages') || activeMetrics.includes('tokens');
    const hasRates = activeMetrics.includes('escalation') || activeMetrics.includes('resolution');

    const formatVolumeAxis = (tickItem: number) => {
        if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}M`;
        if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}k`;
        return tickItem.toString();
    };

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-border-subtle rounded-xl p-6 hover:shadow-indigo-500/5 transition-shadow duration-300 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="font-heading-md text-heading-md text-text-primary">Performance Trend</h2>
                <div className="flex flex-wrap gap-4">
                    {activeMetrics.map(id => {
                        const conf = MetricConfig[id as keyof typeof MetricConfig];
                        return (
                            <div key={id} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: conf.color }}></div>
                                <span className="font-label-sm text-label-sm text-text-muted">{conf.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={MetricConfig.messages.color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={MetricConfig.messages.color} stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={MetricConfig.tokens.color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={MetricConfig.tokens.color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff15" />
                        
                        <XAxis 
                            dataKey="name" 
                            stroke="#ffffff60" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            minTickGap={30}
                        />
                        
                        {hasVolume && (
                            <YAxis 
                                yAxisId="left" 
                                stroke="#ffffff60" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={formatVolumeAxis}
                                width={60}
                            />
                        )}
                        
                        {hasRates && (
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="#ffffff60" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                width={40}
                            />
                        )}
                        
                        <RechartsTooltip content={<CustomTooltip />} />
                        
                        {activeMetrics.map(id => {
                            const conf = MetricConfig[id as keyof typeof MetricConfig];
                            return (
                                <Area
                                    key={id}
                                    yAxisId={conf.yAxisId}
                                    type="monotone"
                                    dataKey={id}
                                    stroke={conf.color}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={conf.fill ? `url(#color${id.charAt(0).toUpperCase() + id.slice(1)})` : 'none'}
                                    activeDot={{ r: 4, strokeWidth: 2, fill: '#13131b', stroke: conf.color }}
                                />
                            );
                        })}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
