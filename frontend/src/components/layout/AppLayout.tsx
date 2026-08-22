import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-850/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Built for WeMakeDevs × Bright Data &quot;Into the Scrape-Verse&quot; Hackathon</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Bright Data Scraper Studio</span>
            <span>•</span>
            <span>Target: Cutshort</span>
            <span>•</span>
            <span className="text-slate-300">FastAPI Ready</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
