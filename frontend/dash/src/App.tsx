/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Integrations } from './pages/Integrations';
import { Chats } from './pages/Chats';
import { Leads } from './pages/Leads';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { ChatbotProvider } from './context/ChatbotContext';

export default function App() {
  return (
    <ChatbotProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ChatbotProvider>
  );
}

