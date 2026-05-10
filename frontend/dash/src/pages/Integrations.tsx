import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { IntegrationCard } from '../components/integrations/IntegrationCard';
import { CurrentIntegrationsTable, CurrentIntegration } from '../components/integrations/CurrentIntegrationsTable';
import { HardDrive, Table, FileText, MessageSquare, Store, Headset, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useChatbot } from '../context/ChatbotContext';

const ALL_INTEGRATIONS = [
  {
    name: 'Google Drive',
    description: 'Connect your cloud storage to sync PDFs, docs, and assets.',
    icon: HardDrive,
    iconColor: '#0F9D58',
    iconBgColor: 'rgba(15, 157, 88, 0.1)',
  },
  {
    name: 'Google Sheets',
    description: 'Import tabular data, product catalogs, and contact lists.',
    icon: Table,
    iconColor: '#0F9D58',
    iconBgColor: 'rgba(15, 157, 88, 0.1)',
  },
  {
    name: 'Google Docs',
    description: 'Sync written manuals, policies, and text-heavy resources.',
    icon: FileText,
    iconColor: '#4285F4',
    iconBgColor: 'rgba(66, 133, 244, 0.1)',
  },
  {
    name: 'Slack',
    description: 'Route handoff requests and notifications to your team.',
    icon: MessageSquare,
    iconColor: '#E01E5A',
    iconBgColor: 'rgba(224, 30, 90, 0.1)',
  },
  {
    name: 'Shopify',
    description: 'Connect your storefront to answer order & product queries.',
    icon: Store,
    iconColor: '#96BF48',
    iconBgColor: 'rgba(150, 191, 72, 0.1)',
  },
  {
    name: 'Zendesk',
    description: 'Sync historical tickets to train the AI on past resolutions.',
    icon: Headset,
    iconColor: '#17494D',
    iconBgColor: 'rgba(3, 54, 61, 0.4)',
  },
];

const INITIAL_CURRENT_INTEGRATIONS: CurrentIntegration[] = [
  {
    id: '1',
    serviceName: 'Google Drive',
    connectionName: 'Q3 Support Logs (Folder)',
    dateModified: 'Oct 24, 2023',
    dateAdded: 'Sep 12, 2023',
    icon: HardDrive,
    iconColor: '#0F9D58',
    iconBgColor: 'rgba(15, 157, 88, 0.1)',
  },
  {
    id: '2',
    serviceName: 'Google Docs',
    connectionName: 'Product Manuals 2024',
    dateModified: 'Oct 20, 2023',
    dateAdded: 'Aug 05, 2023',
    icon: FileText,
    iconColor: '#4285F4',
    iconBgColor: 'rgba(66, 133, 244, 0.1)',
  },
  {
    id: '3',
    serviceName: 'Shopify',
    connectionName: 'Main EU Storefront Data',
    dateModified: 'Oct 15, 2023',
    dateAdded: 'Jul 22, 2023',
    icon: Store,
    iconColor: '#96BF48',
    iconBgColor: 'rgba(150, 191, 72, 0.1)',
  },
  {
    id: '4',
    serviceName: 'Slack',
    connectionName: '#support-escalations',
    dateModified: 'Oct 10, 2023',
    dateAdded: 'Jun 14, 2023',
    icon: MessageSquare,
    iconColor: '#E01E5A',
    iconBgColor: 'rgba(224, 30, 90, 0.1)',
  },
  {
    id: '5',
    serviceName: 'Google Sheets',
    connectionName: 'Pricing Matrix v4.xlsx',
    dateModified: 'Oct 01, 2023',
    dateAdded: 'May 30, 2023',
    icon: Table,
    iconColor: '#0F9D58',
    iconBgColor: 'rgba(15, 157, 88, 0.1)',
  },
];

export const Integrations: React.FC = () => {
  const { selectedChatbot } = useChatbot();
  const [searchTableValue, setSearchTableValue] = useState('');

  const filteredIntegrations = INITIAL_CURRENT_INTEGRATIONS.filter((item) =>
    item.serviceName.toLowerCase().includes(searchTableValue.toLowerCase()) ||
    item.connectionName.toLowerCase().includes(searchTableValue.toLowerCase())
  );

  return (
    <MainLayout title={`Integrations: ${selectedChatbot}`} showBreadcrumbs={true}>
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section 1: Integration Grid */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[28px] font-bold tracking-tight text-text-primary">All Integrations</h2>
            <p className="text-text-muted text-sm">Connect your knowledge bases to FloChat to enhance AI retrieval.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ALL_INTEGRATIONS.map((integration, idx) => (
              <IntegrationCard key={idx} {...integration} />
            ))}
          </div>
        </section>

        {/* Section 2: Active Table */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Current Integrations</h2>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-[18px] h-[18px]" />
              <input
                type="text"
                value={searchTableValue}
                onChange={(e) => setSearchTableValue(e.target.value)}
                className="w-full bg-surface-glass border border-border-subtle rounded-lg py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Search connected sources..."
              />
            </div>
          </div>
          
          <CurrentIntegrationsTable integrations={filteredIntegrations} />
        </section>
      </div>
    </MainLayout>
  );
};
