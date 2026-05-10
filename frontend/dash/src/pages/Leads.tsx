import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadDrawer } from '../components/leads/LeadDrawer';
import { MOCK_LEADS, Lead } from '../data/mockLeads';
import { motion, AnimatePresence } from 'motion/react';
import { useChatbot } from '../context/ChatbotContext';

export const Leads: React.FC = () => {
  const { selectedChatbot } = useChatbot();
  const [selectedLeadId, setSelectedLeadId] = React.useState<string | null>(MOCK_LEADS[0].id);

  const selectedLead = React.useMemo(
    () => MOCK_LEADS.find((l) => l.id === selectedLeadId) || null,
    [selectedLeadId]
  );

  return (
    <MainLayout title={`Leads: ${selectedChatbot}`} showBreadcrumbs={true}>
      <div className="w-full h-full flex flex-col">
        <LeadFilters />
        
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
          <div className={`${selectedLead ? 'col-span-12 lg:col-span-8' : 'col-span-12'} transition-all duration-300 h-full`}>
            <LeadTable 
              leads={MOCK_LEADS} 
              selectedLeadId={selectedLeadId} 
              onSelectLead={setSelectedLeadId} 
            />
          </div>
          
          <AnimatePresence mode="wait">
            {selectedLead && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="col-span-12 lg:col-span-4 h-full"
              >
                <LeadDrawer lead={selectedLead} onClose={() => setSelectedLeadId(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};
