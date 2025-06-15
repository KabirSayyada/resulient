
export interface ParsedContact {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  website?: string;
}

export interface ParsedWorkExperience {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  responsibilities: string[];
}

export interface ParsedEducation {
  institution: string;
  degree: string;
  field?: string;
  graduationDate?: string;
  gpa?: string;
  location?: string;
}

export interface ParsedProject {
  name: string;
  description: string;
  technologies?: string[];
  date?: string;
  url?: string;
}

export interface ParsedCertification {
  name: string;
  issuer: string;
  date?: string;
  expirationDate?: string;
}

export interface ParsedResume {
  contact: ParsedContact;
  professionalSummary?: string;
  workExperience: ParsedWorkExperience[];
  education: ParsedEducation[];
  skills: string[];
  projects: ParsedProject[];
  certifications: ParsedCertification[];
  achievements: string[];
  languages?: string[];
  volunteerExperience: ParsedWorkExperience[]; // Use same structure as work experience
  additionalSections: { [key: string]: string[] };
}
