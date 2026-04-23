import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Hash, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import type { RequiredChannel } from '../types';

const empty = (): Partial<RequiredChannel> => ({
  channel_id: '', channel_name: '', channel_link: '', is_active: true,
});

export default function Channels() {
  const { t } = useLanguage();
  const [channels, setChannels] = useState<RequiredChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item: Partial<RequiredChannel>; isEdit: boolean }>({
    open: false, item: empty(), isEdit: false,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('required_channels').select('*').order('created_at');
    setChannels(data || []);
    setLoading(false);
  };

  const openAdd = () => setModal({ open: true, item: empty(), isEdit: false });
  const openEdit = (ch: RequiredChannel) => setModal({ open: true, item: { ...ch }, isEdit: true });

  const save = async () => {
    if (!modal.item.channel_id?.trim() || !modal.item.channel_name?.trim()) return;
    setSaving(true);
    if (modal.isEdit && modal.item.id) {
      await supabase.from('required_channels').update({
        channel_id: modal.item.channel_id,
        channel_name: modal.item.channel_name,
        channel_link: modal.item.channel_link,
        is_active: modal.item.is_active,
      }).eq('id', modal.item.id);
    } else {
      await supabase.from('required_channels').insert({
        channel_id: modal.item.channel_id,
        channel_name: modal.item.channel_name,
        channel_link: modal.item.channel_link,
        is_active: modal.item.is_active ?? true,
      });
    }
    setSaving(false);
    setModal({ open: false, item: empty(), isEdit: false });
    load();
  };

  const deleteChannel = async () => {
    if (!deleteId) return;
    await supabase.from('required_channels').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  };

  const toggleActive = async (ch: RequiredChannel) => {
    await supabase.from('required_channels').update({ is_active: !ch.is_active }).eq('id', ch.id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-700 font-semibold">{t('requiredChannels')}</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          <Plus size={16} />
          {t('addChannel')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : channels.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-400">{t('noChannels')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map(ch => (
            <div key={ch.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Hash size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{ch.channel_name}</p>
                    <p className="text-xs text-slate-400 font-mono">{ch.channel_id}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(ch)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    ch.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {ch.is_active ? t('enabled') : t('disabled')}
                </button>
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEdit(ch)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  <Edit2 size={13} /> {t('editChannel')}
                </button>
                <button onClick={() => setDeleteId(ch.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 size={13} /> {t('deleteChannel')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal({ open: false, item: empty(), isEdit: false })} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800">{modal.isEdit ? t('editChannel') : t('addChannel')}</h3>
              <button onClick={() => setModal({ open: false, item: empty(), isEdit: false })} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: t('channelId'), key: 'channel_id', placeholder: '@channel_name' },
                { label: t('channelName'), key: 'channel_name', placeholder: 'My Channel' },
                { label: t('channelLink'), key: 'channel_link', placeholder: 'https://t.me/...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</label>
                  <input
                    type="text"
                    value={(modal.item as Record<string, string>)[key] || ''}
                    onChange={e => setModal(m => ({ ...m, item: { ...m.item, [key]: e.target.value } }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal({ open: false, item: empty(), isEdit: false })} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">{t('cancel')}</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                {t('saveChannel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title={t('deleteChannel')}
        message={t('confirmDeleteChannel')}
        onConfirm={deleteChannel}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
}
