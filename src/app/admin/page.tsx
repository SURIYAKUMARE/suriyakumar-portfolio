'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Save,
  LogOut,
  Layers,
  User,
  GraduationCap,
  Award,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  Key,
  Camera,
  Check,
  Sparkles,
  Link2,
} from 'lucide-react';
import { Project, ProfileData, EducationItem, CertificationItem, ContactMessage } from '@/types';
import { DataService, isSupabaseConfigured, supabase } from '@/lib/supabase';
import { initialProfile, initialProjects } from '@/lib/defaultData';
import { sounds } from '@/lib/sound';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'education' | 'certifications' | 'messages' | 'setup'>('profile');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // Auth Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom photo input state
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Modals
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [isCreatingCert, setIsCreatingCert] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const demoAuth = sessionStorage.getItem('admin_authenticated');
      if (demoAuth === 'true') {
        setIsAuthenticated(true);
        loadData();
        setIsAuthChecking(false);
        return;
      }

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setIsAuthenticated(true);
            loadData();
            setIsAuthChecking(false);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }

      setIsAuthChecking(false);
    };

    checkAuth();
  }, []);

  const loadData = async () => {
    try {
      const [projList, prof] = await Promise.all([
        DataService.getProjects(),
        DataService.getProfile(),
      ]);
      setProjects(projList);
      setProfile(prof);
      if (prof?.photo_url) {
        setCustomPhotoInput(prof.photo_url);
      }

      if (typeof window !== 'undefined') {
        const storedMsgs = localStorage.getItem('surya_portfolio_messages_v1');
        if (storedMsgs) setMessages(JSON.parse(storedMsgs));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Login handler with strict password suryaaswin@12
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    // Primary secure password check requested by owner
    if (password.trim() === 'suryaaswin@12') {
      sessionStorage.setItem('admin_authenticated', 'true');
      sounds.playSuccess();
      window.location.href = '/?admin=open';
      return;
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!error && data.session) {
          setIsAuthenticated(true);
          sessionStorage.setItem('admin_authenticated', 'true');
          loadData();
          sounds.playSuccess();
          setAuthLoading(false);
          return;
        }
      } catch (err: unknown) {
        // fall through
      }
    }

    setAuthError('Incorrect password. Please enter the administrator password.');
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    sounds.playClick();
    sessionStorage.removeItem('admin_authenticated');
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  // Profile Photo Quick Switcher (Suit / Casual / Custom)
  const handleSelectPhoto = async (photoUrl: string) => {
    if (!profile) return;
    sounds.playClick();
    const updated = { ...profile, photo_url: photoUrl };
    setProfile(updated);
    setCustomPhotoInput(photoUrl);
    await DataService.saveProfile(updated);
    showToast('Photo updated everywhere! (Navbar, Hero, About)');
    sounds.playSuccess();
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    sounds.playClick();
    await DataService.saveProfile(profile);
    showToast('Profile & Photo saved successfully across the site!');
    sounds.playSuccess();
  };

  // Project Actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    sounds.playClick();
    await DataService.saveProject(editingProject);
    const updated = await DataService.getProjects();
    setProjects(updated);
    setEditingProject(null);
    setIsCreatingProject(false);
    showToast('Project saved successfully!');
    sounds.playSuccess();
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    sounds.playClick();
    await DataService.deleteProject(id);
    const updated = await DataService.getProjects();
    setProjects(updated);
    showToast('Project deleted successfully.');
  };

  // Save Certification
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !profile) return;
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
    setProfile(updatedProfile);
    await DataService.saveProfile(updatedProfile);
    setEditingCert(null);
    setIsCreatingCert(false);
    showToast('Certification saved!');
    sounds.playSuccess();
  };

  const handleDeleteCert = async (id: string) => {
    if (!profile || !confirm('Delete this certification?')) return;
    sounds.playClick();
    const updatedCerts = (profile.certifications || []).filter((c) => c.id !== id);
    const updatedProfile = { ...profile, certifications: updatedCerts };
    setProfile(updatedProfile);
    await DataService.saveProfile(updatedProfile);
    showToast('Certification deleted.');
  };

  // Reset defaults
  const handleResetData = () => {
    if (confirm('Reset portfolio data back to default template?')) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      loadData();
      showToast('Data reset to default.');
      sounds.playSuccess();
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-zinc-500 font-mono text-sm">
        Authenticating session...
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex flex-col justify-center items-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-cyan/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md p-6 sm:p-10 rounded-3xl glass-card border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Site</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            Suriyakumar&apos;s Studio
          </h1>
          <p className="text-xs text-zinc-400 font-light mb-6">
            Manage your personal profile, photo, projects, and certifications.
          </p>

          {authError && (
            <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="suryaaswin000@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-lg"
            >
              {authLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Owner Access Protected Indicator */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <span className="text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Owner Access Protected • Suriyakumar E Studio</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const currentPhoto = profile?.photo_url || '/images/suriyakumar-portrait.jpg';

  return (
    <div className="min-h-screen bg-[#0a0e17] text-zinc-100 flex flex-col">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[9999] px-5 py-3 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/90 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0d131f]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="View Public Site"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/60 shrink-0">
                <Image
                  src={currentPhoto}
                  alt="Suriyakumar E"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold font-serif text-white">
                    Suriyakumar E Studio
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
                    Live Control
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">Content & Photo Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleResetData}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset initial portfolio projects"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'profile', label: 'Photo & Bio', icon: Camera },
            { id: 'projects', label: 'Projects', icon: Layers, count: projects.length },
            { id: 'education', label: 'Education', icon: GraduationCap, count: profile?.education?.length },
            { id: 'certifications', label: 'Certifications', icon: Award, count: profile?.certifications?.length },
            { id: 'messages', label: 'Inquiries', icon: MessageSquare, count: messages.length },
            { id: 'setup', label: 'Cloud Sync', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  sounds.playClick();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-accent-cyan text-accent-cyan font-bold bg-accent-cyan/5'
                    : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================================= */}
        {/* 1. PROFILE & PHOTO STUDIO (Primary tab to edit photo everywhere!)        */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && profile && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-serif text-white mb-1">
                Profile Photo & Personal Brand
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Select your active photo or enter a custom link. Changes update instantly across Navbar, Hero, and About!
              </p>
            </div>

            {/* Visual Photo Picker Section */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Camera className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
                  Select Active Profile Photo
                </h3>
              </div>

              {/* Photo Preset Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Executive Suit Portrait */}
                <div
                  onClick={() => handleSelectPhoto('/images/suriyakumar-portrait.jpg')}
                  className={`p-4 rounded-2xl glass-panel border cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                    currentPhoto === '/images/suriyakumar-portrait.jpg'
                      ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0">
                    <Image
                      src="/images/suriyakumar-portrait.jpg"
                      alt="Suit Portrait"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">Executive Suit</span>
                      {currentPhoto === '/images/suriyakumar-portrait.jpg' && (
                        <span className="p-1 rounded-full bg-accent-cyan text-black">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-light mt-1">
                      Professional black blazer portrait for portfolio cards.
                    </p>
                    <span className="text-[10px] font-mono text-accent-cyan mt-2 inline-block">
                      {currentPhoto === '/images/suriyakumar-portrait.jpg' ? '● Currently Active' : 'Click to Set Active'}
                    </span>
                  </div>
                </div>

                {/* Option 2: Casual Sunglasses Portrait */}
                <div
                  onClick={() => handleSelectPhoto('/images/suriyakumar-casual.jpg')}
                  className={`p-4 rounded-2xl glass-panel border cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                    currentPhoto === '/images/suriyakumar-casual.jpg'
                      ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0">
                    <Image
                      src="/images/suriyakumar-casual.jpg"
                      alt="Casual Portrait"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">Casual Sunglasses</span>
                      {currentPhoto === '/images/suriyakumar-casual.jpg' && (
                        <span className="p-1 rounded-full bg-accent-cyan text-black">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-light mt-1">
                      Casual daylight look with sunglasses and shirt.
                    </p>
                    <span className="text-[10px] font-mono text-accent-cyan mt-2 inline-block">
                      {currentPhoto === '/images/suriyakumar-casual.jpg' ? '● Currently Active' : 'Click to Set Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Custom Photo URL Input */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Or Enter Custom Photo URL</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customPhotoInput}
                    onChange={(e) => setCustomPhotoInput(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg or /images/..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-accent-cyan"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customPhotoInput.trim()) {
                        handleSelectPhoto(customPhotoInput.trim());
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-accent-cyan text-black font-semibold text-xs uppercase tracking-wider hover:bg-accent-cyan/90 transition-colors"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Live Preview Box Across Placements */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                  Live Preview Across Portfolio Elements:
                </span>
                <div className="flex flex-wrap items-center gap-6">
                  {/* Navbar Preview */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/60 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                      <Image src={currentPhoto} alt="Preview" fill className="object-cover object-top" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-300">Navbar Avatar</span>
                  </div>

                  {/* Hero Badge Preview */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-accent-cyan/60">
                      <Image src={currentPhoto} alt="Preview" fill className="object-cover object-top" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-300">Hero Badge</span>
                  </div>

                  {/* About Card Preview */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-9 rounded-md overflow-hidden border border-white/20">
                      <Image src={currentPhoto} alt="Preview" fill className="object-cover object-top" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-300">About 3D Card</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Hero Identity */}
              <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
                  Hero Brand Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Status Badge</label>
                    <input
                      type="text"
                      value={profile.status}
                      onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Tagline / Subtitle</label>
                  <textarea
                    rows={2}
                    value={profile.subtitle}
                    onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan resize-none"
                  />
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent-cyan">
                  About Me Bio Paragraphs
                </h3>
                {profile.bio_paragraphs.map((p, idx) => (
                  <div key={idx}>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      Paragraph {idx + 1}
                    </label>
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const newBio = [...profile.bio_paragraphs];
                        newBio[idx] = e.target.value;
                        setProfile({ ...profile, bio_paragraphs: newBio });
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan resize-none"
                    />
                  </div>
                ))}
              </div>

              {/* Contact Coordinates */}
              <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/15 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                  Contact Coordinates & Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={profile.socials.linkedin}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, linkedin: e.target.value },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-mono text-zinc-400 block mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={profile.socials.github}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, github: e.target.value },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes Live</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. PROJECTS STUDIO TAB                                                    */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-white">Project Showcase</h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Manage your portfolio projects. Changes update in the SpaceEdu showcase.
                </p>
              </div>

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
                    technologies: ['Python', 'SQL', 'Power BI'],
                  });
                  setIsCreatingProject(true);
                  sounds.playClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-cyan hover:bg-accent-cyan/90 text-black font-semibold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full bg-surface-100">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/75 text-white backdrop-blur-md">
                      {p.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/75 text-white backdrop-blur-md">
                      {p.year}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 font-serif">{p.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mb-4 font-light">
                        {p.shortDescription || p.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-1.5 flex-wrap">
                        {p.technologies.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-zinc-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject({ ...p });
                            setIsCreatingProject(false);
                            sounds.playClick();
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. EDUCATION TAB                                                          */}
        {/* ========================================================================= */}
        {activeTab === 'education' && profile && (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-2xl font-bold font-serif text-white">Academic Journey</h2>
            <div className="space-y-4">
              {(profile.education || []).map((edu) => (
                <div key={edu.id} className="p-6 rounded-2xl glass-card border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif">{edu.degree}</h3>
                      <p className="text-xs text-accent-cyan font-mono">{edu.institution} • {edu.location}</p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{edu.period}</span>
                  </div>
                  <p className="text-sm text-zinc-300 font-light">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. CERTIFICATIONS TAB                                                     */}
        {/* ========================================================================= */}
        {activeTab === 'certifications' && profile && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-serif text-white">Certifications & Awards</h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Accreditations and honours showcase.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCert({
                    id: 'cert-' + Date.now(),
                    title: '',
                    issuer: '',
                    year: '2026',
                    category: 'Data Analytics',
                    featuredAward: false,
                  });
                  setIsCreatingCert(true);
                  sounds.playClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-cyan hover:bg-accent-cyan/90 text-black font-semibold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certification</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(profile.certifications || []).map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">{cert.category}</span>
                      <span className="text-xs font-mono text-zinc-500">{cert.year}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{cert.title}</h3>
                    <p className="text-xs text-accent-cyan font-mono">{cert.issuer}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-white/5 mt-4">
                    <button
                      onClick={() => {
                        setEditingCert({ ...cert });
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
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. INQUIRIES TAB                                                          */}
        {/* ========================================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-serif text-white">Direct Inquiries</h2>
              <p className="text-xs text-zinc-400 font-mono">
                Messages dispatched from the contact form.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="p-12 text-center rounded-3xl glass-card border border-white/10 text-zinc-500 font-mono text-xs">
                No inquiries received yet. Submit the contact form on the home page to test!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-6 rounded-2xl glass-card border border-white/10 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                      <div>
                        <span className="font-bold text-white text-base mr-2">{m.name}</span>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-accent-cyan text-xs font-mono hover:underline"
                        >
                          {m.email}
                        </a>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">
                        {new Date(m.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-4 text-xs font-mono text-zinc-400">
                      <span>Area: <strong className="text-zinc-200">{m.service || 'General'}</strong></span>
                      <span>Type: <strong className="text-zinc-200">{m.budget || 'Unspecified'}</strong></span>
                    </div>

                    <p className="text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-wrap">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. SETUP GUIDE TAB                                                        */}
        {/* ========================================================================= */}
        {activeTab === 'setup' && (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-2xl font-bold font-serif text-white">Supabase Cloud Sync</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Your portfolio operates with reliable browser persistence out-of-the-box. When you want to sync across multiple machines, connect Supabase by adding your project keys to <code className="text-accent-cyan font-mono">.env.local</code>.
            </p>
          </div>
        )}
      </main>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              onClick={() => setEditingProject(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-white/20 bg-[#0a0e17] shadow-2xl z-10 p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold font-serif text-white mb-6">
                {isCreatingProject ? 'Add New Project' : 'Edit Project'}
              </h3>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value as Project['category'],
                        })
                      }
                      className="w-full bg-[#101724] border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    >
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Web & IoT">Web & IoT</option>
                      <option value="Full-Stack">Full-Stack</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Short Description (Phase 1)</label>
                  <input
                    type="text"
                    required
                    value={editingProject.shortDescription || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, shortDescription: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    required
                    value={editingProject.image}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, image: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Full Description (Phase 2)</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Technical Specification Callout (Phase 3)</label>
                  <input
                    type="text"
                    value={editingProject.calloutDetail || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, calloutDetail: e.target.value })
                    }
                    placeholder="e.g. Built with OpenCV + Python, 95% recognition accuracy"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Live URL</label>
                    <input
                      type="url"
                      value={editingProject.liveUrl || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, liveUrl: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={editingProject.githubUrl || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, githubUrl: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Year</label>
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, year: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingProject.technologies.join(', ')}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          technologies: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Certification Modal */}
      <AnimatePresence>
        {editingCert && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              onClick={() => setEditingCert(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl glass-panel border border-white/20 bg-[#0a0e17] shadow-2xl z-10 p-6 sm:p-8 space-y-4"
            >
              <h3 className="text-xl font-bold font-serif text-white">
                {isCreatingCert ? 'Add New Certificate' : 'Edit Certificate'}
              </h3>

              <form onSubmit={handleSaveCert} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1">Year</label>
                    <input
                      type="text"
                      required
                      value={editingCert.year}
                      onChange={(e) => setEditingCert({ ...editingCert, year: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Category</label>
                  <select
                    value={editingCert.category}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        category: e.target.value as CertificationItem['category'],
                      })
                    }
                    className="w-full bg-[#101724] border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                  >
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Innovation & Honours">Innovation & Honours</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">
                    Certificate Photo URL (Shown when clicked)
                  </label>
                  <input
                    type="url"
                    value={editingCert.imageUrl || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /images/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                  {editingCert.imageUrl && (
                    <div className="mt-2 relative aspect-video w-32 rounded-lg overflow-hidden border border-white/20">
                      <img src={editingCert.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredAward"
                    checked={!!editingCert.featuredAward}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, featuredAward: e.target.checked })
                    }
                    className="rounded bg-white/10 border-white/20 text-accent-cyan focus:ring-0"
                  />
                  <label htmlFor="featuredAward" className="text-xs font-mono text-zinc-300">
                    Featured Gold Award (YUDHISTRA Style Trophy)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                  >
                    Save Certificate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
