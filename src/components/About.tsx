'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, Terminal, Database, Cpu, Award, Zap, CheckCircle2 } from 'lucide-react';
import { ProfileData } from '@/types';
import { sounds } from '@/lib/sound';

interface AboutProps {
  profile: ProfileData;
}

export default function About({ profile }: AboutProps) {
  const [activeTab, setActiveTab] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Card Tilt Physics (Mouse driven on desktop, neutral on mobile)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === 'undefined' || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [selectedPhoto, setSelectedPhoto] = useState<'portrait' | 'casual'>('portrait');
  const photo =
    selectedPhoto === 'portrait'
      ? profile.photo_url && !profile.photo_url.includes('unsplash')
        ? profile.photo_url
        : '/images/suriyakumar-portrait.jpg'
      : '/images/suriyakumar-casual.jpg';

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Section Glow */}
      <div className="absolute top-1/3 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-accent-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
            01 // PROFILE & PASSION
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
          Data Analytics & <span className="text-gradient-accent">AI Engineering</span>
        </h2>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: 3D Tilt Photo Card & Metrics */}
        <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ perspective: 1000 }}
            className="w-full flex justify-center"
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-white/15 p-3 shadow-2xl group"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-100">
                <Image
                  src={photo}
                  alt={profile.name}
                  fill
                  priority
                  className="object-cover object-top contrast-110 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-transparent opacity-80" />

                {/* Photo Switcher Pill (Touch-Friendly) */}
                <div className="absolute top-4 right-4 z-20 flex gap-1 p-1 rounded-full glass-panel border border-white/15 backdrop-blur-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto('portrait');
                      sounds.playClick();
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono transition-all ${
                      selectedPhoto === 'portrait'
                        ? 'bg-accent-cyan text-black font-bold shadow-md'
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
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono transition-all ${
                      selectedPhoto === 'casual'
                        ? 'bg-accent-cyan text-black font-bold shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Casual
                  </button>
                </div>

                {/* Floating Glass Tag */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-xl glass-panel border border-white/15 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Current Focus</p>
                      <p className="text-xs sm:text-sm font-semibold text-white">CSE (AI & ML) @ Rathinam</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center border border-accent-cyan/40 shrink-0">
                      <Zap className="w-4 h-4 text-accent-cyan" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {profile.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl glass-card border border-white/10 hover:border-accent-cyan/40 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-xs font-medium text-zinc-200">{stat.label}</div>
                {stat.sublabel && (
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{stat.sublabel}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Bio & Skills Matrix */}
        <div className="lg:col-span-7 flex flex-col gap-8 sm:gap-10">
          {/* Bio Staggered Paragraphs */}
          <div className="space-y-4 sm:space-y-5 text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed font-light">
            {profile.bio_paragraphs.map((para, i) => (
              <p key={i} className="tracking-wide">
                {para}
              </p>
            ))}
          </div>

          {/* Interactive Skills Engine */}
          <div className="p-5 sm:p-8 rounded-3xl glass-card border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-300">
                  Technical Arsenal
                </h3>
              </div>

              {/* Category Switcher Tabs (Horizontally scrollable on phones) */}
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
                        ? 'bg-accent-cyan text-black font-semibold shadow-sm'
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
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-[1px] border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: index * 0.08, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-emerald-400 group-hover:shadow-[0_0_10px_rgba(0,240,255,0.6)] transition-shadow"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
