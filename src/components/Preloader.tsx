'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const duration = 1400; // ms
    const interval = 20; // update interval
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step + Math.random() * 2.5;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            if (onComplete) onComplete();
          }, 250);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[10000] flex flex-col justify-between bg-[#06080b] px-8 py-10 text-white select-none overflow-hidden"
        >
          {/* Background Ambient Aura */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-cyan/15 rounded-full blur-[140px]" />
          </div>

          {/* Top Info Bar */}
          <div className="flex items-center justify-between z-10 text-xs tracking-widest text-zinc-500 uppercase">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-zinc-300">SURIYAKUMAR E</span>
            </div>
            <div className="font-mono text-zinc-400">AI & ML // DATA ANALYTICS</div>
          </div>

          {/* Center Monogram / Kinetic Typography */}
          <div className="flex flex-col items-center justify-center z-10 my-auto text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative mb-6"
            >
              <div className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-zinc-400">
                SE<span className="text-accent-cyan">.</span>
              </div>
              <div className="text-xs tracking-[0.35em] text-accent-cyan uppercase font-mono mt-2">
                INTELLIGENCE × ANALYTICS
              </div>
            </motion.div>

            {/* Kinetic line loader */}
            <div className="w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative mt-4">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-cyan via-sky-400 to-emerald-400"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>

          {/* Bottom Counter & Status */}
          <div className="flex items-end justify-between z-10">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              INITIALIZING MODELS & DASHBOARDS
            </div>
            <div className="font-mono text-5xl md:text-7xl font-light tracking-tighter tabular-nums text-white">
              {Math.floor(progress)}
              <span className="text-2xl md:text-3xl text-accent-cyan">%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
