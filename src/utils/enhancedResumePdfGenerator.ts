
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
    console.log('Starting comprehensive content parsing...');
    const sections: ResumeSection[] = [];
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentSection: ResumeSection | null = null;
    let headerProcessed = false;
    let insideExperienceItem = false;
    let currentExperienceItem: any = null;

    console.log('Processing', lines.length, 'lines of content');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();
      console.log(`Line ${i}: "${line}" (uppercase: "${upperLine}")`);

      // Enhanced section header detection
      if (this.isSectionHeader(upperLine)) {
        console.log('Found section header:', line);
        
        // Save previous section
        if (currentSection) {
          // For experience section, add the last item if exists
          if (currentSection.type === 'experience' && currentExperienceItem) {
            if (!currentSection.items) currentSection.items = [];
            currentSection.items.push(JSON.stringify(currentExperienceItem));
          }
          sections.push(currentSection);
        }

        const sectionType = this.getSectionType(upperLine);
        currentSection = {
          type: sectionType,
          title: line,
          content: '',
          items: []
        };
        
        insideExperienceItem = false;
        currentExperienceItem = null;
        continue;
      }

      // Handle header information (contact details)
      if (!headerProcessed && !currentSection) {
        console.log('Processing header line:', line);
        
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
        continue;
      }

      // Mark header as processed when we hit first section or after reasonable lines
      if (!headerProcessed && (currentSection || i > 6)) {
        headerProcessed = true;
      }

      // Process content based on current section
      if (currentSection) {
        console.log(`Processing content for section ${currentSection.type}: "${line}"`);
        
        if (currentSection.type === 'experience') {
          this.processExperienceContent(line, currentSection, currentExperienceItem, insideExperienceItem);
        } else {
          // For other sections, handle bullet points and regular content
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            if (!currentSection.items) currentSection.items = [];
            currentSection.items.push(line.replace(/^[•\-*]\s*/, ''));
          } else if (line.trim().length > 0) {
            currentSection.content += (currentSection.content ? '\n' : '') + line;
          }
        }
      }
    }

    // Add the last section
    if (currentSection) {
      if (currentSection.type === 'experience' && currentExperienceItem) {
        if (!currentSection.items) currentSection.items = [];
        currentSection.items.push(JSON.stringify(currentExperienceItem));
      }
      sections.push(currentSection);
    }

    console.log('Parsed sections:', sections.map(s => ({ type: s.type, title: s.title, itemsCount: s.items?.length || 0, contentLength: s.content.length })));
    return sections;
  }

  private processExperienceContent(line: string, section: ResumeSection, currentItem: any, insideItem: boolean): void {
    // Clean the line of unwanted separators
    let cleanLine = line.replace(/\s*\|\s*-\s*/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Check if this is a job title/company line (contains " - " or similar patterns)
    if (this.isJobTitleLine(cleanLine)) {
      console.log('Found job title line:', cleanLine);
      
      // Save previous item if exists
      if (currentItem) {
        if (!section.items) section.items = [];
        section.items.push(JSON.stringify(currentItem));
      }
      
      // Parse new job info
      currentItem = this.parseJobTitleLine(cleanLine);
      insideItem = true;
      
    } else if (cleanLine.match(/\d{4}/) && currentItem && !cleanLine.startsWith('•')) {
      // This looks like a date/location line
      console.log('Found date/location line:', cleanLine);
      
      // Clean up any pipe separators and extra spacing
      const cleanedDateLine = cleanLine.replace(/\s*\|\s*/g, ' | ').replace(/\s+/g, ' ').trim();
      const parts = cleanedDateLine.split('|').map(p => p.trim()).filter(p => p);
      
      if (parts.length > 0) {
        currentItem.dates = parts[0];
        if (parts.length > 1) {
          currentItem.location = parts[1];
        }
      }
      
    } else if ((cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('*')) && currentItem) {
      // This is a responsibility bullet point
      console.log('Found responsibility:', cleanLine);
      if (!currentItem.responsibilities) currentItem.responsibilities = [];
      currentItem.responsibilities.push(cleanLine.replace(/^[•\-*]\s*/, ''));
      
    } else if (currentItem && cleanLine.trim().length > 10 && !cleanLine.match(/^[A-Z\s]{3,}$/)) {
      // This might be a responsibility without bullet or additional job info
      console.log('Found additional content:', cleanLine);
      if (!currentItem.responsibilities) currentItem.responsibilities = [];
      currentItem.responsibilities.push(cleanLine);
    }
  }

  private isJobTitleLine(line: string): boolean {
    // Enhanced job title detection
    const hasJobSeparators = line.includes(' - ') || line.includes(' at ') || line.includes(' | ');
    const hasReasonableLength = line.length > 10 && line.length < 150;
    const notBulletPoint = !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*');
    const notAllCaps = !(line === line.toUpperCase() && line.length > 20);
    
    return hasJobSeparators && hasReasonableLength && notBulletPoint && notAllCaps;
  }

  private parseJobTitleLine(line: string): any {
    console.log('Parsing job title line:', line);
    
    const item = {
      position: '',
      company: '',
      dates: '',
      location: '',
      responsibilities: []
    };
    
    // Remove any date patterns first for cleaner parsing
    let cleanLine = line;
    const datePatterns = [
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b/gi,
      /\b\d{1,2}\/\d{4}\b/g,
      /\b\d{4}\s*[-–—]\s*\d{4}\b/g,
      /\b\d{4}\s*[-–—]\s*(?:Present|Current|Now)\b/gi
    ];
    
    datePatterns.forEach(pattern => {
      const match = cleanLine.match(pattern);
      if (match && !item.dates) {
        item.dates = match[0];
        cleanLine = cleanLine.replace(pattern, '').trim();
      }
    });
    
    // Try different separation patterns
    const separators = [' - ', ' – ', ' — ', ' at ', ' | ', ' / '];
    
    for (const separator of separators) {
      if (cleanLine.includes(separator)) {
        const parts = cleanLine.split(separator).map(p => p.trim());
        if (parts.length >= 2) {
          item.position = parts[0];
          item.company = parts.slice(1).join(separator);
          break;
        }
      }
    }
    
    // If no clear separator, try to guess based on capitalization or length
    if (!item.position || !item.company) {
      const words = cleanLine.split(' ');
      if (words.length >= 4) {
        const midPoint = Math.floor(words.length / 2);
        item.position = words.slice(0, midPoint).join(' ');
        item.company = words.slice(midPoint).join(' ');
      } else {
        item.position = cleanLine;
        item.company = 'Company';
      }
    }
    
    console.log('Parsed job item:', item);
    return item;
  }

  private isSectionHeader(line: string): boolean {
    const sectionKeywords = [
      'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE', 'PROFILE',
      'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE', 'EMPLOYMENT',
      'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'COMPETENCIES',
      'EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS',
      'PROJECTS', 'KEY PROJECTS', 'NOTABLE PROJECTS',
      'CERTIFICATIONS', 'CERTIFICATES', 'CREDENTIALS',
      'ACHIEVEMENTS', 'ACCOMPLISHMENTS', 'AWARDS',
      'LANGUAGES', 'LANGUAGE SKILLS'
    ];

    return sectionKeywords.some(keyword => line.includes(keyword)) && line.length < 60;
  }

  private getSectionType(line: string): ResumeSection['type'] {
    if (line.includes('SUMMARY') || line.includes('OBJECTIVE') || line.includes('PROFILE')) return 'summary';
    if (line.includes('EXPERIENCE') || line.includes('EMPLOYMENT')) return 'experience';
    if (line.includes('SKILLS') || line.includes('COMPETENCIES')) return 'skills';
    if (line.includes('EDUCATION') || line.includes('ACADEMIC')) return 'education';
    if (line.includes('PROJECTS')) return 'projects';
    if (line.includes('CERTIFICATIONS') || line.includes('CERTIFICATES') || line.includes('CREDENTIALS')) return 'certifications';
    if (line.includes('ACHIEVEMENTS') || line.includes('ACCOMPLISHMENTS') || line.includes('AWARDS')) return 'achievements';
    if (line.includes('LANGUAGES') || line.includes('LANGUAGE')) return 'languages';
    return 'summary';
  }

  private renderHeader(section: ResumeSection): void {
    console.log('Rendering header with content:', section.content);
    const lines = section.content.split('\n').filter(line => line.trim());
    
    // Name (first line, larger font)
    if (lines[0]) {
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor('#1f2937');
      this.pdf.text(lines[0], this.margin, this.currentY);
      this.currentY += 24;
    }

    // Process all remaining lines as contact information
    const contactLines = lines.slice(1);
    console.log('Contact lines to process:', contactLines);
    
    // Group contact info logically
    const contactInfo = [];
    contactLines.forEach(line => {
      // Split line by common separators and clean pipe characters
      const cleanLine = line.replace(/\s*\|\s*-\s*/g, ' | ').replace(/\s+/g, ' ').trim();
      const parts = cleanLine.split(/\s*\|\s*|\s*•\s*|\s{3,}/).filter(p => p.trim());
      contactInfo.push(...parts);
    });

    // Display contact info in a clean format
    if (contactInfo.length > 0) {
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor('#4b5563');
      
      // Join with separators for better readability
      const formattedContact = contactInfo.join(' | ');
      this.pdf.text(formattedContact, this.margin, this.currentY);
      this.currentY += 16;
    }

    this.currentY += 10; // Extra space after header
  }

  private renderExperience(section: ResumeSection): void {
    console.log('Rendering experience section with items:', section.items);
    this.addSection('Professional Experience');
    
    if (!section.items || section.items.length === 0) {
      console.log('No experience items found, using content directly');
      if (section.content) {
        this.addText(section.content, 10, 'normal', '#374151');
      }
      return;
    }
    
    section.items.forEach((itemStr, index) => {
      try {
        const exp = JSON.parse(itemStr);
        console.log('Rendering experience item:', exp);
        
        this.checkPageBreak(80); // Ensure space for experience block
        
        // Job title and company on same line, cleanly formatted
        const titleLine = `${exp.position || 'Position'} - ${exp.company || 'Company'}`;
        this.addText(titleLine, 11, 'bold', '#1f2937');
        
        // Dates and location on next line, cleanly formatted
        if (exp.dates || exp.location) {
          const dateLocationParts = [];
          if (exp.dates) dateLocationParts.push(exp.dates);
          if (exp.location) dateLocationParts.push(exp.location);
          const dateLocation = dateLocationParts.join(' | ');
          this.addText(dateLocation, 9, 'normal', '#6b7280');
        }
        
        this.currentY += 4;
        
        // Responsibilities
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          exp.responsibilities.forEach((resp: string) => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 15);
          });
        }
        
        if (index < section.items.length - 1) {
          this.currentY += 12; // Space between experiences
        }
      } catch (error) {
        console.error('Error parsing experience item:', error);
        // Fallback: treat as plain text
        this.addText(`• ${itemStr}`, 10, 'normal', '#374151', 15);
      }
    });
  }

  private renderSkills(section: ResumeSection): void {
    this.addSection('Technical Skills');
    
    if (section.items && section.items.length > 0) {
      const skillsText = section.items.join(', ');
      this.addText(skillsText, 10, 'normal', '#374151');
    } else if (section.content) {
      this.addText(section.content, 10, 'normal', '#374151');
    }
  }

  private renderEducation(section: ResumeSection): void {
    this.addSection('Education');
    
    if (section.items && section.items.length > 0) {
      section.items.forEach(item => {
        this.addText(item, 10, 'normal', '#374151');
        this.currentY += 4;
      });
    } else if (section.content) {
      // Try to parse education content more intelligently
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
      } else {
        // Fallback to simple text rendering
        this.addText(section.content, 10, 'normal', '#374151');
      }
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
      console.log('Starting enhanced PDF generation with improved parsing...');
      
      const sections = this.parseResumeContent(content);
      console.log('Final parsed sections:', sections.map(s => ({ 
        type: s.type, 
        title: s.title, 
        hasContent: !!s.content, 
        itemsCount: s.items?.length || 0 
      })));

      sections.forEach((section) => {
        console.log(`Rendering section: ${section.type}`);
        
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
