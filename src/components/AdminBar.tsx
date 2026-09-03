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
  GraduationCap,
  Sliders,
  BarChart3,
  Cpu,
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
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
} from 'lucide-react';
import { ProfileData, Project, CertificationItem, EducationItem, ContactMessage } from '@/types';
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
  const [activeTab, setActiveTab] = useState<
    'photo' | 'identity' | 'stats' | 'skills' | 'projects' | 'education' | 'certs' | 'messages'
  >('photo');

  // Login form state
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inquiries state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Modals for projects & certs & education
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [isCreatingCert, setIsCreatingCert] = useState(false);

  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [isCreatingEdu, setIsCreatingEdu] = useState(false);

  // New skill addition state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(85);
  const [newSkillCategoryIndex, setNewSkillCategoryIndex] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'login' && auth !== 'true') {
        setShowLoginModal(true);
      } else if (params.get('admin') === 'open' && auth === 'true') {
        setShowDrawer(true);
      }

      const storedMsgs = localStorage.getItem('surya_portfolio_messages_v1');
      if (storedMsgs) setMessages(JSON.parse(storedMsgs));
    }

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

  // General Profile Saver
  const saveProfileData = async (updated: ProfileData, toastMsg = 'Changes saved live!') => {
    onProfileUpdate(updated);
    await DataService.saveProfile(updated);
    showToast(toastMsg);
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
    setIsCreatingProject(false);
    showToast('Project saved successfully!');
    sounds.playSuccess();
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    sounds.playClick();
    await DataService.deleteProject(id);
    const updated = await DataService.getProjects();
    onProjectsUpdate(updated);
    showToast('Project deleted.');
  };

  // Save Certification
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    sounds.playClick();
    const currentCerts = profile.certifications || [];
    const index = currentCerts.findIndex((c) => c.id === editingCert.id);
    let updatedCerts: CertificationItem[];

    if (index >= 0) {
      updatedCerts = [...currentCerts];
      updatedCerts[index] = { ...editingCert };
    } else {
      updatedCerts = [editingCert, ...currentCerts];
    }

    const updatedProfile = { ...profile, certifications: updatedCerts };
    await saveProfileData(updatedProfile, 'Certificate saved live!');
    setEditingCert(null);
    setIsCreatingCert(false);
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    sounds.playClick();
    const updatedCerts = (profile.certifications || []).filter((c) => c.id !== id);
    const updatedProfile = { ...profile, certifications: updatedCerts };
    await saveProfileData(updatedProfile, 'Certificate deleted.');
  };

  // Save Education
  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;

    sounds.playClick();
    const currentEdu = profile.education || [];
    const index = currentEdu.findIndex((ed) => ed.id === editingEdu.id);
    let updatedEdu: EducationItem[];

    if (index >= 0) {
      updatedEdu = [...currentEdu];
      updatedEdu[index] = { ...editingEdu };
    } else {
      updatedEdu = [editingEdu, ...currentEdu];
    }

    const updatedProfile = { ...profile, education: updatedEdu };
    await saveProfileData(updatedProfile, 'Education timeline saved live!');
    setEditingEdu(null);
    setIsCreatingEdu(false);
  };

  const handleDeleteEdu = async (id: string) => {
    if (!confirm('Delete this education milestone?')) return;
    sounds.playClick();
    const updatedEdu = (profile.education || []).filter((ed) => ed.id !== id);
    const updatedProfile = { ...profile, education: updatedEdu };
    await saveProfileData(updatedProfile, 'Education milestone deleted.');
  };

  // Add Skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    sounds.playClick();
    const skillsCopy = JSON.parse(JSON.stringify(profile.skills));
    if (skillsCopy[newSkillCategoryIndex]) {
      skillsCopy[newSkillCategoryIndex].items.push({
        name: newSkillName.trim(),
        level: Number(newSkillLevel),
      });
      const updatedProfile = { ...profile, skills: skillsCopy };
      await saveProfileData(updatedProfile, `Added "${newSkillName}" to skills!`);
      setNewSkillName('');
      setNewSkillLevel(85);
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (catIndex: number, skillIndex: number) => {
    sounds.playClick();
    const skillsCopy = JSON.parse(JSON.stringify(profile.skills));
    if (skillsCopy[catIndex]) {
      skillsCopy[catIndex].items.splice(skillIndex, 1);
      const updatedProfile = { ...profile, skills: skillsCopy };
      await saveProfileData(updatedProfile, 'Skill removed.');
    }
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
      {/* 1. FLOATING QUICK-CONTROL PILL (When logged in on landing page)           */}
      {/* ========================================================================= */}
      {isAuthenticated && (
        <motion.aside
          aria-label="Admin Control Bar"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-full glass-panel border border-accent-cyan/40 bg-[#07090e]/95 shadow-[0_0_35px_rgba(0,240,255,0.3)] backdrop-blur-2xl max-w-[95vw]"
        >
          {/* Avatar & Status */}
          <div className="flex items-center gap-2 pr-2 border-r border-white/15 shrink-0">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-accent-cyan/60">
              <Image src={currentPhoto} alt="Admin" fill className="object-cover object-top" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-accent-cyan hidden sm:inline-block">
              EDIT ALL THINGS
            </span>
          </div>

          {/* Quick Look Switchers */}
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
            <span>Open Studio Drawer</span>
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
      {/* 2. ADMIN LOGIN MODAL ON LANDING PAGE                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showLoginModal && !isAuthenticated && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
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
                    <p className="text-[10px] font-mono text-zinc-400">Unlock & Edit All Things</p>
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
      {/* 3. SLIDING STUDIO DRAWER (Edit All Things on Landing Page)               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showDrawer && isAuthenticated && (
          <div className="fixed inset-0 z-[999] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full max-w-2xl h-full bg-[#0a0e17] border-l border-white/15 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0d131f]">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/60">
                    <Image src={currentPhoto} alt="Admin" fill className="object-cover object-top" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-serif text-white">Full Portfolio Studio</h3>
                    <p className="text-[10px] font-mono text-zinc-400">Edit every section live on landing page</p>
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

              {/* Tabs Navigation Rail */}
              <div className="flex gap-1 p-2 border-b border-white/10 bg-[#07090e] overflow-x-auto no-scrollbar">
                {[
                  { id: 'photo', label: 'Photo & Looks', icon: Camera },
                  { id: 'identity', label: 'Brand & Bio', icon: Sliders },
                  { id: 'stats', label: 'Bento Stats', icon: BarChart3 },
                  { id: 'skills', label: 'Skills & %', icon: Cpu },
                  { id: 'projects', label: 'Projects', icon: Layers, count: projects.length },
                  { id: 'education', label: 'Education', icon: GraduationCap, count: profile.education?.length },
                  { id: 'certs', label: 'Certificates', icon: Award, count: profile.certifications?.length },
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
                          ? 'bg-accent-cyan text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className="px-1 rounded-full bg-black/30 text-[9px]">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* 1. PHOTO & LOOKS */}
                {activeTab === 'photo' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-accent-cyan">
                      Active Profile Picture (Applies Everywhere)
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => handleSwitchPhoto('/images/suriyakumar-portrait.jpg')}
                        className={`p-3 rounded-2xl glass-panel border cursor-pointer transition-all ${
                          currentPhoto === '/images/suriyakumar-portrait.jpg'
                            ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
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
                            ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
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

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <label className="text-xs font-mono text-zinc-400 block">Or Paste Any Custom Image URL</label>
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
                          className="px-4 py-2 rounded-xl bg-accent-cyan text-black font-semibold text-xs"
                        >
                          Apply Live
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. IDENTITY & BIO */}
                {activeTab === 'identity' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      sounds.playClick();
                      await saveProfileData(profile, 'Identity & Bio saved live!');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => onProfileUpdate({ ...profile, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1">Status Badge</label>
                        <input
                          type="text"
                          value={profile.status}
                          onChange={(e) => onProfileUpdate({ ...profile, status: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => onProfileUpdate({ ...profile, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-1">Tagline / Subtitle</label>
                      <textarea
                        rows={2}
                        value={profile.subtitle}
                        onChange={(e) => onProfileUpdate({ ...profile, subtitle: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan resize-none"
                      />
                    </div>

                    {/* Bio Paragraphs */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono uppercase text-accent-cyan">Bio Paragraphs</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newBio = [...profile.bio_paragraphs, 'New paragraph content...'];
                            onProfileUpdate({ ...profile, bio_paragraphs: newBio });
                          }}
                          className="text-[10px] font-mono text-accent-cyan hover:underline"
                        >
                          + Add Paragraph
                        </button>
                      </div>

                      {profile.bio_paragraphs.map((p, pIdx) => (
                        <div key={pIdx} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                            <span>Paragraph {pIdx + 1}</span>
                            {profile.bio_paragraphs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newBio = profile.bio_paragraphs.filter((_, i) => i !== pIdx);
                                  onProfileUpdate({ ...profile, bio_paragraphs: newBio });
                                }}
                                className="text-red-400 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const newBio = [...profile.bio_paragraphs];
                              newBio[pIdx] = e.target.value;
                              onProfileUpdate({ ...profile, bio_paragraphs: newBio });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan resize-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Contact Coordinates */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <span className="text-xs font-mono uppercase text-emerald-400 block">Contact Coordinates</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono text-zinc-400 block mb-1">Email</label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => onProfileUpdate({ ...profile, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-zinc-400 block mb-1">Phone</label>
                          <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => onProfileUpdate({ ...profile, phone: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono text-zinc-400 block mb-1">LinkedIn URL</label>
                          <input
                            type="url"
                            value={profile.socials.linkedin}
                            onChange={(e) =>
                              onProfileUpdate({
                                ...profile,
                                socials: { ...profile.socials, linkedin: e.target.value },
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-zinc-400 block mb-1">GitHub URL</label>
                          <input
                            type="url"
                            value={profile.socials.github}
                            onChange={(e) =>
                              onProfileUpdate({
                                ...profile,
                                socials: { ...profile.socials, github: e.target.value },
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 shadow-lg"
                    >
                      Save All Identity & Bio Live
                    </button>
                  </form>
                )}

                {/* 3. BENTO STATS */}
                {activeTab === 'stats' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      sounds.playClick();
                      await saveProfileData(profile, 'Stats saved live on landing page!');
                    }}
                    className="space-y-4"
                  >
                    <h4 className="text-xs font-mono uppercase tracking-wider text-accent-cyan">
                      Edit Bento Stats Grid (Numbers count up on scroll)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profile.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-2">
                          <div>
                            <label className="text-[10px] font-mono text-zinc-400 block mb-1">Number Metric</label>
                            <input
                              type="text"
                              value={stat.number}
                              onChange={(e) => {
                                const newStats = [...profile.stats];
                                newStats[sIdx] = { ...stat, number: e.target.value };
                                onProfileUpdate({ ...profile, stats: newStats });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-base font-bold font-display text-accent-cyan focus:outline-none focus:border-accent-cyan"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-zinc-400 block mb-1">Label</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...profile.stats];
                                newStats[sIdx] = { ...stat, label: e.target.value };
                                onProfileUpdate({ ...profile, stats: newStats });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-accent-cyan"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-zinc-400 block mb-1">Sublabel</label>
                            <input
                              type="text"
                              value={stat.sublabel || ''}
                              onChange={(e) => {
                                const newStats = [...profile.stats];
                                newStats[sIdx] = { ...stat, sublabel: e.target.value };
                                onProfileUpdate({ ...profile, stats: newStats });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-accent-cyan"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200"
                    >
                      Save Bento Stats Live
                    </button>
                  </form>
                )}

                {/* 4. TECHNICAL SKILLS & PROFICIENCY */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-accent-cyan">
                      Technical Arsenal & Proficiency Levels
                    </h4>

                    {/* Add New Skill Form */}
                    <form onSubmit={handleAddSkill} className="p-4 rounded-2xl glass-panel border border-accent-cyan/30 space-y-3 bg-accent-cyan/5">
                      <span className="text-[10px] font-mono uppercase text-accent-cyan font-bold block">
                        + Add New Skill
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder="e.g. PyTorch, Docker"
                          className="sm:col-span-2 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-accent-cyan"
                        />
                        <select
                          value={newSkillCategoryIndex}
                          onChange={(e) => setNewSkillCategoryIndex(Number(e.target.value))}
                          className="bg-[#101724] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-accent-cyan"
                        >
                          {profile.skills.map((c, i) => (
                            <option key={i} value={i}>{c.category.split(' ')[0]}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-mono text-zinc-400 whitespace-nowrap">
                          Proficiency: {newSkillLevel}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={newSkillLevel}
                          onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                          className="flex-1 accent-accent-cyan"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 rounded-lg bg-accent-cyan text-black font-semibold text-xs whitespace-nowrap"
                        >
                          Add Skill
                        </button>
                      </div>
                    </form>

                    {/* Skill List by Category */}
                    {profile.skills.map((cat, catIdx) => (
                      <div key={cat.category} className="space-y-3">
                        <h5 className="text-xs font-mono uppercase text-zinc-300 pb-1 border-b border-white/10">
                          {cat.category} ({cat.items.length})
                        </h5>

                        <div className="space-y-2">
                          {cat.items.map((skill, sIdx) => (
                            <div key={skill.name} className="flex items-center gap-3 p-2.5 rounded-xl glass-panel border border-white/5 text-xs">
                              <span className="w-36 truncate font-medium text-white">{skill.name}</span>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={skill.level}
                                onChange={async (e) => {
                                  const skillsCopy = JSON.parse(JSON.stringify(profile.skills));
                                  skillsCopy[catIdx].items[sIdx].level = Number(e.target.value);
                                  const updatedProfile = { ...profile, skills: skillsCopy };
                                  onProfileUpdate(updatedProfile);
                                  await DataService.saveProfile(updatedProfile);
                                }}
                                className="flex-1 accent-accent-cyan"
                              />
                              <span className="w-10 text-right font-mono text-zinc-400">{skill.level}%</span>
                              <button
                                onClick={() => handleDeleteSkill(catIdx, sIdx)}
                                className="p-1 text-zinc-500 hover:text-red-400"
                                title="Delete skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. PROJECTS */}
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono uppercase text-zinc-400">
                        SpaceEdu Planetary Projects ({projects.length})
                      </span>
                      <button
                        onClick={() => {
                          setEditingProject({
                            id: 'proj-' + Date.now(),
                            eyebrow: 'PROJECT 0' + (projects.length + 1),
                            title: '',
                            tagline: '',
                            shortDescription: '',
                            description: '',
                            technicalCallout: '',
                            calloutDetail: '',
                            category: 'Data Analytics',
                            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
                            featured: true,
                            order_index: projects.length + 1,
                            year: '2026',
                            technologies: ['Python', 'SQL'],
                          });
                          setIsCreatingProject(true);
                          sounds.playClick();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-cyan text-black font-semibold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {projects.map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate font-serif">{p.title}</h5>
                            <span className="text-[10px] font-mono text-accent-cyan">{p.category} • {p.year}</span>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">{p.shortDescription || p.description}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingProject(p);
                                setIsCreatingProject(false);
                                sounds.playClick();
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. EDUCATION TIMELINE */}
                {activeTab === 'education' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono uppercase text-zinc-400">
                        Academic Milestones ({profile.education?.length || 0})
                      </span>
                      <button
                        onClick={() => {
                          setEditingEdu({
                            id: 'edu-' + Date.now(),
                            degree: '',
                            institution: '',
                            location: 'Coimbatore, Tamil Nadu',
                            period: '2025 — 2029',
                            description: '',
                          });
                          setIsCreatingEdu(true);
                          sounds.playClick();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-cyan text-black font-semibold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Education</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(profile.education || []).map((edu) => (
                        <div key={edu.id} className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="text-xs font-bold text-white font-serif">{edu.degree}</h5>
                              <p className="text-[10px] font-mono text-accent-cyan">{edu.institution} • {edu.period}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingEdu(edu);
                                  setIsCreatingEdu(false);
                                  sounds.playClick();
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEdu(edu.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-400 font-light">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. CERTIFICATES & AWARDS */}
                {activeTab === 'certs' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono uppercase text-zinc-400">
                        Certificates & Photos ({profile.certifications?.length || 0})
                      </span>
                      <button
                        onClick={() => {
                          setEditingCert({
                            id: 'cert-' + Date.now(),
                            title: '',
                            issuer: '',
                            year: '2026',
                            category: 'Data Analytics',
                            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
                            featuredAward: false,
                          });
                          setIsCreatingCert(true);
                          sounds.playClick();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-cyan text-black font-semibold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Certificate</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(profile.certifications || []).map((cert) => (
                        <div key={cert.id} className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              {cert.imageUrl && (
                                <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-white/20 shrink-0">
                                  <img src={cert.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div>
                                <span className="text-[10px] font-mono text-accent-cyan uppercase">{cert.category}</span>
                                <h5 className="text-xs font-bold text-white font-serif">{cert.title}</h5>
                                <p className="text-[10px] font-mono text-zinc-400">{cert.issuer} • {cert.year}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingCert(cert);
                                  setIsCreatingCert(false);
                                  sounds.playClick();
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCert(cert.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. INQUIRIES */}
                {activeTab === 'messages' && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase text-zinc-400 block mb-2">
                      Inquiries Received ({messages.length})
                    </span>

                    {messages.length === 0 ? (
                      <p className="text-xs text-zinc-500 font-mono">No messages logged yet.</p>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="font-bold text-white">{m.name}</span>
                            <span className="text-zinc-500">{new Date(m.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="text-[11px] font-mono text-accent-cyan">
                            {m.email} {m.service && `• ${m.service}`}
                          </div>
                          <p className="text-xs text-zinc-300 font-light whitespace-pre-wrap">{m.message}</p>
                          <div className="flex gap-2 pt-1 border-t border-white/5">
                            <a
                              href={`https://wa.me/919445648373?text=${encodeURIComponent(`Hi ${m.name}, regarding your inquiry: ${m.message}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-mono flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" /> Reply on WhatsApp
                            </a>
                            <a
                              href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: Inquiry from ${m.name}`)}`}
                              className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[10px] font-mono flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" /> Reply via Mail
                            </a>
                          </div>
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

      {/* ========================================================================= */}
      {/* MODAL 1: PROJECT ADD / EDIT MODAL                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 overflow-y-auto">
            <div onClick={() => setEditingProject(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg p-6 rounded-3xl glass-card border border-white/20 bg-[#0a0e17] space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <h4 className="text-base font-bold font-serif text-white">
                {isCreatingProject ? 'Add New Project' : `Edit ${editingProject.title}`}
              </h4>
              <form onSubmit={handleSaveProject} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Project['category'] })}
                      className="w-full bg-[#101724] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    >
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Web & IoT">Web & IoT</option>
                      <option value="Full-Stack">Full-Stack</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Short Description (Phase 1)</label>
                  <input
                    type="text"
                    required
                    value={editingProject.shortDescription || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Full Description (Phase 2)</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Technical Specification Callout (Phase 3)</label>
                  <input
                    type="text"
                    value={editingProject.calloutDetail || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, calloutDetail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Live URL</label>
                    <input
                      type="url"
                      value={editingProject.liveUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={editingProject.githubUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
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

      {/* ========================================================================= */}
      {/* MODAL 2: CERTIFICATE ADD / EDIT MODAL                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingCert && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 overflow-y-auto">
            <div onClick={() => setEditingCert(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg p-6 rounded-3xl glass-card border border-white/20 bg-[#0a0e17] space-y-4"
            >
              <h4 className="text-base font-bold font-serif text-white">
                {isCreatingCert ? 'Add Certificate' : `Edit ${editingCert.title}`}
              </h4>
              <form onSubmit={handleSaveCert} className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Certificate Title</label>
                  <input
                    type="text"
                    required
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Issuer</label>
                    <input
                      type="text"
                      required
                      value={editingCert.issuer}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Year</label>
                    <input
                      type="text"
                      required
                      value={editingCert.year}
                      onChange={(e) => setEditingCert({ ...editingCert, year: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Category</label>
                  <select
                    value={editingCert.category}
                    onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value as CertificationItem['category'] })}
                    className="w-full bg-[#101724] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                  >
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Innovation & Honours">Innovation & Honours</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Certificate Photo URL</label>
                  <input
                    type="url"
                    value={editingCert.imageUrl || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                  />
                  {editingCert.imageUrl && (
                    <div className="mt-2 relative aspect-video w-32 rounded-lg overflow-hidden border border-white/20">
                      <img src={editingCert.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featAwardDrawer"
                    checked={!!editingCert.featuredAward}
                    onChange={(e) => setEditingCert({ ...editingCert, featuredAward: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-accent-cyan"
                  />
                  <label htmlFor="featAwardDrawer" className="text-xs font-mono text-zinc-300">
                    Featured Gold Award (YUDHISTRA Trophy)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs"
                  >
                    Save Certificate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: EDUCATION ADD / EDIT MODAL                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingEdu && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 overflow-y-auto">
            <div onClick={() => setEditingEdu(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg p-6 rounded-3xl glass-card border border-white/20 bg-[#0a0e17] space-y-4"
            >
              <h4 className="text-base font-bold font-serif text-white">
                {isCreatingEdu ? 'Add Academic Milestone' : `Edit ${editingEdu.degree}`}
              </h4>
              <form onSubmit={handleSaveEdu} className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Degree / Level</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.degree}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Institution</label>
                    <input
                      type="text"
                      required
                      value={editingEdu.institution}
                      onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Period</label>
                    <input
                      type="text"
                      required
                      value={editingEdu.period}
                      onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.location}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingEdu.description}
                    onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEdu(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs"
                  >
                    Save Education
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
