'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowDownRight,
  Sparkles,
  Terminal,
  Database,
  Cpu,
  Mail,
  ArrowUpRight,
  Zap,
  Layers,
} from 'lucide-react';
import { sounds } from '@/lib/sound';

interface HeroProps {
  name?: string;
  title?: string;
  subtitle?: string;
  photo?: string;
}

export default function Hero({
  name = 'Suriyakumar E',
  title = 'Data Analytics | AI & ML Engineering Student',
  subtitle = 'Transforming raw data into predictive intelligence and architecting forward-thinking AI & ML solutions.',
  photo = '/images/suriyakumar-portrait.jpg',
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const magneticButtonRef = useRef<HTMLAnchorElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);
  const yParallax = useTransform(scrollY, [0, 500], [0, 120]);

  // Magnetic button physics for desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!magneticButtonRef.current || typeof window === 'undefined' || window.innerWidth < 1024) return;
    const rect = magneticButtonRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setBtnPos({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
  };

  // Group letters by words so words never break mid-spelling on mobile
  const words = name.split(' ');
  const subtitleWords = subtitle.split(' ');

  return (
    <section
      ref={containerRef}
      className="relative min-h-[94vh] sm:min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 overflow-hidden select-none"
    >
      {/* Radiant Cosmic Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[14%] left-[16%] w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-accent-cyan/15 blur-[150px] animate-blob-float-1" />
        <div className="absolute top-[38%] right-[12%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-emerald-500/12 blur-[150px] animate-blob-float-2" />
        <div className="absolute -bottom-[12%] left-[30%] w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] rounded-full bg-sky-900/20 blur-[170px] animate-blob-float-3" />
        {/* Subtle grid radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      {/* Hero Content Area */}
      <motion.div
        style={{ opacity, y: yParallax }}
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center w-full"
      >
        {/* Top Floating Badge with Profile Avatar & Glowing Halo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative inline-flex items-center gap-2.5 sm:gap-3 px-4 py-2 rounded-full glass-panel border border-accent-cyan/30 bg-[#0a0e17]/80 mb-6 sm:mb-8 shadow-[0_0_30px_rgba(0,240,255,0.2)] max-w-[95%] backdrop-blur-xl group cursor-pointer"
        >
          {/* Pulsing Avatar Halo */}
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-accent-cyan shadow-[0_0_15px_rgba(0,240,255,0.6)] shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover object-top"
            />
          </div>

          <span className="text-[10px] sm:text-xs font-mono tracking-wider sm:tracking-widest text-zinc-200 uppercase truncate">
            {title}
          </span>

          <div className="flex items-center gap-1.5 pl-1 border-l border-white/10 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:inline-block">LIVE</span>
          </div>
        </motion.div>

        {/* Massive Kinetic Typography (Magnetic & Radiant) */}
        <h1 className="relative flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-6 md:gap-x-8 mb-6 font-display font-extrabold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase text-white leading-none">
          {/* Subtle Ambient Behind Title Glow */}
          <span className="absolute -inset-x-12 -inset-y-6 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/10 to-transparent blur-3xl -z-10 pointer-events-none" />

          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-flex whitespace-nowrap">
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  initial={{ opacity: 0, y: 65, rotateX: -60 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.15 + (wordIndex * 6 + charIndex) * 0.035,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  whileHover={{
                    scale: 1.14,
                    color: '#00f0ff',
                    textShadow: '0 0 25px rgba(0,240,255,0.8)',
                    transition: { duration: 0.15 },
                  }}
                  className="inline-block transition-all cursor-default"
                  onMouseEnter={() => sounds.playHover()}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Word-by-Word Reveal Subtitle with High Contrast */}
        <p className="max-w-2xl text-xs sm:text-base md:text-lg lg:text-xl text-zinc-300 font-light leading-relaxed mb-8 sm:mb-10 flex flex-wrap justify-center gap-x-1 sm:gap-x-1.5 px-2">
          {subtitleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.4 + i * 0.03,
                ease: 'easeOut',
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* CTA Buttons (Magnetic with Glowing Accents) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto px-4 sm:px-0"
        >
          {/* Main Primary CTA with Electric Cyan Aura */}
          <motion.a
            ref={magneticButtonRef}
            href="#about"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: btnPos.x, y: btnPos.y }}
            transition={{ type: 'spring', damping: 15, stiffness: 180 }}
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_35px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] active:scale-95"
            data-cursor="pointer"
          >
            <span>Explore Portfolio</span>
            <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 text-black" />
          </motion.a>

          {/* Secondary CTA */}
          <a
            href="#contact"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full glass-panel border border-white/20 text-zinc-200 hover:text-white hover:border-accent-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] text-xs font-medium uppercase tracking-widest transition-all duration-300 active:scale-95"
            data-cursor="pointer"
          >
            <Mail className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Connect Directly</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Floating Micro-Details Strip at Bottom */}
      <div className="w-full max-w-5xl mx-auto mt-12 sm:mt-16 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-zinc-400 font-mono text-[11px] px-2">
        <div className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan shrink-0">
            <Terminal className="w-3 h-3" />
          </div>
          <span className="truncate group-hover:text-white transition-colors">Python • SQL • C++</span>
        </div>

        <div className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Database className="w-3 h-3" />
          </div>
          <span className="truncate group-hover:text-white transition-colors">Pandas • Power BI</span>
        </div>

        <div className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan shrink-0">
            <Cpu className="w-3 h-3" />
          </div>
          <span className="truncate group-hover:text-white transition-colors">AI & ML Engineering</span>
        </div>

        <div className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
            <Zap className="w-3 h-3 text-accent-cyan" />
          </div>
          <span className="text-zinc-300 truncate group-hover:text-accent-cyan transition-colors">Rathinam Tech Campus</span>
        </div>
      </div>
    </section>
  );
}
