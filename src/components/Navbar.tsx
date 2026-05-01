import { useState, useEffect } from 'react';
import { Search, Menu, X, Tv2 } from 'lucide-react';

interface NavbarProps {
  onSearch: (q: string) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onSearch, onNavigate, currentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    onNavigate('browse');
  };

  const navLinks = [
    { id: 'home', label: 'Bosh sahifa' },
    { id: 'browse', label: 'Anime' },
    { id: 'top', label: 'Top reytingli' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-gray-950/95 backdrop-blur-md shadow-2xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tv2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Ani<span className="text-red-500">me</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === link.id
                    ? 'text-red-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Anime qidirish..."
                className="bg-white/10 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-white/15 transition-all w-52"
              />
            </div>
          </form>

          {/* Mobile menu btn */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-950/98 backdrop-blur-md border-t border-white/5 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Anime qidirish..."
                className="w-full bg-white/10 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
              />
            </div>
          </form>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === link.id
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
