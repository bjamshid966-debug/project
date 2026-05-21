import { Github, Calendar, MapPin, Briefcase } from 'lucide-react';
import { translations, Lang } from '../translations';

interface AboutProps { lang: Lang }

export default function About({ lang }: AboutProps) {
  const t = translations[lang].about;

  return (
    <section id="about" className="py-24 bg-gray-950 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">{t.title}</h2>
          <div className="w-12 h-1 bg-cyan-500 mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-400 leading-relaxed mb-5">{t.p1}</p>
            <p className="text-gray-400 leading-relaxed mb-8">{t.p2}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Calendar, label: '2009', sub: 'Started coding' },
                { icon: Briefcase, label: '2+ Years', sub: 'Professional XP' },
                { icon: MapPin, label: 'Uzbekistan', sub: 'Based in' },
                { icon: Github, label: '10+ Repos', sub: 'On GitHub' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-gray-900/60 border border-gray-800/60 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{label}</p>
                    <p className="text-gray-500 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://github.com/bjamshid966-debug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white rounded-xl transition-all duration-200 hover:bg-gray-900 text-sm font-semibold"
            >
              <Github size={16} className="text-cyan-400" />
              {t.github}
            </a>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/20" />
              <img
                src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Developer workspace"
                className="w-full h-full object-cover rounded-2xl opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-gray-950/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-bold text-lg">Bjamshid</p>
                <p className="text-cyan-400 text-sm">Frontend Developer</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
