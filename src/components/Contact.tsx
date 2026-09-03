'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, Copy, CheckCheck, Sparkles, Mail, MapPin, Phone, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sound';
import { DataService } from '@/lib/supabase';
import { ProfileData } from '@/types';

interface ContactProps {
  profile: ProfileData;
}

export default function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Data Analytics & Dashboards',
    budget: 'Internship / Project Collaboration',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    sounds.playClick();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(profile.phone);
    setCopiedPhone(true);
    sounds.playClick();
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    sounds.playClick();

    try {
      await DataService.sendContactMessage(formData);
      setStatus('success');
      sounds.playSuccess();

      // Trigger celebratory confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#38bdf8', '#10b981', '#ffffff'],
      });

      // Reset form after 4 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          service: 'Data Analytics & Dashboards',
          budget: 'Internship / Project Collaboration',
          message: '',
        });
        setStatus('idle');
      }, 4500);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 mb-4">
          <Sparkles className="w-3 h-3 text-accent-cyan" />
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            05 // GET IN TOUCH
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white mb-4">
          Let&apos;s Build Something <span className="text-gradient-accent">Intelligent.</span>
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg font-light">
          Available for data analytics projects, AI/ML engineering internships, and research collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Connect & Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Quick Copy Email Card */}
          <div className="p-7 rounded-3xl glass-card border border-white/10 space-y-4">
            <h3 className="text-base font-display font-bold text-white">Direct Communication</h3>
            
            {/* Copyable Email Pill */}
            <div
              onClick={copyEmail}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    PRIMARY EMAIL
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-accent-cyan transition-colors">
                    {profile.email}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/10 text-zinc-300 group-hover:text-white transition-colors">
                {copiedEmail ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                    <CheckCheck className="w-3.5 h-3.5" /> Copied!
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
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    TELEPHONE / WHATSAPP
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {profile.phone}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/10 text-zinc-300 group-hover:text-white transition-colors">
                {copiedPhone ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                    <CheckCheck className="w-3.5 h-3.5" /> Copied!
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </div>
            </div>

            {/* Location & Timezone info */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono mb-1">
                <MapPin className="w-3.5 h-3.5 text-accent-cyan" />
                <span>LOCATION BASE</span>
              </div>
              <div className="text-xs text-zinc-200 font-medium">
                {profile.location}
              </div>
            </div>
          </div>

          {/* Social Profiles with Hover Glow */}
          <div className="p-6 rounded-3xl glass-card border border-white/10">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-4">
              Professional Profiles
            </span>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/50 hover:bg-accent-cyan/10 text-zinc-200 hover:text-accent-cyan transition-all text-xs font-medium group"
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
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-zinc-200 hover:text-white transition-all text-xs font-medium group"
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

        {/* Right Column: Animated Glass Form with Floating Labels */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-10 rounded-3xl glass-card border border-white/15 shadow-2xl relative overflow-hidden"
          >
            <div className="space-y-6">
              {/* Name Input with Floating Label */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder=" "
                  className="peer w-full bg-white/5 border border-white/10 rounded-2xl px-5 pt-6 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                />
                <label
                  htmlFor="name"
                  className="absolute left-5 top-4 text-xs font-mono uppercase tracking-wider text-zinc-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-accent-cyan peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px]"
                >
                  Your Name / Organization
                </label>
              </div>

              {/* Email Input with Floating Label */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder=" "
                  className="peer w-full bg-white/5 border border-white/10 rounded-2xl px-5 pt-6 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-4 text-xs font-mono uppercase tracking-wider text-zinc-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-accent-cyan peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px]"
                >
                  Email Address
                </label>
              </div>

              {/* Domain & Opportunity Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                    Subject / Area of Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-surface-100 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  >
                    <option value="Data Analytics & Dashboards">Data Analytics & Power BI</option>
                    <option value="AI / ML Engineering Project">AI / ML Engineering Project</option>
                    <option value="Internship / Full-Time Role">Internship / Apprenticeship</option>
                    <option value="Research & Hackathon Collaboration">Research Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                    Engagement Type
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-surface-100 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  >
                    <option value="Internship">Internship Opportunity</option>
                    <option value="Project Collaboration">Project Collaboration</option>
                    <option value="Full-Time / Part-Time">Academic / Industry Project</option>
                    <option value="Networking & Mentorship">General Connect</option>
                  </select>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="relative">
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder=" "
                  className="peer w-full bg-white/5 border border-white/10 rounded-2xl px-5 pt-6 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all resize-none"
                />
                <label
                  htmlFor="message"
                  className="absolute left-5 top-4 text-xs font-mono uppercase tracking-wider text-zinc-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-accent-cyan peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px]"
                >
                  Your message or project scope...
                </label>
              </div>

              {/* Morphing Submit Button */}
              <button
                type="submit"
                disabled={status !== 'idle'}
                onMouseEnter={() => sounds.playHover()}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 select-none relative overflow-hidden ${
                  status === 'success'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]'
                }`}
              >
                {status === 'idle' && (
                  <>
                    <span>Transmit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}

                {status === 'submitting' && (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting...</span>
                  </span>
                )}

                {status === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                    <span>Message Dispatched to Suriyakumar!</span>
                  </motion.div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
