import { useState } from 'react';
import { Send, Mail, Github, CheckCircle } from 'lucide-react';
import { translations, Lang } from '../translations';

interface ContactProps { lang: Lang }

export default function Contact({ lang }: ContactProps) {
  const t = translations[lang].contact;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 bg-gray-950 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14 text-center">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2">{t.subtitle}</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">{t.title}</h2>
          <div className="w-12 h-1 bg-cyan-500 mt-4 rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-gray-400 leading-relaxed mb-8">
              Have a project in mind or want to collaborate? I'm always open to new opportunities. Reach out and let's build something great together.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:bjamshid@example.com"
                className="flex items-center gap-4 p-4 bg-gray-900/60 border border-gray-800/60 rounded-xl hover:border-cyan-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <Mail size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Email</p>
                  <p className="text-gray-500 text-xs">bjamshid@example.com</p>
                </div>
              </a>
              <a
                href="https://github.com/bjamshid966-debug"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-900/60 border border-gray-800/60 rounded-xl hover:border-cyan-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <Github size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">GitHub</p>
                  <p className="text-gray-500 text-xs">github.com/bjamshid966-debug</p>
                </div>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={t.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-gray-900/60 border border-gray-800/60 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <input
              type="email"
              placeholder={t.email}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-gray-900/60 border border-gray-800/60 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <textarea
              rows={5}
              placeholder={t.message}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="w-full bg-gray-900/60 border border-gray-800/60 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
            >
              {sent ? (
                <>
                  <CheckCircle size={18} />
                  {t.sent}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t.send}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
