import { Menu, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';

interface NavbarProps {
  onMenuClick: () => void;
  title: string;
}

const langs: { code: Language; label: string }[] = [
  { code: 'uz', label: "O'z" },
  { code: 'ru', label: 'Ru' },
  { code: 'en', label: 'En' },
];

export default function Navbar({ onMenuClick, title }: NavbarProps) {
  const { lang, setLang } = useLanguage();
  return (
    <header className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="text-slate-800 font-semibold text-base">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Globe size={16} className="text-slate-400" />
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          {langs.map(({ code, label }) => (
            <button key={code} onClick={() => setLang(code)}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${lang === code ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
} 
