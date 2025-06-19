import jsPDF from 'jspdf';
import { ParsedResume } from '@/types/resumeStructure';

type TemplateType = 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'tech' | 'professional' | 'compact' | 'clean' | 'border';

// Enhanced PDF generator that creates text-based PDFs with proper formatting and graphics
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
    this.margin = 45; // Reduced from 40 to 45pt
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
    const lineHeight = fontSize * 1.15; // Reduced from 1.4 to achieve 11pt line height from previous 12pt

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
    this.addSpace(4); // Reduced spacing
    this.pdf.setDrawColor(color);
    this.pdf.setLineWidth(width);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.addSpace(8); // Reduced spacing
  }

  // Add colored rectangle for visual elements
  private addColoredRect(x: number, y: number, width: number, height: number, color: string): void {
    this.pdf.setFillColor(color);
    this.pdf.rect(x, y, width, height, 'F');
  }

  // Add gradient simulation using multiple rectangles
  private addGradientRect(x: number, y: number, width: number, height: number, startColor: string, endColor: string): void {
    const steps = 20;
    const stepHeight = height / steps;
    
    // Parse hex colors
    const parseHex = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const start = parseHex(startColor);
    const end = parseHex(endColor);

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(start.r + (end.r - start.r) * ratio);
      const g = Math.round(start.g + (end.g - start.g) * ratio);
      const b = Math.round(start.b + (end.b - start.b) * ratio);
      
      this.pdf.setFillColor(r, g, b);
      this.pdf.rect(x, y + i * stepHeight, width, stepHeight, 'F');
    }
  }

  // Helper method to add additional sections
  private addAdditionalSections(resume: ParsedResume, headerColor: string = '#333333', contentColor: string = '#000000'): void {
    // Handle certifications
    if (resume.certifications && resume.certifications.length > 0) {
      this.addText('CERTIFICATIONS', 10, 'bold', headerColor); // Reduced from 12 to 10
      this.addLine();
      
      resume.certifications.forEach(cert => {
        const certLine = cert.issuer && cert.issuer !== 'Unknown' 
          ? `${cert.name} | ${cert.issuer}${cert.date ? ` | ${cert.date}` : ''}`
          : cert.name;
        this.addText(certLine, 9, 'normal', contentColor); // Reduced from 10 to 9
        this.addSpace(6); // Reduced spacing
      });
      this.addSpace(10); // Reduced from 12 to 10
    }

    // Handle achievements
    if (resume.achievements && resume.achievements.length > 0) {
      this.addText('ACHIEVEMENTS', 10, 'bold', headerColor); // Reduced from 12 to 10
      this.addLine();
      
      resume.achievements.forEach(achievement => {
        this.addText(`• ${achievement}`, 9, 'normal', contentColor, 'left', 15); // Reduced from 10 to 9
        this.addSpace(3); // Reduced spacing
      });
      this.addSpace(10); // Reduced from 16 to 10
    }

    // Handle projects
    if (resume.projects && resume.projects.length > 0) {
      this.addText('PROJECTS', 10, 'bold', headerColor); // Reduced from 12 to 10
      this.addLine();
      
      resume.projects.forEach(project => {
        this.addText(project.name, 9, 'bold', contentColor); // Reduced from 11 to 9
        this.addSpace(3);
        if (project.description) {
          this.addText(project.description, 9, 'normal', contentColor); // Reduced from 10 to 9
          this.addSpace(3);
        }
        if (project.technologies && project.technologies.length > 0) {
          this.addText(`Technologies: ${project.technologies.join(', ')}`, 8, 'normal', '#666666'); // Reduced from 9 to 8
        }
        this.addSpace(10); // Reduced from 12 to 10
      });
    }

    // Handle additional sections (references, languages, etc.)
    if (resume.additionalSections) {
      Object.entries(resume.additionalSections).forEach(([sectionName, sectionContent]) => {
        if (Array.isArray(sectionContent) && sectionContent.length > 0) {
          this.addText(sectionName.toUpperCase(), 10, 'bold', headerColor); // Reduced from 12 to 10
          this.addLine();
          
          sectionContent.forEach(item => {
            if (typeof item === 'string') {
              const displayText = item.startsWith('•') || item.startsWith('-') || item.startsWith('*') 
                ? item 
                : `• ${item}`;
              this.addText(displayText, 9, 'normal', contentColor, 'left', item.startsWith('•') ? 0 : 15); // Reduced from 10 to 9
              this.addSpace(3); // Reduced spacing
            }
          });
          this.addSpace(10); // Reduced from 16 to 10
        }
      });
    }
  }

  // Classic template formatting - Enhanced with additional sections
  private generateClassicTemplate(resume: ParsedResume): void {
    // Header
    this.addText(resume.contact.name || '', 16, 'bold', '#000000', 'center'); // Reduced from 18 to 16
    this.addSpace(10); // Reduced spacing
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 9, 'normal', '#666666', 'center'); // Reduced from 10 to 9
    this.addSpace(20); // Reduced spacing

    // Professional Summary
    if (resume.professionalSummary) {
      this.addText('PROFESSIONAL SUMMARY', 10, 'bold', '#333333'); // Reduced from 12 to 10
      this.addLine();
      this.addText(resume.professionalSummary, 9); // Reduced from 10 to 9
      this.addSpace(16); // Reduced spacing
    }

    // Work Experience
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 10, 'bold', '#333333'); // Reduced from 12 to 10
      this.addLine();
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 9, 'bold'); // Reduced from 11 to 9
        this.addSpace(2);
        this.addText(`${exp.company || ''} | ${exp.startDate || ''} - ${exp.endDate || ''}`, 9, 'normal', '#666666'); // Reduced from 10 to 9
        this.addSpace(6); // Reduced spacing
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 9, 'normal', '#000000', 'left', 15); // Reduced from 10 to 9
            this.addSpace(2); // Reduced spacing
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12); // Reduced spacing
      });
      this.addSpace(16); // Reduced spacing
    }

    // Skills
    if (resume.skills.length > 0) {
      this.addText('TECHNICAL SKILLS', 10, 'bold', '#333333'); // Reduced from 12 to 10
      this.addLine();
      this.addText(resume.skills.join(' • '), 9); // Reduced from 10 to 9
      this.addSpace(16); // Reduced spacing
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 10, 'bold', '#333333'); // Reduced from 12 to 10
      this.addLine();
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 9, 'bold'); // Reduced from 11 to 9
        this.addSpace(2);
        this.addText(`${edu.institution || ''} | ${edu.graduationDate || ''}`, 9, 'normal', '#666666'); // Reduced from 10 to 9
        this.addSpace(10); // Reduced from 12 to 10
      });
      this.addSpace(12); // Reduced spacing
    }

    // Add all additional sections
    this.addAdditionalSections(resume, '#333333', '#000000');
  }

  // Modern template formatting - Enhanced with additional sections
  private generateModernTemplate(resume: ParsedResume): void {
    // Header with blue accent
    this.addText(resume.contact.name || '', 16, 'bold', '#1e40af'); // Reduced from 20 to 16
    this.addSpace(10); // Reduced spacing
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 9, 'normal', '#374151'); // Reduced from 10 to 9
    this.addLine('#3b82f6', 2);
    this.addSpace(16); // Reduced spacing

    // Professional Summary with background effect (simulated with spacing)
    if (resume.professionalSummary) {
      this.addText('PROFESSIONAL SUMMARY', 10, 'bold', '#1e40af'); // Reduced from 12 to 10
      this.addSpace(10); // Reduced spacing
      this.addText(resume.professionalSummary, 9, 'normal', '#111827'); // Reduced from 10 to 9
      this.addSpace(16); // Reduced spacing
    }

    // Work Experience with left border effect
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 10, 'bold', '#1e40af'); // Reduced from 12 to 10
      this.addSpace(10); // Reduced spacing
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 9, 'bold', '#111827'); // Reduced from 11 to 9
        this.addSpace(2);
        this.addText(exp.company || '', 9, 'bold', '#3b82f6'); // Reduced from 10 to 9
        this.addSpace(2);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 9, 'normal', '#6b7280'); // Reduced from 10 to 9
        }
        this.addSpace(6); // Reduced spacing
        
        if (exp.responsibilities) {
          exp.responsibilities.slice(0, 4).forEach(resp => {
            this.addText(`• ${resp}`, 9, 'normal', '#374151', 'left', 15); // Reduced from 10 to 9
            this.addSpace(2); // Reduced spacing
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12); // Reduced spacing
      });
      this.addSpace(16); // Reduced spacing
    }

    // Skills in tag-like format
    if (resume.skills.length > 0) {
      this.addText('TECHNICAL SKILLS', 10, 'bold', '#1e40af'); // Reduced from 12 to 10
      this.addSpace(10); // Reduced spacing
      
      let skillsLine = '';
      resume.skills.slice(0, 15).forEach((skill, index) => {
        skillsLine += skill;
        if (index < resume.skills.slice(0, 15).length - 1) skillsLine += ' | ';
      });
      this.addText(skillsLine, 9, 'normal', '#374151'); // Reduced from 10 to 9
      this.addSpace(16); // Reduced spacing
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 10, 'bold', '#1e40af'); // Reduced from 12 to 10
      this.addSpace(10); // Reduced spacing
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 9, 'bold', '#111827'); // Reduced from 11 to 9
        this.addSpace(2);
        this.addText(edu.institution || '', 9, 'normal', '#374151'); // Reduced from 10 to 9
        this.addSpace(2);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 9, 'normal', '#6b7280'); // Reduced from 10 to 9
        }
        this.addSpace(10); // Reduced spacing
      });
      this.addSpace(12); // Reduced spacing
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

  // Creative template formatting with graphics
  private generateCreativeTemplate(resume: ParsedResume): void {
    // Add gradient header background
    this.addGradientRect(0, 0, this.pageWidth, 80, '#7c3aed', '#a855f7');
    
    // Header with gradient effect
    this.addText(resume.contact.name || '', 22, 'normal', '#ffffff', 'center');
    this.addSpace(8);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' • ');
    
    this.addText(contactInfo, 10, 'normal', '#ffffff', 'center');
    this.addSpace(20);

    // Professional Summary with accent
    if (resume.professionalSummary) {
      // Add colored circle accent
      this.addColoredRect(this.margin - 5, this.currentY - 2, 4, 16, '#7c3aed');
      this.addText('Professional Summary', 14, 'normal', '#7c3aed', 'left', 15);
      this.addSpace(8);
      this.addText(resume.professionalSummary, 10, 'normal', '#374151', 'left', 15);
      this.addSpace(16);
    }

    // Core Competencies with visual tags
    if (resume.skills.length > 0) {
      this.addColoredRect(this.margin - 5, this.currentY - 2, 4, 16, '#7c3aed');
      this.addText('Core Competencies', 14, 'normal', '#7c3aed', 'left', 15);
      this.addSpace(8);
      
      // Add skills with background rectangles to simulate tags
      let currentX = this.margin + 15;
      let lineY = this.currentY;
      const skillsPerLine = 4;
      let skillCount = 0;
      
      resume.skills.slice(0, 15).forEach((skill, index) => {
        if (skillCount === skillsPerLine) {
          currentX = this.margin + 15;
          lineY += 20;
          skillCount = 0;
        }
        
        const skillWidth = skill.length * 4 + 10;
        this.addColoredRect(currentX, lineY - 12, skillWidth, 16, '#f3f4f6');
        this.pdf.setFontSize(9);
        this.pdf.setTextColor('#374151');
        this.pdf.text(skill, currentX + 5, lineY - 2);
        
        currentX += skillWidth + 10;
        skillCount++;
      });
      
      this.currentY = lineY + 20;
      this.addSpace(16);
    }

    // Professional Experience
    if (resume.workExperience.length > 0) {
      this.addColoredRect(this.margin - 5, this.currentY - 2, 4, 16, '#7c3aed');
      this.addText('Professional Experience', 14, 'normal', '#7c3aed', 'left', 15);
      this.addSpace(8);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 12, 'bold', '#111827', 'left', 15);
        this.addSpace(3);
        this.addText(exp.company || '', 11, 'bold', '#7c3aed', 'left', 15);
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#6b7280', 'left', 15);
        }
        this.addSpace(6);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 30);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Education
    if (resume.education.length > 0) {
      this.addColoredRect(this.margin - 5, this.currentY - 2, 4, 16, '#7c3aed');
      this.addText('Education', 14, 'normal', '#7c3aed', 'left', 15);
      this.addSpace(8);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827', 'left', 15);
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#7c3aed', 'left', 15);
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280', 'left', 15);
        }
        this.addSpace(10);
      });
      this.addSpace(16);
    }

    // Add all additional sections with creative styling
    this.addAdditionalSections(resume, '#7c3aed', '#374151');
  }

  // Tech template formatting with graphics
  private generateTechTemplate(resume: ParsedResume): void {
    // Add left border accent
    this.addColoredRect(0, 0, 6, this.pageHeight, '#16a34a');
    
    // Header
    this.addText(resume.contact.name || '', 18, 'bold', '#111827', 'left', 20);
    this.addSpace(8);
    
    // Add terminal-style contact info with icons (simulated with text)
    if (resume.contact.email) {
      this.addText(`[email] ${resume.contact.email}`, 10, 'normal', '#16a34a', 'left', 20);
      this.addSpace(2);
    }
    if (resume.contact.phone) {
      this.addText(`[phone] ${resume.contact.phone}`, 10, 'normal', '#16a34a', 'left', 20);
      this.addSpace(2);
    }
    if (resume.contact.linkedin) {
      this.addText(`[linkedin] ${resume.contact.linkedin}`, 10, 'normal', '#16a34a', 'left', 20);
      this.addSpace(2);
    }
    this.addSpace(16);

    // About section with code-style header
    if (resume.professionalSummary) {
      this.addText('// ABOUT', 12, 'bold', '#111827', 'left', 20);
      this.addLine('#16a34a', 1);
      
      // Add background for summary
      this.addColoredRect(this.margin + 20, this.currentY - 5, this.contentWidth - 40, 50, '#f9fafb');
      this.addText(resume.professionalSummary, 10, 'normal', '#374151', 'left', 30);
      this.addSpace(16);
    }

    // Tech Stack with code formatting
    if (resume.skills.length > 0) {
      this.addText('// TECH_STACK', 12, 'bold', '#111827', 'left', 20);
      this.addLine('#16a34a', 1);
      
      // Add dark background for code block
      this.addColoredRect(this.margin + 20, this.currentY - 5, this.contentWidth - 40, 60, '#111827');
      this.currentY += 5;
      this.addText('const skills = [', 10, 'normal', '#16a34a', 'left', 30);
      this.addSpace(4);
      
      resume.skills.slice(0, 12).forEach((skill, index) => {
        const isLast = index === resume.skills.slice(0, 12).length - 1;
        this.addText(`  "${skill}"${isLast ? '' : ','}`, 10, 'normal', '#eab308', 'left', 50);
        this.addSpace(2);
      });
      
      this.addText('];', 10, 'normal', '#16a34a', 'left', 30);
      this.addSpace(16);
    }

    // Experience with terminal styling
    if (resume.workExperience.length > 0) {
      this.addText('// EXPERIENCE', 12, 'bold', '#111827', 'left', 20);
      this.addLine('#16a34a', 1);
      
      resume.workExperience.forEach((exp, index) => {
        // Add border for each experience
        this.addColoredRect(this.margin + 20, this.currentY - 5, this.contentWidth - 40, 3, '#e5e7eb');
        this.addSpace(8);
        
        this.addText(exp.position || '', 11, 'bold', '#111827', 'left', 30);
        this.addSpace(3);
        this.addText(exp.company || '', 11, 'bold', '#16a34a', 'left', 30);
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'bold', '#6b7280', 'left', 30);
        }
        this.addSpace(6);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`> ${resp}`, 10, 'normal', '#374151', 'left', 45);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('// EDUCATION', 12, 'bold', '#111827', 'left', 20);
      this.addLine('#16a34a', 1);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827', 'left', 30);
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#16a34a', 'left', 30);
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280', 'left', 30);
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

  // Border template formatting with graphics
  private generateBorderTemplate(resume: ParsedResume): void {
    // Add full page border
    this.pdf.setDrawColor('#111827');
    this.pdf.setLineWidth(2);
    this.pdf.rect(20, 20, this.pageWidth - 40, this.pageHeight - 40);
    
    // Add inner border
    this.pdf.setDrawColor('#6b7280');
    this.pdf.setLineWidth(1);
    this.pdf.rect(30, 30, this.pageWidth - 60, this.pageHeight - 60);
    
    // Adjust margins for border
    this.margin = 50;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    
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

    // Professional Summary with border accent
    if (resume.professionalSummary) {
      // Add section background
      this.addColoredRect(this.margin, this.currentY - 5, this.contentWidth, 20, '#111827');
      this.addText('PROFESSIONAL SUMMARY', 12, 'bold', '#ffffff', 'left', 10);
      this.addSpace(15);
      this.addText(resume.professionalSummary, 10, 'normal', '#374151');
      this.addSpace(16);
    }

    // Experience with bordered sections
    if (resume.workExperience.length > 0) {
      this.addColoredRect(this.margin, this.currentY - 5, this.contentWidth, 20, '#111827');
      this.addText('PROFESSIONAL EXPERIENCE', 12, 'bold', '#ffffff', 'left', 10);
      this.addSpace(15);
      
      resume.workExperience.forEach((exp, index) => {
        // Add border for each experience
        this.pdf.setDrawColor('#e5e7eb');
        this.pdf.setLineWidth(1);
        this.pdf.rect(this.margin, this.currentY - 5, this.contentWidth, 80);
        
        this.addText(exp.position || '', 11, 'bold', '#111827', 'left', 10);
        this.addSpace(3);
        this.addText(exp.company || '', 10, 'bold', '#6b7280', 'left', 10);
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#6b7280', 'left', 10);
        }
        this.addSpace(6);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 25);
            this.addSpace(3);
          });
        }
        
        this.addSpace(15);
        if (index < resume.workExperience.length - 1) this.addSpace(12);
      });
      this.addSpace(16);
    }

    // Skills with border styling
    if (resume.skills.length > 0) {
      this.addColoredRect(this.margin, this.currentY - 5, this.contentWidth, 20, '#111827');
      this.addText('CORE SKILLS', 12, 'bold', '#ffffff', 'left', 10);
      this.addSpace(15);
      
      // Display skills in a bordered grid format
      const skillsPerRow = 3;
      for (let i = 0; i < resume.skills.slice(0, 18).length; i += skillsPerRow) {
        const rowSkills = resume.skills.slice(i, i + skillsPerRow);
        this.addText(rowSkills.join('   |   '), 10, 'normal', '#4b5563', 'left', 10);
        this.addSpace(4);
      }
      this.addSpace(12);
    }

    // Education with border styling
    if (resume.education.length > 0) {
      this.addColoredRect(this.margin, this.currentY - 5, this.contentWidth, 20, '#111827');
      this.addText('EDUCATION', 12, 'bold', '#ffffff', 'left', 10);
      this.addSpace(15);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827', 'left', 10);
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'bold', '#6b7280', 'left', 10);
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280', 'left', 10);
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
    console.log('Generating enhanced PDF with graphics for template:', templateType);
    
    const generator = new TemplatePDFGenerator();
    generator.generate(resume, templateType);
    generator.save(filename);
    
    console.log('Enhanced PDF with graphics generated successfully');
    return true;
  } catch (error) {
    console.error('Error generating enhanced template PDF:', error);
    return false;
  }
};
