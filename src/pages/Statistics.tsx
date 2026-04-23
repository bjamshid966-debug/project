import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StatsDaily } from '../types';

type Range = '7' | '14' | '30';

export default function Statistics() {
  const { t } = useLanguage();
  const [data, setData] = useState<StatsDaily[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>('14');

  useEffect(() => { loadStats(); }, [range]);

  const loadStats = async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from('stats_daily')
      .select('*')
      .order('date', { ascending: false })
      .limit(parseInt(range));
    setData((rows || []).reverse());
    setLoading(false);
  };

  const fmt = (d: string) => {
    const date = new Date(d);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const totals = data.reduce((acc, row) => ({
    new_users: acc.new_users + row.new_users,
    active_users: Math.max(acc.active_users, row.active_users),
    commands_used: acc.commands_used + row.commands_used,
    messages_sent: acc.messages_sent + row.messages_sent,
    payments_count: acc.payments_count + row.payments_count,
    payments_total: acc.payments_total + row.payments_total,
  }), { new_users: 0, active_users: 0, commands_used: 0, messages_sent: 0, payments_count: 0, payments_total: 0 });

  const tooltipStyle = { borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-white">
          {(['7', '14', '30'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                range === r ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {r === '7' ? t('last7days') : r === '14' ? '14 days' : t('last30days')}
            </button>
          ))}
        </div>
        {loading && <LoadingSpinner size="sm" />}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('newUsers'), value: totals.new_users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('activeUsers'), value: totals.active_users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: t('commandsUsed'), value: totals.commands_used.toLocaleString(), color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: t('messagesSent'), value: totals.messages_sent.toLocaleString(), color: 'text-slate-600', bg: 'bg-slate-100' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4`}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">{t('userGrowth')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={fmt} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="new_users" stroke="#3b82f6" strokeWidth={2} fill="url(#gradNew)" name={t('newUsers')} />
            <Area type="monotone" dataKey="active_users" stroke="#10b981" strokeWidth={2} fill="url(#gradActive)" name={t('activeUsers')} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">{t('commandStats')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={fmt} />
              <Bar dataKey="commands_used" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t('commandsUsed')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">{t('messagesSent')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={fmt} />
              <Line type="monotone" dataKey="messages_sent" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name={t('messagesSent')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">{t('dailyStats')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {['Date', t('newUsers'), t('activeUsers'), t('commandsUsed'), t('messagesSent')].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.slice().reverse().map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{row.date}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">+{row.new_users}</td>
                  <td className="px-4 py-3 text-blue-600">{row.active_users}</td>
                  <td className="px-4 py-3 text-slate-600">{row.commands_used}</td>
                  <td className="px-4 py-3 text-slate-600">{row.messages_sent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
