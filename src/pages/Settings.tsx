import { useEffect, useState } from 'react';
import { Bot, Save, Plus, Trash2, Users, Settings as SettingsIcon, X, Check, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import type { BotSetting, Admin } from '../types';

export default function Settings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<BotSetting[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'admins'>('settings');
  const [adminModal, setAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', login_id: '', password: '', telegram_username: '' });
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [settingsRes, adminsRes] = await Promise.all([
      supabase.from('bot_settings').select('*').order('key'),
      supabase.from('admins').select('id, login_id, name, telegram_username, is_active, created_at, last_login').order('created_at'),
    ]);
    setSettings(settingsRes.data || []);
    setAdmins(adminsRes.data || []);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const saveSetting = async (setting: BotSetting) => {
    setSavingKey(setting.key);
    await supabase.from('bot_settings').update({ value: setting.value, updated_at: new Date().toISOString() }).eq('id', setting.id);
    setSavingKey(null);
    showToast(t('settingsSaved'));
  };

  const updateSettingValue = (id: string, value: string) => {
    setSettings(s => s.map(item => item.id === id ? { ...item, value } : item));
  };

  const saveAdmin = async () => {
    if (!newAdmin.name.trim() || !newAdmin.login_id.trim() || !newAdmin.password.trim()) return;
    setSavingAdmin(true);
    await supabase.from('admins').insert({
      name: newAdmin.name,
      login_id: newAdmin.login_id,
      password_hash: newAdmin.password,
      telegram_username: newAdmin.telegram_username,
      is_active: true,
    });
    setSavingAdmin(false);
    setAdminModal(false);
    setNewAdmin({ name: '', login_id: '', password: '', telegram_username: '' });
    load();
  };

  const deleteAdmin = async () => {
    if (!deleteAdminId) return;
    await supabase.from('admins').delete().eq('id', deleteAdminId);
    setDeleteAdminId(null);
    load();
  };

  const sensitiveKeys = ['bot_token', 'password'];

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-emerald-600 text-white flex items-center gap-2">
          <Check size={16} />
          {toast}
        </div>
      )}

      <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white w-fit">
        <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          <SettingsIcon size={15} /> {t('botSettings')}
        </button>
        <button onClick={() => setActiveTab('admins')} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors ${activeTab === 'admins' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Users size={15} /> {t('adminsList')}
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Bot size={18} className="text-blue-600" />
            <h3 className="font-semibold text-slate-700">{t('botInfo')}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {settings.map(s => {
              const isSensitive = sensitiveKeys.some(k => s.key.toLowerCase().includes(k));
              const shown = showPasswords[s.key];
              return (
                <div key={s.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="sm:w-48 shrink-0">
                    <p className="text-sm font-medium text-slate-700">{s.key}</p>
                    {s.description && <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={isSensitive && !shown ? 'password' : 'text'}
                        value={s.value}
                        onChange={e => updateSettingValue(s.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                      />
                      {isSensitive && (
                        <button onClick={() => setShowPasswords(p => ({ ...p, [s.key]: !p[s.key] }))} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {shown ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => saveSetting(s)}
                      disabled={savingKey === s.key}
                      className="shrink-0 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {savingKey === s.key ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={13} />}
                      {t('save')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setAdminModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-blue-600/20">
              <Plus size={16} /> {t('addAdmin')}
            </button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {[t('adminName'), t('adminLoginId'), t('adminTelegram'), t('status'), t('actions')].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{admin.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{admin.login_id}</td>
                    <td className="px-4 py-3 text-blue-600">{admin.telegram_username || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${admin.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {admin.is_active ? t('enabled') : t('disabled')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDeleteAdminId(admin.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAdminModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800">{t('addAdmin')}</h3>
              <button onClick={() => setAdminModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: t('adminName'), key: 'name', placeholder: 'Jamshid' },
                { label: t('adminLoginId'), key: 'login_id', placeholder: '12345679' },
                { label: t('adminPassword'), key: 'password', placeholder: '••••••••', type: 'password' },
                { label: t('adminTelegram'), key: 'telegram_username', placeholder: '@username' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</label>
                  <input type={type || 'text'} value={(newAdmin as Record<string, string>)[key] || ''}
                    onChange={e => setNewAdmin(a => ({ ...a, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAdminModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">{t('cancel')}</button>
              <button onClick={saveAdmin} disabled={savingAdmin} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white disabled:opacity-60 flex items-center justify-center gap-2">
                {savingAdmin ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                {t('add')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteAdminId} title={t('deleteAdmin')} message={t('confirmDeleteAdmin')} onConfirm={deleteAdmin} onCancel={() => setDeleteAdminId(null)} danger />
    </div>
  );
}
