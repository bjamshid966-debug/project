import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../i18n';

const routeTitles: Record<string, TranslationKey> = {
  '/': 'dashboard',
  '/users': 'users',
  '/broadcast': 'broadcast',
  '/statistics': 'statistics',
  '/channels': 'channels',
  '/prices': 'prices',
  '/commands': 'commands',
  '/settings': 'settings',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const titleKey = routeTitles[pathname] || 'dashboard';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={t(titleKey)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
