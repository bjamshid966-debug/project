import { Trophy, Star, Medal } from 'lucide-react';
import type { Anime } from '../lib/supabase';

interface TopPageProps {
  animeList: Anime[];
  onSelect: (anime: Anime) => void;
}

export default function TopPage({ animeList, onSelect }: TopPageProps) {
  const sorted = [...animeList].sort((a, b) => b.rating - a.rating);

  const medalColor = (i: number) => {
    if (i === 0) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (i === 1) return 'text-gray-300 bg-gray-300/10 border-gray-300/30';
    if (i === 2) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  };

  const rankBg = (i: number) => {
    if (i === 0) return 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20';
    if (i === 1) return 'bg-gradient-to-r from-gray-400/5 to-transparent border-gray-400/10';
    if (i === 2) return 'bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/20';
    return 'bg-white/3 border-white/5';
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/10 rounded-2xl mb-4 border border-yellow-400/20">
            <Trophy size={28} className="text-yellow-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Top <span className="text-yellow-400">Reytingli</span>
          </h1>
          <p className="text-gray-400">Eng yaxshi reyting olgan animalar</p>
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3 mb-10 items-end">
          {[sorted[1], sorted[0], sorted[2]].map((anime, podiumIdx) => {
            if (!anime) return null;
            const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
            const heights = ['h-28', 'h-36', 'h-24'];
            const podiumColors = [
              'bg-gray-600',
              'bg-yellow-500',
              'bg-orange-600',
            ];
            return (
              <div
                key={anime.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onSelect(anime)}
              >
                <img
                  src={anime.cover_image}
                  alt={anime.title}
                  className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-xl border-2 border-white/10 group-hover:border-white/30 transition-all shadow-lg mb-2"
                />
                <p className="text-white text-xs font-semibold text-center line-clamp-1 mb-1 px-1">{anime.title}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={10} className="text-yellow-400" fill="currentColor" />
                  <span className="text-yellow-400 text-xs font-bold">{anime.rating}</span>
                </div>
                <div className={`w-full ${heights[podiumIdx]} ${podiumColors[podiumIdx]} rounded-t-lg flex items-start justify-center pt-2`}>
                  <span className="text-white font-black text-xl">#{rank}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="space-y-3">
          {sorted.map((anime, i) => (
            <div
              key={anime.id}
              onClick={() => onSelect(anime)}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:-translate-x-1 hover:shadow-lg ${rankBg(i)}`}
            >
              {/* Rank */}
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm flex-shrink-0 ${medalColor(i)}`}>
                {i < 3 ? <Medal size={18} /> : `#${i + 1}`}
              </div>

              {/* Cover */}
              <img
                src={anime.cover_image}
                alt={anime.title}
                className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold truncate">{anime.title}</h3>
                <p className="text-gray-500 text-sm">{anime.studio} · {anime.year}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {anime.genre.slice(0, 2).map(g => (
                    <span key={g} className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-col items-end flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  <span className="text-white font-black text-lg">{anime.rating}</span>
                </div>
                <span className="text-gray-500 text-xs">{anime.episodes} ep</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
