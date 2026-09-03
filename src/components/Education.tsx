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
    <section id="education" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Section Glow */}
      <div className="absolute top-1/2 right-0 w-72 sm:w-80 h-72 sm:h-80 bg-accent-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-3 sm:mb-4">
          <GraduationCap className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
            02 // ACADEMIC FOUNDATION
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
          Education & <span className="text-gradient-accent">Specialization</span>
        </h2>
      </div>

      {/* Vertical Animated Timeline with Glowing Energy Stream */}
      <div className="relative ml-3 sm:ml-8 space-y-8 sm:space-y-12 pl-5 sm:pl-8">
        {/* The Animated Line */}
        <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-gradient-to-b from-accent-cyan via-emerald-400 to-transparent opacity-40" />
        <div className="absolute left-[-1px] top-3 w-1 h-20 bg-accent-cyan rounded-full blur-[2px] animate-pulse" />

        {education.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            onMouseEnter={() => sounds.playHover()}
            className="relative group"
          >
            {/* Timeline Glowing Node Marker (Centered on line) */}
            <div className="absolute -left-[30px] sm:-left-[42px] top-1.5 w-5 h-5 rounded-full bg-[#0a0e17] border-2 border-accent-cyan flex items-center justify-center shadow-[0_0_18px_rgba(0,240,255,0.9)] group-hover:scale-125 transition-transform duration-300 z-10">
              <div className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
            </div>

            {/* Timeline Card */}
            <div className="p-5 sm:p-8 rounded-3xl glass-card border border-white/10 hover:border-accent-cyan/60 hover:shadow-[0_10px_35px_rgba(0,240,255,0.15)] transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                <div>
                  <h3 className="text-lg sm:text-2xl font-display font-bold text-white group-hover:text-accent-cyan transition-colors leading-snug">
                    {item.degree}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-300 font-medium mt-1">
                    <span>{item.institution}</span>
                    <span className="text-zinc-600 hidden xs:inline">•</span>
                    <span className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-400 font-mono">
                      <MapPin className="w-3 h-3 text-accent-cyan shrink-0" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-white/10 text-[11px] font-mono text-accent-cyan shrink-0 self-start sm:self-auto">
                  <Calendar className="w-3 h-3" />
                  <span>{item.period}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-4">
                {item.description}
              </p>

              {item.highlights && (
                <div className="space-y-2 pt-3 border-t border-white/5">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-400 font-light">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />
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
