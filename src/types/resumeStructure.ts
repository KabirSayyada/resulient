
export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  website?: string;
}

export interface WorkExperience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  location?: string;
  responsibilities: string[];
}

export interface Education {
  degree: string;
  field?: string;
  institution: string;
  graduationDate: string;
  location?: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  date?: string;
  url?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
}

export interface VolunteerExperience {
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ParsedResume {
  contact: ContactInfo;
  professionalSummary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  languages?: string[];
  additionalSections: {
    volunteer?: VolunteerExperience[];
    interests?: string[];
    languages?: string[];
    references?: string[];
    publications?: string[];
    training?: string[];
    additional?: string[];
    awards?: string[];
    hobbies?: string[];
    [key: string]: any;
  };
}

// Export aliases for parser compatibility
export type ParsedContact = ContactInfo;
export type ParsedWorkExperience = WorkExperience;
export type ParsedEducation = Education;
export type ParsedProject = Project;
export type ParsedCertification = Certification;
