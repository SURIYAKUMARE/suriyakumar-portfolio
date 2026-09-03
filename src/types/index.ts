export interface Project {
  id: string;
  eyebrow?: string;
  title: string;
  tagline?: string;
  shortDescription?: string;
  description: string;
  technicalCallout?: string;
  calloutDetail?: string;
  category: "Data Analytics" | "AI & ML" | "Web & IoT" | "Full-Stack";
  image: string;
  zoomImage?: string;
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  featured: boolean;
  order_index: number;
  year: string;
  client?: string;
  role?: string;
  technologies: string[];
  metrics?: { label: string; value: string }[];
  awards?: string[];
  created_at?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  featuredAward?: boolean;
  category: "Data Analytics" | "AI & ML" | "Innovation & Honours";
}

export interface ProfileData {
  id?: string;
  name: string;
  title: string;
  subtitle: string;
  status: string;
  bio_paragraphs: string[];
  location: string;
  email: string;
  phone: string;
  photo_url?: string;
  resume_url?: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
    dribbble?: string;
  };
  stats: {
    number: string;
    label: string;
    sublabel?: string;
  }[];
  skills: {
    category: string;
    items: { name: string; level: number; iconName?: string }[];
  }[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service?: string;
  budget?: string;
  message: string;
  created_at: string;
}
