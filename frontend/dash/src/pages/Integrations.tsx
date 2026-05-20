import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { IntegrationCard } from '../components/integrations/IntegrationCard';
import { CurrentIntegrationsTable, type CurrentIntegration } from '../components/integrations/CurrentIntegrationsTable';
import { HardDrive, Table, FileText, MessageSquare, Store, Headset, Search } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import { GoogleSheetModal } from '../components/integrations/GoogleSheetModal';
import { apiFetch, apiJson } from '../utils/api';

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

export const Integrations: React.FC = () => {
  const { selectedChatbot } = useChatbot();
  const [searchTableValue, setSearchTableValue] = useState('');
  const [integrations, setIntegrations] = useState<CurrentIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isSavingSheet, setIsSavingSheet] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, { connected: boolean; coming_soon?: boolean }>>({});

  const handleAddIntegration = async (name: string) => {
    if (name === 'Google Sheets') {
      setIsSheetModalOpen(true);
    } else if (name === 'Google Drive') {
      try {
        const res = await apiFetch('/api/google/status');
        const data = await res.json();
        if (!data.linked) {
          window.location.href = '/login?next=/integrations';
        } else {
          openGooglePicker();
        }
      } catch (err) {
        console.error('Failed to check Google status:', err);
      }
    } else {
      alert(`Integration for ${name} is coming soon!`);
    }
  };

  const openGooglePicker = async () => {
    try {
      const res = await apiFetch('/api/auth/token');
      const data = await res.json();
      if (!data.token) throw new Error('No token');
      
      const token = data.token;
      const appId = data.clientId ? data.clientId.split('-')[0] : '';

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        // @ts-ignore
        window.gapi.load('picker', { callback: () => {
          // @ts-ignore
          const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
          view.setMimeTypes('application/pdf,application/vnd.google-apps.document');
          
          // @ts-ignore
          const picker = new window.google.picker.PickerBuilder()
            .addView(view)
            .setOAuthToken(token)
            .setAppId(appId)
            .setCallback(async (data: any) => {
              // @ts-ignore
              if (data.action === window.google.picker.Action.PICKED) {
                const fileId = data.docs[0].id;
                try {
                  const saveRes = await apiJson('/api/drive/process', 'POST', { fileId });
                  if (saveRes.ok) {
                    window.location.reload();
                  } else {
                    alert('Failed to save file');
                  }
                } catch (e) {
                  console.error(e);
                }
              }
            })
            .build();
          picker.setVisible(true);
        }});
      };
      document.body.appendChild(script);
    } catch (e) {
      console.error(e);
      alert('Failed to initialize Google Picker');
    }
  };

  const handleSheetSubmit = async (sheetUrl: string, range: string) => {
    setIsSavingSheet(true);
    try {
      const res = await apiJson('/api/sheets/save', 'POST', { sheetUrl, range });
      if (res.ok) {
        setIsSheetModalOpen(false);
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(`Failed to save sheet: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to save sheet:', err);
      alert('Failed to save sheet');
    } finally {
      setIsSavingSheet(false);
    }
  };

  useEffect(() => {
    apiFetch('/api/integrations/status')
      .then(res => res.json())
      .then(data => { if (!data.error) setIntegrationStatus(data); })
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch('/api/integrations/list');
        if (!response.ok) {
          throw new Error('Failed to fetch integrations');
        }
        const data = await response.json();
        
        const mappedIntegrations: CurrentIntegration[] = data.map((item: any) => {
          let icon = HardDrive;
          let iconColor = '#0F9D58';
          let iconBgColor = 'rgba(15, 157, 88, 0.1)';
          let serviceName = 'Knowledge Base';
          
          if (item.type === 'doc') {
             icon = FileText;
             iconColor = '#4285F4';
             iconBgColor = 'rgba(66, 133, 244, 0.1)';
             serviceName = 'Google Docs';
          } else if (item.type === 'pdf') {
             icon = FileText;
             iconColor = '#EA4335';
             iconBgColor = 'rgba(234, 67, 53, 0.1)';
             serviceName = 'PDF Document';
          } else if (item.type === 'sheet') {
             icon = Table;
             iconColor = '#0F9D58';
             iconBgColor = 'rgba(15, 157, 88, 0.1)';
             serviceName = 'Google Sheets';
          }
          
          return {
            id: String(item.id),
            serviceName,
            connectionName: item.name,
            dateModified: item.dateModified || 'Unknown',
            dateAdded: item.dateAdded || 'Unknown',
            icon,
            iconColor,
            iconBgColor
          };
        });
        
        setIntegrations(mappedIntegrations);
      } catch (error) {
        console.error('Error fetching integrations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIntegrations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await apiJson('/api/integrations/delete', 'POST', { id });
      if (res.ok) {
        setIntegrations(prev => prev.filter(i => i.id !== id));
      } else {
        console.error('Failed to delete integration');
      }
    } catch (err) {
      console.error('Failed to delete integration:', err);
    }
  };

  const filteredIntegrations = integrations.filter((item) =>
    item.serviceName.toLowerCase().includes(searchTableValue.toLowerCase()) ||
    item.connectionName.toLowerCase().includes(searchTableValue.toLowerCase())
  );

  return (
    <MainLayout title={`Integrations: ${selectedChatbot?.name || ''}`} showBreadcrumbs={true}>
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section 1: Integration Grid */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[28px] font-bold tracking-tight text-text-primary">All Integrations</h2>
            <p className="text-text-muted text-sm">Connect your knowledge bases to FloChat to enhance AI retrieval.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ALL_INTEGRATIONS.map((integration, idx) => {
              const statusKey = integration.name.toLowerCase().split(' ')[0];
              const status = integrationStatus[statusKey];
              const isComingSoon = status?.coming_soon ?? !['Google Drive', 'Google Sheets', 'Google Docs'].includes(integration.name);
              const isConnected = status?.connected ?? false;
              return (
                <IntegrationCard
                  key={idx}
                  {...integration}
                  comingSoon={isComingSoon}
                  connected={isConnected}
                  onAddIntegration={() => handleAddIntegration(integration.name)}
                />
              );
            })}
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
          
          {isLoading ? (
            <div className="flex justify-center p-8 text-text-muted">Loading integrations...</div>
          ) : (
            <CurrentIntegrationsTable integrations={filteredIntegrations} onDelete={handleDelete} />
          )}
        </section>
      </div>
      <GoogleSheetModal 
        isOpen={isSheetModalOpen} 
        onClose={() => setIsSheetModalOpen(false)} 
        onSubmit={handleSheetSubmit} 
        isSaving={isSavingSheet} 
      />
    </MainLayout>
  );
};
