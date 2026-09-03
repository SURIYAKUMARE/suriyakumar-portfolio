'use client';

import { motion } from 'framer-motion';
import { Award, Sparkles, ExternalLink, ShieldCheck, Trophy } from 'lucide-react';
import { CertificationItem } from '@/types';
import { sounds } from '@/lib/sound';

interface CertificationsProps {
  certifications: CertificationItem[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Section Glow */}
      <div className="absolute top-1/3 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-3 sm:mb-4">
          <Award className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
            03 // ACCREDITATIONS & HONOURS
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
          Certifications & <span className="text-gradient-accent">Awards</span>
        </h2>
      </div>

      {/* Responsive Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {certifications.map((item, idx) => {
          const isFeatured = item.featuredAward;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onMouseEnter={() => sounds.playHover()}
              className={`p-5 sm:p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                isFeatured
                  ? 'glass-card border-2 border-amber-400/40 bg-gradient-to-b from-amber-500/10 via-surface-100 to-surface-200 shadow-[0_10px_35px_rgba(251,191,36,0.15)]'
                  : 'glass-card border border-white/10 hover:border-accent-cyan/50 shadow-xl'
              }`}
            >
              {/* Corner Glow on Hover */}
              <div
                className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-[40px] pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                  isFeatured ? 'bg-amber-400/30' : 'bg-accent-cyan/20'
                }`}
              />

              <div>
                {/* Top Badge: Category & Year */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isFeatured
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold'
                        : 'bg-white/5 text-zinc-400 border border-white/10'
                    }`}
                  >
                    {item.category}
                  </span>

                  <span className="text-[11px] font-mono text-zinc-400">{item.year}</span>
                </div>

                {/* Icon */}
                <div className="mb-4">
                  {isFeatured ? (
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                      <Trophy className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Certification Title */}
                <h3 className="font-sans font-bold text-sm sm:text-base text-white group-hover:text-accent-cyan transition-colors line-clamp-2 leading-snug mb-2">
                  {item.title}
                </h3>
              </div>

              {/* Issuer & Verification */}
              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px] truncate mr-2">
                  {item.issuer}
                </span>

                <span
                  className={`shrink-0 flex items-center gap-1 font-mono text-[10px] ${
                    isFeatured ? 'text-amber-300 font-bold' : 'text-emerald-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFeatured ? 'bg-amber-400' : 'bg-emerald-400'
                    } animate-pulse`}
                  />
                  <span>Verified</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
