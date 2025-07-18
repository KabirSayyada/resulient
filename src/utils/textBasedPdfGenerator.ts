
import jsPDF from 'jspdf';

export async function generateTextBasedPDF(
  textContent: string,
  filename: string = 'text-based-resume.pdf'
): Promise<boolean> {
  try {
    console.log('Generating text-based PDF from content...');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);
    const lineHeight = 16;
    
    let currentY = margin + 20;

    // Parse the text content into structured sections
    const sections = parseTextContent(textContent);
    
    // Render each section with different styling
    for (const section of sections) {
      currentY = renderSection(pdf, section, currentY, margin, contentWidth, pageWidth, pageHeight);
      
      // Add page break if needed
      if (currentY > pageHeight - 100) {
        pdf.addPage();
        currentY = margin + 20;
      }
    }

    console.log('Text-based PDF generation completed');
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error generating text-based PDF:', error);
    return false;
  }
}

interface ResumeSection {
  type: 'header' | 'section' | 'content' | 'bullet' | 'separator';
  content: string;
  level?: number;
}

function parseTextContent(textContent: string): ResumeSection[] {
  const lines = textContent.split('\n');
  const sections: ResumeSection[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      sections.push({ type: 'separator', content: '' });
      continue;
    }

    // Check if it's a section header (followed by equals or dashes)
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
    const isHeader = nextLine.match(/^[=\-]{3,}$/);
    
    if (isHeader) {
      sections.push({ 
        type: 'header', 
        content: line.replace(/^#+\s*/, '').replace(/^[•\-*]\s*/, '').trim()
      });
      i++; // Skip the underline
      continue;
    }

    // Check if it's a bullet point
    if (line.match(/^[•\-*]\s/)) {
      sections.push({ 
        type: 'bullet', 
        content: line.replace(/^[•\-*]\s*/, '').trim()
      });
      continue;
    }

    // Regular content
    sections.push({ type: 'content', content: line });
  }
  
  return sections;
}

function renderSection(
  pdf: jsPDF, 
  section: ResumeSection, 
  currentY: number, 
  margin: number, 
  contentWidth: number,
  pageWidth: number,
  pageHeight: number
): number {
  const lineHeight = 16;
  
  switch (section.type) {
    case 'header':
      // Section headers with blue background and white text
      pdf.setFillColor(59, 130, 246); // Blue-500
      pdf.rect(margin, currentY - 15, contentWidth, 25, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255); // White text
      
      const headerLines = pdf.splitTextToSize(section.content.toUpperCase(), contentWidth - 20);
      for (const line of headerLines) {
        pdf.text(line, margin + 10, currentY);
        currentY += lineHeight;
      }
      
      currentY += 10; // Extra spacing after headers
      break;

    case 'content':
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(51, 51, 51); // Dark gray
      
      // Check if it's contact info or dates (make it smaller and lighter)
      if (section.content.includes('@') || section.content.includes('|') || section.content.match(/\d{4}/)) {
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128); // Gray-500
      }
      
      const contentLines = pdf.splitTextToSize(section.content, contentWidth);
      for (const line of contentLines) {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin + 20;
        }
        pdf.text(line, margin, currentY);
        currentY += lineHeight;
      }
      
      // Add spacing after contact info or dates
      if (section.content.includes('@') || section.content.includes('|')) {
        currentY += 5;
      }
      break;

    case 'bullet':
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(51, 51, 51);
      
      // Add bullet point with indentation
      const bulletText = `• ${section.content}`;
      const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 20);
      
      for (const line of bulletLines) {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin + 20;
        }
        pdf.text(line, margin + 15, currentY);
        currentY += lineHeight;
      }
      break;

    case 'separator':
      currentY += 8; // Add space for separators
      break;

    default:
      break;
  }
  
  return currentY;
}
