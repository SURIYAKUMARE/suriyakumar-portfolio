'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, Sparkles, Terminal, Database, Cpu, Mail } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface HeroProps {
  name?: string;
  title?: string;
  subtitle?: string;
}

export default function Hero({
  name = 'Suriyakumar E',
  title = 'Data Analytics | AI & ML Engineering Student',
  subtitle = 'Transforming raw data into predictive intelligence and architecting forward-thinking AI & ML solutions.',
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const magneticButtonRef = useRef<HTMLAnchorElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);
  const yParallax = useTransform(scrollY, [0, 500], [0, 140]);

  // Magnetic button physics
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!magneticButtonRef.current) return;
    const rect = magneticButtonRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setBtnPos({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
  };

  // Kinetic letters animation split
  const letters = name.split('');
  const subtitleWords = subtitle.split(' ');

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden select-none"
    >
      {/* Drifting Soft Mesh Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[18%] left-[22%] w-[500px] h-[500px] rounded-full bg-accent-cyan/15 blur-[140px] animate-blob-float-1" />
        <div className="absolute top-[42%] right-[16%] w-[450px] h-[450px] rounded-full bg-emerald-500/12 blur-[140px] animate-blob-float-2" />
        <div className="absolute -bottom-[10%] left-[36%] w-[550px] h-[550px] rounded-full bg-sky-900/15 blur-[160px] animate-blob-float-3" />
      </div>

      {/* Hero Content Area */}
      <motion.div
        style={{ opacity, y: yParallax }}
        className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center"
      >
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-white/10 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-spin-slow" />
          <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
            {title}
          </span>
        </motion.div>

        {/* Massive Kinetic Typography */}
        <h1 className="flex flex-wrap justify-center items-center gap-x-2 md:gap-x-4 mb-6 font-display font-extrabold tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase text-white leading-none">
          {letters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 70, rotateX: -60 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.15 + index * 0.04,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              whileHover={{
                scale: 1.1,
                color: '#00f0ff',
                transition: { duration: 0.2 },
              }}
              className="inline-block transition-colors cursor-default"
              onMouseEnter={() => sounds.playHover()}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        {/* Word-by-Word Reveal Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-10 flex flex-wrap justify-center gap-x-1.5">
          {subtitleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5 + i * 0.035,
                ease: 'easeOut',
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* Magnetic CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          {/* Main Magnetic Button */}
          <motion.a
            ref={magneticButtonRef}
            href="#projects"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: btnPos.x, y: btnPos.y }}
            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="magnetic-btn group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm tracking-wider uppercase transition-shadow duration-300 shadow-[0_0_35px_rgba(0,240,255,0.35)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>View My Work</span>
              <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </motion.a>

          {/* Secondary Outline Button */}
          <a
            href="#contact"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-panel border border-white/10 text-zinc-300 hover:text-white hover:border-accent-cyan/40 text-sm font-medium tracking-wider uppercase transition-all duration-300"
          >
            <Mail className="w-4 h-4 text-accent-cyan" />
            <span>Contact Me</span>
          </a>
        </motion.div>

        {/* Micro-Details Info Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-16 pt-8 border-t border-white/5 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left font-mono text-xs"
        >
          <div>
            <span className="text-zinc-500 block">EDUCATION</span>
            <span className="text-zinc-200 font-sans">B.E. CSE (AI & ML)</span>
          </div>
          <div>
            <span className="text-zinc-500 block">CORE EXPERTISE</span>
            <span className="text-zinc-200 font-sans">Python • SQL • Power BI</span>
          </div>
          <div>
            <span className="text-zinc-500 block">INSTITUTION</span>
            <span className="text-zinc-200 font-sans">Rathinam Tech Campus</span>
          </div>
          <div>
            <span className="text-zinc-500 block">OPPORTUNITY STATUS</span>
            <span className="text-emerald-400 font-sans flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Open for Internships
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
