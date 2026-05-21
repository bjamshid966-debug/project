import { Globe, Layers, Plug } from 'lucide-react';
import { translations, Lang } from '../translations';

interface ServicesProps { lang: Lang }

const ICONS = [Globe, Layers, Plug];

export default function Services({ lang }: ServicesProps) {
  const t = translations[lang].services;

  return (
    <section id="services" className="py-24 bg-gray-950 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14 text-center">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">{t.title}</h2>
          <div className="w-12 h-1 bg-cyan-500 mt-4 rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={item.title}
                className="group relative bg-gray-900/60 border border-gray-800/60 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon size={24} className="text-cyan-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
