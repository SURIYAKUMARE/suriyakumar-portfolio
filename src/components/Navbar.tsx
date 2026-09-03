'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import Image from 'next/image';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Shield } from 'lucide-react';
import { sounds } from '@/lib/sound';

export default function Navbar() {
  const [soundActive, setSoundActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    sounds.setEnabled(next);
    if (next) sounds.playClick();
  };

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Projects', href: '#projects' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between glass-panel px-5 py-3 rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {/* Brand Logo with Avatar */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              onMouseEnter={() => sounds.playHover()}
              onClick={() => sounds.playClick()}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/60 shadow-[0_0_12px_rgba(0,240,255,0.4)] group-hover:scale-110 transition-transform">
                <Image
                  src="/images/suriyakumar-portrait.jpg"
                  alt="Suriyakumar E"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-white group-hover:text-accent-cyan transition-colors">
                  Suriyakumar E
                </span>
                <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-mono hidden sm:inline-block">
                  AI & ML • Data Analytics
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => sounds.playHover()}
                  onClick={() => sounds.playClick()}
                  className="px-3.5 py-1.5 text-xs uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right Actions: Availability Badge, Sound Toggle, Admin & CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Live Status Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open for Internships
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

              {/* Action Button */}
              <a
                href="#contact"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
              >
                <span>Connect</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 mx-4 p-4 rounded-2xl glass-panel border border-white/10 shadow-2xl flex flex-col gap-2.5"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  sounds.playClick();
                }}
                className="px-3 py-2 text-sm text-zinc-200 hover:text-white hover:bg-white/5 rounded-lg"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-black bg-white rounded-full"
              >
                Connect
              </a>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
}
