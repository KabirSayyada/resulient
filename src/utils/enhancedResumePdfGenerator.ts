
import jsPDF from 'jspdf';

interface ResumeSection {
  type: 'header' | 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications' | 'achievements' | 'languages';
  title?: string;
  content: string;
  items?: string[];
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

  private parseStructuredContent(content: string): ResumeSection[] {
    console.log('Parsing structured resume content...');
    const sections: ResumeSection[] = [];
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentSection: ResumeSection | null = null;
    let headerProcessed = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip separator lines
      if (line.match(/^[─\-=]+$/)) continue;
      
      // Check for section headers
      if (this.isSectionHeader(line)) {
        console.log('Found section:', line);
        
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }

        const sectionType = this.getSectionType(line.toUpperCase());
        currentSection = {
          type: sectionType,
          title: line,
          content: '',
          items: []
        };
        continue;
      }

      // Handle header (contact info) - first non-section lines
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
        continue;
      }

      // Mark header as processed when we hit first section
      if (!headerProcessed && currentSection) {
        headerProcessed = true;
      }

      // Add content to current section
      if (currentSection && line.trim().length > 0) {
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          if (!currentSection.items) currentSection.items = [];
          currentSection.items.push(line.replace(/^[•\-*]\s*/, ''));
        } else {
          currentSection.content += (currentSection.content ? '\n' : '') + line;
        }
      }
    }

    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }

    console.log('Parsed sections:', sections.map(s => ({ 
      type: s.type, 
      title: s.title, 
      contentLength: s.content.length, 
      itemsCount: s.items?.length || 0 
    })));

    return sections;
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

    const upperLine = line.toUpperCase();
    return sectionKeywords.some(keyword => upperLine.includes(keyword)) && line.length < 60;
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
    console.log('Rendering header:', section.content);
    const lines = section.content.split('\n').filter(line => line.trim());
    
    // Name (first line)
    if (lines[0]) {
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor('#1f2937');
      this.pdf.text(lines[0], this.margin, this.currentY);
      this.currentY += 24;
    }

    // Contact information
    const contactLines = lines.slice(1);
    if (contactLines.length > 0) {
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor('#4b5563');
      
      contactLines.forEach(line => {
        this.pdf.text(line, this.margin, this.currentY);
        this.currentY += 14;
      });
    }

    this.currentY += 10;
  }

  private renderExperience(section: ResumeSection): void {
    this.addSection('Professional Experience');
    
    const lines = section.content.split('\n').filter(line => line.trim());
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Check if this looks like a job title/company line
      if (this.isJobTitleLine(line)) {
        this.checkPageBreak(60);
        this.addText(line, 11, 'bold', '#1f2937');
        
        // Look for date/location on next line
        if (i + 1 < lines.length && lines[i + 1].match(/\d{4}/)) {
          this.addText(lines[i + 1], 9, 'normal', '#6b7280');
          i++;
        }
        
        this.currentY += 4;
      } else {
        // Regular content
        this.addText(line, 10, 'normal', '#374151');
      }
      
      i++;
    }

    // Add items if any
    if (section.items && section.items.length > 0) {
      section.items.forEach(item => {
        this.addText(`• ${item}`, 10, 'normal', '#374151', 15);
      });
    }
  }

  private isJobTitleLine(line: string): boolean {
    return line.includes(' - ') || line.includes(' at ') || 
           (line.length > 10 && line.length < 100 && !line.startsWith('•'));
  }

  private renderGenericSection(section: ResumeSection): void {
    if (!section.title) return;
    
    this.addSection(section.title.replace(/^[A-Z\s]+$/, (match) => 
      match.split(' ').map(word => 
        word.charAt(0) + word.slice(1).toLowerCase()
      ).join(' ')
    ));
    
    if (section.content) {
      this.addText(section.content, 10, 'normal', '#374151');
    }
    
    if (section.items && section.items.length > 0) {
      section.items.forEach(item => {
        this.addText(`• ${item}`, 10, 'normal', '#374151');
      });
    }
  }

  public generatePDF(content: string, filename: string): boolean {
    try {
      console.log('Starting enhanced PDF generation...');
      
      const sections = this.parseStructuredContent(content);

      sections.forEach((section) => {
        console.log(`Rendering section: ${section.type}`);
        
        switch (section.type) {
          case 'header':
            this.renderHeader(section);
            break;
          case 'experience':
            this.renderExperience(section);
            break;
          default:
            this.renderGenericSection(section);
            break;
        }
        
        this.currentY += 12;
      });

      console.log('PDF generation completed');
      this.pdf.save(filename);
      return true;
      
    } catch (error) {
      console.error('Error in PDF generation:', error);
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
