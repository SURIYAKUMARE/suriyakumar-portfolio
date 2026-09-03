'use client';

import { motion } from 'framer-motion';
import { Award, Briefcase, Calendar, Sparkles, Star } from 'lucide-react';
import { sounds } from '@/lib/sound';

export default function Experience() {
  const experiences = [
    {
      period: '2024 — Present',
      role: 'Staff Creative Technologist',
      company: 'Aetheria Interactive',
      location: 'Remote // San Francisco',
      description:
        'Directing digital experiences and GPU-accelerated design systems for high-growth tech companies. Mentoring creative developers in WebGL shaders and state synchronization.',
      tags: ['WebGL', 'Next.js', 'Creative Direction', 'Performance Tuning'],
    },
    {
      period: '2022 — 2024',
      role: 'Lead Frontend Architect',
      company: 'Krypton Protocol Labs',
      location: 'Bangalore, IN',
      description:
        'Architected real-time institutional analytics dashboards streaming 25k+ financial events per second with sub-12ms latency and buttery-smooth canvas visualizations.',
      tags: ['TypeScript', 'D3.js', 'WebSockets', 'Design Systems'],
    },
    {
      period: '2020 — 2022',
      role: 'Senior Interaction Designer & Dev',
      company: 'Monoform Digital Studio',
      location: 'Bangalore, IN',
      description:
        'Collaborated with international luxury and fashion brands to craft award-winning editorial web experiences, custom kinetic fonts, and fluid interactive physics.',
      tags: ['GSAP', 'Framer Motion', 'Editorial Web', 'Three.js'],
    },
  ];

  const awards = [
    { name: 'Site of the Day (2x)', issuer: 'Awwwards', year: '2025' },
    { name: 'Developer Award', issuer: 'Awwwards', year: '2025' },
    { name: 'FWA of the Day', issuer: 'The FWA', year: '2024' },
    { name: 'Special Kudos & Best UI', issuer: 'CSS Design Awards', year: '2024' },
  ];

  return (
    <section id="experience" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-4">
          <Briefcase className="w-3 h-3 text-accent-violet" />
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            03 // TRAJECTORY & RECOGNITION
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
          Experience & <span className="text-gradient-accent">Accolades</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Timeline Column */}
        <div className="lg:col-span-8 space-y-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onMouseEnter={() => sounds.playHover()}
              className="p-8 rounded-3xl glass-card border border-white/10 hover:border-accent-violet/30 transition-all duration-300 relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-accent-violet transition-colors">
                    {exp.role}
                  </h3>
                  <p className="text-sm font-medium text-zinc-400">
                    {exp.company} • <span className="text-zinc-500 font-mono text-xs">{exp.location}</span>
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 self-start sm:self-auto">
                  <Calendar className="w-3 h-3 text-accent-cyan" />
                  {exp.period}
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed font-light mb-6">
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-zinc-400 bg-white/5 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Awards Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-8 rounded-3xl glass-card border border-white/10">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-display font-bold text-white">Honors & Recognition</h3>
            </div>

            <div className="space-y-4">
              {awards.map((award, i) => (
                <div
                  key={i}
                  onMouseEnter={() => sounds.playHover()}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-white">{award.name}</span>
                    <span className="text-xs font-mono text-amber-400">{award.year}</span>
                  </div>
                  <span className="text-xs text-zinc-400 block">{award.issuer}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-zinc-400 font-light mb-2">
                Evaluated for design innovation, usability, performance, and interaction fluidity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
