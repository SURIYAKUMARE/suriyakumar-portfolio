import { createClient } from '@supabase/supabase-js';
import { Project, ProfileData, ContactMessage } from '@/types';
import { initialProfile, initialProjects } from './defaultData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage fallback storage keys
const LOCAL_STORAGE_PROJECTS_KEY = 'surya_portfolio_projects_v1';
const LOCAL_STORAGE_PROFILE_KEY = 'surya_portfolio_profile_v1';
const LOCAL_STORAGE_MESSAGES_KEY = 'surya_portfolio_messages_v1';

// Unified Data Services with Supabase + LocalStorage Fallback
export const DataService = {
  // Fetch Projects
  async getProjects(): Promise<Project[]> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fall through
        }
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(data));
          }
          return data as Project[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local dataset', err);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(initialProjects));
    }
    return initialProjects;
  },

  // Save/Update Project
  async saveProject(project: Project): Promise<Project> {
    const projects = await this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    let updated: Project[];

    if (index >= 0) {
      updated = [...projects];
      updated[index] = { ...project };
    } else {
      updated = [project, ...projects];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(updated));
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('projects').upsert(project);
      } catch (err) {
        console.error('Supabase upsert failed', err);
      }
    }

    return project;
  },

  // Delete Project
  async deleteProject(id: string): Promise<boolean> {
    const projects = await this.getProjects();
    const updated = projects.filter((p) => p.id !== id);

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(updated));
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete error', err);
      }
    }

    return true;
  },

  // Fetch Profile
  async getProfile(): Promise<ProfileData> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!parsed.photo_url || parsed.photo_url.includes('unsplash')) {
            parsed.photo_url = initialProfile.photo_url;
            localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(parsed));
          }
          return parsed;
        } catch {
          // fall through
        }
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .single();

        if (!error && data) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(data));
          }
          return data as ProfileData;
        }
      } catch (err) {
        console.warn('Supabase profile fetch error', err);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(initialProfile));
    }
    return initialProfile;
  },

  // Save Profile
  async saveProfile(profile: ProfileData): Promise<ProfileData> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('profile').upsert({ id: 'primary', ...profile });
      } catch (err) {
        console.error('Supabase profile save error', err);
      }
    }

    return profile;
  },

  // Send Contact Message
  async sendContactMessage(message: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    const record: ContactMessage = {
      ...message,
      id: 'msg-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
      const list: ContactMessage[] = existing ? JSON.parse(existing) : [];
      list.unshift(record);
      localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(list));
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('messages').insert([record]);
      } catch (err) {
        console.warn('Could not post to Supabase messages table', err);
      }
    }

    return record;
  },

  // Reset default data
  resetDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(initialProjects));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(initialProfile));
    }
  }
};
