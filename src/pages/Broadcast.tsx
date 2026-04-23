import { useEffect, useState } from 'react';
import { Send, Clock, CheckCircle, XCircle, Loader, Image, Video, FileText, Music } from 'lucide-react';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Broadcast as BroadcastType } from '../types';

const mediaTypes = [
  { value: 'none', label: 'noMedia', Icon: Send },
  { value: 'photo', label: 'photo', Icon: Image },
  { value: 'video', label: 'video', Icon: Video },
  { value: 'document', label: 'document', Icon: FileText },
  { value: 'audio', label: 'audio', Icon: Music },
] as const;

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'pending' as const },
  sending: { icon: Loader, color: 'text-blue-600', bg: 'bg-blue-50', label: 'sending' as const },
  completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'completed' as const },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'failed' as const },
};

export default function Broadcast() {
  const { t } = useLanguage();
  const { admin } = useAuth();
  const [message, setMessage] = useState('');
  const [mediaType, setMediaType] = useState('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<BroadcastType[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('broadcasts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    setHistory(data || []);
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSend = async () => {
    if (!message.trim() && mediaType === 'none') return;
    setSending(true);

    const { data: adminRecord } = await supabase
      .from('admins')
      .select('id')
      .eq('login_id', admin?.login_id)
      .maybeSingle();

    const { data: broadcast, error } = await supabase
      .from('broadcasts')
      .insert({
        message: message.trim(),
        media_type: mediaType,
        media_url: mediaUrl.trim(),
        caption: caption.trim(),
        status: 'pending',
        created_by: adminRecord?.id || null,
      })
      .select()
      .single();

    if (error || !broadcast) {
      setSending(false);
      showToast('error', error?.message || 'Xato');
      return;
    }

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token || SUPABASE_ANON_KEY;

    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ broadcast_id: broadcast.id }),
    });

    const result = await res.json();
    setSending(false);

    if (result.success) {
      showToast('success', `${t('broadcastSent')} (${result.sent}/${result.total})`);
      setMessage('');
      setMediaUrl('');
      setCaption('');
      setMediaType('none');
    } else {
      showToast('error', result.error || 'Xato');
    }

    loadHistory();
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Send size={16} className="text-blue-600" />
            {t('newBroadcast')}
          </h3>

          <div className="mb-4">
            <label className="text-xs font-medium text-slate-500 mb-2 block">{t('mediaType')}</label>
            <div className="flex flex-wrap gap-2">
              {mediaTypes.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setMediaType(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    mediaType === value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <Icon size={13} />
                  {t(label as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">{t('messageText')}</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              placeholder={t('enterMessage')}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{message.length} chars</p>
          </div>

          {mediaType !== 'none' && (
            <>
              <div className="mb-3">
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">{t('mediaUrl')}</label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">{t('captionText')}</label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            onClick={handleSend}
            disabled={sending || (!message.trim() && mediaType === 'none')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('sendingBroadcast')}
              </>
            ) : (
              <>
                <Send size={16} />
                {t('sendBroadcast')}
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">{t('broadcastHistory')}</h3>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="py-16 flex justify-center"><LoadingSpinner /></div>
            ) : history.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">{t('noData')}</div>
            ) : history.map(bc => {
              const cfg = statusConfig[bc.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              return (
                <div key={bc.id} className="px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 line-clamp-2">{bc.message || `[${bc.media_type}]`}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(bc.created_at).toLocaleString()}</p>
                    </div>
                    <div className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon size={12} className={bc.status === 'sending' ? 'animate-spin' : ''} />
                      {t(cfg.label)}
                    </div>
                  </div>
                  {bc.status !== 'pending' && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="text-center py-1.5 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-400">{t('total')}</p>
                        <p className="text-sm font-semibold text-slate-700">{bc.total_users}</p>
                      </div>
                      <div className="text-center py-1.5 bg-emerald-50 rounded-lg">
                        <p className="text-xs text-emerald-500">{t('sentCount')}</p>
                        <p className="text-sm font-semibold text-emerald-700">{bc.sent_count}</p>
                      </div>
                      <div className="text-center py-1.5 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-400">{t('failedCount')}</p>
                        <p className="text-sm font-semibold text-red-600">{bc.failed_count}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
