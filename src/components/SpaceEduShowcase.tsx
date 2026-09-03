'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ChevronDown,
  Play,
  ArrowRight,
  ExternalLink,
  Github,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  BarChart,
} from 'lucide-react';
import { Project } from '@/types';
import { sounds } from '@/lib/sound';

interface SpaceEduShowcaseProps {
  projects: Project[];
}

export default function SpaceEduShowcase({ projects }: SpaceEduShowcaseProps) {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Only enable heavy pinning on desktop (width >= 1024px) for 60fps buttery smoothness
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const phase1El = section.querySelector('.phase-1-content');
        const phase2El = section.querySelector('.phase-2-content');
        const phase3El = section.querySelector('.phase-3-content');
        const planetImage = section.querySelector('.project-planet-img');
        const planetContainer = section.querySelector('.project-planet-container');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // SEQUENCE:
        // 0% -> 25%: Phase 1 is visible, planet rises slightly
        // 25% -> 50%: Transition from Phase 1 to Phase 2 (split reveal)
        // 50% -> 75%: Transition from Phase 2 to Phase 3 (dramatic zoom)
        // 75% -> 100%: Phase 3 fades out into next project

        tl.to(phase1El, {
          opacity: 0,
          y: -40,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0.2);

        // Planet moves to the left/right and scales down slightly into split view
        const isEven = index % 2 === 0;
        tl.to(planetContainer, {
          xPercent: isEven ? -24 : 24,
          yPercent: -8,
          scale: 0.82,
          duration: 1,
          ease: 'power2.inOut',
        }, 0.2);

        // Phase 2 text slides in from opposite side
        tl.fromTo(phase2El, {
          opacity: 0,
          xPercent: isEven ? 40 : -40,
        }, {
          opacity: 1,
          xPercent: 0,
          duration: 0.9,
          ease: 'power2.out',
        }, 0.4);

        // Phase 2 fades out as we zoom
        tl.to(phase2El, {
          opacity: 0,
          y: -30,
          duration: 0.6,
          ease: 'power2.in',
        }, 1.2);

        // Phase 3: Dramatic zoom of the planet image to fill the entire viewport
        tl.to(planetContainer, {
          xPercent: 0,
          yPercent: 0,
          scale: 2.2,
          filter: 'brightness(0.35) contrast(1.15)',
          duration: 1.4,
          ease: 'power2.inOut',
        }, 1.1);

        // Phase 3 detail callout box appears bottom-right
        tl.fromTo(phase3El, {
          opacity: 0,
          y: 40,
          scale: 0.9,
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, 1.5);

        // Fade out callout and container at the very end
        tl.to([phase3El, planetContainer], {
          opacity: 0,
          scale: 2.6,
          duration: 0.5,
          ease: 'power1.in',
        }, 2.1);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  const scrollToSection = (idx: number) => {
    sounds.playClick();
    const target = sectionRefs.current[idx];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="projects" ref={containerRef} className="relative w-full bg-[#0a0e17] text-white">
      {/* SpaceEdu Projects Sequences */}
      {projects.map((project, idx) => {
        const prevProject = projects[(idx - 1 + projects.length) % projects.length];
        const nextProject = projects[(idx + 1) % projects.length];
        const isEven = idx % 2 === 0;

        return (
          <section
            key={project.id}
            id={`project-panel-${idx}`}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            className="relative w-full min-h-screen lg:h-screen flex items-center justify-center overflow-hidden border-b border-white/5"
          >
            {/* AMBIENT BACKGROUND GLOW */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className={`absolute top-1/3 ${
                  isEven ? 'left-1/4' : 'right-1/4'
                } w-[600px] h-[600px] rounded-full bg-accent-cyan/10 blur-[170px]`}
              />
            </div>

            {/* DOCKED LEFT & RIGHT THUMBNAIL PREVIEWS (like SpaceEdu Mercury/Earth planet docks) */}
            <div className="hidden lg:flex fixed-or-absolute inset-x-8 top-1/2 -translate-y-1/2 pointer-events-none z-30 justify-between items-center w-[calc(100%-4rem)]">
              {/* Previous Project Dock */}
              <button
                onClick={() => scrollToSection((idx - 1 + projects.length) % projects.length)}
                onMouseEnter={() => sounds.playHover()}
                className="pointer-events-auto group flex items-center gap-3 p-2 rounded-full glass-panel border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 backdrop-blur-md"
                title={`Jump to ${prevProject.title}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white/20 group-hover:scale-110 transition-transform">
                  <Image
                    src={prevProject.image}
                    alt={prevProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left pr-3 hidden xl:block">
                  <span className="text-[9px] font-mono text-zinc-400 block uppercase tracking-widest">
                    PREV
                  </span>
                  <span className="text-xs font-serif text-white group-hover:text-accent-cyan transition-colors">
                    {prevProject.title.length > 18 ? prevProject.title.slice(0, 18) + '…' : prevProject.title}
                  </span>
                </div>
              </button>

              {/* Next Project Dock */}
              <button
                onClick={() => scrollToSection((idx + 1) % projects.length)}
                onMouseEnter={() => sounds.playHover()}
                className="pointer-events-auto group flex items-center gap-3 p-2 rounded-full glass-panel border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 backdrop-blur-md"
                title={`Jump to ${nextProject.title}`}
              >
                <div className="text-right pl-3 hidden xl:block">
                  <span className="text-[9px] font-mono text-zinc-400 block uppercase tracking-widest">
                    NEXT
                  </span>
                  <span className="text-xs font-serif text-white group-hover:text-accent-cyan transition-colors">
                    {nextProject.title.length > 18 ? nextProject.title.slice(0, 18) + '…' : nextProject.title}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white/20 group-hover:scale-110 transition-transform">
                  <Image
                    src={nextProject.image}
                    alt={nextProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            </div>

            {/* CENTRAL / RISING PROJECT VESSEL / PLANET IMAGE */}
            <div className="project-planet-container absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="relative w-[340px] sm:w-[460px] md:w-[620px] lg:w-[740px] aspect-[16/10] rounded-3xl overflow-hidden shadow-[0_20px_90px_rgba(0,0,0,0.85)] border border-white/15 bg-surface-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  priority={idx === 0}
                  className="project-planet-img object-cover brightness-95 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/80 via-transparent to-transparent" />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PHASE 1: HERO STATE (Centered Eyebrow, Serif Title, Divider, View Button) */}
            {/* ========================================================================= */}
            <div className="phase-1-content relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-8 pb-36 lg:pb-0 select-none">
              {/* Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-5">
                <Sparkles className="w-3 h-3 text-accent-cyan" />
                <span className="text-[11px] font-mono tracking-[0.25em] text-accent-cyan uppercase">
                  {project.eyebrow || `PROJECT 0${idx + 1}`} // 05
                </span>
              </div>

              {/* Huge Serif Project Title */}
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white mb-6 leading-tight max-w-3xl">
                {project.title}
              </h2>

              {/* Thin Accent Divider Line */}
              <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent mb-6" />

              {/* Short One-Line Description */}
              <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light max-w-xl mb-8 leading-relaxed">
                {project.shortDescription || project.tagline}
              </p>

              {/* Centered Pill Button: VIEW PROJECT */}
              <button
                onClick={() => {
                  sounds.playClick();
                  // Scroll smoothly into Phase 2 of this section
                  window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
                }}
                onMouseEnter={() => sounds.playHover()}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]"
              >
                <span>View Project</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              {/* Scroll Down Chevron Indicator */}
              <div className="mt-12 lg:absolute lg:bottom-10 left-1/2 lg:-translate-x-1/2 flex flex-col items-center gap-1 opacity-60 animate-bounce">
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                  Scroll to Reveal
                </span>
                <ChevronDown className="w-4 h-4 text-accent-cyan" />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PHASE 2: SPLIT REVEAL (Text Drawer Sliding In Opposite to Project Vessel) */}
            {/* ========================================================================= */}
            <div
              className={`phase-2-content absolute z-20 max-w-lg px-6 sm:px-10 py-8 rounded-3xl glass-panel border border-white/15 shadow-2xl backdrop-blur-2xl ${
                isEven
                  ? 'lg:right-16 lg:left-auto'
                  : 'lg:left-16 lg:right-auto'
              } bottom-12 lg:bottom-auto top-auto lg:top-1/2 lg:-translate-y-1/2 hidden lg:block opacity-0 pointer-events-auto`}
            >
              {/* Category Pill */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent-cyan px-2.5 py-0.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30">
                  THE PROJECT // {project.category}
                </span>
                <span className="text-xs font-mono text-zinc-400">{project.year}</span>
              </div>

              {/* Title in Drawer */}
              <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3 leading-snug">
                {project.title}
              </h3>

              {/* Full Paragraph Description */}
              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-300 bg-white/5 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons: LEARN MORE Pill + Circular Play/Demo Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveModalProject(project);
                  }}
                  onMouseEnter={() => sounds.playHover()}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Learn More
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveModalProject(project);
                  }}
                  onMouseEnter={() => sounds.playHover()}
                  className="w-10 h-10 rounded-full bg-accent-cyan text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                  title="Open Project Details & Repository"
                  aria-label="Open Project Demo"
                >
                  <Play className="w-4 h-4 fill-black translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PHASE 3: ZOOM CLOSE-UP CALLOUT (Anchored Bottom-Right with Accent Line)   */}
            {/* ========================================================================= */}
            <div className="phase-3-content absolute bottom-12 right-6 sm:right-12 z-20 max-w-md p-6 sm:p-8 rounded-2xl glass-panel border border-white/20 bg-black/60 backdrop-blur-xl shadow-2xl hidden lg:block opacity-0 pointer-events-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent-cyan">
                  TECHNICAL SPECIFICATION & RESULT
                </span>
              </div>

              <h4 className="text-xl font-serif font-bold text-white mb-2">
                {project.technicalCallout || 'System Performance Highlight'}
              </h4>

              {/* Thin Horizontal Accent Line */}
              <div className="w-full h-[1px] bg-gradient-to-r from-accent-cyan via-white/40 to-transparent mb-3" />

              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-4">
                {project.calloutDetail || project.description}
              </p>

              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  {project.metrics.map((m, i) => (
                    <div key={i}>
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                        {m.label}
                      </span>
                      <span className="text-sm font-mono font-bold text-accent-cyan">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* MOBILE ADAPTIVE VIEW: Clean Stacked Cards for Touch Screens               */}
            {/* ========================================================================= */}
            <div className="lg:hidden relative z-20 w-full px-4 py-8 flex flex-col gap-4">
              <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-accent-cyan">
                  <span>{project.eyebrow}</span>
                  <span>{project.category}</span>
                </div>
                <p className="text-xs text-zinc-300 font-light">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider mt-2"
                >
                  Explore Details & Links
                </button>
              </div>
            </div>
          </section>
        );
      })}

      {/* ========================================================================= */}
      {/* DEEP-DIVE CASE STUDY MODAL (Opened via Learn More or ▶ Button)           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-white/20 bg-[#0a0e17] shadow-[0_25px_80px_rgba(0,0,0,0.9)] z-10 p-6 sm:p-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close Case Study"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2.5 text-xs font-mono text-accent-cyan uppercase tracking-widest mb-2">
                  <span>{activeModalProject.eyebrow || 'PROJECT'}</span>
                  <span>•</span>
                  <span>{activeModalProject.category}</span>
                  <span>•</span>
                  <span>{activeModalProject.year}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif text-white mb-2">
                  {activeModalProject.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                  {activeModalProject.shortDescription}
                </p>
              </div>

              {/* Project Hero Preview */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-2xl">
                <Image
                  src={activeModalProject.image}
                  alt={activeModalProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Full Description & Architecture */}
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                  System Architecture & Implementation
                </h4>
                <p className="text-sm text-zinc-200 leading-relaxed font-light">
                  {activeModalProject.description}
                </p>
                {activeModalProject.calloutDetail && (
                  <div className="p-4 rounded-xl bg-white/5 border border-accent-cyan/30 text-xs font-mono text-accent-cyan">
                    {activeModalProject.calloutDetail}
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
                  Technologies Deployed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-mono text-zinc-200 bg-white/5 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-4">
                {activeModalProject.liveUrl && (
                  <a
                    href={activeModalProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-panel border border-white/15 text-zinc-200 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Repository</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
