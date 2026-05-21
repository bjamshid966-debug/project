import { Github, Code2 } from 'lucide-react';
import { translations, Lang } from '../translations';

interface FooterProps { lang: Lang }

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang].footer;
  const nav = translations[lang].nav;

  const links = [
    { href: '#about', label: nav.about },
    { href: '#skills', label: nav.skills },
    { href: '#projects', label: nav.projects },
    { href: '#contact', label: nav.contact },
  ];

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-gray-950 border-t border-gray-800/60 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Code2 size={16} className="text-cyan-400" />
            </div>
            <span className="font-bold text-white text-lg">BJ<span className="text-cyan-400">.</span></span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-gray-500 hover:text-cyan-400 text-sm transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <a
            href="https://github.com/bjamshid966-debug"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>

        <div className="border-t border-gray-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Bjamshid. {t.rights}
          </p>
          <p className="text-gray-700 text-xs">{t.built}</p>
        </div>
      </div>
    </footer>
  );
}
