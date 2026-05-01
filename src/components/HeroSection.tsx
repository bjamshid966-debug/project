import { Play, Info, Star, Clock, Calendar } from 'lucide-react';
import type { Anime } from '../lib/supabase';

interface HeroProps {
  anime: Anime | null;
  onWatch: (anime: Anime) => void;
  onInfo: (anime: Anime) => void;
}

export default function HeroSection({ anime, onWatch, onInfo }: HeroProps) {
  if (!anime) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={anime.banner_image || anime.cover_image}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/30" />
      </div>

      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-xl pt-16">
          {/* Label */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-red-500" />
            <span className="text-red-400 text-sm font-semibold uppercase tracking-widest">
              Tavsiya etilgan
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-none mb-2 tracking-tight">
            {anime.title}
          </h1>
          <p className="text-gray-400 text-base mb-5 font-medium">{anime.title_japanese}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
            <div className="flex items-center gap-1.5">
              <Star size={15} className="text-yellow-400" fill="currentColor" />
              <span className="text-yellow-400 font-bold text-base">{anime.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Clock size={14} />
              <span>{anime.episodes} epizod</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Calendar size={14} />
              <span>{anime.year}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              anime.status === 'Airing' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {anime.status === 'Airing' ? 'Efirda' : 'Tugagan'}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genre.map(g => (
              <span
                key={g}
                className="text-xs border border-white/20 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm bg-white/5"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-gray-300 text-sm leading-relaxed mb-8 line-clamp-3">
            {anime.synopsis}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onWatch(anime)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-500/30"
            >
              <Play size={18} fill="white" />
              Ko'rish
            </button>
            <button
              onClick={() => onInfo(anime)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              <Info size={18} />
              Batafsil
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
    </section>
  );
}
