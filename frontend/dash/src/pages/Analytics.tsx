import React, { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { AnalyticsFilters } from '../components/analytics/AnalyticsFilters';
import { AnalyticsKPIs } from '../components/analytics/AnalyticsKPIs';
import { VolumeChart } from '../components/analytics/VolumeChart';
import { SecondaryInsights } from '../components/analytics/SecondaryInsights';

export const Analytics: React.FC = () => {
  const [activeMetrics, setActiveMetrics] = useState(['messages', 'tokens']);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string } | null>(null);

  const [metrics, setMetrics] = useState<any>(null);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleApplyCompare = (metrics: string[]) => {
      if(metrics.length === 0) setActiveMetrics(['messages', 'tokens']); // Default fallback
      else setActiveMetrics(metrics);
  };

  const daysCount = useMemo(() => {
      if (dateRange === 'Today') return 1;
      if (dateRange === 'Last 7 Days') return 7;
      if (dateRange === 'Last 30 Days') return 30;
      if (dateRange === 'Custom' && customDateRange?.start && customDateRange?.end) {
          const start = new Date(customDateRange.start);
          const end = new Date(customDateRange.end);
          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 ? diffDays : 1;
      }
      return 30;
  }, [dateRange, customDateRange]);

  useEffect(() => {

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const resMetrics = await fetch('/api/analytics/metrics');
        if (resMetrics.ok) {
          const data = await resMetrics.json();
          setMetrics(data);
        }

        let period = 'day';
        if (daysCount > 30) period = 'month';
        if (daysCount > 365) period = 'year';
        
        const resTs = await fetch(`/api/analytics/timeseries?period=${period}`);
        if (resTs.ok) {
          const tsData = await resTs.json();
          setTimeseries(tsData);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [daysCount]);

  return (
    <MainLayout title="Analytics" showBreadcrumbs={true}>
      <div className="max-w-7xl mx-auto pb-8">
        <AnalyticsFilters 
            onApplyCompare={handleApplyCompare} 
            dateRange={dateRange}
            setDateRange={setDateRange}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
        />
        {loading ? (
          <div className="flex items-center justify-center py-12 text-text-muted">Loading analytics...</div>
        ) : (
          <>
            <AnalyticsKPIs days={daysCount} metrics={metrics} />
            <VolumeChart activeMetrics={activeMetrics} days={daysCount} timeseries={timeseries} />
            <SecondaryInsights days={daysCount} />
          </>
        )}
      </div>
    </MainLayout>
  );
};
