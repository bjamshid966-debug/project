import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Anime } from './lib/supabase';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import BrowsePage from './components/BrowsePage';
import TopPage from './components/TopPage';
import AnimeDetail from './components/AnimeDetail';

type Page = 'home' | 'browse' | 'top';

export default function App() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  useEffect(() => {
    loadAnime();
  }, []);

  const loadAnime = async () => {
    const { data } = await supabase.from('anime').select('*').order('rating', { ascending: false });
    if (data) setAnimeList(data);
    setLoading(false);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage('browse');
  };

  const handleNavigate = (p: string) => {
    setPage(p as Page);
    if (p !== 'browse') setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-red-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-400 text-sm animate-pulse">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <Navbar
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        currentPage={page}
      />

      {page === 'home' && (
        <HomePage
          animeList={animeList}
          onSelect={handleSelectAnime}
          onNavigate={handleNavigate}
        />
      )}

      {page === 'browse' && (
        <BrowsePage
          animeList={animeList}
          searchQuery={searchQuery}
          onSelect={handleSelectAnime}
        />
      )}

      {page === 'top' && (
        <TopPage
          animeList={animeList}
          onSelect={handleSelectAnime}
        />
      )}

      {selectedAnime && (
        <AnimeDetail
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </div>
  );
}
