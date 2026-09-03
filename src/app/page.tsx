'use client';

import { useState, useEffect } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SpaceEduShowcase from '@/components/SpaceEduShowcase';
import Education from '@/components/Education';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Project, ProfileData } from '@/types';
import { DataService } from '@/lib/supabase';
import { initialProfile, initialProjects } from '@/lib/defaultData';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loadedProfile, loadedProjects] = await Promise.all([
          DataService.getProfile(),
          DataService.getProjects(),
        ]);
        if (loadedProfile) setProfile(loadedProfile);
        if (loadedProjects && loadedProjects.length > 0) setProjects(loadedProjects);
      } catch (err) {
        console.error('Failed to load dynamic portfolio data', err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Cinematic Entrance Preloader */}
      <Preloader onComplete={() => setLoading(false)} />

      <div className={`min-h-screen transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        
        <main>
          {/* Hero Section */}
          <Hero
            name={profile.name}
            title={profile.title}
            subtitle={profile.subtitle}
          />

          {/* About Me (Bio, 3D Card, Interactive Skills & Badges) */}
          <About profile={profile} />

          {/* SpaceEdu 4-Phase Cinematic Pinned Project Showcase */}
          <SpaceEduShowcase projects={projects} />

          {/* Academic Foundation Timeline */}
          <Education education={profile.education || initialProfile.education} />

          {/* Certifications & Honours */}
          <Certifications certifications={profile.certifications || initialProfile.certifications} />

          {/* Contact Experience */}
          <Contact profile={profile} />
        </main>

        <Footer />
      </div>
    </>
  );
}
