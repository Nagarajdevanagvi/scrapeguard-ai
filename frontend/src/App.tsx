/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { ScraperHealth } from './pages/ScraperHealth';
import { Incidents } from './pages/Incidents';
import { SelfHealing } from './pages/SelfHealing';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/scrapers" element={<ScraperHealth />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/self-healing" element={<SelfHealing />} />
          <Route path="/settings" element={<Settings />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

