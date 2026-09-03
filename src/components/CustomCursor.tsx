'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'project' | 'text'>('default');
  const [customText, setCustomText] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for buttery cursor tracking
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const followerConfig = { damping: 20, stiffness: 180, mass: 0.8 };
  const followerX = useSpring(mouseX, followerConfig);
  const followerY = useSpring(mouseY, followerConfig);

  useEffect(() => {
    // Detect touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Scan interactive targets on hover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectEl = target.closest('[data-cursor="project"]');
      const textEl = target.closest('[data-cursor="text"]');
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]');

      if (projectEl) {
        setCursorType('project');
        setCustomText('VIEW');
      } else if (textEl) {
        setCursorType('text');
        setCustomText('');
      } else if (interactiveEl) {
        setCursorType('pointer');
        setCustomText('');
      } else {
        setCursorType('default');
        setCustomText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Follower Ring */}
      <motion.div
        style={{
          x: followerX,
          y: followerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute rounded-full pointer-events-none flex items-center justify-center transition-colors duration-300"
        animate={{
          width: cursorType === 'project' ? 84 : cursorType === 'pointer' ? 48 : 34,
          height: cursorType === 'project' ? 84 : cursorType === 'pointer' ? 48 : 34,
          backgroundColor: cursorType === 'project' ? 'rgba(139, 92, 246, 0.85)' : 'rgba(255, 255, 255, 0.05)',
          borderColor: cursorType === 'project' ? 'transparent' : 'rgba(168, 85, 247, 0.45)',
          borderWidth: cursorType === 'project' ? 0 : 1.5,
          backdropFilter: cursorType === 'project' ? 'blur(6px)' : 'none',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        {cursorType === 'project' && (
          <span className="text-[11px] font-bold tracking-widest text-white uppercase select-none">
            {customText}
          </span>
        )}
      </motion.div>

      {/* Center Precision Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute rounded-full pointer-events-none bg-white"
        animate={{
          width: cursorType === 'project' ? 0 : cursorType === 'pointer' ? 6 : 5,
          height: cursorType === 'project' ? 0 : cursorType === 'pointer' ? 6 : 5,
          opacity: cursorType === 'project' ? 0 : 1,
          backgroundColor: cursorType === 'pointer' ? '#c084fc' : '#ffffff',
          boxShadow: cursorType === 'pointer' ? '0 0 12px #8b5cf6' : '0 0 8px rgba(255,255,255,0.6)',
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
