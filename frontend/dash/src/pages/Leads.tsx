import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadDrawer } from '../components/leads/LeadDrawer';
import { Lead, LeadStatus } from '../data/mockLeads';
import { motion, AnimatePresence } from 'motion/react';
import { useChatbot } from '../context/ChatbotContext';
import { apiFetch } from '../utils/api';

export const Leads: React.FC = () => {
  const { selectedChatbot } = useChatbot();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await apiFetch('/api/leads/list');
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
          if (data.length > 0) {
            setSelectedLeadId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch leads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const selectedLead = React.useMemo(
    () => leads.find((l) => l.id === selectedLeadId) || null,
    [leads, selectedLeadId]
  );

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    setSelectedLeadId(null);
  };

  return (
    <MainLayout title={`Leads: ${selectedChatbot?.name || ''}`} showBreadcrumbs={true}>
      <div className="w-full h-full flex flex-col">
        <LeadFilters />
        
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
          <div className={`${selectedLead ? 'col-span-12 lg:col-span-8' : 'col-span-12'} transition-all duration-300 h-full`}>
            {loading ? (
              <div className="flex items-center justify-center h-full text-text-muted">Loading leads...</div>
            ) : (
              <LeadTable 
                leads={leads} 
                selectedLeadId={selectedLeadId} 
                onSelectLead={setSelectedLeadId} 
              />
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {selectedLead && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="col-span-12 lg:col-span-4 h-full"
              >
                <LeadDrawer 
                  lead={selectedLead} 
                  onClose={() => setSelectedLeadId(null)} 
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteLead}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};
