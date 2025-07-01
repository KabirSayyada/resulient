
import { ParsedResume } from '@/types/resumeStructure';

export const generateExecutiveATSTemplate = (resume: ParsedResume): string => {
  const sections: string[] = [];

  // Header Section
  if (resume.contact.name) {
    sections.push(resume.contact.name.toUpperCase());
    sections.push('='.repeat(resume.contact.name.length));
    sections.push('');
  }

  // Contact Information
  const contactInfo = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.linkedin,
    resume.contact.address
  ].filter(Boolean).join(' | ');
  
  if (contactInfo) {
    sections.push(contactInfo);
    sections.push('');
  }

  // Executive Summary
  if (resume.professionalSummary) {
    sections.push('EXECUTIVE SUMMARY');
    sections.push('==================');
    sections.push('');
    sections.push(resume.professionalSummary);
    sections.push('');
  }

  // Core Competencies
  if (resume.skills.length > 0) {
    sections.push('CORE COMPETENCIES');
    sections.push('==================');
    sections.push('');
    
    // Group skills in rows of 3 for executive format
    const skillGroups: string[] = [];
    for (let i = 0; i < resume.skills.length; i += 3) {
      const group = resume.skills.slice(i, i + 3);
      skillGroups.push(group.map(skill => `• ${skill}`).join('     '));
    }
    sections.push(...skillGroups);
    sections.push('');
  }

  // Professional Experience
  if (resume.workExperience.length > 0) {
    sections.push('PROFESSIONAL EXPERIENCE');
    sections.push('========================');
    sections.push('');

    resume.workExperience.forEach((exp, index) => {
      // Position and Company
      if (exp.position) {
        sections.push(exp.position.toUpperCase());
      }
      if (exp.company) {
        sections.push(exp.company);
      }
      
      // Dates
      if (exp.startDate || exp.endDate) {
        const dateRange = `${exp.startDate || ''} - ${exp.endDate || 'Present'}`;
        sections.push(dateRange);
      }
      sections.push('');

      // Responsibilities/Achievements
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach(responsibility => {
          sections.push(`• ${responsibility}`);
        });
      }
      
      if (index < resume.workExperience.length - 1) {
        sections.push('');
      }
    });
    sections.push('');
  }

  // Education
  if (resume.education.length > 0) {
    sections.push('EDUCATION');
    sections.push('=========');
    sections.push('');

    resume.education.forEach(edu => {
      let educationLine = '';
      if (edu.degree) {
        educationLine += edu.degree;
      }
      if (edu.field) {
        educationLine += edu.degree ? ` in ${edu.field}` : edu.field;
      }
      if (educationLine) {
        sections.push(educationLine);
      }
      
      if (edu.institution) {
        sections.push(edu.institution);
      }
      
      if (edu.graduationDate) {
        sections.push(edu.graduationDate);
      }
      sections.push('');
    });
  }

  // Key Projects
  if (resume.projects.length > 0) {
    sections.push('KEY PROJECTS');
    sections.push('=============');
    sections.push('');

    resume.projects.forEach(project => {
      if (project.name) {
        sections.push(project.name.toUpperCase());
      }
      if (project.description) {
        sections.push(project.description);
      }
      if (project.technologies && project.technologies.length > 0) {
        sections.push(`Technologies: ${project.technologies.join(', ')}`);
      }
      sections.push('');
    });
  }

  // Professional Certifications
  if (resume.certifications.length > 0) {
    sections.push('PROFESSIONAL CERTIFICATIONS');
    sections.push('============================');
    sections.push('');

    resume.certifications.forEach(cert => {
      let certLine = '';
      if (cert.name) {
        certLine += cert.name;
      }
      if (cert.issuer && cert.issuer !== 'Unknown') {
        certLine += ` - ${cert.issuer}`;
      }
      if (cert.date) {
        certLine += ` (${cert.date})`;
      }
      if (certLine) {
        sections.push(certLine);
      }
    });
    sections.push('');
  }

  // Achievements
  if (resume.achievements.length > 0) {
    sections.push('KEY ACHIEVEMENTS');
    sections.push('================');
    sections.push('');

    resume.achievements.forEach(achievement => {
      sections.push(`• ${achievement}`);
    });
    sections.push('');
  }

  return sections.join('\n');
};
