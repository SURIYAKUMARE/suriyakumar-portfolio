'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { ExternalLink, Github, Sparkles, X, Trophy, Layers, CheckCircle2 } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = ['All', 'Data Analytics', 'AI & ML', 'Web & IoT'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambient background accent */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-4">
            <Sparkles className="w-3 h-3 text-accent-cyan" />
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
              04 // SELECTED PROJECTS
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
            Engineering & <span className="text-gradient-accent">Analytics Showcase</span>
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                sounds.playClick();
              }}
              onMouseEnter={() => sounds.playHover()}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl transition-all duration-300 font-mono ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, idx) => (
          <motion.article
            key={project.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            onClick={() => {
              setActiveProject(project);
              sounds.playClick();
            }}
            onMouseEnter={() => sounds.playHover()}
            data-cursor="project"
            className="group relative rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-accent-cyan/40 transition-all duration-500 cursor-pointer flex flex-col justify-between"
          >
            {/* Project Image Viewport */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-200">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/30 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Floating Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/10">
                  {project.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono text-zinc-300 bg-black/70 backdrop-blur-md border border-white/10">
                  {project.year}
                </span>
              </div>

              {/* Awards Pill */}
              {project.awards && project.awards.length > 0 && (
                <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-medium backdrop-blur-md">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>{project.awards[0]}</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-accent-cyan transition-colors">
                    {project.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-black transition-colors duration-300">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-5 font-light leading-relaxed">
                  {project.tagline}
                </p>
              </div>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-500 bg-white/5">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Deep-Dive Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-white/20 bg-[#0a0c12] shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 p-6 sm:p-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close Case Study"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2.5 text-xs font-mono text-accent-cyan uppercase tracking-widest mb-2">
                  <span>{activeProject.category}</span>
                  <span>•</span>
                  <span>{activeProject.year}</span>
                  {activeProject.client && (
                    <>
                      <span>•</span>
                      <span>Domain: {activeProject.client}</span>
                    </>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                  {activeProject.title}
                </h3>
                <p className="text-base text-zinc-300 font-light leading-relaxed">
                  {activeProject.tagline}
                </p>
              </div>

              {/* Hero Preview Image in Modal */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Description & Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/10">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                    Project Architecture & Technical Execution
                  </h4>
                  <p className="text-zinc-300 text-sm leading-relaxed font-light">
                    {activeProject.description}
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <span className="text-zinc-500 uppercase block mb-1">Role</span>
                    <span className="text-white font-sans text-sm">{activeProject.role || 'Lead Engineer'}</span>
                  </div>
                  {activeProject.metrics && activeProject.metrics.length > 0 && (
                    <div>
                      <span className="text-zinc-500 uppercase block mb-2">Key Metrics</span>
                      <div className="space-y-1.5">
                        {activeProject.metrics.map((m, i) => (
                          <div key={i} className="flex justify-between text-zinc-300">
                            <span>{m.label}:</span>
                            <span className="text-accent-cyan font-bold">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies Used */}
              <div className="mb-8">
                <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
                  Technologies Deployed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-mono text-zinc-200 bg-white/5 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    <span>Launch Project</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
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
    </section>
  );
}
