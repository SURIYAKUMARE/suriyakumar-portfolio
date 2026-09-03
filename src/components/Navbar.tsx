'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  ArrowUpRight,
  Shield,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { sounds } from '@/lib/sound';

export default function Navbar() {
  const [soundActive, setSoundActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    sounds.setEnabled(next);
    if (next) sounds.playClick();
  };

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-cyan via-sky-400 to-emerald-400 origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2.5 sm:py-3' : 'py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between glass-panel px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            {/* Brand Logo with Avatar */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group"
              onMouseEnter={() => sounds.playHover()}
              onClick={() => sounds.playClick()}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/60 shadow-[0_0_12px_rgba(0,240,255,0.4)] group-hover:scale-110 transition-transform shrink-0">
                <Image
                  src="/images/suriyakumar-portrait.jpg"
                  alt="Suriyakumar E"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-white group-hover:text-accent-cyan transition-colors">
                  Suriyakumar E
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-wider text-zinc-400 uppercase font-mono hidden xs:inline-block">
                  AI & ML • Data Analytics
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Laptop / Desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => sounds.playHover()}
                  onClick={() => sounds.playClick()}
                  className="px-3.5 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right Actions: Availability Badge, Sound Toggle, Admin & CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Live Status Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open for Work</span>
              </div>

              {/* Sound FX Toggle */}
              <button
                onClick={toggleSound}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title={soundActive ? 'Mute Sound FX' : 'Enable Sound FX'}
                aria-label="Sound Toggle"
              >
                {soundActive ? (
                  <Volume2 className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <VolumeX className="w-4 h-4 opacity-60" />
                )}
              </button>

              {/* Admin Portal Link */}
              <Link
                href="/admin"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Admin Studio (Supabase Auth)"
              >
                <Shield className="w-4 h-4" />
              </Link>

              {/* Desktop Action Button */}
              <a
                href="#contact"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
              >
                <span>Connect</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  sounds.playClick();
                }}
                className="md:hidden p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* FULLSCREEN FROSTED GLASS MOBILE MENU DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="md:hidden fixed inset-x-4 top-20 z-50 p-6 rounded-3xl glass-panel border border-white/20 bg-[#0a0e17]/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open for Internships & AI Projects</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      sounds.playClick();
                    }}
                    className="flex items-center justify-between px-4 py-3 text-base font-serif text-white hover:text-accent-cyan hover:bg-white/5 rounded-2xl transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                  </a>
                ))}
              </div>

              {/* Direct Quick Actions for Phone Users */}
              <div className="pt-4 border-t border-white/10 space-y-2.5">
                <a
                  href="mailto:suryaaswin000@gmail.com"
                  className="w-full py-3 px-4 rounded-xl glass-panel border border-white/10 text-xs font-mono text-zinc-200 flex items-center justify-center gap-2 hover:border-accent-cyan/40"
                >
                  <Mail className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>suryaaswin000@gmail.com</span>
                </a>

                <a
                  href="tel:+919445648373"
                  className="w-full py-3 px-4 rounded-xl glass-panel border border-white/10 text-xs font-mono text-zinc-200 flex items-center justify-center gap-2 hover:border-accent-cyan/40"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91-9445648373</span>
                </a>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-mono text-zinc-400 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Studio</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
