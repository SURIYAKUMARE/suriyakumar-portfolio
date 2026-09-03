'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUp, Sparkles, Heart } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface FooterProps {
  photo?: string;
}

export default function Footer({ photo = '/images/suriyakumar-portrait.jpg' }: FooterProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sounds.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-500 font-mono text-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/40 shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Image
              src={photo}
              alt="Suriyakumar E"
              fill
              className="object-cover object-top"
            />
          </div>
          <div>
            <span className="text-zinc-200 font-sans font-medium block">
              Suriyakumar E // AI & Data Analytics
            </span>
            <span className="text-[11px] text-zinc-400">
              Rathinam Technical Campus • CSE (AI & ML)
            </span>
          </div>
        </div>

        {/* Center: Live Local Time */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400">COIMBATORE, TN:</span>
          <span className="text-white font-medium">{time || '11:30:00 AM'} IST</span>
        </div>

        {/* Right: Back to Top Button */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => sounds.playHover()}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-zinc-300 hover:text-white hover:border-accent-cyan/30 transition-all uppercase tracking-wider text-[11px] group"
          aria-label="Return to Top"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 text-accent-cyan" />
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
        <div>
          © {new Date().getFullYear()} Suriyakumar E. Designed & engineered for high impact.
        </div>
        <div className="flex items-center gap-4">
          <a href="#about" className="hover:text-zinc-300 transition-colors">About</a>
          <a href="#projects" className="hover:text-zinc-300 transition-colors">Projects</a>
          <a href="#education" className="hover:text-zinc-300 transition-colors">Education</a>
          <a href="#certifications" className="hover:text-zinc-300 transition-colors">Certifications</a>
          <a href="/admin" className="hover:text-accent-cyan transition-colors">Admin Portal</a>
        </div>
      </div>
    </footer>
  );
}
