import { useState, useEffect } from 'react';
import { X, Star, Clock, Calendar, Tv, Building2, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Anime, Review } from '../lib/supabase';

interface AnimeDetailProps {
  anime: Anime;
  onClose: () => void;
}

export default function AnimeDetail({ anime, onClose }: AnimeDetailProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ user_name: '', rating: 8, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [anime.id]);

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('anime_id', anime.id)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.user_name.trim() || !reviewForm.comment.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      anime_id: anime.id,
      user_name: reviewForm.user_name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });
    if (!error) {
      setReviewForm({ user_name: '', rating: 8, comment: '' });
      setShowForm(false);
      loadReviews();
    }
    setSubmitting(false);
  };

  const statusColor =
    anime.status === 'Airing'
      ? 'text-green-400 bg-green-500/10 border-green-500/30'
      : 'text-gray-400 bg-gray-500/10 border-gray-500/30';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-950 w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl">
        {/* Banner */}
        <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-3xl sm:rounded-t-2xl">
          <img
            src={anime.banner_image || anime.cover_image}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 sm:px-8 pb-8">
          {/* Header row */}
          <div className="flex gap-4 -mt-16 relative z-10 mb-5">
            <img
              src={anime.cover_image}
              alt={anime.title}
              className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-xl border-2 border-gray-800 shadow-xl flex-shrink-0"
            />
            <div className="pt-16 sm:pt-20 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{anime.title}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{anime.title_japanese}</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-1.5 mb-1">
                <Star size={14} className="text-yellow-400" />
                <span className="text-xs text-gray-400">Reyting</span>
              </div>
              <p className="text-xl font-black text-white">{anime.rating}<span className="text-sm text-gray-500">/10</span></p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={14} className="text-blue-400" />
                <span className="text-xs text-gray-400">Epizodlar</span>
              </div>
              <p className="text-xl font-black text-white">{anime.episodes}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={14} className="text-orange-400" />
                <span className="text-xs text-gray-400">Yil</span>
              </div>
              <p className="text-xl font-black text-white">{anime.year}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-1.5 mb-1">
                <Tv size={14} className="text-red-400" />
                <span className="text-xs text-gray-400">Tur</span>
              </div>
              <p className="text-xl font-black text-white">{anime.type}</p>
            </div>
          </div>

          {/* Status & Studio */}
          <div className="flex flex-wrap gap-3 mb-5">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${statusColor}`}>
              {anime.status === 'Airing' ? 'Efirda' : 'Tugagan'}
            </span>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Building2 size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">{anime.studio}</span>
            </div>
            <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-sm text-gray-300">
              {anime.season} {anime.year}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genre.map(g => (
              <span
                key={g}
                className="text-sm bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="mb-8">
            <h3 className="text-white font-bold text-lg mb-3">Tavsif</h3>
            <p className="text-gray-300 leading-relaxed text-sm">{anime.synopsis}</p>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">
                Sharhlar
                {reviews.length > 0 && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">({reviews.length})</span>
                )}
              </h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Sharh yozish
                <ChevronDown size={14} className={`transition-transform ${showForm ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Review form */}
            {showForm && (
              <form onSubmit={submitReview} className="bg-white/5 rounded-xl p-5 border border-white/10 mb-5">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Ismingiz</label>
                    <input
                      type="text"
                      value={reviewForm.user_name}
                      onChange={e => setReviewForm(prev => ({ ...prev, user_name: e.target.value }))}
                      placeholder="Ismingizni kiriting"
                      className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Baho: {reviewForm.rating}/10</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={reviewForm.rating}
                      onChange={e => setReviewForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      className="w-full accent-red-500 mt-2"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-1.5">Sharh</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Bu anime haqida fikringizni yozing..."
                    rows={3}
                    className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  {submitting ? 'Yuborilmoqda...' : 'Sharh yuborish'}
                </button>
              </form>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Star size={32} className="mx-auto mb-3 opacity-30" />
                <p>Hali sharhlar yo'q. Birinchi bo'ling!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                          {review.user_name[0].toUpperCase()}
                        </div>
                        <span className="text-white font-semibold text-sm">{review.user_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-yellow-400" fill="currentColor" />
                        <span className="text-yellow-400 font-bold text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                    <p className="text-gray-600 text-xs mt-2">
                      {new Date(review.created_at).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
