import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { apiFetch } from '../utils/api';
import { MetricCard } from '../components/dashboard/MetricCard';
import { PlatformActivityChart } from '../components/dashboard/PlatformActivityChart';
import { RecentLeads } from '../components/dashboard/RecentLeads';
import { LiveActivityFeed } from '../components/dashboard/LiveActivityFeed';
import { MessageSquare, UserPlus, Cpu, Timer } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';

export const Dashboard: React.FC = () => {
  const { selectedChatbot } = useChatbot();

  const [metrics, setMetrics] = useState([
      {
        title: 'Total Messages',
        value: '0',
        trend: 0.0,
        icon: MessageSquare,
        sparklineColorClass: 'text-primary-container',
        sparklineBgClass: 'from-transparent via-primary-container/20 to-transparent',
        sparklineData: 'M0,20 L10,15 L20,18 L30,10 L40,12 L50,5 L60,8 L70,2 L80,6 L90,1 L100,4'
      },
      {
        title: 'Active Leads',
        value: '0',
        trend: 0.0,
        icon: UserPlus,
        sparklineColorClass: 'text-tertiary',
        sparklineBgClass: 'from-transparent via-tertiary/20 to-transparent',
        sparklineData: 'M0,15 L15,12 L30,16 L45,8 L60,10 L75,4 L90,6 L100,2'
      },
      {
        title: 'Token Usage',
        value: '0',
        trend: 0.0,
        icon: Cpu,
        sparklineColorClass: 'text-secondary',
        sparklineBgClass: 'from-transparent via-secondary/20 to-transparent',
        sparklineData: 'M0,5 L20,8 L40,4 L60,12 L80,9 L100,15'
      },
      {
        title: 'Avg. Resolution',
        value: '0s',
        trend: 0.0,
        icon: Timer,
        sparklineColorClass: 'text-emerald-400',
        sparklineBgClass: 'from-transparent via-emerald-400/20 to-transparent',
        sparklineData: 'M0,18 L25,14 L50,16 L75,8 L100,5'
      }
  ]);

  useEffect(() => {
    apiFetch('/api/analytics/metrics')
      .then(res => res.json())
      .then(data => {
         if (!data.error) {
            const totalMsg = data.total_messages ?? 0;
            const leads = data.lead_capture_count ?? 0;
            const tokens = data.total_tokens ?? 0;
            const resRate = data.resolution_rate ?? 0;
            setMetrics(prev => [
              { ...prev[0], value: totalMsg.toLocaleString(), trend: +(data.message_trend ?? 0) },
              { ...prev[1], value: leads.toLocaleString(), trend: +(data.lead_trend ?? 0) },
              { ...prev[2], value: tokens >= 1000000 ? (tokens / 1000000).toFixed(1) + 'M' : tokens >= 1000 ? (tokens / 1000).toFixed(1) + 'k' : String(tokens), trend: -(data.token_trend ?? 0) },
              { ...prev[3], value: resRate.toFixed(1) + '%', trend: +(data.resolution_trend ?? 0) }
            ]);
         }
      })
      .catch(console.error);
  }, [selectedChatbot]);

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="font-heading-md text-heading-md text-on-surface mb-2">Analytics Overview: {selectedChatbot?.name}</h2>
        <p className="font-body-base text-body-base text-text-muted">
          Monitor your AI's performance and lead generation metrics in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <PlatformActivityChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentLeads />
        <LiveActivityFeed />
      </div>
    </MainLayout>
  );
};
