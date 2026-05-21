import { ArrowDown, Github, ExternalLink } from 'lucide-react';
import { translations, Lang } from '../translations';

interface HeroProps { lang: Lang }

export default function Hero({ lang }: HeroProps) {
  const t = translations[lang].hero;

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {t.since}
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4">
          {t.greeting}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            {t.name}
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 font-light mb-6">
          {t.role}
        </p>

        <p className="max-w-xl mx-auto text-gray-500 text-base leading-relaxed mb-10">
          {t.bio}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollTo('#projects')}
            className="group flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105"
          >
            {t.cta}
            <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="flex items-center gap-2 px-8 py-3 bg-transparent border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:bg-gray-900"
          >
            {t.ctaSecondary}
          </button>
          <a
            href="https://github.com/bjamshid966-debug"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-gray-600 rounded-xl hover:bg-gray-900"
          >
            <Github size={18} />
            GitHub
          </a>
        </div>
      </div>

      <button
        onClick={() => scrollTo('#about')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600 hover:text-cyan-400 transition-colors animate-bounce"
      >
        <ArrowDown size={22} />
      </button>
    </section>
  );
}
