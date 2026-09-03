'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Trophy,
  X,
  Eye,
  CheckCircle2,
  Download,
  Maximize2,
} from 'lucide-react';
import { CertificationItem } from '@/types';
import { sounds } from '@/lib/sound';

interface CertificationsProps {
  certifications: CertificationItem[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  const openCertificate = (item: CertificationItem) => {
    sounds.playClick();
    setSelectedCert(item);
  };

  const closeCertificate = () => {
    sounds.playClick();
    setSelectedCert(null);
  };

  return (
    <section id="certifications" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Section Glow */}
      <div className="absolute top-1/3 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 mb-3 sm:mb-4 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
          <Award className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-300 uppercase font-semibold">
            03 // ACCREDITATIONS & HONOURS
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white mb-2">
          Certifications & <span className="text-gradient-accent">Awards</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-mono">
          Click any certificate card below to view its credential photo & verification details.
        </p>
      </div>

      {/* Responsive Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {certifications.map((item, idx) => {
          const isFeatured = item.featuredAward;

          return (
            <motion.div
              key={item.id}
              onClick={() => openCertificate(item)}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onMouseEnter={() => sounds.playHover()}
              className={`p-5 sm:p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden cursor-pointer ${
                isFeatured
                  ? 'glass-card border-2 border-amber-400/50 bg-gradient-to-b from-amber-500/15 via-[#0d131f] to-[#0a0e17] shadow-[0_0_35px_rgba(251,191,36,0.25)] hover:border-amber-300'
                  : 'glass-card border border-white/10 hover:border-accent-cyan/60 hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)]'
              }`}
            >
              {/* Corner Glow */}
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[45px] pointer-events-none transition-opacity duration-300 ${
                  isFeatured ? 'bg-amber-400/35 opacity-100' : 'bg-accent-cyan/20 opacity-0 group-hover:opacity-100'
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

                {/* Icon & Hover View Action */}
                <div className="flex items-center justify-between mb-4">
                  {isFeatured ? (
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                      <Trophy className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}

                  {/* "Click to View" Pill */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/10 text-zinc-200 backdrop-blur-md">
                    <Eye className="w-3 h-3 text-accent-cyan" />
                    <span>View Photo</span>
                  </span>
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

      {/* ========================================================================= */}
      {/* CERTIFICATE PHOTO LIGHTBOX MODAL                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCertificate}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 25 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl glass-card border border-white/20 bg-[#07090e] shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0d131f]/90">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedCert.featuredAward
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                    }`}
                  >
                    {selectedCert.featuredAward ? <Trophy className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white font-serif line-clamp-1">
                      {selectedCert.title}
                    </h4>
                    <p className="text-[11px] font-mono text-zinc-400">
                      {selectedCert.issuer} • {selectedCert.year} • {selectedCert.category}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCertificate}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Photo Display Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center bg-[#07080a]">
                <div className="relative w-full max-w-2xl aspect-[16/11] rounded-2xl overflow-hidden glass-panel border-2 border-white/20 shadow-2xl group">
                  {selectedCert.imageUrl ? (
                    <Image
                      src={selectedCert.imageUrl}
                      alt={selectedCert.title}
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  ) : (
                    /* Fallback Stylized Official Document Frame */
                    <div className="w-full h-full bg-[#0a0e17] p-8 flex flex-col justify-between border-4 border-accent-cyan/30 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1),transparent_70%)]" />
                      <div className="relative z-10 flex justify-between items-center text-xs font-mono text-zinc-400">
                        <span>CERTIFICATE ID: VERIFIED-SE-{selectedCert.year}</span>
                        <span className="text-emerald-400">● OFFICIAL CREDENTIAL</span>
                      </div>

                      <div className="relative z-10 my-auto py-6">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                          This is to certify that
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-2 tracking-wide">
                          SURIYAKUMAR E
                        </h2>
                        <div className="w-32 h-[1px] bg-accent-cyan mx-auto my-3" />
                        <p className="text-xs sm:text-base text-zinc-300 font-light max-w-lg mx-auto">
                          has successfully demonstrated certified competence and proficiency in
                        </p>
                        <h3 className="text-lg sm:text-xl font-bold text-accent-cyan mt-2">
                          {selectedCert.title}
                        </h3>
                        <p className="text-xs font-mono text-zinc-400 mt-1">
                          Conferred by {selectedCert.issuer}
                        </p>
                      </div>

                      <div className="relative z-10 flex justify-between items-end pt-4 border-t border-white/10 text-[10px] font-mono text-zinc-400">
                        <div>
                          <span>STATUS: ACCREDITED</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-amber-400/60 bg-amber-400/10 flex items-center justify-center text-amber-300 font-bold">
                          SEAL
                        </div>
                        <div>
                          <span>YEAR: {selectedCert.year}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gradient Frame Overlay */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-2xl" />
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d131f]/90">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authenticated Credential • Suriyakumar E Portfolio</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedCert.imageUrl && (
                    <a
                      href={selectedCert.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Full Res</span>
                    </a>
                  )}

                  <button
                    onClick={closeCertificate}
                    className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
