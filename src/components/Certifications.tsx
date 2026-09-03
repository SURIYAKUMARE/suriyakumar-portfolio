'use client';

import { motion } from 'framer-motion';
import { Award, Trophy, Sparkles, ExternalLink, CheckCircle, Flame } from 'lucide-react';
import { CertificationItem } from '@/types';
import { sounds } from '@/lib/sound';

interface CertificationsProps {
  certifications: CertificationItem[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Section Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-4">
          <Award className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            03 // CREDENTIALS & HONOURS
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
          Certifications & <span className="text-gradient-accent">Accreditations</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base font-light mt-3 max-w-2xl">
          Industry credentials in Data Analytics, Vector Databases, Artificial Intelligence, and Innovation.
        </p>
      </div>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {certifications.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
            onMouseEnter={() => sounds.playHover()}
            className={`p-6 rounded-3xl glass-card border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
              cert.featuredAward
                ? 'border-amber-400/40 bg-gradient-to-b from-amber-500/10 to-surface-200/80 shadow-[0_10px_35px_rgba(245,158,11,0.15)]'
                : 'border-white/10 hover:border-accent-cyan/40 hover:shadow-[0_10px_30px_rgba(0,240,255,0.12)]'
            }`}
          >
            {/* Top Badge Accent */}
            {cert.featuredAward && (
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-mono text-amber-300 uppercase tracking-widest flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Featured Award
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${
                    cert.featuredAward
                      ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                      : 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                  }`}
                >
                  {cert.featuredAward ? <Trophy className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                </div>

                <span className="text-xs font-mono text-zinc-500">{cert.year}</span>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1.5">
                {cert.category}
              </span>

              <h3
                className={`text-base sm:text-lg font-bold font-display mb-3 transition-colors ${
                  cert.featuredAward
                    ? 'text-amber-200 group-hover:text-amber-400'
                    : 'text-white group-hover:text-accent-cyan'
                }`}
              >
                {cert.title}
              </h3>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">{cert.issuer}</span>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
