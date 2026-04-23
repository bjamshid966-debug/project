import { useEffect, useState, useCallback } from 'react';
import { Search, Eye, Ban, UserCheck, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import type { TelegramUser } from '../types';

const PAGE_SIZE = 15;
type Filter = 'all' | 'active' | 'banned';

export default function Users() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<TelegramUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<TelegramUser | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banModal, setBanModal] = useState<{ user: TelegramUser; type: 'ban' | 'unban' | 'delete' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('telegram_users')
      .select('*', { count: 'exact' })
      .order('joined_at', { ascending: false });

    if (filter === 'active') query = query.eq('is_banned', false).eq('is_deleted', false);
    else if (filter === 'banned') query = query.eq('is_banned', true);
    else query = query.eq('is_deleted', false);

    if (search.trim()) {
      const s = search.trim();
      if (/^\d+$/.test(s)) {
        query = query.eq('telegram_id', parseInt(s));
      } else {
        query = query.ilike('username', `%${s}%`);
      }
    }

    const { data, count } = await query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    setUsers(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [filter, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleBanAction = async () => {
    if (!banModal) return;
    setActionLoading(true);
    const { user, type } = banModal;
    if (type === 'ban') {
      await supabase.from('telegram_users').update({ is_banned: true, ban_reason: banReason }).eq('id', user.id);
    } else if (type === 'unban') {
      await supabase.from('telegram_users').update({ is_banned: false, ban_reason: '' }).eq('id', user.id);
    } else {
      await supabase.from('telegram_users').update({ is_deleted: true }).eq('id', user.id);
    }
    setActionLoading(false);
    setBanModal(null);
    setBanReason('');
    load();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder={t('searchUsers')}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden shrink-0">
          {(['all', 'active', 'banned'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? t('allUsers') : f === 'active' ? t('activeOnly') : t('bannedOnly')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{t('userId')}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{t('username')}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">{t('firstName')}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">{t('joinDate')}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{t('status')}</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="py-16 text-center"><LoadingSpinner /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-slate-400 text-sm">{t('noUsers')}</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{user.telegram_id}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">
                    {user.username ? `@${user.username}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                    {[user.first_name, user.last_name].filter(Boolean).join(' ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">
                    {new Date(user.joined_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {user.is_banned ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{t('banned')}</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{t('active')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedUser(user)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title={t('viewDetails')}>
                        <Eye size={15} />
                      </button>
                      {user.is_banned ? (
                        <button onClick={() => setBanModal({ user, type: 'unban' })} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title={t('unban')}>
                          <UserCheck size={15} />
                        </button>
                      ) : (
                        <button onClick={() => setBanModal({ user, type: 'ban' })} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title={t('ban')}>
                          <Ban size={15} />
                        </button>
                      )}
                      <button onClick={() => setBanModal({ user, type: 'delete' })} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title={t('delete')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500 text-xs">
              {t('showing')} {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} {t('of')} {total} {t('results')}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-slate-600 text-xs font-medium">{page + 1} / {totalPages}</span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{t('userDetails')}</h3>
                <button onClick={() => setSelectedUser(null)} className="text-slate-300 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedUser.first_name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-white font-medium">{[selectedUser.first_name, selectedUser.last_name].filter(Boolean).join(' ') || 'N/A'}</p>
                  <p className="text-slate-300 text-sm">{selectedUser.username ? `@${selectedUser.username}` : '—'}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                [t('userId'), selectedUser.telegram_id],
                [t('language'), selectedUser.language_code?.toUpperCase()],
                [t('joinDate'), new Date(selectedUser.joined_at).toLocaleString()],
                [t('lastActive'), new Date(selectedUser.last_active).toLocaleString()],
                [t('totalCommands'), selectedUser.total_commands],
                [t('status'), selectedUser.is_banned ? t('banned') : t('active')],
                ...(selectedUser.is_banned && selectedUser.ban_reason ? [[t('banReason'), selectedUser.ban_reason]] : []),
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between items-start">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-medium text-slate-800 text-right max-w-[60%]">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {banModal && banModal.type !== 'ban' ? (
        <ConfirmModal
          isOpen={true}
          title={banModal.type === 'unban' ? t('unban') : t('delete')}
          message={banModal.type === 'unban' ? t('confirmUnban') : t('confirmDelete')}
          onConfirm={handleBanAction}
          onCancel={() => setBanModal(null)}
          danger={banModal.type === 'delete'}
        />
      ) : banModal && banModal.type === 'ban' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setBanModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-1">{t('ban')}</h3>
            <p className="text-sm text-slate-500 mb-4">{t('confirmBan')}</p>
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 block mb-1.5">{t('banReason')}</label>
              <input
                type="text"
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Spam..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setBanModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">{t('cancel')}</button>
              <button onClick={handleBanAction} disabled={actionLoading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium text-white disabled:opacity-60">
                {actionLoading ? t('loading') : t('ban')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
