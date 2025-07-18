
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
    
    console.log('Parsing contact info from lines:', lines);
    
    // Look for name in the first few lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim();
      // Skip lines that look like contact info
      if (!line.includes('@') && !line.match(/\d{3}/) && !line.includes('linkedin') && line.length > 2) {
        contact.name = line;
        break;
      }
    }

    // Parse contact details from all lines
    const allText = lines.join(' ');
    
    // Extract email
    const emailMatch = allText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) contact.email = emailMatch[1];

    // Extract phone
    const phoneMatch = allText.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch) contact.phone = phoneMatch[1];

    // Extract LinkedIn
    const linkedinMatch = allText.match(/(linkedin\.com\/in\/[^\s|]+)/i);
    if (linkedinMatch) contact.linkedin = linkedinMatch[1];

    console.log('Parsed contact info:', contact);
    return contact;
  }

  private parseResumeContent(content: string): any {
    console.log('Starting to parse resume content...');
    
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
    console.log('Total lines to process:', lines.length);
    
    let currentSection = '';
    let headerProcessed = false;
    let currentExperience: ResumeExperience | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      console.log(`Processing line ${i}: "${line}"`);

      // Check for section headers
      if (this.isSectionHeader(upperLine)) {
        currentSection = this.getSectionType(upperLine);
        console.log(`Found section header: ${currentSection}`);
        
        // Save current experience if we're leaving experience section
        if (currentExperience && currentSection !== 'experience') {
          sections.experience.push(currentExperience);
          currentExperience = null;
        }
        continue;
      }

      // Process header (contact info) - take first 5 lines if no section identified yet
      if (!headerProcessed && !currentSection) {
        const headerLines = lines.slice(0, Math.min(5, lines.length));
        sections.contact = this.parseContactInfo(headerLines.join('\n'));
        headerProcessed = true;
        console.log('Header processed, contact info:', sections.contact);
        continue;
      }

      if (!headerProcessed && currentSection) {
        headerProcessed = true;
      }

      // Process content based on section
      if (currentSection === 'experience') {
        this.processExperience(line, sections.experience, currentExperience);
        if (sections.experience.length > 0) {
          currentExperience = sections.experience[sections.experience.length - 1];
        }
      } else if (currentSection === 'education') {
        this.processEducation(line, sections.education);
      } else if (currentSection) {
        // For other sections, accumulate content
        if (sections[currentSection] !== undefined) {
          if (typeof sections[currentSection] === 'string') {
            sections[currentSection] += (sections[currentSection] ? '\n' : '') + line;
          }
        }
      }
    }

    // Save final experience if exists
    if (currentExperience) {
      sections.experience.push(currentExperience);
    }

    console.log('Final parsed sections:', sections);
    return sections;
  }

  private isSectionHeader(line: string): boolean {
    const headers = [
      'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE', 'PROFILE',
      'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE', 'EMPLOYMENT',
      'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'COMPETENCIES',
      'EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS',
      'PROJECTS', 'KEY PROJECTS', 'NOTABLE PROJECTS',
      'CERTIFICATIONS', 'CERTIFICATES', 'CERTIFICATION',
      'ACHIEVEMENTS', 'ACCOMPLISHMENTS', 'AWARDS'
    ];
    
    // Check if line contains any header keywords and is reasonably short
    return headers.some(header => line.includes(header)) && line.length < 100;
  }

  private getSectionType(line: string): string {
    if (line.includes('SUMMARY') || line.includes('OBJECTIVE') || line.includes('PROFILE')) return 'summary';
    if (line.includes('EXPERIENCE') || line.includes('EMPLOYMENT')) return 'experience';
    if (line.includes('SKILLS') || line.includes('COMPETENCIES')) return 'skills';
    if (line.includes('EDUCATION') || line.includes('ACADEMIC') || line.includes('QUALIFICATIONS')) return 'education';
    if (line.includes('PROJECTS')) return 'projects';
    if (line.includes('CERTIFICATIONS') || line.includes('CERTIFICATES')) return 'certifications';
    if (line.includes('ACHIEVEMENTS') || line.includes('ACCOMPLISHMENTS') || line.includes('AWARDS')) return 'achievements';
    return 'summary';
  }

  private processExperience(line: string, experiences: ResumeExperience[], currentExperience: ResumeExperience | null): void {
    // Check if this is a job title line (contains common separators)
    if (this.isJobTitleLine(line)) {
      const exp = this.parseJobTitle(line);
      experiences.push(exp);
      console.log('Added new experience:', exp);
    } 
    // Check if this looks like a date/location line
    else if (line.match(/\d{4}/) && experiences.length > 0) {
      const lastExp = experiences[experiences.length - 1];
      const parts = line.split('|').map(p => p.trim());
      if (parts[0]) lastExp.dates = parts[0];
      if (parts[1]) lastExp.location = parts[1];
      console.log('Updated experience with dates/location:', lastExp);
    } 
    // Check if this is a responsibility bullet point
    else if ((line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) && experiences.length > 0) {
      const responsibility = line.replace(/^[•\-*]\s*/, '').trim();
      experiences[experiences.length - 1].responsibilities.push(responsibility);
      console.log('Added responsibility:', responsibility);
    }
    // Check if this looks like a company/location line without bullet
    else if (experiences.length > 0 && !line.startsWith('•') && !line.startsWith('-') && line.length > 10) {
      const lastExp = experiences[experiences.length - 1];
      if (!lastExp.company && line.length < 100) {
        lastExp.company = line;
        console.log('Updated company name:', line);
      } else if (line.length < 200) {
        // Treat as responsibility without bullet
        lastExp.responsibilities.push(line);
        console.log('Added responsibility (no bullet):', line);
      }
    }
  }

  private processEducation(line: string, education: ResumeEducation[]): void {
    if (line.includes('-') || line.toLowerCase().includes('university') || 
        line.toLowerCase().includes('college') || line.toLowerCase().includes('degree')) {
      const parts = line.split('-').map(p => p.trim());
      education.push({
        degree: parts[0] || line,
        institution: parts[1] || '',
        date: ''
      });
      console.log('Added education:', education[education.length - 1]);
    } else if (line.match(/\d{4}/) && education.length > 0) {
      education[education.length - 1].date = line;
      console.log('Updated education date:', line);
    }
  }

  private isJobTitleLine(line: string): boolean {
    return (line.includes(' - ') || line.includes(' at ') || line.includes(' | ')) && 
           !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*') &&
           line.length > 10 && line.length < 150;
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
      position = line.trim();
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
    console.log('Rendering header with contact:', contact);
    
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
    if (!content || !content.trim()) return;

    console.log(`Rendering section: ${title}`);
    
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

    console.log(`Rendering ${experiences.length} experiences`);
    
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

    console.log(`Rendering ${education.length} education entries`);
    
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
      console.log('Generating text-structured PDF with content length:', content.length);
      
      if (!content || content.trim().length === 0) {
        console.error('No content provided for PDF generation');
        return false;
      }
      
      const sections = this.parseResumeContent(content);

      // Always render header, even if minimal
      this.renderHeader(sections.contact);

      // If we don't have structured sections, render the raw content
      if (!sections.summary && sections.experience.length === 0 && !sections.skills && sections.education.length === 0) {
        console.log('No structured sections found, rendering raw content');
        this.renderSection('Resume Content', content);
      } else {
        // Render structured sections
        if (sections.summary) {
          this.renderSection('Professional Summary', sections.summary);
        }

        this.renderExperience(sections.experience);

        if (sections.skills) {
          this.renderSection('Technical Skills', sections.skills);
        }

        this.renderEducation(sections.education);

        if (sections.projects) {
          this.renderSection('Projects', sections.projects, true);
        }

        if (sections.certifications) {
          this.renderSection('Certifications', sections.certifications, true);
        }

        if (sections.achievements) {
          this.renderSection('Achievements', sections.achievements, true);
        }
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
    console.log('Starting text-structured PDF generation...');
    const generator = new TextStructuredPDFGenerator();
    return generator.generatePDF(resumeContent, filename);
  } catch (error) {
    console.error('Error generating text-structured PDF:', error);
    return false;
  }
}
