import { translations, Lang } from '../translations';

interface ExperienceProps { lang: Lang }

const TIMELINE = [
  {
    year: '2024 — Present',
    role: 'Frontend Developer',
    company: 'Freelance',
    desc: 'Building custom web applications for clients across e-commerce, SaaS, and media. Specializing in React and Next.js.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    year: '2023',
    role: 'Junior Frontend Developer',
    company: 'Tech Startup',
    desc: 'Developed and maintained responsive UI components for a SaaS platform. Collaborated in agile sprints.',
    tags: ['React', 'JavaScript', 'CSS3'],
  },
  {
    year: '2022',
    role: 'Frontend Intern',
    company: 'Web Agency',
    desc: 'Converted Figma designs into pixel-perfect HTML/CSS pages. Learned industry best practices and Git workflows.',
    tags: ['HTML', 'CSS', 'Git'],
  },
  {
    year: '2009',
    role: 'Started Coding',
    company: 'Self-taught',
    desc: 'Began the journey — exploring web fundamentals, building personal projects, and falling in love with the craft.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
];

export default function Experience({ lang }: ExperienceProps) {
  const t = translations[lang].experience;

  return (
    <section id="experience" className="py-24 bg-gray-900/40 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">{t.title}</h2>
          <div className="w-12 h-1 bg-cyan-500 mt-4 rounded-full" />
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gray-800" />

          <div className="flex flex-col gap-10">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className={`relative flex flex-col md:flex-row gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-500 border-2 border-gray-950 z-10 top-3" />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-gray-900/70 border border-gray-800/70 rounded-2xl p-6 hover:border-cyan-500/20 transition-all duration-300 group">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">{item.year}</span>
                    <h3 className="text-white font-bold text-lg mt-1">{item.role}</h3>
                    <p className="text-gray-500 text-sm font-medium mb-3">{item.company}</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs text-gray-500 bg-gray-800/60 rounded-md border border-gray-700/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
