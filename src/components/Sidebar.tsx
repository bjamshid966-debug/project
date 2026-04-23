import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Send, BarChart2, Hash, DollarSign, Terminal, Settings, LogOut, Bot, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, key: 'dashboard' as const },
  { path: '/users', icon: Users, key: 'users' as const },
  { path: '/broadcast', icon: Send, key: 'broadcast' as const },
  { path: '/statistics', icon: BarChart2, key: 'statistics' as const },
  { path: '/channels', icon: Hash, key: 'channels' as const },
  { path: '/prices', icon: DollarSign, key: 'prices' as const },
  { path: '/commands', icon: Terminal, key: 'commands' as const },
  { path: '/settings', icon: Settings, key: 'settings' as const },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { admin, logout } = useAuth();
  const { t } = useLanguage();
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-30
        flex flex-col transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">IT Frontend</p>
              <p className="text-xs text-slate-400">Bot Admin</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{admin?.telegram_username || ''}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map(({ path, icon: Icon, key }) => (
            <NavLink key={path} to={path} end={path === '/'} onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium
                transition-all duration-150
                ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
              `}>
              <Icon size={18} className="shrink-0" />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-150">
            <LogOut size={18} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
