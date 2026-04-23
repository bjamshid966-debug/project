import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, DollarSign, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import type { CoursePrice } from '../types';

const empty = (): Partial<CoursePrice> => ({
  course_name: '', description: '', price: 0, currency: 'UZS', duration_days: 30, is_active: true,
});

export default function Prices() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState<CoursePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item: Partial<CoursePrice>; isEdit: boolean }>({
    open: false, item: empty(), isEdit: false,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('course_prices').select('*').order('price');
    setPrices(data || []);
    setLoading(false);
  };

  const save = async () => {
    if (!modal.item.course_name?.trim()) return;
    setSaving(true);
    const payload = {
      course_name: modal.item.course_name,
      description: modal.item.description,
      price: modal.item.price || 0,
      currency: modal.item.currency || 'UZS',
      duration_days: modal.item.duration_days || 30,
      is_active: modal.item.is_active ?? true,
    };
    if (modal.isEdit && modal.item.id) {
      await supabase.from('course_prices').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', modal.item.id);
    } else {
      await supabase.from('course_prices').insert(payload);
    }
    setSaving(false);
    setModal({ open: false, item: empty(), isEdit: false });
    load();
  };

  const deletePrice = async () => {
    if (!deleteId) return;
    await supabase.from('course_prices').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  };

  const fmt = (price: number, currency: string) => {
    if (currency === 'UZS') return `${price.toLocaleString()} so'm`;
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-700 font-semibold">{t('coursePrices')}</h2>
        <button
          onClick={() => setModal({ open: true, item: empty(), isEdit: false })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          <Plus size={16} />
          {t('addPrice')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner /></div>
      ) : prices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-400">{t('noPrices')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {prices.map(p => (
            <div key={p.id} className={`bg-white rounded-xl border-2 p-5 hover:shadow-md transition-all ${p.is_active ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <DollarSign size={20} className="text-emerald-600" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.is_active ? t('enabled') : t('disabled')}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{p.course_name}</h3>
              {p.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{p.description}</p>}
              <div className="flex items-end justify-between border-t border-slate-100 pt-3">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{fmt(p.price, p.currency)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.duration_days} days</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setModal({ open: true, item: { ...p }, isEdit: true })} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  <Edit2 size={13} /> {t('editPrice')}
                </button>
                <button onClick={() => setDeleteId(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 size={13} /> {t('deletePrice')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal({ open: false, item: empty(), isEdit: false })} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800">{modal.isEdit ? t('editPrice') : t('addPrice')}</h3>
              <button onClick={() => setModal({ open: false, item: empty(), isEdit: false })} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('courseName')}</label>
                <input type="text" value={modal.item.course_name || ''} onChange={e => setModal(m => ({ ...m, item: { ...m.item, course_name: e.target.value } }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('description')}</label>
                <textarea rows={2} value={modal.item.description || ''} onChange={e => setModal(m => ({ ...m, item: { ...m.item, description: e.target.value } }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('price')}</label>
                  <input type="number" value={modal.item.price || 0} onChange={e => setModal(m => ({ ...m, item: { ...m.item, price: parseFloat(e.target.value) || 0 } }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('currency')}</label>
                  <select value={modal.item.currency || 'UZS'} onChange={e => setModal(m => ({ ...m, item: { ...m.item, currency: e.target.value } }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>UZS</option><option>USD</option><option>RUB</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('duration')}</label>
                <input type="number" value={modal.item.duration_days || 30} onChange={e => setModal(m => ({ ...m, item: { ...m.item, duration_days: parseInt(e.target.value) || 30 } }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal({ open: false, item: empty(), isEdit: false })} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">{t('cancel')}</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                {t('savePrice')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} title={t('deletePrice')} message={t('confirmDeleteChannel')} onConfirm={deletePrice} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
}
