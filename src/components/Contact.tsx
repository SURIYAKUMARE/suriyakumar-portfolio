'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MessageCircle,
  ExternalLink,
  Zap,
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
  const [dispatchedChannel, setDispatchedChannel] = useState<'whatsapp' | 'email' | 'both'>('both');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // International WhatsApp number for Suriyakumar E (+91-9445648373 -> 919445648373)
  const whatsappNumber = '919445648373';
  const targetEmail = profile.email || 'suryaaswin000@gmail.com';

  const copyEmail = () => {
    sounds.playClick();
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    sounds.playClick();
    navigator.clipboard.writeText(profile.phone || '+919445648373');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  // Helper to construct WhatsApp link
  const getWhatsAppUrl = (name: string, email: string, service: string, msg: string) => {
    const text = `*New Inquiry from Portfolio Website*%0A%0A*Name:* ${encodeURIComponent(name || 'Visitor')}%0A*Email:* ${encodeURIComponent(email || 'Not provided')}%0A*Area:* ${encodeURIComponent(service)}%0A%0A*Message:*%0A${encodeURIComponent(msg || 'Hi Suriyakumar, I saw your portfolio and would like to connect!')}`;
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  // Helper to construct Email mailto link
  const getEmailUrl = (name: string, email: string, service: string, msg: string) => {
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name || 'Visitor'} [${service}]`);
    const body = encodeURIComponent(
      `Hello Suriyakumar,\n\nName: ${name}\nEmail: ${email}\nProject Area: ${service}\n\nMessage:\n${msg}\n\nSent from your Portfolio website.`
    );
    return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  // Save to Admin Inbox
  const saveToAdminInbox = (channel: string) => {
    if (typeof window !== 'undefined') {
      const key = 'surya_portfolio_messages_v1';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift({
        id: 'msg-' + Date.now(),
        ...formData,
        budget: `Direct ${channel}`,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(existing));
    }
  };

  // 1. Direct Submit to WhatsApp
  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Please enter your name and message to continue to WhatsApp.');
      return;
    }
    sounds.playClick();
    setStatus('submitting');
    setDispatchedChannel('whatsapp');

    saveToAdminInbox('WhatsApp');

    const url = getWhatsAppUrl(formData.name, formData.email, formData.service, formData.message);
    window.open(url, '_blank');

    setTimeout(() => {
      setStatus('success');
      sounds.playSuccess();
    }, 400);
  };

  // 2. Direct Submit to Email Client
  const handleSendViaEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Please enter your name and message to continue to Email.');
      return;
    }
    sounds.playClick();
    setStatus('submitting');
    setDispatchedChannel('email');

    saveToAdminInbox('Email');

    const url = getEmailUrl(formData.name, formData.email, formData.service, formData.message);
    window.location.href = url;

    setTimeout(() => {
      setStatus('success');
      sounds.playSuccess();
    }, 400);
  };

  // 3. Dual Dispatch (WhatsApp + Email)
  const handleDualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    sounds.playClick();
    setStatus('submitting');
    setDispatchedChannel('both');

    saveToAdminInbox('WhatsApp & Mail');

    // Open WhatsApp in new tab
    const waUrl = getWhatsAppUrl(formData.name, formData.email, formData.service, formData.message);
    window.open(waUrl, '_blank');

    // Also trigger email client after slight delay
    setTimeout(() => {
      const mailUrl = getEmailUrl(formData.name, formData.email, formData.service, formData.message);
      window.location.href = mailUrl;
    }, 500);

    setStatus('success');
    sounds.playSuccess();
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[300px] sm:h-[400px] bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 mb-3 sm:mb-4 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-300 uppercase font-semibold">
            04 // DIRECT DISPATCH
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white mb-3 sm:mb-4">
          Let&apos;s Build Something <span className="text-gradient-accent">Intelligent.</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-base lg:text-lg font-light max-w-xl mx-auto">
          Send messages directly to my WhatsApp & inbox with zero friction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Left Column: Direct WhatsApp, Email, Call & Socials */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
          <div className="p-5 sm:p-7 rounded-3xl glass-card border border-white/10 space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-display font-bold text-white">Direct Channels</h3>

            {/* Direct WhatsApp Instant Card (Green Brand Highlight) */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Hi Suriyakumar, I saw your portfolio and would like to discuss a project / internship opportunity.'
              )}`}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => sounds.playHover()}
              onClick={() => sounds.playClick()}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/15 transition-all duration-300 group active:scale-98 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                  {/* Official WhatsApp SVG icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                      WHATSAPP DIRECT CHAT
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    +91 94456 48373
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:text-white transition-colors shrink-0 ml-2">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </a>

            {/* Copyable Email Pill */}
            <div
              onClick={copyEmail}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 cursor-pointer group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    PRIMARY EMAIL
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-accent-cyan transition-colors break-all">
                    {targetEmail}
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
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    DIRECT PHONE
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-accent-cyan transition-colors">
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

        {/* Right Column: Direct Dispatch Form (WhatsApp + Mail) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 rounded-3xl glass-card border border-white/15 shadow-2xl relative overflow-hidden space-y-5">
            {/* Form Success State Notification */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm space-y-3"
                >
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Inquiry Dispatched Successfully!</span>
                  </div>
                  <p className="text-zinc-300 font-light text-xs leading-relaxed">
                    Your message was prepared directly for Suriyakumar E. If WhatsApp or your email client didn&apos;t open automatically, use these instant buttons:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={getWhatsAppUrl(formData.name, formData.email, formData.service, formData.message)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-400"
                    >
                      <span>Open in WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={getEmailUrl(formData.name, formData.email, formData.service, formData.message)}
                      className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-zinc-200"
                    >
                      <span>Open in Email App</span>
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleDualSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                  Your Name <span className="text-accent-cyan">*</span>
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                />
              </div>

              {/* Category / Area */}
              <div>
                <label htmlFor="service" className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                  Project / Discussion Area
                </label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-[#101724] border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan transition-all"
                >
                  <option value="Data Analytics">Data Analytics & Power BI</option>
                  <option value="AI & ML Systems">AI & Machine Learning Systems</option>
                  <option value="Hardware / IoT Telemetry">Hardware & GPS Telemetry (NSG)</option>
                  <option value="Internship / Hiring">Internship & Recruitment</option>
                  <option value="Academic Research">Research & Innovation</option>
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                  Your Message <span className="text-accent-cyan">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your project, internship opportunity, or question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan resize-none transition-all"
                />
              </div>

              {/* Direct Multi-Channel Dispatch Buttons */}
              <div className="pt-2 space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                  Choose Direct Dispatch Method:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Button 1: Send via WhatsApp */}
                  <button
                    type="button"
                    onClick={handleSendViaWhatsApp}
                    className="py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-98"
                  >
                    {/* WhatsApp icon */}
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Direct via WhatsApp</span>
                  </button>

                  {/* Button 2: Send via Email */}
                  <button
                    type="button"
                    onClick={handleSendViaEmail}
                    className="py-3.5 px-4 rounded-xl glass-panel border border-white/20 hover:border-accent-cyan text-white hover:text-accent-cyan font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <Mail className="w-4 h-4 text-accent-cyan" />
                    <span>Direct via Mail</span>
                  </button>
                </div>

                {/* Primary Dual Dispatch Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 px-6 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to WhatsApp & Mail (Dual Dispatch)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
