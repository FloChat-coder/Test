import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip
} from 'recharts';
import { apiFetch } from '../../utils/api';

const TIMEFRAMES = [
  { id: 'day', label: '7D' },
  { id: 'month', label: '30D' },
  { id: 'year', label: '1Y' },
];

export const PlatformActivityChart: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('day');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/api/analytics/timeseries?period=${activeTimeframe}`)
      .then(res => res.json())
      .then(resData => {
         if (!resData.error && Array.isArray(resData)) {
             const mapped = resData.map(item => {
                 let label = item.date;
                 if (activeTimeframe === 'day') {
                     const d = new Date(item.date);
                     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                     label = dayNames[d.getUTCDay()] || label;
                 }
                 return {
                     name: label,
                     aiHandled: item.total_messages || (item.sessions * (item.avg_messages || 0)),
                     humanHandled: Math.floor((item.sessions || 0) * (item.handoff_rate || 0) / 100) || 0
                 };
             });
             setData(mapped);
         }
      })
      .catch(console.error);
  }, [activeTimeframe]);

  const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
          return (
              <div className="bg-surface-bright border border-border-subtle rounded-lg p-3 shadow-xl backdrop-blur-xl z-20 min-w-[150px]">
                  <div className="font-label-sm text-text-primary mb-2">{label}</div>
                  {payload.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 font-body-base text-[13px] mb-1" style={{ color: entry.color }}>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          {entry.value} {entry.name === 'aiHandled' ? 'AI' : 'Human'}
                      </div>
                  ))}
              </div>
          );
      }
      return null;
  };

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
      <div className="h-[300px] w-full mt-4">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-text-muted font-body-base">
              No activity data available for this period.
            </div>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                      <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8083ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8083ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
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
                  
                  <YAxis 
                      stroke="#ffffff60" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                  />
                  
                  <RechartsTooltip content={<CustomTooltip />} />
                  
                  <Area
                      type="monotone"
                      dataKey="aiHandled"
                      stroke="#8083ff"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAi)"
                      activeDot={{ r: 4, fill: '#13131b', stroke: '#8083ff', strokeWidth: 2 }}
                  />
                  <Area
                      type="monotone"
                      dataKey="humanHandled"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorHuman)"
                      activeDot={{ r: 4, fill: '#13131b', stroke: '#4f46e5', strokeWidth: 2 }}
                  />
              </AreaChart>
          </ResponsiveContainer>
          )}
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
