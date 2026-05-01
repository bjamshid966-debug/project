import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import AnimeCard from './AnimeCard';
import type { Anime } from '../lib/supabase';

interface BrowsePageProps {
  animeList: Anime[];
  searchQuery: string;
  onSelect: (anime: Anime) => void;
}

const ALL_GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Mystery', 'Romance', 'Sci-Fi', 'Supernatural', 'Thriller', 'Historical', 'School', 'Psychological', 'Superhero'];
const STATUSES = [
  { value: '', label: 'Barchasi' },
  { value: 'Airing', label: 'Efirda' },
  { value: 'Finished', label: 'Tugagan' },
  { value: 'Upcoming', label: 'Tez kunda' },
];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Reyting bo\'yicha' },
  { value: 'year', label: 'Yil bo\'yicha' },
  { value: 'title', label: 'Nomi bo\'yicha' },
  { value: 'episodes', label: 'Epizodlar bo\'yicha' },
];

export default function BrowsePage({ animeList, searchQuery, onSelect }: BrowsePageProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('rating');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleGenre = (g: string) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const filtered = useMemo(() => {
    let list = [...animeList];
    const q = localSearch.toLowerCase();
    if (q) {
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.title_japanese.toLowerCase().includes(q) ||
        a.studio.toLowerCase().includes(q)
      );
    }
    if (status) list = list.filter(a => a.status === status);
    if (selectedGenres.length > 0) {
      list = list.filter(a => selectedGenres.every(g => a.genre.includes(g)));
    }
    list.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'year') return b.year - a.year;
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'episodes') return b.episodes - a.episodes;
      return 0;
    });
    return list;
  }, [animeList, localSearch, status, selectedGenres, sort]);

  const clearFilters = () => {
    setLocalSearch('');
    setSelectedGenres([]);
    setStatus('');
    setSort('rating');
  };

  const hasFilters = localSearch || selectedGenres.length > 0 || status || sort !== 'rating';

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Anime <span className="text-red-500">Katalogi</span>
          </h1>
          <p className="text-gray-400">{filtered.length} ta anime topildi</p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Anime nomini qidiring..."
              className="w-full bg-gray-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-colors ${
              filtersOpen
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-gray-900 border-white/10 text-gray-300 hover:border-white/20'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:block">Filtr</span>
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-gray-900 text-gray-300 hover:text-white text-sm transition-colors"
            >
              <X size={16} />
              <span className="hidden sm:block">Tozalash</span>
            </button>
          )}
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 mb-6 animate-in">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Holat</h4>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setStatus(s.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        status === s.value
                          ? 'bg-red-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Saralash</h4>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSort(s.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        sort === s.value
                          ? 'bg-red-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="mt-5">
              <h4 className="text-white font-semibold text-sm mb-3">Janr</h4>
              <div className="flex flex-wrap gap-2">
                {ALL_GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedGenres.includes(g)
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                    } border`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Search size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-400 text-lg">Hech narsa topilmadi</p>
            <p className="text-gray-600 text-sm mt-1">Boshqa kalit so'z bilan qidiring</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(anime => (
              <AnimeCard key={anime.id} anime={anime} onClick={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
