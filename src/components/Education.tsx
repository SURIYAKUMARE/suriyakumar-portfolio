'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { EducationItem } from '@/types';
import { sounds } from '@/lib/sound';

interface EducationProps {
  education: EducationItem[];
}

export default function Education({ education }: EducationProps) {
  return (
    <section id="education" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Section Glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-4">
          <GraduationCap className="w-3 h-3 text-accent-cyan" />
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            02 // ACADEMIC FOUNDATION
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
          Education & <span className="text-gradient-accent">Specialization</span>
        </h2>
      </div>

      {/* Vertical Animated Timeline */}
      <div className="relative border-l border-white/10 ml-4 sm:ml-8 space-y-12 pl-6 sm:pl-10">
        {education.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            onMouseEnter={() => sounds.playHover()}
            className="relative group"
          >
            {/* Timeline Glowing Node Marker */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-[#07080a] border-2 border-accent-cyan flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.6)] group-hover:scale-125 transition-transform duration-300">
              <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            </div>

            {/* Timeline Card */}
            <div className="p-7 sm:p-9 rounded-3xl glass-card border border-white/10 hover:border-accent-cyan/40 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-accent-cyan transition-colors">
                    {item.degree}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium mt-1">
                    <span>{item.institution}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                      <MapPin className="w-3 h-3 text-accent-cyan" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>{item.period}</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-6">
                {item.description}
              </p>

              {item.highlights && item.highlights.length > 0 && (
                <div className="pt-4 border-t border-white/5 space-y-2">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
