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
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { Project } from '@/types';
import { sounds } from '@/lib/sound';

interface SpaceEduShowcaseProps {
  projects: Project[];
}

export default function SpaceEduShowcase({ projects }: SpaceEduShowcaseProps) {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Pinning enabled on desktop / laptop screens (width >= 1024px)
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const phase1El = section.querySelector('.phase-1-content');
        const phase2El = section.querySelector('.phase-2-content');
        const phase3El = section.querySelector('.phase-3-content');
        const planetContainer = section.querySelector('.project-planet-container');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=220%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onEnter: () => setActiveProjectIdx(index),
            onEnterBack: () => setActiveProjectIdx(index),
          },
        });

        // SEQUENCE FOR LAPTOPS / DESKTOPS:
        // 0.0 -> 0.3: Phase 1 fades out, planet shifts to side
        // 0.3 -> 0.6: Phase 2 drawer slides in
        // 0.6 -> 0.9: Phase 2 fades out, planet zooms full-bleed + Phase 3 callout box reveals
        // 0.9 -> 1.0: Clean crossfade into next project

        tl.to(
          phase1El,
          {
            opacity: 0,
            y: -35,
            scale: 0.96,
            duration: 0.7,
            ease: 'power2.inOut',
          },
          0.15
        );

        // Planet moves to left or right into split view
        const isEven = index % 2 === 0;
        tl.to(
          planetContainer,
          {
            xPercent: isEven ? -22 : 22,
            yPercent: -4,
            scale: 0.85,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          0.15
        );

        // Phase 2 text slides in from opposite side
        tl.fromTo(
          phase2El,
          {
            opacity: 0,
            xPercent: isEven ? 35 : -35,
          },
          {
            opacity: 1,
            xPercent: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          0.35
        );

        // Phase 2 fades out as zoom begins
        tl.to(
          phase2El,
          {
            opacity: 0,
            y: -25,
            duration: 0.5,
            ease: 'power2.in',
          },
          1.1
        );

        // Phase 3: Zoom planet image to fill viewport
        tl.to(
          planetContainer,
          {
            xPercent: 0,
            yPercent: 0,
            scale: 2.1,
            filter: 'brightness(0.32) contrast(1.15)',
            duration: 1.2,
            ease: 'power2.inOut',
          },
          1.0
        );

        // Phase 3 callout box appears bottom-right
        tl.fromTo(
          phase3El,
          {
            opacity: 0,
            y: 35,
            scale: 0.92,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          1.35
        );

        // Transition out
        tl.to(
          [phase3El, planetContainer],
          {
            opacity: 0,
            scale: 2.4,
            duration: 0.4,
            ease: 'power1.in',
          },
          1.95
        );
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
      {/* DESKTOP QUICK-JUMP NAVIGATION RAIL (Visible on Laptop & Desktop) */}
      <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto">
        {projects.map((p, i) => (
          <button
            key={p.id}
            onClick={() => scrollToSection(i)}
            onMouseEnter={() => sounds.playHover()}
            className="group flex items-center gap-3 py-1 px-2 rounded-full transition-all"
            title={`Jump to ${p.title}`}
          >
            <span
              className={`text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 rounded glass-panel border border-white/10 ${
                activeProjectIdx === i ? 'text-accent-cyan border-accent-cyan/40' : 'text-zinc-400'
              }`}
            >
              0{i + 1} {p.title.split(' ')[0]}
            </span>
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeProjectIdx === i
                  ? 'w-6 h-2 bg-accent-cyan shadow-[0_0_12px_rgba(0,240,255,0.8)]'
                  : 'bg-white/20 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>

      {/* PROJECT SHOWCASE SECTIONS */}
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
            className="relative w-full border-b border-white/5 overflow-hidden"
          >
            {/* AMBIENT BACKGROUND GLOW */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className={`absolute top-1/3 ${
                  isEven ? 'left-1/4' : 'right-1/4'
                } w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-accent-cyan/10 blur-[160px]`}
              />
            </div>

            {/* ========================================================================= */}
            {/* 1. LAPTOP & DESKTOP CINEMATIC PINNED VIEW (Screen width >= 1024px)        */}
            {/* ========================================================================= */}
            <div className="hidden lg:flex relative w-full h-screen items-center justify-center overflow-hidden">
              {/* DOCKED PREV & NEXT THUMBNAIL PREVIEWS */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 pointer-events-none z-30 flex justify-between items-center w-[calc(100%-4rem)]">
                {/* Previous Project Dock */}
                <button
                  onClick={() => scrollToSection((idx - 1 + projects.length) % projects.length)}
                  onMouseEnter={() => sounds.playHover()}
                  className="pointer-events-auto group flex items-center gap-3 p-2 rounded-full glass-panel border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 backdrop-blur-md"
                  title={`Jump to ${prevProject.title}`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden relative border border-white/20 group-hover:scale-110 transition-transform">
                    <Image
                      src={prevProject.image}
                      alt={prevProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left pr-3 hidden 2xl:block">
                    <span className="text-[9px] font-mono text-zinc-400 block uppercase tracking-widest">
                      PREV
                    </span>
                    <span className="text-xs font-serif text-white group-hover:text-accent-cyan transition-colors">
                      {prevProject.title.length > 18
                        ? prevProject.title.slice(0, 18) + '…'
                        : prevProject.title}
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
                  <div className="text-right pl-3 hidden 2xl:block">
                    <span className="text-[9px] font-mono text-zinc-400 block uppercase tracking-widest">
                      NEXT
                    </span>
                    <span className="text-xs font-serif text-white group-hover:text-accent-cyan transition-colors">
                      {nextProject.title.length > 18
                        ? nextProject.title.slice(0, 18) + '…'
                        : nextProject.title}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full overflow-hidden relative border border-white/20 group-hover:scale-110 transition-transform">
                    <Image
                      src={nextProject.image}
                      alt={nextProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              </div>

              {/* CENTRAL PROJECT VESSEL / PLANET IMAGE (Positions smoothly in lower half to prevent overlap) */}
              <div className="project-planet-container absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="relative w-[520px] xl:w-[640px] 2xl:w-[720px] aspect-[16/10] rounded-3xl overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.9)] border border-white/15 bg-surface-100 mt-28 xl:mt-32">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority={idx === 0}
                    className="project-planet-img object-cover brightness-95 contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/85 via-transparent to-transparent" />
                </div>
              </div>

              {/* PHASE 1: HERO STATE (Clean upper-screen placement for laptop screens) */}
              <div className="phase-1-content relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-8 xl:pt-12 select-none">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-white/10 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                  <span className="text-[11px] font-mono tracking-[0.25em] text-accent-cyan uppercase font-semibold">
                    {project.eyebrow || `PROJECT 0${idx + 1}`} // 05
                  </span>
                </div>

                <h2 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-serif tracking-tight text-white mb-4 leading-tight max-w-3xl">
                  {project.title}
                </h2>

                <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent mb-4" />

                <p className="text-xs sm:text-sm lg:text-base text-zinc-300 font-light max-w-lg mb-6 leading-relaxed">
                  {project.shortDescription || project.tagline}
                </p>

                <button
                  onClick={() => {
                    sounds.playClick();
                    window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
                  }}
                  onMouseEnter={() => sounds.playHover()}
                  className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]"
                >
                  <span>View Project</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </button>

                <div className="mt-8 flex flex-col items-center gap-1 opacity-60 animate-bounce">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                    Scroll to Reveal
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-accent-cyan" />
                </div>
              </div>

              {/* PHASE 2: SPLIT REVEAL DRAWER */}
              <div
                className={`phase-2-content absolute z-20 max-w-md xl:max-w-lg px-6 xl:px-8 py-7 rounded-3xl glass-panel border border-white/15 shadow-2xl backdrop-blur-2xl ${
                  isEven ? 'right-12 xl:right-20' : 'left-12 xl:left-20'
                } top-1/2 -translate-y-1/2 opacity-0 pointer-events-auto`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent-cyan px-2.5 py-0.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30">
                    THE PROJECT // {project.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{project.year}</span>
                </div>

                <h3 className="text-2xl xl:text-3xl font-serif text-white mb-3 leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs xl:text-sm text-zinc-300 font-light leading-relaxed mb-5">
                  {project.description}
                </p>

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

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveModalProject(project);
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    Learn More
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveModalProject(project);
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className="w-9 h-9 rounded-full bg-accent-cyan text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                    title="Open Project Details"
                  >
                    <Play className="w-3.5 h-3.5 fill-black translate-x-0.5" />
                  </button>
                </div>
              </div>

              {/* PHASE 3: ZOOM CLOSE-UP SPECIFICATION CALLOUT */}
              <div className="phase-3-content absolute bottom-10 right-10 xl:right-16 z-20 max-w-md p-6 xl:p-8 rounded-2xl glass-panel border border-white/20 bg-black/60 backdrop-blur-xl shadow-2xl opacity-0 pointer-events-auto">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent-cyan">
                    TECHNICAL SPECIFICATION & RESULT
                  </span>
                </div>

                <h4 className="text-lg xl:text-xl font-serif font-bold text-white mb-2">
                  {project.technicalCallout || 'System Performance Highlight'}
                </h4>

                <div className="w-full h-[1px] bg-gradient-to-r from-accent-cyan via-white/40 to-transparent mb-3" />

                <p className="text-xs xl:text-sm text-zinc-300 font-light leading-relaxed mb-4">
                  {project.calloutDetail || project.description}
                </p>

                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                    {project.metrics.map((m, i) => (
                      <div key={i}>
                        <span className="text-[9px] font-mono text-zinc-400 block uppercase">
                          {m.label}
                        </span>
                        <span className="text-xs xl:text-sm font-mono font-bold text-accent-cyan">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. MOBILE & TABLET CINEMATIC VIEW (Screen width < 1024px)                 */}
            {/* ========================================================================= */}
            <div className="lg:hidden relative w-full px-4 py-16 flex flex-col justify-center">
              <div className="w-full max-w-lg mx-auto rounded-3xl glass-card border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
                {/* Mobile Header Badges */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-widest text-accent-cyan uppercase px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30">
                    {project.eyebrow || `PROJECT 0${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span>{project.category}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                </div>

                {/* Mobile Project Title */}
                <h3 className="text-2xl sm:text-3xl font-serif text-white leading-snug">
                  {project.title}
                </h3>

                {/* Mobile Image Mockup */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-surface-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/80 via-transparent to-transparent" />
                </div>

                {/* Mobile Short Description */}
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  {project.description}
                </p>

                {/* Mobile Technical Specification Callout */}
                {project.calloutDetail && (
                  <div className="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-accent-cyan">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>{project.technicalCallout || 'Key Engineering Result'}</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-light">
                      {project.calloutDetail}
                    </p>
                  </div>
                )}

                {/* Mobile Technologies Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-300 bg-white/5 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Mobile Action Buttons */}
                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveModalProject(project);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    <span>Explore Case Study</span>
                    <Play className="w-3.5 h-3.5 fill-black translate-x-0.5" />
                  </button>

                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl glass-panel border border-white/15 text-zinc-200 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-accent-cyan" />
                        <span>Live</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl glass-panel border border-white/15 text-zinc-200 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Mobile Navigation Indicator Bar */}
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <button
                    onClick={() => scrollToSection((idx - 1 + projects.length) % projects.length)}
                    className="flex items-center gap-1 hover:text-white transition-colors py-1 px-2"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <span className="text-zinc-500">
                    {idx + 1} / {projects.length}
                  </span>
                  <button
                    onClick={() => scrollToSection((idx + 1) % projects.length)}
                    className="flex items-center gap-1 hover:text-white transition-colors py-1 px-2"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ========================================================================= */}
      {/* DEEP-DIVE CASE STUDY MODAL (Responsive on Mobile & Laptop)                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-white/20 bg-[#0a0e17] shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 p-5 sm:p-8 xl:p-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close Case Study"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-5 pr-8">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-accent-cyan uppercase tracking-widest mb-2">
                  <span>{activeModalProject.eyebrow || 'PROJECT'}</span>
                  <span>•</span>
                  <span>{activeModalProject.category}</span>
                  <span>•</span>
                  <span>{activeModalProject.year}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl xl:text-4xl font-serif text-white mb-2 leading-tight">
                  {activeModalProject.title}
                </h3>
                <p className="text-xs sm:text-sm xl:text-base text-zinc-300 font-light leading-relaxed">
                  {activeModalProject.shortDescription}
                </p>
              </div>

              {/* Hero Image */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-2xl bg-surface-100">
                <Image
                  src={activeModalProject.image}
                  alt={activeModalProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Architecture & Details */}
              <div className="space-y-3.5 mb-6 pb-6 border-b border-white/10">
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  System Architecture & Implementation
                </h4>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-light">
                  {activeModalProject.description}
                </p>
                {activeModalProject.calloutDetail && (
                  <div className="p-3.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-xs font-mono text-accent-cyan">
                    {activeModalProject.calloutDetail}
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-2.5">
                  Technologies Deployed
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-xs font-mono text-zinc-200 bg-white/5 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {activeModalProject.liveUrl && (
                  <a
                    href={activeModalProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors shadow-lg"
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
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full glass-panel border border-white/15 text-zinc-200 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors"
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
