export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface SkillItem {
  name: string;
  level: number; // 1-5
}

export interface SkillCategory {
  name: string;
  items: SkillItem[];
  showLevel?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // e.g. Native, B2, Fluent
}

export interface VolunteeringItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  location: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string[];
}

export interface CustomSection {
  id: string;
  title: string; // The header of the section (e.g. "Publications")
  items: CustomSectionItem[];
}

export interface ResumeData {
  // Core Info
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  profileImage?: string; // Base64 encoded image or URL (opsiyonel)

  // Sections
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  volunteering: VolunteeringItem[];
  awards: AwardItem[];
  interests: string[]; // Simple list
  customSections: CustomSection[];
  references: string;

  // Layout Order
  sectionOrder: string[]; // Array of keys: 'summary', 'experience', 'education', 'skills', 'projects', etc.
}

export interface AgentResponse {
  thoughts: string;
  chatResponse: string;
  updatedResume: ResumeData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  thoughts?: string;
  timestamp: number;
}

export type GeminiModel =
  | 'gemini-3-flash-preview'
  | 'gemini-3-pro-preview'
  | 'gemini-flash-latest'
  | 'gemini-flash-lite-latest';

// CV Theme Types
export type CVThemeId = 'classic' | 'executive' | 'modern' | 'sidebar' | 'professional' | 'elegant' | 'creative';

export interface CVThemeConfig {
  id: CVThemeId;
  name: string;
  description: string;
  accentColor: string;
}
