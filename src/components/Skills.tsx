import { translations, Lang } from '../translations';

interface SkillsProps { lang: Lang }

const SKILLS = [
  { name: 'React', level: 90, color: '#06b6d4' },
  { name: 'Next.js', level: 82, color: '#06b6d4' },
  { name: 'TypeScript', level: 78, color: '#06b6d4' },
  { name: 'Tailwind CSS', level: 92, color: '#14b8a6' },
  { name: 'JavaScript', level: 88, color: '#06b6d4' },
  { name: 'HTML / CSS', level: 95, color: '#14b8a6' },
  { name: 'Git & GitHub', level: 80, color: '#06b6d4' },
  { name: 'REST APIs', level: 75, color: '#14b8a6' },
];

const TAGS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS',
  'HTML5', 'CSS3', 'Git', 'GitHub', 'Vite', 'REST API', 'Responsive Design',
  'Figma', 'VS Code', 'npm', 'Vercel',
];

export default function Skills({ lang }: SkillsProps) {
  const t = translations[lang].skills;

  return (
    <section id="skills" className="py-24 bg-gray-900/40 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">{t.title}</h2>
          <div className="w-12 h-1 bg-cyan-500 mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {SKILLS.map((s) => (
            <div key={s.name} className="group">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 text-sm font-semibold">{s.name}</span>
                <span className="text-cyan-400 text-sm font-bold">{s.level}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-cyan-500 to-teal-400"
                  style={{ width: `${s.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs font-semibold text-gray-400 bg-gray-900/80 border border-gray-800/80 rounded-lg hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-200 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
