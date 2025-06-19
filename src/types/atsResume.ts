
export interface ATSResumeData {
  personalInfo: string;
  workExperience: string[];
  education: string[];
  skills: string;
  achievements: string;
  additionalSections: string;
}

export interface ParsedATSResume {
  contact: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
  };
  professionalSummary?: string;
  workExperience: Array<{
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    responsibilities: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    graduationDate?: string;
    gpa?: string;
    location?: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies?: string[];
    date?: string;
    url?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date?: string;
    expirationDate?: string;
  }>;
  achievements: string[];
  languages?: string[];
  volunteer?: Array<{
    organization: string;
    role: string;
    startDate?: string;
    endDate?: string;
    description: string;
  }>;
  additionalSections: { [key: string]: string[] };
}
