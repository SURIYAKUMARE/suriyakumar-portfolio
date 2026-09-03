'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Key,
  X,
  Camera,
  Layers,
  Award,
  MessageSquare,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2,
  ExternalLink,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { ProfileData, Project, CertificationItem, ContactMessage } from '@/types';
import { DataService } from '@/lib/supabase';
import { sounds } from '@/lib/sound';

interface AdminBarProps {
  profile: ProfileData;
  onProfileUpdate: (updated: ProfileData) => void;
  projects: Project[];
  onProjectsUpdate: (updated: Project[]) => void;
}

export default function AdminBar({
  profile,
  onProfileUpdate,
  projects,
  onProjectsUpdate,
}: AdminBarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<'photo' | 'profile' | 'certs' | 'projects' | 'messages'>('photo');

  // Login form state
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inquiries state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Project editing
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    // Check existing authentication
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    // Check URL parameters (e.g. /?admin=login or /?admin=open)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'login' && auth !== 'true') {
        setShowLoginModal(true);
      } else if (params.get('admin') === 'open' && auth === 'true') {
        setShowDrawer(true);
      }

      // Load contact messages
      const storedMsgs = localStorage.getItem('surya_portfolio_messages_v1');
      if (storedMsgs) setMessages(JSON.parse(storedMsgs));
    }

    // Custom event listener from footer link
    const handleOpenLogin = () => {
      if (sessionStorage.getItem('admin_authenticated') === 'true') {
        setShowDrawer(true);
      } else {
        setShowLoginModal(true);
      }
    };

    window.addEventListener('open-admin-login', handleOpenLogin);
    return () => window.removeEventListener('open-admin-login', handleOpenLogin);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (password.trim() === 'suryaaswin@12') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setShowLoginModal(false);
      setPassword('');
      sounds.playSuccess();
      showToast('Welcome back, Suriyakumar! Admin mode active.');
    } else {
      setLoginError('Incorrect admin password.');
      sounds.playClick();
    }
  };

  const handleLogout = () => {
    sounds.playClick();
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setShowDrawer(false);
    showToast('Logged out of Admin mode.');
  };

  // 1-Click Photo Switcher
  const handleSwitchPhoto = async (photoUrl: string) => {
    sounds.playClick();
    const updated = { ...profile, photo_url: photoUrl };
    onProfileUpdate(updated);
    await DataService.saveProfile(updated);
    showToast('Profile photo updated live everywhere!');
    sounds.playSuccess();
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    sounds.playClick();
    await DataService.saveProject(editingProject);
    const updated = await DataService.getProjects();
    onProjectsUpdate(updated);
    setEditingProject(null);
    showToast('Project saved successfully!');
    sounds.playSuccess();
  };

  const currentPhoto = profile.photo_url || '/images/suriyakumar-portrait.jpg';

  return (
    <>
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-[9999] px-4 py-2.5 rounded-2xl glass-panel border border-accent-cyan/40 bg-[#0a0e17]/95 text-accent-cyan text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. FLOATING ADMIN QUICK-CONTROL PILL (When logged in on landing page)    */}
      {/* ========================================================================= */}
      {isAuthenticated && (
        <motion.aside
          aria-label="Admin Control Bar"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-full glass-panel border border-accent-cyan/40 bg-[#07090e]/90 shadow-[0_0_35px_rgba(0,240,255,0.3)] backdrop-blur-2xl max-w-[95vw]"
        >
          {/* Avatar & Status */}
          <div className="flex items-center gap-2 pr-2 border-r border-white/15 shrink-0">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-accent-cyan/60">
              <Image src={currentPhoto} alt="Admin" fill className="object-cover object-top" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-accent-cyan hidden sm:inline-block">
              ADMIN MODE
            </span>
          </div>

          {/* Quick Photo Switcher Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleSwitchPhoto('/images/suriyakumar-portrait.jpg')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all ${
                currentPhoto === '/images/suriyakumar-portrait.jpg'
                  ? 'bg-accent-cyan text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.6)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Set Suit Portrait"
            >
              👔 Suit
            </button>
            <button
              onClick={() => handleSwitchPhoto('/images/suriyakumar-casual.jpg')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all ${
                currentPhoto === '/images/suriyakumar-casual.jpg'
                  ? 'bg-accent-cyan text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.6)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Set Casual Portrait"
            >
              🕶️ Casual
            </button>
          </div>

          {/* Studio Drawer Trigger */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowDrawer(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-[11px] font-mono transition-colors shrink-0"
          >
            <Sliders className="w-3 h-3 text-accent-cyan" />
            <span>Studio Drawer</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors shrink-0"
            title="Exit Admin Mode"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </motion.aside>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN LOGIN MODAL DIRECTLY ON LANDING PAGE                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showLoginModal && !isAuthenticated && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-white/20 bg-[#0a0e17] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent-cyan/15 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-serif text-white">Owner Access</h3>
                    <p className="text-[10px] font-mono text-zinc-400">Stay on Landing Page</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowLoginModal(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loginError && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-accent-cyan text-black font-semibold text-xs uppercase tracking-wider hover:bg-accent-cyan/90 transition-colors shadow-lg"
                >
                  Unlock & Stay on Landing Page
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <span className="text-[10px] font-mono text-zinc-500">
                  Protected Portfolio Studio • Suriyakumar E
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. SLIDING STUDIO DRAWER OVER LANDING PAGE                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showDrawer && isAuthenticated && (
          <div className="fixed inset-0 z-[999] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full max-w-xl h-full bg-[#0a0e17] border-l border-white/15 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0d131f]">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/60">
                    <Image src={currentPhoto} alt="Admin" fill className="object-cover object-top" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-serif text-white">Live Studio Drawer</h3>
                    <p className="text-[10px] font-mono text-zinc-400">Edits sync live on landing page</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-2 border-b border-white/10 bg-[#07090e] overflow-x-auto no-scrollbar">
                {[
                  { id: 'photo', label: 'Photo & Looks', icon: Camera },
                  { id: 'profile', label: 'Bio & Identity', icon: Sliders },
                  { id: 'certs', label: 'Certificates', icon: Award, count: profile.certifications?.length },
                  { id: 'projects', label: 'Projects', icon: Layers, count: projects.length },
                  { id: 'messages', label: 'Inquiries', icon: MessageSquare, count: messages.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as typeof activeTab);
                        sounds.playClick();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono rounded-lg whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-accent-cyan text-black font-bold'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className="px-1 rounded-full bg-black/20 text-[9px]">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* 1. PHOTO & LOOKS TAB */}
                {activeTab === 'photo' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-accent-cyan">
                      Active Profile Picture
                    </h4>

                    {/* Presets */}
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => handleSwitchPhoto('/images/suriyakumar-portrait.jpg')}
                        className={`p-3 rounded-2xl glass-panel border cursor-pointer transition-all ${
                          currentPhoto === '/images/suriyakumar-portrait.jpg'
                            ? 'border-accent-cyan bg-accent-cyan/10'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-2">
                          <Image src="/images/suriyakumar-portrait.jpg" alt="Suit" fill className="object-cover object-top" />
                        </div>
                        <span className="text-xs font-bold text-white block">Executive Suit</span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {currentPhoto === '/images/suriyakumar-portrait.jpg' ? '● Active' : 'Click to Set'}
                        </span>
                      </div>

                      <div
                        onClick={() => handleSwitchPhoto('/images/suriyakumar-casual.jpg')}
                        className={`p-3 rounded-2xl glass-panel border cursor-pointer transition-all ${
                          currentPhoto === '/images/suriyakumar-casual.jpg'
                            ? 'border-accent-cyan bg-accent-cyan/10'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-2">
                          <Image src="/images/suriyakumar-casual.jpg" alt="Casual" fill className="object-cover object-top" />
                        </div>
                        <span className="text-xs font-bold text-white block">Casual Look</span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {currentPhoto === '/images/suriyakumar-casual.jpg' ? '● Active' : 'Click to Set'}
                        </span>
                      </div>
                    </div>

                    {/* Custom URL Input */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <label className="text-xs font-mono text-zinc-400 block">Or Custom Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customPhotoInput}
                          onChange={(e) => setCustomPhotoInput(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customPhotoInput.trim()) {
                              handleSwitchPhoto(customPhotoInput.trim());
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-accent-cyan text-black font-semibold text-xs"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. BIO & IDENTITY TAB */}
                {activeTab === 'profile' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      sounds.playClick();
                      await DataService.saveProfile(profile);
                      showToast('Profile saved live!');
                      sounds.playSuccess();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => onProfileUpdate({ ...profile, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => onProfileUpdate({ ...profile, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">Subtitle / Tagline</label>
                      <textarea
                        rows={3}
                        value={profile.subtitle}
                        onChange={(e) => onProfileUpdate({ ...profile, subtitle: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200"
                    >
                      Save Identity Live
                    </button>
                  </form>
                )}

                {/* 3. CERTIFICATES & PHOTOS TAB */}
                {activeTab === 'certs' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono uppercase text-zinc-400">
                        Certificates & Photos ({profile.certifications?.length || 0})
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(profile.certifications || []).map((cert, cIdx) => (
                        <div
                          key={cert.id}
                          className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-mono text-accent-cyan uppercase">{cert.category}</span>
                              <h5 className="text-xs font-bold text-white font-serif">{cert.title}</h5>
                              <p className="text-[10px] font-mono text-zinc-400">{cert.issuer} • {cert.year}</p>
                            </div>
                            {cert.featuredAward && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                Award
                              </span>
                            )}
                          </div>

                          {/* Image preview & URL input */}
                          <div className="space-y-1 pt-2 border-t border-white/5">
                            <label className="text-[10px] font-mono text-zinc-400 block">
                              Certificate Photo URL:
                            </label>
                            <div className="flex items-center gap-2">
                              {cert.imageUrl && (
                                <div className="relative w-10 h-7 rounded overflow-hidden border border-white/20 shrink-0">
                                  <img src={cert.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <input
                                type="url"
                                value={cert.imageUrl || ''}
                                onChange={async (e) => {
                                  const updatedCerts = [...(profile.certifications || [])];
                                  updatedCerts[cIdx] = { ...cert, imageUrl: e.target.value };
                                  const updatedProfile = { ...profile, certifications: updatedCerts };
                                  onProfileUpdate(updatedProfile);
                                  await DataService.saveProfile(updatedProfile);
                                }}
                                placeholder="Paste certificate image link..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-accent-cyan"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono uppercase text-zinc-400">
                        SpaceEdu Planetary Projects ({projects.length})
                      </span>
                    </div>

                    <div className="space-y-3">
                      {projects.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate font-serif">{p.title}</h5>
                            <span className="text-[10px] font-mono text-zinc-400">{p.category}</span>
                          </div>
                          <button
                            onClick={() => setEditingProject(p)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. MESSAGES TAB */}
                {activeTab === 'messages' && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase text-zinc-400 block mb-2">
                      Inquiries Received ({messages.length})
                    </span>

                    {messages.length === 0 ? (
                      <p className="text-xs text-zinc-500 font-mono">No messages logged yet.</p>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="font-bold text-white">{m.name}</span>
                            <span className="text-zinc-500">{new Date(m.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-zinc-300 font-light">{m.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Edit Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <div onClick={() => setEditingProject(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg p-6 rounded-3xl glass-card border border-white/20 bg-[#0a0e17] space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <h4 className="text-base font-bold font-serif text-white">Edit {editingProject.title}</h4>
              <form onSubmit={handleSaveProject} className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Short Description</label>
                  <input
                    type="text"
                    value={editingProject.shortDescription || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Technical Specification Callout</label>
                  <input
                    type="text"
                    value={editingProject.calloutDetail || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, calloutDetail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
