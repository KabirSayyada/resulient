
import { ParsedResume } from '@/types/resumeStructure';

export const parseOptimizedResumeContent = (content: string): ParsedResume => {
  const lines = content.split('\n').filter(line => line.trim());
  
  const resume: ParsedResume = {
    contact: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: ''
    },
    professionalSummary: '',
    workExperience: [],
    skills: [],
    education: [],
    projects: [],
    certifications: []
  };

  let currentSection = '';
  let currentExperience: any = null;
  let currentEducation: any = null;
  let currentProject: any = null;
  let currentCertification: any = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and section dividers
    if (!trimmedLine || trimmedLine.match(/^=+$/)) continue;

    // Detect sections
    if (trimmedLine.match(/^[A-Z\s]+$/)) {
      currentSection = trimmedLine.toLowerCase();
      
      // Save previous items when switching sections
      if (currentExperience) {
        resume.workExperience.push(currentExperience);
        currentExperience = null;
      }
      if (currentEducation) {
        resume.education.push(currentEducation);
        currentEducation = null;
      }
      if (currentProject) {
        resume.projects.push(currentProject);
        currentProject = null;
      }
      if (currentCertification) {
        resume.certifications.push(currentCertification);
        currentCertification = null;
      }
      continue;
    }

    // Parse content based on section
    if (currentSection.includes('summary') || currentSection.includes('objective')) {
      if (!trimmedLine.startsWith('•')) {
        resume.professionalSummary += (resume.professionalSummary ? ' ' : '') + trimmedLine;
      }
    } 
    else if (currentSection.includes('experience') || currentSection.includes('employment')) {
      if (trimmedLine.startsWith('•')) {
        if (currentExperience) {
          currentExperience.responsibilities.push(trimmedLine.substring(1).trim());
        }
      } else if (trimmedLine.includes('|') || trimmedLine.includes('–') || trimmedLine.includes('-')) {
        // Save previous experience
        if (currentExperience) {
          resume.workExperience.push(currentExperience);
        }
        
        // Parse new experience
        const parts = trimmedLine.split(/[|–-]/);
        currentExperience = {
          position: parts[0]?.trim() || '',
          company: parts[1]?.trim() || '',
          startDate: parts[2]?.trim() || '',
          endDate: parts[3]?.trim() || '',
          responsibilities: []
        };
      } else if (!currentExperience && trimmedLine) {
        // First line might be position
        currentExperience = {
          position: trimmedLine,
          company: '',
          startDate: '',
          endDate: '',
          responsibilities: []
        };
      } else if (currentExperience && !currentExperience.company) {
        currentExperience.company = trimmedLine;
      }
    }
    else if (currentSection.includes('skill') || currentSection.includes('technical')) {
      const skillsText = trimmedLine.replace(/^•\s*/, '');
      const skills = skillsText.split(/[,•|]/).map(s => s.trim()).filter(s => s);
      resume.skills.push(...skills);
    }
    else if (currentSection.includes('education')) {
      if (trimmedLine.includes('|') || trimmedLine.includes('–') || trimmedLine.includes('-')) {
        if (currentEducation) {
          resume.education.push(currentEducation);
        }
        
        const parts = trimmedLine.split(/[|–-]/);
        currentEducation = {
          degree: parts[0]?.trim() || '',
          field: '',
          institution: parts[1]?.trim() || '',
          graduationDate: parts[2]?.trim() || ''
        };
      } else if (!currentEducation && trimmedLine) {
        currentEducation = {
          degree: trimmedLine,
          field: '',
          institution: '',
          graduationDate: ''
        };
      } else if (currentEducation && !currentEducation.institution) {
        currentEducation.institution = trimmedLine;
      }
    }
    else if (currentSection.includes('project')) {
      if (!trimmedLine.startsWith('•') && !currentProject) {
        currentProject = {
          name: trimmedLine,
          description: '',
          technologies: []
        };
      } else if (currentProject && trimmedLine.startsWith('•')) {
        currentProject.description += (currentProject.description ? ' ' : '') + trimmedLine.substring(1).trim();
      } else if (currentProject && !trimmedLine.startsWith('•')) {
        resume.projects.push(currentProject);
        currentProject = {
          name: trimmedLine,
          description: '',
          technologies: []
        };
      }
    }
    else if (currentSection.includes('certification')) {
      if (trimmedLine.includes('|') || trimmedLine.includes('–') || trimmedLine.includes('-')) {
        if (currentCertification) {
          resume.certifications.push(currentCertification);
        }
        
        const parts = trimmedLine.split(/[|–-]/);
        currentCertification = {
          name: parts[0]?.trim() || '',
          issuer: parts[1]?.trim() || 'Unknown',
          date: parts[2]?.trim() || ''
        };
      } else if (!currentCertification && trimmedLine) {
        currentCertification = {
          name: trimmedLine,
          issuer: 'Unknown',
          date: ''
        };
      }
    }
    else if (!currentSection && trimmedLine) {
      // Try to extract contact info from the beginning
      if (trimmedLine.includes('@') && !resume.contact.email) {
        resume.contact.email = trimmedLine;
      } else if (trimmedLine.match(/^\+?[\d\s\-\(\)]+$/) && !resume.contact.phone) {
        resume.contact.phone = trimmedLine;
      } else if (trimmedLine.includes('linkedin') && !resume.contact.linkedin) {
        resume.contact.linkedin = trimmedLine;
      } else if (!resume.contact.name && !trimmedLine.includes('@') && !trimmedLine.match(/^\+?[\d\s\-\(\)]+$/)) {
        resume.contact.name = trimmedLine;
      }
    }
  }

  // Save any remaining items
  if (currentExperience) resume.workExperience.push(currentExperience);
  if (currentEducation) resume.education.push(currentEducation);
  if (currentProject) resume.projects.push(currentProject);
  if (currentCertification) resume.certifications.push(currentCertification);

  // Remove duplicates from skills
  resume.skills = [...new Set(resume.skills)];

  return resume;
};
