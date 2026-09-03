'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  CheckCheck,
  Sparkles,
  ArrowUpRight,
  Linkedin,
  Github,
  MessageSquare,
} from 'lucide-react';
import { ProfileData } from '@/types';
import { sounds } from '@/lib/sound';

interface ContactProps {
  profile: ProfileData;
}

export default function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Data Analytics',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyEmail = () => {
    sounds.playClick();
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    sounds.playClick();
    navigator.clipboard.writeText(profile.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setStatus('submitting');

    try {
      if (typeof window !== 'undefined') {
        const key = 'surya_portfolio_messages_v1';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift({
          id: 'msg-' + Date.now(),
          ...formData,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(existing));
      }

      await new Promise((r) => setTimeout(r, 900));
      setStatus('success');
      sounds.playSuccess();

      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          service: 'Data Analytics',
          message: '',
        });
        setStatus('idle');
      }, 4000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[300px] sm:h-[400px] bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
            04 // GET IN TOUCH
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white mb-3 sm:mb-4">
          Let&apos;s Build Something <span className="text-gradient-accent">Intelligent.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-base lg:text-lg font-light max-w-xl mx-auto">
          Available for data analytics projects, AI/ML engineering internships, and research collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Left Column: Direct Connect & Info */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
          {/* Quick Copy Email & Phone Card */}
          <div className="p-5 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-display font-bold text-white">Direct Communication</h3>

            {/* Copyable Email Pill */}
            <div
              onClick={copyEmail}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 cursor-pointer group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    PRIMARY EMAIL
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-accent-cyan transition-colors break-all">
                    {profile.email}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/10 text-zinc-300 group-hover:text-white transition-colors shrink-0 ml-2">
                {copiedEmail ? (
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs text-emerald-400 font-mono">
                    <CheckCheck className="w-3.5 h-3.5" /> Copied
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </div>
            </div>

            {/* Copyable Phone Pill */}
            <div
              onClick={copyPhone}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 cursor-pointer group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    DIRECT CALL / WHATSAPP
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {profile.phone}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/10 text-zinc-300 group-hover:text-white transition-colors shrink-0 ml-2">
                {copiedPhone ? (
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs text-emerald-400 font-mono">
                    <CheckCheck className="w-3.5 h-3.5" /> Copied
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="p-5 sm:p-6 rounded-3xl glass-card border border-white/10">
            <span className="text-[11px] sm:text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-3 sm:mb-4">
              Professional Profiles
            </span>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/50 hover:bg-accent-cyan/10 text-zinc-200 hover:text-accent-cyan transition-all text-xs font-medium group active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-accent-cyan" />
                  <span>LinkedIn</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent-cyan transition-colors" />
              </a>

              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-zinc-200 hover:text-white transition-all text-xs font-medium group active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form (16px base font size on mobile to prevent iOS Safari zoom) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl glass-card border border-white/15 shadow-2xl relative overflow-hidden space-y-5"
          >
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Johnson"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
              />
            </div>

            {/* Category / Area of Collaboration */}
            <div>
              <label htmlFor="service" className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                Project / Interest Area
              </label>
              <select
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full bg-[#101724] border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan transition-all"
              >
                <option value="Data Analytics">Data Analytics & Power BI</option>
                <option value="AI & ML Engineering">AI & Machine Learning Systems</option>
                <option value="Hardware / IoT Telemetry">Hardware & IoT (NSG Tracking)</option>
                <option value="Internship / Hiring">Internship & Recruitment Opportunity</option>
                <option value="General Collaboration">Academic Research & Other</option>
              </select>
            </div>

            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                Your Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your initiative or opportunity..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan resize-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 px-6 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-98"
            >
              {status === 'submitting' ? (
                <span>Transmitting Inquiry...</span>
              ) : status === 'success' ? (
                <span className="flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Message Sent Successfully!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
