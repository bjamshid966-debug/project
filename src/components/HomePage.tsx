import { TrendingUp, Star, Flame, ChevronRight } from 'lucide-react';
import AnimeCard from './AnimeCard';
import HeroSection from './HeroSection';
import type { Anime } from '../lib/supabase';

interface HomePageProps {
  animeList: Anime[];
  onSelect: (anime: Anime) => void;
  onNavigate: (page: string) => void;
}

export default function HomePage({ animeList, onSelect, onNavigate }: HomePageProps) {
  const hero = animeList.find(a => a.title === 'Attack on Titan') || animeList[0];
  const topRated = [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const airing = animeList.filter(a => a.status === 'Airing').slice(0, 6);
  const recent = [...animeList].sort((a, b) => b.year - a.year).slice(0, 6);

  const Section = ({
    title,
    icon,
    items,
    accent,
  }: {
    title: string;
    icon: React.ReactNode;
    items: Anime[];
    accent: string;
  }) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-6 rounded-full ${accent}`} />
          <div className={`p-1.5 rounded-lg ${accent.replace('bg-', 'bg-').replace('-500', '-500/10')}`}>
            {icon}
          </div>
          <h2 className="text-white font-bold text-xl">{title}</h2>
        </div>
        <button
          onClick={() => onNavigate('browse')}
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors"
        >
          Barchasi
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map(anime => (
          <AnimeCard key={anime.id} anime={anime} onClick={onSelect} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-gray-950 min-h-screen">
      <HeroSection
        anime={hero}
        onWatch={onSelect}
        onInfo={onSelect}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        {/* Stats banner */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[
            { label: 'Anime', value: animeList.length + '+', color: 'text-red-400' },
            { label: "Efirdagi seriyalar", value: animeList.filter(a => a.status === 'Airing').length, color: 'text-green-400' },
            { label: 'O\'rtacha reyting', value: (animeList.reduce((s, a) => s + a.rating, 0) / animeList.length || 0).toFixed(1), color: 'text-yellow-400' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white/3 border border-white/5 rounded-2xl p-4 sm:p-6 text-center"
            >
              <div className={`text-2xl sm:text-4xl font-black ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <Section
          title="Top reytingli"
          icon={<Star size={16} className="text-yellow-400" />}
          items={topRated}
          accent="bg-yellow-500"
        />

        {airing.length > 0 && (
          <Section
            title="Hozir efirda"
            icon={<Flame size={16} className="text-green-400" />}
            items={airing}
            accent="bg-green-500"
          />
        )}

        <Section
          title="Yangi qo'shilganlar"
          icon={<TrendingUp size={16} className="text-blue-400" />}
          items={recent}
          accent="bg-blue-500"
        />
      </div>
    </div>
  );
}
