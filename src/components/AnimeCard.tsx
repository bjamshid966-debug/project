import { Star, Play, Clock } from 'lucide-react';
import type { Anime } from '../lib/supabase';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
}

export default function AnimeCard({ anime, onClick }: AnimeCardProps) {
  const statusColor =
    anime.status === 'Airing'
      ? 'bg-green-500'
      : anime.status === 'Upcoming'
      ? 'bg-blue-500'
      : 'bg-gray-500';

  return (
    <div
      onClick={() => onClick(anime)}
      className="group cursor-pointer rounded-xl overflow-hidden bg-gray-900 border border-white/5 hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/10"
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={anime.cover_image}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={22} className="text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Status badge */}
        <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold text-white ${statusColor}`}>
          {anime.status === 'Airing' ? 'Efirda' : anime.status === 'Upcoming' ? 'Tez kunda' : 'Tugagan'}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
          <Star size={12} className="text-yellow-400" fill="currentColor" />
          <span className="text-white text-xs font-bold">{anime.rating}</span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
            {anime.title}
          </h3>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="bg-white/5 px-2 py-0.5 rounded-full">{anime.type}</span>
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>{anime.episodes} ep</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {anime.genre.slice(0, 2).map(g => (
            <span
              key={g}
              className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
