
import jsPDF from 'jspdf';

interface ResumeSection {
  type: 'header' | 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications' | 'achievements' | 'languages';
  title?: string;
  content: string;
  items?: string[];
}

interface ExperienceItem {
  position: string;
  company: string;
  dates: string;
  location?: string;
  responsibilities: string[];
}

interface EducationItem {
  degree: string;
  institution: string;
  date: string;
  details?: string;
}

class EnhancedResumePDFGenerator {
  private pdf: jsPDF;
  private currentY: number;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;
  private lineHeight: number;

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    this.pageWidth = 595.28;
    this.pageHeight = 841.89;
    this.margin = 50;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.currentY = this.margin;
    this.lineHeight = 14;
  }

  private checkPageBreak(neededHeight: number): void {
    if (this.currentY + neededHeight > this.pageHeight - this.margin - 20) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addText(
    text: string,
    fontSize: number = 10,
    fontWeight: 'normal' | 'bold' = 'normal',
    color: string = '#000000',
    indent: number = 0,
    maxWidth?: number
  ): void {
    if (!text || !text.trim()) return;

    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontWeight);
    this.pdf.setTextColor(color);

    const effectiveWidth = maxWidth || (this.contentWidth - indent);
    const lines = this.pdf.splitTextToSize(text.trim(), effectiveWidth);
    const totalHeight = lines.length * this.lineHeight * 1.2;

    this.checkPageBreak(totalHeight);

    lines.forEach((line: string) => {
      this.pdf.text(line, this.margin + indent, this.currentY);
      this.currentY += this.lineHeight * 1.2;
    });
  }

  private addSection(title: string): void {
    this.currentY += 8;
    this.checkPageBreak(20);
    
    // Section title
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor('#1f2937');
    this.pdf.text(title.toUpperCase(), this.margin, this.currentY);
    this.currentY += 16;
    
    // Underline
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.currentY - 2, this.pageWidth - this.margin, this.currentY - 2);
    this.currentY += 8;
  }

  private parseResumeContent(content: string): ResumeSection[] {
    const sections: ResumeSection[] = [];
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentSection: ResumeSection | null = null;
    let headerProcessed = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      // Check for section headers
      if (this.isSectionHeader(upperLine)) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }

        const sectionType = this.getSectionType(upperLine);
        currentSection = {
          type: sectionType,
          title: line,
          content: '',
          items: []
        };
        continue;
      }

      // Handle header information (first few lines before any section)
      if (!headerProcessed && !currentSection) {
        if (!sections.find(s => s.type === 'header')) {
          sections.push({
            type: 'header',
            content: line,
            items: []
          });
        } else {
          const headerSection = sections.find(s => s.type === 'header');
          if (headerSection) {
            headerSection.content += '\n' + line;
          }
        }

        // Mark header as processed after a few lines or when we hit a section
        if (sections.length > 0 && sections[0].content.split('\n').length >= 4) {
          headerProcessed = true;
        }
        continue;
      }

      // Add content to current section
      if (currentSection) {
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          currentSection.items?.push(line.replace(/^[•\-*]\s*/, ''));
        } else {
          currentSection.content += (currentSection.content ? '\n' : '') + line;
        }
      }
    }

    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  private isSectionHeader(line: string): boolean {
    const sectionKeywords = [
      'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE',
      'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE',
      'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES',
      'EDUCATION', 'ACADEMIC BACKGROUND',
      'PROJECTS', 'KEY PROJECTS',
      'CERTIFICATIONS', 'CERTIFICATES',
      'ACHIEVEMENTS', 'ACCOMPLISHMENTS',
      'LANGUAGES'
    ];

    return sectionKeywords.some(keyword => line.includes(keyword)) && line.length < 50;
  }

  private getSectionType(line: string): ResumeSection['type'] {
    if (line.includes('SUMMARY') || line.includes('OBJECTIVE')) return 'summary';
    if (line.includes('EXPERIENCE')) return 'experience';
    if (line.includes('SKILLS') || line.includes('COMPETENCIES')) return 'skills';
    if (line.includes('EDUCATION')) return 'education';
    if (line.includes('PROJECTS')) return 'projects';
    if (line.includes('CERTIFICATIONS') || line.includes('CERTIFICATES')) return 'certifications';
    if (line.includes('ACHIEVEMENTS') || line.includes('ACCOMPLISHMENTS')) return 'achievements';
    if (line.includes('LANGUAGES')) return 'languages';
    return 'summary';
  }

  private renderHeader(section: ResumeSection): void {
    const lines = section.content.split('\n').filter(line => line.trim());
    
    // Name (first line, larger font)
    if (lines[0]) {
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor('#1f2937');
      this.pdf.text(lines[0], this.margin, this.currentY);
      this.currentY += 24;
    }

    // Contact information (remaining lines, smaller font)
    const contactInfo = lines.slice(1).join(' | ');
    if (contactInfo) {
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor('#4b5563');
      this.pdf.text(contactInfo, this.margin, this.currentY);
      this.currentY += 16;
    }

    this.currentY += 10; // Extra space after header
  }

  private renderExperience(section: ResumeSection): void {
    this.addSection('Professional Experience');
    
    const experiences = this.parseExperienceItems(section.content);
    
    experiences.forEach((exp, index) => {
      this.checkPageBreak(60); // Ensure space for experience block
      
      // Job title and company
      this.addText(`${exp.position} - ${exp.company}`, 11, 'bold', '#1f2937');
      
      // Dates and location
      if (exp.dates || exp.location) {
        const dateLocation = [exp.dates, exp.location].filter(Boolean).join(' | ');
        this.addText(dateLocation, 9, 'normal', '#6b7280');
      }
      
      this.currentY += 4;
      
      // Responsibilities
      exp.responsibilities.forEach(resp => {
        this.addText(`• ${resp}`, 10, 'normal', '#374151', 15);
      });
      
      if (index < experiences.length - 1) {
        this.currentY += 12; // Space between experiences
      }
    });
  }

  private parseExperienceItems(content: string): ExperienceItem[] {
    const lines = content.split('\n').filter(line => line.trim());
    const experiences: ExperienceItem[] = [];
    let currentExp: ExperienceItem | null = null;

    for (const line of lines) {
      if (line.includes(' - ') && !line.startsWith('•') && !line.match(/^\d{4}/)) {
        // This is likely a job title - company line
        if (currentExp) {
          experiences.push(currentExp);
        }
        
        const parts = line.split(' - ');
        currentExp = {
          position: parts[0]?.trim() || '',
          company: parts[1]?.trim() || '',
          dates: '',
          responsibilities: []
        };
      } else if (currentExp && line.match(/\d{4}/)) {
        // This is a date line
        const parts = line.split('|');
        currentExp.dates = parts[0]?.trim() || '';
        currentExp.location = parts[1]?.trim() || '';
      } else if (currentExp && (line.startsWith('•') || line.startsWith('-'))) {
        // This is a responsibility
        currentExp.responsibilities.push(line.replace(/^[•\-]\s*/, ''));
      }
    }

    if (currentExp) {
      experiences.push(currentExp);
    }

    return experiences;
  }

  private renderSkills(section: ResumeSection): void {
    this.addSection('Technical Skills');
    
    let skillsText = section.content;
    if (section.items && section.items.length > 0) {
      skillsText = section.items.join(', ');
    }
    
    this.addText(skillsText, 10, 'normal', '#374151');
  }

  private renderEducation(section: ResumeSection): void {
    this.addSection('Education');
    
    const lines = section.content.split('\n').filter(line => line.trim());
    let currentEdu: EducationItem | null = null;
    
    for (const line of lines) {
      if (line.includes(' - ') || line.toLowerCase().includes('university') || line.toLowerCase().includes('college')) {
        if (currentEdu) {
          this.renderEducationItem(currentEdu);
        }
        
        const parts = line.split(' - ');
        currentEdu = {
          degree: parts[0]?.trim() || line,
          institution: parts[1]?.trim() || '',
          date: ''
        };
      } else if (currentEdu && line.match(/\d{4}/)) {
        currentEdu.date = line;
      }
    }
    
    if (currentEdu) {
      this.renderEducationItem(currentEdu);
    }
  }

  private renderEducationItem(edu: EducationItem): void {
    this.checkPageBreak(30);
    this.addText(edu.degree, 11, 'bold', '#1f2937');
    if (edu.institution) {
      this.addText(edu.institution, 10, 'normal', '#6b7280');
    }
    if (edu.date) {
      this.addText(edu.date, 9, 'normal', '#6b7280');
    }
    this.currentY += 8;
  }

  private renderGenericSection(section: ResumeSection): void {
    if (!section.title) return;
    
    this.addSection(section.title.replace(/^[A-Z\s]+$/, (match) => 
      match.split(' ').map(word => 
        word.charAt(0) + word.slice(1).toLowerCase()
      ).join(' ')
    ));
    
    if (section.items && section.items.length > 0) {
      section.items.forEach(item => {
        this.addText(`• ${item}`, 10, 'normal', '#374151', 0);
      });
    } else if (section.content) {
      this.addText(section.content, 10, 'normal', '#374151');
    }
  }

  public generatePDF(content: string, filename: string): boolean {
    try {
      console.log('Starting enhanced PDF generation...');
      
      const sections = this.parseResumeContent(content);
      console.log('Parsed sections:', sections.map(s => ({ type: s.type, title: s.title })));

      sections.forEach((section) => {
        switch (section.type) {
          case 'header':
            this.renderHeader(section);
            break;
          case 'summary':
            this.addSection('Professional Summary');
            this.addText(section.content, 10, 'normal', '#374151');
            break;
          case 'experience':
            this.renderExperience(section);
            break;
          case 'skills':
            this.renderSkills(section);
            break;
          case 'education':
            this.renderEducation(section);
            break;
          default:
            this.renderGenericSection(section);
            break;
        }
        
        this.currentY += 12; // Space between sections
      });

      console.log('PDF generation completed, saving...');
      this.pdf.save(filename);
      return true;
      
    } catch (error) {
      console.error('Error in enhanced PDF generation:', error);
      return false;
    }
  }
}

export async function generateEnhancedResumePDF(
  resumeContent: string,
  filename: string = 'optimized-resume.pdf'
): Promise<boolean> {
  try {
    const generator = new EnhancedResumePDFGenerator();
    return generator.generatePDF(resumeContent, filename);
  } catch (error) {
    console.error('Error generating enhanced resume PDF:', error);
    return false;
  }
}
