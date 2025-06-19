import jsPDF from 'jspdf';
import { ParsedResume } from '@/types/resumeStructure';

type TemplateType = 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'tech' | 'professional' | 'compact' | 'clean' | 'border';

// Enhanced PDF generator that creates text-based PDFs with proper formatting
class TemplatePDFGenerator {
  private pdf: jsPDF;
  private currentY: number;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    this.pageWidth = 595.28;
    this.pageHeight = 841.89;
    this.margin = 40;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.currentY = this.margin;
  }

  private checkPageBreak(neededHeight: number): void {
    if (this.currentY + neededHeight > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addSpace(points: number): void {
    this.currentY += points;
  }

  private addText(
    text: string,
    fontSize: number,
    fontStyle: 'normal' | 'bold' = 'normal',
    color: string = '#000000',
    align: 'left' | 'center' | 'right' = 'left',
    indent: number = 0
  ): void {
    if (!text || text.trim() === '') return;

    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontStyle);
    this.pdf.setTextColor(color);

    const effectiveWidth = this.contentWidth - indent;
    const lines = this.pdf.splitTextToSize(text, effectiveWidth);
    const lineHeight = fontSize * 1.4;

    this.checkPageBreak(lines.length * lineHeight);

    for (const line of lines) {
      let xPosition = this.margin + indent;
      if (align === 'center') {
        xPosition = this.pageWidth / 2;
      } else if (align === 'right') {
        xPosition = this.pageWidth - this.margin;
      }

      this.pdf.text(line, xPosition, this.currentY, { align });
      this.currentY += lineHeight;
    }
  }

  private addLine(color: string = '#cccccc', width: number = 0.5): void {
    this.addSpace(6);
    this.pdf.setDrawColor(color);
    this.pdf.setLineWidth(width);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.addSpace(12);
  }

  // Helper method to add additional sections
  private addAdditionalSections(resume: ParsedResume, headerColor: string = '#333333', contentColor: string = '#000000'): void {
    // Handle certifications
    if (resume.certifications && resume.certifications.length > 0) {
      this.addText('CERTIFICATIONS', 12, 'bold', headerColor);
      this.addLine();
      
      resume.certifications.forEach(cert => {
        const certLine = cert.issuer && cert.issuer !== 'Unknown' 
          ? `${cert.name} | ${cert.issuer}${cert.date ? ` | ${cert.date}` : ''}`
          : cert.name;
        this.addText(certLine, 10, 'normal', contentColor);
        this.addSpace(8);
      });
      this.addSpace(12);
    }

    // Handle achievements
    if (resume.achievements && resume.achievements.length > 0) {
      this.addText('ACHIEVEMENTS', 12, 'bold', headerColor);
      this.addLine();
      
      resume.achievements.forEach(achievement => {
        this.addText(`• ${achievement}`, 10, 'normal', contentColor, 'left', 15);
        this.addSpace(4);
      });
      this.addSpace(16);
    }

    // Handle projects
    if (resume.projects && resume.projects.length > 0) {
      this.addText('PROJECTS', 12, 'bold', headerColor);
      this.addLine();
      
      resume.projects.forEach(project => {
        this.addText(project.name, 11, 'bold', contentColor);
        this.addSpace(4);
        if (project.description) {
          this.addText(project.description, 10, 'normal', contentColor);
          this.addSpace(4);
        }
        if (project.technologies && project.technologies.length > 0) {
          this.addText(`Technologies: ${project.technologies.join(', ')}`, 9, 'normal', '#666666');
        }
        this.addSpace(12);
      });
    }

    // Handle additional sections (references, languages, etc.)
    if (resume.additionalSections) {
      Object.entries(resume.additionalSections).forEach(([sectionName, sectionContent]) => {
        if (Array.isArray(sectionContent) && sectionContent.length > 0) {
          this.addText(sectionName.toUpperCase(), 12, 'bold', headerColor);
          this.addLine();
          
          sectionContent.forEach(item => {
            if (typeof item === 'string') {
              const displayText = item.startsWith('•') || item.startsWith('-') || item.startsWith('*') 
                ? item 
                : `• ${item}`;
              this.addText(displayText, 10, 'normal', contentColor, 'left', item.startsWith('•') ? 0 : 15);
              this.addSpace(4);
            }
          });
          this.addSpace(16);
        }
      });
    }
  }

  // Classic template formatting - Enhanced with additional sections
  private generateClassicTemplate(resume: ParsedResume): void {
    // Header
    this.addText(resume.contact.name || '', 18, 'bold', '#000000', 'center');
    this.addSpace(12);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 10, 'normal', '#666666', 'center');
    this.addSpace(24);

    // Professional Summary
    if (resume.professionalSummary) {
      this.addText('PROFESSIONAL SUMMARY', 12, 'bold', '#333333');
      this.addLine();
      this.addText(resume.professionalSummary, 10);
      this.addSpace(20);
    }

    // Work Experience
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 12, 'bold', '#333333');
      this.addLine();
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'bold');
        this.addSpace(3);
        this.addText(`${exp.company || ''} | ${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#666666');
        this.addSpace(8);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#000000', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(16);
      });
      this.addSpace(20);
    }

    // Skills
    if (resume.skills.length > 0) {
      this.addText('TECHNICAL SKILLS', 12, 'bold', '#333333');
      this.addLine();
      this.addText(resume.skills.join(' • '), 10);
      this.addSpace(20);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 12, 'bold', '#333333');
      this.addLine();
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold');
        this.addSpace(3);
        this.addText(`${edu.institution || ''} | ${edu.graduationDate || ''}`, 10, 'normal', '#666666');
        this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Add all additional sections
    this.addAdditionalSections(resume, '#333333', '#000000');
  }

  // Modern template formatting - Enhanced with additional sections
  private generateModernTemplate(resume: ParsedResume): void {
    // Header with blue accent
    this.addText(resume.contact.name || '', 20, 'bold', '#1e40af');
    this.addSpace(12);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 10, 'normal', '#374151');
    this.addLine('#3b82f6', 2);
    this.addSpace(20);

    // Professional Summary with background effect (simulated with spacing)
    if (resume.professionalSummary) {
      this.addText('PROFESSIONAL SUMMARY', 12, 'bold', '#1e40af');
      this.addSpace(12);
      this.addText(resume.professionalSummary, 10, 'normal', '#111827');
      this.addSpace(20);
    }

    // Work Experience with left border effect
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 12, 'bold', '#1e40af');
      this.addSpace(12);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 10, 'bold', '#3b82f6');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#6b7280');
        }
        this.addSpace(8);
        
        if (exp.responsibilities) {
          exp.responsibilities.slice(0, 4).forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(16);
      });
      this.addSpace(20);
    }

    // Skills in tag-like format
    if (resume.skills.length > 0) {
      this.addText('TECHNICAL SKILLS', 12, 'bold', '#1e40af');
      this.addSpace(12);
      
      let skillsLine = '';
      resume.skills.slice(0, 15).forEach((skill, index) => {
        skillsLine += skill;
        if (index < resume.skills.slice(0, 15).length - 1) skillsLine += ' | ';
      });
      this.addText(skillsLine, 10, 'normal', '#374151');
      this.addSpace(20);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 12, 'bold', '#1e40af');
      this.addSpace(12);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#374151');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280');
        }
        this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Add all additional sections with modern colors
    this.addAdditionalSections(resume, '#1e40af', '#374151');
  }

  // Minimal template formatting
  private generateMinimalTemplate(resume: ParsedResume): void {
    // Clean header
    this.addText(resume.contact.name || '', 22, 'normal', '#111827', 'center');
    this.addSpace(16);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean);
    
    contactInfo.forEach(info => {
      this.addText(info, 10, 'normal', '#6b7280', 'center');
      this.addSpace(2);
    });
    
    this.addSpace(12);
    this.pdf.setDrawColor('#d1d5db');
    this.pdf.setLineWidth(0.5);
    const lineStart = this.pageWidth / 2 - 30;
    const lineEnd = this.pageWidth / 2 + 30;
    this.pdf.line(lineStart, this.currentY, lineEnd, this.currentY);
    this.addSpace(24);

    // Summary
    if (resume.professionalSummary) {
      this.addText('SUMMARY', 11, 'normal', '#374151');
      this.addSpace(12);
      this.addText(resume.professionalSummary, 10, 'normal', '#4b5563');
      this.addSpace(20);
    }

    // Experience
    if (resume.workExperience.length > 0) {
      this.addText('EXPERIENCE', 11, 'normal', '#374151');
      this.addSpace(12);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 10, 'normal', '#6b7280');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} – ${exp.endDate || ''}`, 9, 'normal', '#9ca3af');
        }
        this.addSpace(8);
        
        if (exp.responsibilities) {
          exp.responsibilities.slice(0, 3).forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#4b5563', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(16);
      });
      this.addSpace(20);
    }

    // Skills
    if (resume.skills.length > 0) {
      this.addText('SKILLS', 11, 'normal', '#374151');
      this.addSpace(12);
      this.addText(resume.skills.slice(0, 20).join(' • '), 10, 'normal', '#4b5563');
      this.addSpace(20);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 11, 'normal', '#374151');
      this.addSpace(12);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#6b7280');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 9, 'normal', '#9ca3af');
        }
        this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Add all additional sections with minimal colors
    this.addAdditionalSections(resume, '#374151', '#4b5563');
  }

  // Executive template formatting - Fixed bullet points and spacing
  private generateExecutiveTemplate(resume: ParsedResume): void {
    // Executive header
    this.addText(resume.contact.name?.toUpperCase() || '', 20, 'bold', '#111827');
    this.addSpace(8);
    this.addLine('#1f2937', 1);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 10, 'bold', '#4b5563');
    this.addSpace(24);

    // Executive Summary
    if (resume.professionalSummary) {
      this.addText('EXECUTIVE SUMMARY', 12, 'bold', '#111827');
      this.addLine('#6b7280');
      this.addText(resume.professionalSummary, 10, 'bold', '#374151');
      this.addSpace(20);
    }

    // Core Competencies
    if (resume.skills.length > 0) {
      this.addText('CORE COMPETENCIES', 12, 'bold', '#111827');
      this.addLine('#6b7280');
      
      const skillsPerRow = 3;
      const skillsRows = [];
      for (let i = 0; i < resume.skills.slice(0, 18).length; i += skillsPerRow) {
        skillsRows.push(resume.skills.slice(i, i + skillsPerRow));
      }
      
      skillsRows.forEach(row => {
        const rowText = row.map(skill => `• ${skill}`).join('   ');
        this.addText(rowText, 10, 'bold', '#4b5563');
        this.addSpace(5);
      });
      this.addSpace(16);
    }

    // Professional Experience
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 12, 'bold', '#111827');
      this.addLine('#6b7280');
      
      resume.workExperience.forEach((exp, index) => {
        this.addText((exp.position || '').toUpperCase(), 11, 'bold', '#111827');
        this.addSpace(4);
        this.addText(exp.company || '', 10, 'bold', '#4b5563');
        this.addSpace(4);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} – ${exp.endDate || ''}`, 10, 'bold', '#6b7280');
        }
        this.addSpace(8);
        
        if (exp.responsibilities) {
          exp.responsibilities.slice(0, 4).forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 10);
            this.addSpace(4);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(16);
      });
      this.addSpace(20);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 12, 'bold', '#111827');
      this.addLine('#6b7280');
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(4);
        this.addText(edu.institution || '', 10, 'bold', '#4b5563');
        this.addSpace(4);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'bold', '#6b7280');
        }
        this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Add all additional sections with executive styling
    this.addAdditionalSections(resume, '#111827', '#374151');
  }

  // Creative template formatting
  private generateCreativeTemplate(resume: ParsedResume): void {
    // Header with gradient effect (simulated)
    this.addText(resume.contact.name || '', 22, 'normal', '#333333', 'center');
    this.addSpace(8);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' • ');
    
    this.addText(contactInfo, 10, 'normal', '#666666', 'center');
    this.addSpace(20);

    // Professional Summary
    if (resume.professionalSummary) {
      this.addText('Professional Summary', 14, 'normal', '#7c3aed');
      this.addSpace(8);
      this.addText(resume.professionalSummary, 10, 'normal', '#374151');
      this.addSpace(16);
    }

    // Core Competencies as tags
    if (resume.skills.length > 0) {
      this.addText('Core Competencies', 14, 'normal', '#7c3aed');
      this.addSpace(8);
      this.addText(resume.skills.slice(0, 15).join(' • '), 10, 'normal', '#4b5563');
      this.addSpace(16);
    }

    // Professional Experience
    if (resume.workExperience.length > 0) {
      this.addText('Professional Experience', 14, 'normal', '#7c3aed');
      this.addSpace(8);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 12, 'bold', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 11, 'bold', '#7c3aed');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#6b7280');
        }
        this.addSpace(6);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('Education', 14, 'normal', '#7c3aed');
      this.addSpace(8);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#7c3aed');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280');
        }
        this.addSpace(10);
      });
      this.addSpace(16);
    }

    // Add all additional sections with creative styling
    this.addAdditionalSections(resume, '#7c3aed', '#374151');
  }

  // Tech template formatting
  private generateTechTemplate(resume: ParsedResume): void {
    // Header
    this.addText(resume.contact.name || '', 18, 'bold', '#111827');
    this.addSpace(8);
    
    if (resume.contact.email) {
      this.addText(`📧 ${resume.contact.email}`, 10, 'normal', '#16a34a');
      this.addSpace(2);
    }
    if (resume.contact.phone) {
      this.addText(`📱 ${resume.contact.phone}`, 10, 'normal', '#16a34a');
      this.addSpace(2);
    }
    if (resume.contact.linkedin) {
      this.addText(`🔗 ${resume.contact.linkedin}`, 10, 'normal', '#16a34a');
      this.addSpace(2);
    }
    this.addSpace(16);

    // About section
    if (resume.professionalSummary) {
      this.addText('// ABOUT', 12, 'bold', '#111827');
      this.addLine('#16a34a', 1);
      this.addText(resume.professionalSummary, 10, 'normal', '#374151');
      this.addSpace(16);
    }

    // Tech Stack
    if (resume.skills.length > 0) {
      this.addText('// TECH_STACK', 12, 'bold', '#111827');
      this.addLine('#16a34a', 1);
      this.addText('const skills = [', 10, 'normal', '#16a34a');
      this.addSpace(4);
      
      resume.skills.slice(0, 12).forEach((skill, index) => {
        const isLast = index === resume.skills.slice(0, 12).length - 1;
        this.addText(`  "${skill}"${isLast ? '' : ','}`, 10, 'normal', '#eab308', 'left', 20);
        this.addSpace(2);
      });
      
      this.addText('];', 10, 'normal', '#16a34a');
      this.addSpace(16);
    }

    // Experience
    if (resume.workExperience.length > 0) {
      this.addText('// EXPERIENCE', 12, 'bold', '#111827');
      this.addLine('#16a34a', 1);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 11, 'bold', '#16a34a');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'bold', '#6b7280');
        }
        this.addSpace(6);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`> ${resp}`, 10, 'normal', '#374151', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('// EDUCATION', 12, 'bold', '#111827');
      this.addLine('#16a34a', 1);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#16a34a');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280');
        }
        this.addSpace(10);
      });
      this.addSpace(16);
    }

    // Add all additional sections with tech styling
    this.addAdditionalSections(resume, '#111827', '#374151');
  }

  // Professional template formatting
  private generateProfessionalTemplate(resume: ParsedResume): void {
    // Centered header
    this.addText(resume.contact.name?.toUpperCase() || '', 20, 'bold', '#111827', 'center');
    this.addSpace(8);
    this.addLine('#6b7280', 1);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 10, 'normal', '#6b7280', 'center');
    this.addSpace(20);

    // Executive Summary
    if (resume.professionalSummary) {
      this.addText('EXECUTIVE SUMMARY', 14, 'bold', '#111827', 'center');
      this.addSpace(8);
      this.addText(`"${resume.professionalSummary}"`, 10, 'normal', '#374151', 'center');
      this.addSpace(16);
    }

    // Core Competencies
    if (resume.skills.length > 0) {
      this.addText('CORE COMPETENCIES', 14, 'bold', '#111827', 'center');
      this.addSpace(8);
      
      // Display skills in columns (simulated)
      const skillsPerRow = 3;
      for (let i = 0; i < resume.skills.slice(0, 15).length; i += skillsPerRow) {
        const rowSkills = resume.skills.slice(i, i + skillsPerRow);
        this.addText(rowSkills.join('   •   '), 10, 'normal', '#4b5563', 'center');
        this.addSpace(4);
      }
      this.addSpace(12);
    }

    // Professional Experience
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 14, 'bold', '#111827', 'center');
      this.addSpace(8);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 12, 'bold', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 11, 'bold', '#6b7280');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'bold', '#6b7280');
        }
        this.addSpace(6);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 14, 'bold', '#111827', 'center');
      this.addSpace(8);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827', 'center');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'bold', '#6b7280', 'center');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280', 'center');
        }
        this.addSpace(10);
      });
      this.addSpace(16);
    }

    // Add all additional sections with professional styling
    this.addAdditionalSections(resume, '#111827', '#374151');
  }

  // Compact template formatting
  private generateCompactTemplate(resume: ParsedResume): void {
    // Compact header
    this.addText(resume.contact.name || '', 16, 'bold', '#111827');
    this.addSpace(4);
    this.addText(`${resume.contact.email || ''} | ${resume.contact.phone || ''}`, 9, 'normal', '#6b7280');
    this.addSpace(4);
    if (resume.contact.linkedin || resume.contact.address) {
      this.addText(`${resume.contact.linkedin || ''} | ${resume.contact.address || ''}`, 9, 'normal', '#6b7280');
    }
    this.addLine('#cccccc', 0.5);

    // Two-column layout simulation
    if (resume.professionalSummary) {
      this.addText('SUMMARY', 11, 'bold', '#111827');
      this.addSpace(4);
      this.addText(resume.professionalSummary, 9, 'normal', '#374151');
      this.addSpace(12);
    }

    // Experience (main column)
    if (resume.workExperience.length > 0) {
      this.addText('EXPERIENCE', 11, 'bold', '#111827');
      this.addSpace(4);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 10, 'bold', '#111827');
        this.addSpace(2);
        this.addText(exp.company || '', 9, 'normal', '#6b7280');
        this.addSpace(2);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 9, 'normal', '#6b7280');
        }
        this.addSpace(4);
        
        if (exp.responsibilities) {
          exp.responsibilities.slice(0, 3).forEach(resp => {
            this.addText(`• ${resp}`, 9, 'normal', '#374151', 'left', 10);
            this.addSpace(2);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(8);
      });
      this.addSpace(12);
    }

    // Skills sidebar (simulated)
    if (resume.skills.length > 0) {
      this.addText('SKILLS', 11, 'bold', '#111827');
      this.addSpace(4);
      this.addText(resume.skills.slice(0, 12).join(' • '), 9, 'normal', '#374151');
      this.addSpace(12);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 11, 'bold', '#111827');
      this.addSpace(4);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 10, 'bold', '#111827');
        this.addSpace(2);
        this.addText(edu.institution || '', 9, 'normal', '#6b7280');
        this.addSpace(2);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 9, 'normal', '#6b7280');
        }
        this.addSpace(6);
      });
      this.addSpace(12);
    }

    // Add all additional sections with compact styling
    this.addAdditionalSections(resume, '#111827', '#374151');
  }

  // Clean template formatting
  private generateCleanTemplate(resume: ParsedResume): void {
    // Simple header
    this.addText(resume.contact.name || '', 18, 'normal', '#111827');
    this.addSpace(6);
    
    if (resume.contact.email) {
      this.addText(resume.contact.email, 10, 'normal', '#6b7280');
      this.addSpace(2);
    }
    if (resume.contact.phone) {
      this.addText(resume.contact.phone, 10, 'normal', '#6b7280');
      this.addSpace(2);
    }
    if (resume.contact.linkedin) {
      this.addText(resume.contact.linkedin, 10, 'normal', '#6b7280');
      this.addSpace(2);
    }
    if (resume.contact.address) {
      this.addText(resume.contact.address, 10, 'normal', '#6b7280');
      this.addSpace(2);
    }
    this.addSpace(16);

    // Summary
    if (resume.professionalSummary) {
      this.addText('Summary', 12, 'normal', '#111827');
      this.addSpace(6);
      this.addText(resume.professionalSummary, 10, 'normal', '#374151');
      this.addSpace(16);
    }

    // Experience
    if (resume.workExperience.length > 0) {
      this.addText('Experience', 12, 'normal', '#111827');
      this.addSpace(6);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'normal', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 10, 'normal', '#6b7280');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#6b7280');
        }
        this.addSpace(6);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Skills
    if (resume.skills.length > 0) {
      this.addText('Skills', 12, 'normal', '#111827');
      this.addSpace(6);
      this.addText(resume.skills.join(', '), 10, 'normal', '#374151');
      this.addSpace(16);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('Education', 12, 'normal', '#111827');
      this.addSpace(6);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'normal', '#111827');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#6b7280');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280');
        }
        this.addSpace(10);
      });
      this.addSpace(16);
    }

    // Add all additional sections with clean styling
    this.addAdditionalSections(resume, '#111827', '#374151');
  }

  // Border template formatting
  private generateBorderTemplate(resume: ParsedResume): void {
    // Header with border styling
    this.addText(resume.contact.name?.toUpperCase() || '', 20, 'bold', '#111827');
    this.addSpace(6);
    this.addLine('#111827', 2);
    
    // Contact info in grid format
    const leftContact = [resume.contact.email, resume.contact.phone].filter(Boolean);
    const rightContact = [resume.contact.linkedin, resume.contact.address].filter(Boolean);
    
    leftContact.forEach(info => {
      this.addText(info, 10, 'normal', '#6b7280');
      this.addSpace(2);
    });
    rightContact.forEach(info => {
      this.addText(info, 10, 'normal', '#6b7280');
      this.addSpace(2);
    });
    this.addSpace(16);

    // Professional Summary with border
    if (resume.professionalSummary) {
      this.addText('PROFESSIONAL SUMMARY', 12, 'bold', '#ffffff', 'left', 0);
      this.addSpace(8);
      this.addText(resume.professionalSummary, 10, 'normal', '#374151');
      this.addSpace(16);
    }

    // Experience with borders
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 12, 'bold', '#ffffff', 'left', 0);
      this.addSpace(8);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 10, 'bold', '#6b7280');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#6b7280');
        }
        this.addSpace(6);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Skills with border
    if (resume.skills.length > 0) {
      this.addText('CORE SKILLS', 12, 'bold', '#ffffff', 'left', 0);
      this.addSpace(8);
      
      // Display skills in a grid format
      const skillsPerRow = 3;
      for (let i = 0; i < resume.skills.slice(0, 18).length; i += skillsPerRow) {
        const rowSkills = resume.skills.slice(i, i + skillsPerRow);
        this.addText(rowSkills.join('   |   '), 10, 'normal', '#4b5563');
        this.addSpace(4);
      }
      this.addSpace(12);
    }

    // Education with border
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 12, 'bold', '#ffffff', 'left', 0);
      this.addSpace(8);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'bold', '#6b7280');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280');
        }
        this.addSpace(10);
      });
      this.addSpace(16);
    }

    // Add all additional sections with border styling
    this.addAdditionalSections(resume, '#111827', '#374151');
  }

  public generate(resume: ParsedResume, templateType: TemplateType): void {
    this.currentY = this.margin;
    
    switch (templateType) {
      case 'classic':
        this.generateClassicTemplate(resume);
        break;
      case 'modern':
        this.generateModernTemplate(resume);
        break;
      case 'minimal':
        this.generateMinimalTemplate(resume);
        break;
      case 'executive':
        this.generateExecutiveTemplate(resume);
        break;
      case 'creative':
        this.generateCreativeTemplate(resume);
        break;
      case 'tech':
        this.generateTechTemplate(resume);
        break;
      case 'professional':
        this.generateProfessionalTemplate(resume);
        break;
      case 'compact':
        this.generateCompactTemplate(resume);
        break;
      case 'clean':
        this.generateCleanTemplate(resume);
        break;
      case 'border':
        this.generateBorderTemplate(resume);
        break;
      default:
        this.generateClassicTemplate(resume);
    }
  }

  public save(filename: string): void {
    this.pdf.save(filename);
  }
}

export const generateTemplatePDF = async (
  resume: ParsedResume,
  templateType: TemplateType,
  filename: string
): Promise<boolean> => {
  try {
    console.log('Generating text-based PDF for template:', templateType);
    
    const generator = new TemplatePDFGenerator();
    generator.generate(resume, templateType);
    generator.save(filename);
    
    console.log('Text-based PDF generated successfully');
    return true;
  } catch (error) {
    console.error('Error generating text-based template PDF:', error);
    return false;
  }
};
