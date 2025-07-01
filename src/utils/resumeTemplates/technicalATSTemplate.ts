
import { ParsedResume } from '@/types/resumeStructure';

export const generateTechnicalATSTemplate = (resume: ParsedResume): string => {
  const sections: string[] = [];

  // Header Section
  if (resume.contact.name) {
    sections.push(`# ${resume.contact.name}`);
    sections.push('='.repeat(resume.contact.name.length + 2));
    sections.push('');
  }

  // Contact Information
  const contactInfo = [
    resume.contact.email ? `📧 ${resume.contact.email}` : '',
    resume.contact.phone ? `📱 ${resume.contact.phone}` : '',
    resume.contact.linkedin ? `🔗 ${resume.contact.linkedin}` : '',
    resume.contact.address ? `📍 ${resume.contact.address}` : ''
  ].filter(Boolean).join(' | ');
  
  if (contactInfo) {
    sections.push(contactInfo);
    sections.push('');
  }

  // Technical Summary
  if (resume.professionalSummary) {
    sections.push('// TECHNICAL SUMMARY');
    sections.push('====================');
    sections.push('');
    sections.push(resume.professionalSummary);
    sections.push('');
  }

  // Technical Skills (Priority section for tech roles)
  if (resume.skills.length > 0) {
    sections.push('// TECHNICAL SKILLS');
    sections.push('==================');
    sections.push('');
    
    // Categorize skills for better ATS parsing
    const programmingSkills = resume.skills.filter(skill => 
      /javascript|python|java|react|node|angular|vue|typescript|c\+\+|c#|php|ruby|go|rust|swift|kotlin/i.test(skill)
    );
    
    const toolsSkills = resume.skills.filter(skill => 
      /docker|kubernetes|aws|azure|git|jenkins|terraform|mongodb|postgresql|mysql|redis/i.test(skill)
    );
    
    const otherSkills = resume.skills.filter(skill => 
      !programmingSkills.includes(skill) && !toolsSkills.includes(skill)
    );

    if (programmingSkills.length > 0) {
      sections.push('Programming Languages & Frameworks:');
      programmingSkills.forEach(skill => {
        sections.push(`• ${skill}`);
      });
      sections.push('');
    }

    if (toolsSkills.length > 0) {
      sections.push('Tools & Technologies:');
      toolsSkills.forEach(skill => {
        sections.push(`• ${skill}`);
      });
      sections.push('');
    }

    if (otherSkills.length > 0) {
      sections.push('Additional Skills:');
      otherSkills.forEach(skill => {
        sections.push(`• ${skill}`);
      });
      sections.push('');
    }
  }

  // Professional Experience
  if (resume.workExperience.length > 0) {
    sections.push('// PROFESSIONAL EXPERIENCE');
    sections.push('==========================');
    sections.push('');

    resume.workExperience.forEach((exp, index) => {
      // Position and Company
      if (exp.position && exp.company) {
        sections.push(`${exp.position} - ${exp.company}`);
      } else if (exp.position) {
        sections.push(exp.position);
      } else if (exp.company) {
        sections.push(exp.company);
      }
      
      // Dates
      if (exp.startDate || exp.endDate) {
        const dateRange = `${exp.startDate || ''} - ${exp.endDate || 'Present'}`;
        sections.push(dateRange);
      }
      sections.push('');

      // Technical Achievements
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach(responsibility => {
          sections.push(`> ${responsibility}`);
        });
      }
      
      if (index < resume.workExperience.length - 1) {
        sections.push('');
      }
    });
    sections.push('');
  }

  // Projects (High priority for tech roles)
  if (resume.projects.length > 0) {
    sections.push('// KEY PROJECTS');
    sections.push('===============');
    sections.push('');

    resume.projects.forEach(project => {
      if (project.name) {
        sections.push(`Project: ${project.name}`);
      }
      if (project.description) {
        sections.push(`> ${project.description}`);
      }
      if (project.technologies && project.technologies.length > 0) {
        sections.push(`> Tech Stack: ${project.technologies.join(', ')}`);
      }
      sections.push('');
    });
  }

  // Education
  if (resume.education.length > 0) {
    sections.push('// EDUCATION');
    sections.push('============');
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

  // Technical Certifications
  if (resume.certifications.length > 0) {
    sections.push('// CERTIFICATIONS');
    sections.push('=================');
    sections.push('');

    resume.certifications.forEach(cert => {
      let certLine = '';
      if (cert.name) {
        certLine += `> ${cert.name}`;
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

  // Technical Achievements
  if (resume.achievements.length > 0) {
    sections.push('// ACHIEVEMENTS');
    sections.push('===============');
    sections.push('');

    resume.achievements.forEach(achievement => {
      sections.push(`> ${achievement}`);
    });
    sections.push('');
  }

  // Languages (if available)
  if (resume.languages && resume.languages.length > 0) {
    sections.push('// LANGUAGES');
    sections.push('============');
    sections.push('');

    resume.languages.forEach(language => {
      sections.push(`> ${language}`);
    });
    sections.push('');
  }

  return sections.join('\n');
};
