import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Send, TrendingUp, Activity, CreditCard, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import type { StatsDaily } from '../types';

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  bannedUsers: number;
  totalBroadcasts: number;
  newToday: number;
  totalPayments: number;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, activeToday: 0, bannedUsers: 0,
    totalBroadcasts: 0, newToday: 0, totalPayments: 0,
  });
  const [chartData, setChartData] = useState<StatsDaily[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const [usersRes, broadcastsRes, statsRes] = await Promise.all([
      supabase.from('telegram_users').select('is_banned, is_deleted, joined_at, last_active'),
      supabase.from('broadcasts').select('id', { count: 'exact', head: true }),
      supabase.from('stats_daily').select('*').order('date', { ascending: true }).limit(14),
    ]);

    const users = usersRes.data || [];
    const today = new Date().toISOString().split('T')[0];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    setStats({
      totalUsers: users.filter(u => !u.is_deleted).length,
      activeToday: users.filter(u => u.last_active && new Date(u.last_active) >= todayStart).length,
      bannedUsers: users.filter(u => u.is_banned && !u.is_deleted).length,
      totalBroadcasts: broadcastsRes.count || 0,
      newToday: users.filter(u => u.joined_at?.startsWith(today)).length,
      totalPayments: 0,
    });

    if (statsRes.data) setChartData(statsRes.data);
    setLoading(false);
  };

  const fmt = (d: string) => {
    const date = new Date(d);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('totalUsers')} value={stats.totalUsers.toLocaleString()} icon={Users} color="blue" />
        <StatCard title={t('activeToday')} value={stats.activeToday.toLocaleString()} icon={UserCheck} color="green" />
        <StatCard title={t('bannedUsers')} value={stats.bannedUsers.toLocaleString()} icon={UserX} color="red" />
        <StatCard title={t('broadcast')} value={stats.totalBroadcasts.toLocaleString()} icon={Send} color="amber" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('newToday')} value={stats.newToday} icon={TrendingUp} color="green" />
        <StatCard title={t('totalPayments')} value={stats.totalPayments} icon={CreditCard} color="slate" />
        <StatCard title="Commands" value={chartData.reduce((s, d) => s + d.commands_used, 0).toLocaleString()} icon={Zap} color="blue" />
        <StatCard title="Messages" value={chartData.reduce((s, d) => s + d.messages_sent, 0).toLocaleString()} icon={Activity} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">{t('userGrowth')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="newUsersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }} labelFormatter={fmt} />
              <Area type="monotone" dataKey="new_users" stroke="#3b82f6" strokeWidth={2} fill="url(#newUsersGrad)" name={t('newUsers')} />
              <Area type="monotone" dataKey="active_users" stroke="#10b981" strokeWidth={2} fill="none" name={t('activeUsers')} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">{t('commandStats')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }} labelFormatter={fmt} />
              <Bar dataKey="commands_used" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t('commandsUsed')} />
              <Bar dataKey="messages_sent" fill="#10b981" radius={[4, 4, 0, 0]} name={t('messagesSent')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">{t('recentActivity')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{t('newUsers')}</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{t('activeUsers')}</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{t('commandsUsed')}</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{t('messagesSent')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.slice().reverse().slice(0, 7).map(row => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-slate-700">{row.date}</td>
                  <td className="px-5 py-3 text-right text-emerald-600 font-medium">+{row.new_users}</td>
                  <td className="px-5 py-3 text-right text-blue-600 font-medium">{row.active_users}</td>
                  <td className="px-5 py-3 text-right text-slate-600">{row.commands_used}</td>
                  <td className="px-5 py-3 text-right text-slate-600">{row.messages_sent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
