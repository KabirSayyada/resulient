
import { ParsedResume } from '@/types/resumeStructure';
import { TemplateConfig, ValidatedContent } from '@/types/resumeTemplate';

export class TemplateValidator {
  private config: TemplateConfig;

  constructor(config: TemplateConfig) {
    this.config = config;
  }

  validateContent(resume: ParsedResume): ValidatedContent {
    const errors: string[] = [];
    const warnings: string[] = [];
    const processedContent = { ...resume };

    // Validate contact information
    if (!resume.contact.name || resume.contact.name.trim() === '') {
      errors.push('Name is required');
      processedContent.contact.name = 'Your Name';
    }

    // Validate email format
    if (resume.contact.email && !this.isValidEmail(resume.contact.email)) {
      warnings.push('Email format may not be valid');
    }

    // Validate phone format
    if (resume.contact.phone && !this.isValidPhone(resume.contact.phone)) {
      warnings.push('Phone format may not be standard');
      processedContent.contact.phone = this.formatPhone(resume.contact.phone);
    }

    // Ensure minimum content requirements
    if (!resume.workExperience || resume.workExperience.length === 0) {
      if (!resume.education || resume.education.length === 0) {
        errors.push('Either work experience or education is required');
      }
    }

    // Validate work experience entries
    if (resume.workExperience) {
      resume.workExperience.forEach((exp, index) => {
        if (!exp.position || exp.position.trim() === '') {
          processedContent.workExperience[index].position = 'Position Title';
        }
        if (!exp.company || exp.company.trim() === '') {
          processedContent.workExperience[index].company = 'Company Name';
        }
        if (!exp.responsibilities || exp.responsibilities.length === 0) {
          processedContent.workExperience[index].responsibilities = ['Key achievement or responsibility'];
        }
      });
    }

    // Validate education entries
    if (resume.education) {
      resume.education.forEach((edu, index) => {
        if (!edu.degree || edu.degree.trim() === '') {
          processedContent.education[index].degree = 'Degree';
        }
        if (!edu.institution || edu.institution.trim() === '') {
          processedContent.education[index].institution = 'Institution Name';
        }
      });
    }

    // Ensure skills array is not empty
    if (!resume.skills || resume.skills.length === 0) {
      processedContent.skills = ['Relevant Skill 1', 'Relevant Skill 2', 'Relevant Skill 3'];
      warnings.push('No skills provided - added placeholder skills');
    }

    // Truncate long text fields to prevent overflow
    if (resume.professionalSummary && resume.professionalSummary.length > 600) {
      processedContent.professionalSummary = resume.professionalSummary.substring(0, 600) + '...';
      warnings.push('Professional summary truncated to fit template');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      processedContent
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  private formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
    }
    return phone; // Return original if can't format
  }
}
