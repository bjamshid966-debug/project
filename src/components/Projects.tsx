import { Github, ExternalLink } from 'lucide-react';
import { translations, Lang } from '../translations';

interface ProjectsProps { lang: Lang }

const PROJECTS = [
  {
    title: 'E-Commerce Platform',
    desc: 'Full-featured online store with cart, auth, and payment integration. Built with React, TypeScript, and REST APIs.',
    tech: ['React', 'TypeScript', 'Tailwind', 'REST API'],
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
    github: 'https://github.com/bjamshid966-debug',
    live: '#',
    featured: true,
  },
  {
    title: 'Task Manager App',
    desc: 'Kanban-style productivity app with drag-and-drop, real-time updates, and team collaboration.',
    tech: ['React', 'Next.js', 'Tailwind'],
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
    github: 'https://github.com/bjamshid966-debug',
    live: '#',
    featured: true,
  },
  {
    title: 'Weather Dashboard',
    desc: 'Real-time weather app with geolocation, 7-day forecasts, and beautiful animated conditions.',
    tech: ['React', 'TypeScript', 'API'],
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=600',
    github: 'https://github.com/bjamshid966-debug',
    live: '#',
    featured: false,
  },
  {
    title: 'Blog CMS',
    desc: 'Content management system with markdown support, SEO optimization, and responsive layout.',
    tech: ['Next.js', 'Tailwind', 'TypeScript'],
    image: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=600',
    github: 'https://github.com/bjamshid966-debug',
    live: '#',
    featured: false,
  },
  {
    title: 'Portfolio V1',
    desc: 'My first portfolio website — clean, minimal, fast. Showcases early projects and skills.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    github: 'https://github.com/bjamshid966-debug',
    live: '#',
    featured: false,
  },
  {
    title: 'UI Component Library',
    desc: 'Reusable React component library with Storybook documentation and full TypeScript support.',
    tech: ['React', 'Storybook', 'Tailwind'],
    image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600',
    github: 'https://github.com/bjamshid966-debug',
    live: '#',
    featured: false,
  },
];

export default function Projects({ lang }: ProjectsProps) {
  const t = translations[lang].projects;

  return (
    <section id="projects" className="py-24 bg-gray-950 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">{t.title}</h2>
          <div className="w-12 h-1 bg-cyan-500 mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <div
              key={p.title}
              className="group relative bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1"
            >
              {p.featured && (
                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-cyan-500 text-gray-950 text-xs font-bold rounded-md">
                  Featured
                </div>
              )}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>

              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-semibold"
                  >
                    <Github size={14} />
                    {t.viewCode}
                  </a>
                  <a
                    href={p.live}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors font-semibold"
                  >
                    <ExternalLink size={14} />
                    {t.viewLive}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://github.com/bjamshid966-debug"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-cyan-500/40 text-gray-400 hover:text-white rounded-xl transition-all duration-200 text-sm font-semibold hover:bg-gray-900"
          >
            <Github size={16} />
            View all on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
