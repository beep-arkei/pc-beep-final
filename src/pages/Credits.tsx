import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Code, Palette, Zap } from 'lucide-react';

export const Credits: React.FC = () => {
  const contributors = [
    { name: 'Ryan Kaito Beppu', role: 'Lead Developer & Designer', icon: <Code size={24} /> },
    { name: 'PC Beep Team', role: 'Product & Inventory Management', icon: <Zap size={24} /> },
  ];

  const techStack = [
    { name: 'React 19', desc: 'Frontend Framework' },
    { name: 'Vite', desc: 'Build Tool' },
    { name: 'Tailwind CSS 4', desc: 'Styling Engine' },
    { name: 'Zustand', desc: 'State Management' },
    { name: 'Framer Motion', desc: 'Animations' },
    { name: 'Lucide React', desc: 'Icon Library' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-black text-navy uppercase tracking-tighter mb-4">
          PROJECT <span className="text-cyan">CREDITS</span>
        </h1>
        <p className="text-slate-500 font-medium">The team and technology behind PC Beep Philippines.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        <section>
          <h2 className="text-xl font-black text-navy uppercase tracking-tight mb-8 flex items-center gap-2">
            <Heart className="text-cyan" size={20} /> CONTRIBUTORS
          </h2>
          <div className="space-y-6">
            {contributors.map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-cyan">
                  {c.icon}
                </div>
                <div>
                  <div className="font-bold text-navy">{c.name}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black text-navy uppercase tracking-tight mb-8 flex items-center gap-2">
            <Palette className="text-cyan" size={20} /> TECH STACK
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {techStack.map((t, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="font-bold text-navy text-sm">{t.name}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-navy rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Special Thanks</h3>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            To the Philippine gaming community for the constant inspiration and feedback that helps us build the best PC assembly platform in the country.
          </p>
        </div>
      </div>
    </div>
  );
};
