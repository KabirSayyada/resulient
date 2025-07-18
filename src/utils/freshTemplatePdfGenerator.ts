
import jsPDF from 'jspdf';

export async function generateFreshTemplatePDF(
  textContent: string,
  filename: string = 'fresh-template-resume.pdf'
): Promise<boolean> {
  try {
    console.log('Generating fresh template PDF from content...');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);
    const lineHeight = 14;
    
    let currentY = margin + 20;

    // Parse the text content into structured sections
    const sections = parseFreshResumeContent(textContent);
    
    // Add fresh template background elements
    pdf.setFillColor(248, 250, 252); // Very light blue-gray background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add decorative side bar
    pdf.setFillColor(59, 130, 246); // Blue accent
    pdf.rect(0, 0, 8, pageHeight, 'F');
    
    // Render each section with fresh styling
    for (const section of sections) {
      currentY = renderFreshSection(pdf, section, currentY, margin, contentWidth, pageWidth, pageHeight, lineHeight);
      
      // Add page break if needed
      if (currentY > pageHeight - 100) {
        pdf.addPage();
        pdf.setFillColor(248, 250, 252);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        pdf.setFillColor(59, 130, 246);
        pdf.rect(0, 0, 8, pageHeight, 'F');
        currentY = margin + 20;
      }
    }

    console.log('Fresh template PDF generation completed');
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error generating fresh template PDF:', error);
    return false;
  }
}

interface FreshResumeSection {
  type: 'name' | 'contact' | 'section_header' | 'content' | 'bullet' | 'separator';
  content: string;
  level?: number;
}

function parseFreshResumeContent(textContent: string): FreshResumeSection[] {
  const lines = textContent.split('\n');
  const sections: FreshResumeSection[] = [];
  let foundName = false;
  let foundContact = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      sections.push({ type: 'separator', content: '' });
      continue;
    }

    // Skip markdown code block markers
    if (line.match(/^```/)) {
      continue;
    }

    // Detect name (first substantial line)
    if (!foundName && !line.includes('@') && !line.includes('|') && !line.match(/^\d/) && 
        !line.match(/^[=\-]{3,}$/) && line.length > 2 && !line.startsWith('•') && !line.startsWith('-')) {
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      const isHeader = nextLine.match(/^[=\-]{3,}$/);
      
      if (!isHeader) {
        sections.push({ type: 'name', content: line });
        foundName = true;
        continue;
      }
    }

    // Detect contact info
    if (foundName && !foundContact && (line.includes('@') || line.includes('|') || 
        line.match(/\(\d{3}\)/) || line.match(/\d{3}-\d{3}-\d{4}/))) {
      sections.push({ type: 'contact', content: line });
      foundContact = true;
      continue;
    }

    // Check if it's a section header
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
    const isHeader = nextLine.match(/^[=\-]{3,}$/);
    
    if (isHeader) {
      sections.push({ 
        type: 'section_header', 
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

function renderFreshSection(
  pdf: jsPDF, 
  section: FreshResumeSection, 
  currentY: number, 
  margin: number, 
  contentWidth: number,
  pageWidth: number,
  pageHeight: number,
  lineHeight: number
): number {
  
  switch (section.type) {
    case 'name':
      // Large, bold name with shadow effect
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.setTextColor(30, 58, 138); // Dark blue
      
      const nameLines = pdf.splitTextToSize(section.content, contentWidth - 40);
      for (const line of nameLines) {
        // Shadow effect
        pdf.setTextColor(200, 200, 200);
        pdf.text(line, margin + 22, currentY + 2);
        // Main text
        pdf.setTextColor(30, 58, 138);
        pdf.text(line, margin + 20, currentY);
        currentY += 35;
      }
      
      // Add decorative line under name
      pdf.setFillColor(59, 130, 246);
      pdf.rect(margin + 20, currentY - 10, 100, 3, 'F');
      currentY += 10;
      break;

    case 'contact':
      // Contact info in styled boxes
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(75, 85, 99); // Gray
      
      const contactInfo = parseContactInfo(section.content);
      let contactX = margin + 20;
      
      for (const info of contactInfo) {
        if (info.trim()) {
          const textWidth = pdf.getTextWidth(info.trim());
          
          // Background box for contact info
          pdf.setFillColor(236, 254, 255); // Very light cyan
          pdf.roundedRect(contactX - 5, currentY - 12, textWidth + 10, 18, 3, 3, 'F');
          
          // Border
          pdf.setDrawColor(34, 211, 238); // Cyan border
          pdf.setLineWidth(0.5);
          pdf.roundedRect(contactX - 5, currentY - 12, textWidth + 10, 18, 3, 3, 'S');
          
          pdf.text(info.trim(), contactX, currentY);
          contactX += textWidth + 25;
          
          // Move to next line if too wide
          if (contactX > pageWidth - margin - 100) {
            currentY += 25;
            contactX = margin + 20;
          }
        }
      }
      
      if (contactX > margin + 20) {
        currentY += 25;
      }
      currentY += 15;
      break;

    case 'section_header':
      currentY += 20;
      
      // Creative section header with geometric design
      pdf.setFillColor(34, 197, 94); // Green accent
      pdf.circle(margin + 25, currentY - 5, 6, 'F');
      
      pdf.setFillColor(168, 85, 247); // Purple accent
      pdf.rect(margin + 40, currentY - 8, 15, 6, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(17, 24, 39); // Very dark gray
      
      const headerLines = pdf.splitTextToSize(section.content.toUpperCase(), contentWidth - 80);
      for (const line of headerLines) {
        pdf.text(line, margin + 65, currentY);
        currentY += lineHeight + 2;
      }
      
      currentY += 10;
      break;

    case 'content':
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(55, 65, 81); // Medium gray
      
      // Check if it's a job title or company (style differently)
      const isJobTitle = section.content.includes('|') && !section.content.includes('@');
      
      if (isJobTitle) {
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(17, 24, 39);
      }
      
      const lines = pdf.splitTextToSize(section.content, contentWidth - 40);
      
      for (const line of lines) {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          pdf.setFillColor(248, 250, 252);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          pdf.setFillColor(59, 130, 246);
          pdf.rect(0, 0, 8, pageHeight, 'F');
          currentY = margin + 20;
        }
        
        pdf.text(line, margin + 30, currentY);
        currentY += lineHeight;
      }
      
      if (isJobTitle) {
        currentY += 5;
      }
      break;

    case 'bullet':
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      
      // Creative bullet design
      pdf.setFillColor(249, 115, 22); // Orange bullet
      pdf.circle(margin + 35, currentY - 3, 2.5, 'F');
      
      pdf.setFillColor(34, 197, 94); // Green inner dot
      pdf.circle(margin + 35, currentY - 3, 1, 'F');
      
      const bulletLines = pdf.splitTextToSize(section.content, contentWidth - 60);
      
      for (let i = 0; i < bulletLines.length; i++) {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          pdf.setFillColor(248, 250, 252);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          pdf.setFillColor(59, 130, 246);
          pdf.rect(0, 0, 8, pageHeight, 'F');
          currentY = margin + 20;
        }
        
        pdf.text(bulletLines[i], margin + 45, currentY);
        if (i < bulletLines.length - 1) {
          currentY += lineHeight;
        }
      }
      
      currentY += lineHeight + 3;
      break;

    case 'separator':
      currentY += 8;
      break;

    default:
      break;
  }
  
  return currentY;
}

function parseContactInfo(contactLine: string): string[] {
  const separators = [' | ', '|', ' • ', '•', ' - ', '  '];
  let contactParts = [contactLine];
  
  for (const separator of separators) {
    const newParts: string[] = [];
    for (const part of contactParts) {
      if (part.includes(separator)) {
        newParts.push(...part.split(separator));
      } else {
        newParts.push(part);
      }
    }
    contactParts = newParts;
  }
  
  return contactParts.filter(part => part.trim().length > 0);
}
