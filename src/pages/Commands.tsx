import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Terminal, X, Check, Hash } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import type { BotCommand } from '../types';

const empty = (): Partial<BotCommand> => ({
  command: '', description_uz: '', description_ru: '', description_en: '',
  response_uz: '', response_ru: '', response_en: '', is_active: true,
});

export default function Commands() {
  const { t } = useLanguage();
  const [commands, setCommands] = useState<BotCommand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item: Partial<BotCommand>; isEdit: boolean }>({
    open: false, item: empty(), isEdit: false,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('uz');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('bot_commands').select('*').order('command');
    setCommands(data || []);
    setLoading(false);
  };

  const save = async () => {
    if (!modal.item.command?.trim()) return;
    setSaving(true);
    const payload = {
      command: modal.item.command?.startsWith('/') ? modal.item.command : `/${modal.item.command}`,
      description_uz: modal.item.description_uz || '',
      description_ru: modal.item.description_ru || '',
      description_en: modal.item.description_en || '',
      response_uz: modal.item.response_uz || '',
      response_ru: modal.item.response_ru || '',
      response_en: modal.item.response_en || '',
      is_active: modal.item.is_active ?? true,
    };
    if (modal.isEdit && modal.item.id) {
      await supabase.from('bot_commands').update(payload).eq('id', modal.item.id);
    } else {
      await supabase.from('bot_commands').insert(payload);
    }
    setSaving(false);
    setModal({ open: false, item: empty(), isEdit: false });
    load();
  };

  const deleteCmd = async () => {
    if (!deleteId) return;
    await supabase.from('bot_commands').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  };

  const toggleActive = async (cmd: BotCommand) => {
    await supabase.from('bot_commands').update({ is_active: !cmd.is_active }).eq('id', cmd.id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-700 font-semibold">{t('botCommands')}</h2>
        <button
          onClick={() => setModal({ open: true, item: empty(), isEdit: false })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          <Plus size={16} />
          {t('addCommand')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('command')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">{t('descriptionUz')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('status')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commands.length === 0 ? (
                  <tr><td colSpan={4} className="py-16 text-center text-slate-400">{t('noCommands')}</td></tr>
                ) : commands.map(cmd => (
                  <tr key={cmd.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Terminal size={14} className="text-slate-500" />
                        </div>
                        <span className="font-mono font-medium text-blue-600">{cmd.command}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell max-w-xs">
                      <span className="line-clamp-1">{cmd.description_uz || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(cmd)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${cmd.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {cmd.is_active ? t('enabled') : t('disabled')}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setModal({ open: true, item: { ...cmd }, isEdit: true })} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteId(cmd.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal({ open: false, item: empty(), isEdit: false })} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{modal.isEdit ? t('editCommand') : t('addCommand')}</h3>
                <button onClick={() => setModal({ open: false, item: empty(), isEdit: false })} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('command')}</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={modal.item.command?.replace(/^\//, '') || ''} onChange={e => setModal(m => ({ ...m, item: { ...m.item, command: `/${e.target.value}` } }))}
                    placeholder="start" className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 mb-3">
                  {(['uz', 'ru', 'en'] as const).map(lang => (
                    <button key={lang} onClick={() => setActiveTab(lang)}
                      className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === lang ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div key={activeTab} className="space-y-3">
                  <input type="text"
                    value={(modal.item as Record<string, string>)[`description_${activeTab}`] || ''}
                    onChange={e => setModal(m => ({ ...m, item: { ...m.item, [`description_${activeTab}`]: e.target.value } }))}
                    placeholder={`Description...`}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <textarea rows={3}
                    value={(modal.item as Record<string, string>)[`response_${activeTab}`] || ''}
                    onChange={e => setModal(m => ({ ...m, item: { ...m.item, [`response_${activeTab}`]: e.target.value } }))}
                    placeholder={`Response...`}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 pb-6 pt-4 border-t border-slate-100">
              <div className="flex gap-3">
                <button onClick={() => setModal({ open: false, item: empty(), isEdit: false })} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">{t('cancel')}</button>
                <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                  {t('saveCommand')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title={t('deleteCommand')} message={t('confirmDeleteChannel')} onConfirm={deleteCmd} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
}
