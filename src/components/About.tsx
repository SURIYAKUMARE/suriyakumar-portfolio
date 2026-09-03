'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, AnimatePresence, useInView } from 'framer-motion';
import {
  Sparkles,
  Terminal,
  Database,
  Cpu,
  Award,
  Zap,
  CheckCircle2,
  Code2,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { ProfileData } from '@/types';
import { sounds } from '@/lib/sound';

interface AboutProps {
  profile: ProfileData;
}

// Smooth animated number counter
function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(match[1], 10);
    const suffix = match[2];
    const isZeroPadded = match[1].startsWith('0') && match[1].length > 1;

    const duration = 1400;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOut * targetNum);

      const formatted = isZeroPadded && current < 10 ? `0${current}` : `${current}`;
      setDisplayValue(`${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function About({ profile }: AboutProps) {
  const [activeTab, setActiveTab] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Card Tilt Physics (Smooth & natural)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-160, 160], [10, -10]);
  const rotateY = useTransform(mouseX, [-160, 160], [-10, 10]);

  // Spotlight position
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === 'undefined' || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);

    // Update spotlight percentage
    const spotX = ((e.clientX - rect.left) / rect.width) * 100;
    const spotY = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x: spotX, y: spotY });
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlightPos({ x: 50, y: 50 });
  };

  const [selectedPhoto, setSelectedPhoto] = useState<'portrait' | 'casual'>('portrait');
  const photo =
    selectedPhoto === 'portrait'
      ? profile.photo_url && !profile.photo_url.includes('unsplash')
        ? profile.photo_url
        : '/images/suriyakumar-portrait.jpg'
      : '/images/suriyakumar-casual.jpg';

  return (
    <section id="about" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Subtle Gradient Flares */}
      <div className="absolute top-1/4 -left-24 w-[420px] h-[420px] bg-accent-cyan/12 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[380px] h-[380px] bg-emerald-500/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Section Header */}
      <div className="mb-14 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.12)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-spin-slow" />
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-300 uppercase font-semibold">
            01 // PROFILE & PASSION
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white"
        >
          Data Analytics & <span className="text-gradient-accent">AI Engineering</span>
        </motion.h2>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Refined 3D Portrait Card & Bento Stats */}
        <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
          <div className="relative flex justify-center">
            {/* 3D TILT PHOTO CARD */}
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ perspective: 1000 }}
              className="w-full flex justify-center cursor-pointer"
              data-cursor="pointer"
            >
              <motion.div
                style={{ rotateX, rotateY }}
                className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-white/20 p-3 shadow-[0_25px_70px_rgba(0,0,0,0.85)] group transition-all duration-300 hover:border-accent-cyan/60"
              >
                {/* Dynamic Cursor Spotlight Beam on Hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  style={{
                    background: `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(0, 240, 255, 0.18), transparent 70%)`,
                  }}
                />

                {/* Card Interior */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-100">
                  {/* Photo with Seamless Crossfade */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={photo}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={photo}
                        alt={profile.name}
                        fill
                        priority
                        className="object-cover object-top contrast-110 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/20 to-transparent opacity-90 pointer-events-none" />

                  {/* Top Photo Switcher Pill */}
                  <div className="absolute top-4 right-4 z-20 flex gap-1 p-1 rounded-full glass-panel border border-white/20 backdrop-blur-md shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto('portrait');
                        sounds.playClick();
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono transition-all duration-200 ${
                        selectedPhoto === 'portrait'
                          ? 'bg-accent-cyan text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.7)]'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Suit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto('casual');
                        sounds.playClick();
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono transition-all duration-200 ${
                        selectedPhoto === 'casual'
                          ? 'bg-accent-cyan text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.7)]'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Casual
                    </button>
                  </div>

                  {/* Floating Status Pill Top-Left */}
                  <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/20 backdrop-blur-md text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Suriyakumar E</span>
                  </div>

                  {/* Bottom Glass Tag */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-panel border border-white/20 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                          Academic Track
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-white">
                          CSE (AI & ML) @ Rathinam Tech
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center border border-accent-cyan/50 shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                        <Zap className="w-4 h-4 text-accent-cyan" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Bento Grid with Animated Number Counters */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {profile.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onMouseEnter={() => sounds.playHover()}
                className="p-4 sm:p-5 rounded-2xl glass-card border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 group cursor-default"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-1 group-hover:text-accent-cyan transition-colors">
                  <AnimatedCounter value={stat.number} />
                </div>
                <div className="text-xs font-medium text-zinc-200">{stat.label}</div>
                {stat.sublabel && (
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{stat.sublabel}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Bio & Skills Matrix */}
        <div className="lg:col-span-7 flex flex-col gap-8 sm:gap-10">
          {/* Bio Paragraphs */}
          <div className="space-y-4 sm:space-y-5 text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed font-light">
            {profile.bio_paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="tracking-wide"
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Interactive Skills Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-5 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-2xl relative overflow-hidden"
          >
            {/* Top Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-300">
                  Technical Arsenal
                </h3>
              </div>

              {/* Category Switcher Tabs */}
              <div className="flex gap-1.5 p-1 rounded-xl bg-surface-100 border border-white/10 overflow-x-auto no-scrollbar">
                {profile.skills.map((group, idx) => (
                  <button
                    key={group.category}
                    onClick={() => {
                      setActiveTab(idx);
                      sounds.playClick();
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all duration-200 ${
                      activeTab === idx
                        ? 'bg-accent-cyan text-black font-semibold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {group.category.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Category Skill Bars */}
            <div className="space-y-4">
              {profile.skills[activeTab]?.items.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                    <span className="text-zinc-300 group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-zinc-400 font-sans group-hover:text-accent-cyan transition-colors">
                      {skill.level}%
                    </span>
                  </div>

                  <div className="relative w-full h-2.5 rounded-full bg-white/5 overflow-hidden p-[1px] border border-white/5">
                    <motion.div
                      key={`${activeTab}-${skill.name}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, delay: index * 0.06, ease: 'easeOut' }}
                      className="relative h-full rounded-full bg-gradient-to-r from-accent-cyan to-emerald-400 group-hover:shadow-[0_0_14px_rgba(0,240,255,0.7)] transition-shadow"
                    >
                      <span className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
