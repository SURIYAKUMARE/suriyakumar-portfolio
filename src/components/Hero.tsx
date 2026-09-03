'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowDownRight, Sparkles, Terminal, Database, Cpu, Mail, ArrowUpRight } from 'lucide-react';
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
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 overflow-hidden select-none"
    >
      {/* Drifting Soft Mesh Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[16%] left-[18%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-accent-cyan/15 blur-[140px] animate-blob-float-1" />
        <div className="absolute top-[42%] right-[14%] w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] rounded-full bg-emerald-500/10 blur-[140px] animate-blob-float-2" />
        <div className="absolute -bottom-[10%] left-[34%] w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-sky-900/15 blur-[160px] animate-blob-float-3" />
      </div>

      {/* Hero Content Area */}
      <motion.div
        style={{ opacity, y: yParallax }}
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center w-full"
      >
        {/* Top Floating Badge with Profile Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 mb-6 sm:mb-8 shadow-[0_0_25px_rgba(0,240,255,0.15)] max-w-[95%]"
        >
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-accent-cyan/60 shadow-[0_0_10px_rgba(0,240,255,0.4)] shrink-0">
            <Image
              src="/images/suriyakumar-portrait.jpg"
              alt={name}
              fill
              className="object-cover object-top"
            />
          </div>
          <span className="text-[10px] sm:text-xs font-mono tracking-wider sm:tracking-widest text-zinc-300 uppercase truncate">
            {title}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        </motion.div>

        {/* Massive Kinetic Typography (Word-Safe for Phones & Laptops) */}
        <h1 className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5 md:gap-x-7 mb-6 font-display font-extrabold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase text-white leading-none">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-flex whitespace-nowrap">
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  initial={{ opacity: 0, y: 60, rotateX: -55 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15 + (wordIndex * 6 + charIndex) * 0.035,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  whileHover={{
                    scale: 1.12,
                    color: '#00f0ff',
                    transition: { duration: 0.15 },
                  }}
                  className="inline-block transition-colors cursor-default"
                  onMouseEnter={() => sounds.playHover()}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Word-by-Word Reveal Subtitle */}
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

        {/* CTA Buttons (Touch-Optimized for Phone, Magnetic for Laptop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto px-4 sm:px-0"
        >
          {/* Main Primary CTA */}
          <motion.a
            ref={magneticButtonRef}
            href="#projects"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: btnPos.x, y: btnPos.y }}
            transition={{ type: 'spring', damping: 15, stiffness: 180 }}
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] active:scale-95"
            data-cursor="pointer"
          >
            <span>Explore Projects</span>
            <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </motion.a>

          {/* Secondary CTA */}
          <a
            href="#contact"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full glass-panel border border-white/15 text-zinc-300 hover:text-white hover:border-accent-cyan/40 text-xs font-medium uppercase tracking-widest transition-all duration-300 active:scale-95"
            data-cursor="pointer"
          >
            <Mail className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Get in Touch</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Floating Micro-Details Strip at Bottom */}
      <div className="w-full max-w-5xl mx-auto mt-12 sm:mt-16 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-zinc-400 font-mono text-[11px] px-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
          <span className="truncate">Python • SQL • C++</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Pandas • Power BI</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
          <span className="truncate">AI & ML Specialization</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="text-zinc-300 truncate">Rathinam Tech Campus</span>
        </div>
      </div>
    </section>
  );
}
