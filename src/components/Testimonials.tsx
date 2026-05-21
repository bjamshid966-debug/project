import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { translations, Lang } from '../translations';

interface TestimonialsProps { lang: Lang }

const TESTIMONIALS = [
  {
    name: 'Alisher T.',
    role: 'Startup Founder',
    text: 'Bjamshid delivered a flawless e-commerce platform ahead of schedule. The code quality and attention to detail exceeded expectations.',
    avatar: 'AT',
  },
  {
    name: 'Kamola R.',
    role: 'Product Manager',
    text: 'Outstanding frontend work. Our web app load times dropped by 40% after the refactor. Professional, communicative, and technically superb.',
    avatar: 'KR',
  },
  {
    name: 'Dilshod M.',
    role: 'Agency Director',
    text: 'We bring Bjamshid in for our most complex projects. Consistently delivers pixel-perfect, responsive interfaces on time.',
    avatar: 'DM',
  },
];

export default function Testimonials({ lang }: TestimonialsProps) {
  const t = translations[lang].testimonials;
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? TESTIMONIALS.length - 1 : a - 1));
  const next = () => setActive((a) => (a === TESTIMONIALS.length - 1 ? 0 : a + 1));

  const item = TESTIMONIALS[active];

  return (
    <section id="testimonials" className="py-24 bg-gray-900/40 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-14 text-center">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">{t.title}</h2>
          <div className="w-12 h-1 bg-cyan-500 mt-4 rounded-full mx-auto" />
        </div>

        <div className="relative bg-gray-900/70 border border-gray-800/70 rounded-2xl p-8 md:p-12">
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-cyan-400 fill-cyan-400" />
            ))}
          </div>

          <blockquote className="text-gray-300 text-lg leading-relaxed mb-8">
            "{item.text}"
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
              {item.avatar}
            </div>
            <div>
              <p className="text-white font-bold">{item.name}</p>
              <p className="text-gray-500 text-sm">{item.role}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl border border-gray-700 hover:border-cyan-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-xl border border-gray-700 hover:border-cyan-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <ChevronRight size={18} />
            </button>
            <div className="flex items-center gap-2 ml-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-200 ${i === active ? 'w-6 h-2 bg-cyan-500' : 'w-2 h-2 bg-gray-700 hover:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
