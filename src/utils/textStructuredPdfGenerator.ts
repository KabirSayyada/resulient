
import jsPDF from 'jspdf';

interface ResumeContact {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  website?: string;
}

interface ResumeExperience {
  position: string;
  company: string;
  dates: string;
  location?: string;
  responsibilities: string[];
}

interface ResumeEducation {
  degree: string;
  institution: string;
  date: string;
  details?: string;
}

class TextStructuredPDFGenerator {
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
    this.margin = 60;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.currentY = this.margin;
    this.lineHeight = 14;
  }

  private checkPageBreak(neededHeight: number): void {
    if (this.currentY + neededHeight > this.pageHeight - this.margin - 30) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addTextLine(
    text: string,
    fontSize: number = 10,
    fontWeight: 'normal' | 'bold' = 'normal',
    color: string = '#000000',
    align: 'left' | 'center' | 'right' = 'left',
    spacingAfter: number = 0
  ): void {
    if (!text || !text.trim()) return;

    this.checkPageBreak(this.lineHeight + spacingAfter);

    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontWeight);
    this.pdf.setTextColor(color);

    let xPosition = this.margin;
    if (align === 'center') {
      xPosition = this.pageWidth / 2;
    } else if (align === 'right') {
      xPosition = this.pageWidth - this.margin;
    }

    this.pdf.text(text.trim(), xPosition, this.currentY, { align });
    this.currentY += this.lineHeight + spacingAfter;
  }

  private addSeparatorLine(): void {
    this.checkPageBreak(10);
    this.pdf.setDrawColor(180, 180, 180);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 8;
  }

  private addWrappedText(
    text: string,
    fontSize: number = 10,
    fontWeight: 'normal' | 'bold' = 'normal',
    color: string = '#000000',
    indent: number = 0,
    spacingAfter: number = 0
  ): void {
    if (!text || !text.trim()) return;

    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontWeight);
    this.pdf.setTextColor(color);

    const effectiveWidth = this.contentWidth - indent;
    const lines = this.pdf.splitTextToSize(text.trim(), effectiveWidth);
    const totalHeight = lines.length * this.lineHeight + spacingAfter;

    this.checkPageBreak(totalHeight);

    lines.forEach((line: string) => {
      this.pdf.text(line, this.margin + indent, this.currentY);
      this.currentY += this.lineHeight;
    });
    
    if (spacingAfter > 0) {
      this.currentY += spacingAfter;
    }
  }

  private parseContactInfo(content: string): ResumeContact {
    const contact: ResumeContact = {};
    const lines = content.split('\n').filter(line => line.trim());
    
    // First line is typically the name
    if (lines[0]) {
      contact.name = lines[0].trim();
    }

    // Parse contact details from remaining lines
    const contactText = lines.slice(1).join(' ');
    
    // Extract email
    const emailMatch = contactText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) contact.email = emailMatch[1];

    // Extract phone
    const phoneMatch = contactText.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch) contact.phone = phoneMatch[1];

    // Extract LinkedIn
    const linkedinMatch = contactText.match(/(linkedin\.com\/in\/[^\s|]+)/i);
    if (linkedinMatch) contact.linkedin = linkedinMatch[1];

    // Extract website/portfolio
    const websiteMatch = contactText.match(/((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s|]*)?)/);
    if (websiteMatch && !websiteMatch[1].includes('linkedin') && !websiteMatch[1].includes('@')) {
      contact.website = websiteMatch[1];
    }

    return contact;
  }

  private parseResumeContent(content: string): any {
    const sections = {
      contact: {} as ResumeContact,
      summary: '',
      experience: [] as ResumeExperience[],
      education: [] as ResumeEducation[],
      skills: '',
      achievements: '',
      projects: '',
      certifications: ''
    };

    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    let currentSection = '';
    let headerProcessed = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      // Check for section headers
      if (this.isSectionHeader(upperLine)) {
        currentSection = this.getSectionType(upperLine);
        continue;
      }

      // Process header (contact info)
      if (!headerProcessed && !currentSection) {
        if (!sections.contact.name) {
          sections.contact = this.parseContactInfo(lines.slice(0, Math.min(5, lines.length)).join('\n'));
          headerProcessed = true;
        }
        continue;
      }

      if (!headerProcessed && currentSection) {
        headerProcessed = true;
      }

      // Process content based on section
      if (currentSection) {
        this.processContentBySection(line, currentSection, sections);
      }
    }

    return sections;
  }

  private isSectionHeader(line: string): boolean {
    const headers = [
      'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE',
      'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE',
      'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES',
      'EDUCATION', 'ACADEMIC BACKGROUND',
      'PROJECTS', 'KEY PROJECTS',
      'CERTIFICATIONS', 'CERTIFICATES',
      'ACHIEVEMENTS', 'ACCOMPLISHMENTS'
    ];
    return headers.some(header => line.includes(header)) && line.length < 60;
  }

  private getSectionType(line: string): string {
    if (line.includes('SUMMARY') || line.includes('OBJECTIVE')) return 'summary';
    if (line.includes('EXPERIENCE')) return 'experience';
    if (line.includes('SKILLS') || line.includes('COMPETENCIES')) return 'skills';
    if (line.includes('EDUCATION')) return 'education';
    if (line.includes('PROJECTS')) return 'projects';
    if (line.includes('CERTIFICATIONS') || line.includes('CERTIFICATES')) return 'certifications';
    if (line.includes('ACHIEVEMENTS') || line.includes('ACCOMPLISHMENTS')) return 'achievements';
    return 'summary';
  }

  private processContentBySection(line: string, section: string, sections: any): void {
    if (section === 'experience') {
      this.processExperience(line, sections.experience);
    } else if (section === 'education') {
      this.processEducation(line, sections.education);
    } else {
      // For other sections, accumulate content
      if (sections[section]) {
        sections[section] += (sections[section] ? '\n' : '') + line;
      }
    }
  }

  private processExperience(line: string, experiences: ResumeExperience[]): void {
    // Check if this is a job title line
    if (this.isJobTitleLine(line)) {
      const exp = this.parseJobTitle(line);
      experiences.push(exp);
    } else if (line.match(/\d{4}/) && experiences.length > 0) {
      // Date/location line
      const lastExp = experiences[experiences.length - 1];
      const parts = line.split('|').map(p => p.trim());
      if (parts[0]) lastExp.dates = parts[0];
      if (parts[1]) lastExp.location = parts[1];
    } else if (line.startsWith('•') || line.startsWith('-')) {
      // Responsibility
      if (experiences.length > 0) {
        experiences[experiences.length - 1].responsibilities.push(
          line.replace(/^[•\-]\s*/, '')
        );
      }
    }
  }

  private processEducation(line: string, education: ResumeEducation[]): void {
    if (line.includes('-') || line.toLowerCase().includes('university') || line.toLowerCase().includes('college')) {
      const parts = line.split('-').map(p => p.trim());
      education.push({
        degree: parts[0] || line,
        institution: parts[1] || '',
        date: ''
      });
    } else if (line.match(/\d{4}/) && education.length > 0) {
      education[education.length - 1].date = line;
    }
  }

  private isJobTitleLine(line: string): boolean {
    return (line.includes(' - ') || line.includes(' at ')) && 
           !line.startsWith('•') && 
           line.length > 10 && 
           line.length < 150;
  }

  private parseJobTitle(line: string): ResumeExperience {
    const separators = [' - ', ' at ', ' | '];
    let position = '';
    let company = '';

    for (const sep of separators) {
      if (line.includes(sep)) {
        const parts = line.split(sep);
        position = parts[0].trim();
        company = parts.slice(1).join(sep).trim();
        break;
      }
    }

    if (!position) {
      position = line;
      company = '';
    }

    return {
      position,
      company,
      dates: '',
      location: '',
      responsibilities: []
    };
  }

  private renderHeader(contact: ResumeContact): void {
    // Name - large and centered
    if (contact.name) {
      this.addTextLine(contact.name, 18, 'bold', '#1f2937', 'center', 8);
    }

    // Contact details - centered on one line
    const contactParts = [];
    if (contact.email) contactParts.push(contact.email);
    if (contact.phone) contactParts.push(contact.phone);
    if (contact.linkedin) contactParts.push(contact.linkedin);
    if (contact.website) contactParts.push(contact.website);

    if (contactParts.length > 0) {
      this.addTextLine(contactParts.join(' • '), 10, 'normal', '#4b5563', 'center', 15);
    }

    this.addSeparatorLine();
  }

  private renderSection(title: string, content: string, isList: boolean = false): void {
    if (!content) return;

    this.currentY += 5;
    this.addTextLine(title.toUpperCase(), 12, 'bold', '#1f2937', 'left', 5);

    if (isList) {
      const items = content.split('\n').filter(item => item.trim());
      items.forEach(item => {
        this.addWrappedText(`• ${item.trim()}`, 10, 'normal', '#374151', 15, 2);
      });
    } else {
      this.addWrappedText(content, 10, 'normal', '#374151', 0, 8);
    }
  }

  private renderExperience(experiences: ResumeExperience[]): void {
    if (experiences.length === 0) return;

    this.currentY += 5;
    this.addTextLine('PROFESSIONAL EXPERIENCE', 12, 'bold', '#1f2937', 'left', 5);

    experiences.forEach((exp, index) => {
      // Job title and company
      const titleLine = exp.company ? `${exp.position} | ${exp.company}` : exp.position;
      this.addTextLine(titleLine, 11, 'bold', '#1f2937', 'left', 2);

      // Dates and location
      if (exp.dates || exp.location) {
        const dateParts = [];
        if (exp.dates) dateParts.push(exp.dates);
        if (exp.location) dateParts.push(exp.location);
        this.addTextLine(dateParts.join(' | '), 9, 'normal', '#6b7280', 'left', 3);
      }

      // Responsibilities
      exp.responsibilities.forEach(resp => {
        this.addWrappedText(`• ${resp}`, 10, 'normal', '#374151', 15, 1);
      });

      // Space between jobs
      if (index < experiences.length - 1) {
        this.currentY += 8;
      }
    });
  }

  private renderEducation(education: ResumeEducation[]): void {
    if (education.length === 0) return;

    this.currentY += 5;
    this.addTextLine('EDUCATION', 12, 'bold', '#1f2937', 'left', 5);

    education.forEach(edu => {
      const eduLine = edu.institution ? `${edu.degree} | ${edu.institution}` : edu.degree;
      this.addTextLine(eduLine, 11, 'bold', '#1f2937', 'left', 2);
      
      if (edu.date) {
        this.addTextLine(edu.date, 9, 'normal', '#6b7280', 'left', 5);
      }
    });
  }

  public generatePDF(content: string, filename: string): boolean {
    try {
      console.log('Generating text-structured PDF...');
      
      const sections = this.parseResumeContent(content);

      // Render header
      this.renderHeader(sections.contact);

      // Render summary
      if (sections.summary) {
        this.renderSection('Professional Summary', sections.summary);
      }

      // Render experience
      this.renderExperience(sections.experience);

      // Render skills
      if (sections.skills) {
        this.renderSection('Technical Skills', sections.skills);
      }

      // Render education
      this.renderEducation(sections.education);

      // Render projects
      if (sections.projects) {
        this.renderSection('Projects', sections.projects, true);
      }

      // Render certifications
      if (sections.certifications) {
        this.renderSection('Certifications', sections.certifications, true);
      }

      // Render achievements
      if (sections.achievements) {
        this.renderSection('Achievements', sections.achievements, true);
      }

      console.log('Text-structured PDF generation completed');
      this.pdf.save(filename);
      return true;
      
    } catch (error) {
      console.error('Error generating text-structured PDF:', error);
      return false;
    }
  }
}

export async function generateTextStructuredPDF(
  resumeContent: string,
  filename: string = 'text-structured-resume.pdf'
): Promise<boolean> {
  try {
    const generator = new TextStructuredPDFGenerator();
    return generator.generatePDF(resumeContent, filename);
  } catch (error) {
    console.error('Error generating text-structured PDF:', error);
    return false;
  }
}
