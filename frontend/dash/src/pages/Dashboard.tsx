import React, { useMemo } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { MetricCard } from '../components/dashboard/MetricCard';
import { PlatformActivityChart } from '../components/dashboard/PlatformActivityChart';
import { RecentLeads } from '../components/dashboard/RecentLeads';
import { LiveActivityFeed } from '../components/dashboard/LiveActivityFeed';
import { MessageSquare, UserPlus, Cpu, Timer } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';

export const Dashboard: React.FC = () => {
  const { selectedChatbot } = useChatbot();

  const METRICS_DATA = useMemo(() => {
    // Generate some stable fake variation based on bot name
    const seed = selectedChatbot.length + selectedChatbot.charCodeAt(0);
    const m1 = 1 + (seed % 5) * 0.5;
    const m2 = 1 + (seed % 3) * 0.2;

    return [
      {
        title: 'Total Messages',
        value: Math.floor(24592 * m1).toLocaleString(),
        trend: +(12.5 * m2).toFixed(1),
        icon: MessageSquare,
        sparklineColorClass: 'text-primary-container',
        sparklineBgClass: 'from-transparent via-primary-container/20 to-transparent',
        sparklineData: 'M0,20 L10,15 L20,18 L30,10 L40,12 L50,5 L60,8 L70,2 L80,6 L90,1 L100,4'
      },
      {
        title: 'Active Leads',
        value: Math.floor(1204 * m2).toLocaleString(),
        trend: +(8.2 * m1).toFixed(1),
        icon: UserPlus,
        sparklineColorClass: 'text-tertiary',
        sparklineBgClass: 'from-transparent via-tertiary/20 to-transparent',
        sparklineData: 'M0,15 L15,12 L30,16 L45,8 L60,10 L75,4 L90,6 L100,2'
      },
      {
        title: 'Token Usage',
        value: (1.4 * m1).toFixed(1) + 'M',
        trend: -(3.1 * m2).toFixed(1),
        icon: Cpu,
        sparklineColorClass: 'text-secondary',
        sparklineBgClass: 'from-transparent via-secondary/20 to-transparent',
        sparklineData: 'M0,5 L20,8 L40,4 L60,12 L80,9 L100,15'
      },
      {
        title: 'Avg. Resolution',
        value: `1m ${Math.floor(12 * m1)}s`,
        trend: +(18.0 * m2).toFixed(1),
        icon: Timer,
        sparklineColorClass: 'text-emerald-400',
        sparklineBgClass: 'from-transparent via-emerald-400/20 to-transparent',
        sparklineData: 'M0,18 L25,14 L50,16 L75,8 L100,5'
      }
    ];
  }, [selectedChatbot]);

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="font-heading-md text-heading-md text-on-surface mb-2">Analytics Overview: {selectedChatbot}</h2>
        <p className="font-body-base text-body-base text-text-muted">
          Monitor your AI's performance and lead generation metrics in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {METRICS_DATA.map((metric, index) => (
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
