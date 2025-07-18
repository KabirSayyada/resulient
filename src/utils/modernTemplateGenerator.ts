
import jsPDF from 'jspdf';

export async function generateModernTemplatePDF(
  textContent: string,
  filename: string = 'modern-template-resume.pdf'
): Promise<boolean> {
  try {
    console.log('Generating modern template PDF from content...');
    
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
    const sections = parseResumeContent(textContent);
    
    // Add modern header background
    pdf.setFillColor(52, 73, 94); // Dark blue-gray
    pdf.rect(0, 0, pageWidth, 120, 'F');
    
    // Render each section with modern styling
    for (const section of sections) {
      currentY = renderModernSection(pdf, section, currentY, margin, contentWidth, pageWidth, pageHeight, lineHeight);
      
      // Add page break if needed
      if (currentY > pageHeight - 100) {
        pdf.addPage();
        currentY = margin + 20;
      }
    }

    console.log('Modern template PDF generation completed');
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error generating modern template PDF:', error);
    return false;
  }
}

interface ModernResumeSection {
  type: 'name' | 'contact' | 'section_header' | 'content' | 'bullet' | 'separator' | 'experience_item' | 'education_item';
  content: string;
  level?: number;
  metadata?: any;
}

function parseResumeContent(textContent: string): ModernResumeSection[] {
  const lines = textContent.split('\n');
  const sections: ModernResumeSection[] = [];
  let isFirstSection = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      sections.push({ type: 'separator', content: '' });
      continue;
    }

    // Detect name (usually the first non-empty line)
    if (isFirstSection && !line.includes('@') && !line.includes('|') && !line.match(/^\d/)) {
      sections.push({ type: 'name', content: line });
      isFirstSection = false;
      continue;
    }

    // Detect contact info (contains email, phone, or has | separators)
    if (line.includes('@') || line.includes('|') || line.match(/\(\d{3}\)/)) {
      sections.push({ type: 'contact', content: line });
      continue;
    }

    // Check if it's a section header (followed by equals or dashes)
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

function processModernText(text: string): { text: string; isBold: boolean; isItalic: boolean }[] {
  const parts: { text: string; isBold: boolean; isItalic: boolean }[] = [];
  
  // Handle both bold (**) and italic (*) markdown
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the formatted part
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        isBold: false,
        isItalic: false
      });
    }
    
    const matchedText = match[1];
    if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
      // Bold text
      parts.push({
        text: matchedText.replace(/\*\*/g, ''),
        isBold: true,
        isItalic: false
      });
    } else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
      // Italic text
      parts.push({
        text: matchedText.replace(/\*/g, ''),
        isBold: false,
        isItalic: true
      });
    }
    
    lastIndex = match.index + matchedText.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isBold: false,
      isItalic: false
    });
  }
  
  return parts.length > 0 ? parts : [{ text, isBold: false, isItalic: false }];
}

function renderModernSection(
  pdf: jsPDF, 
  section: ModernResumeSection, 
  currentY: number, 
  margin: number, 
  contentWidth: number,
  pageWidth: number,
  pageHeight: number,
  lineHeight: number
): number {
  
  switch (section.type) {
    case 'name':
      // Name in header area with white text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255); // White text
      
      const nameLines = pdf.splitTextToSize(section.content, contentWidth - 40);
      for (const line of nameLines) {
        pdf.text(line, margin + 20, 50);
      }
      
      currentY = 140; // Position after header
      break;

    case 'contact':
      // Contact info in header area with light text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(236, 240, 241); // Light gray
      
      const contactLines = pdf.splitTextToSize(section.content, contentWidth - 40);
      for (const line of contactLines) {
        pdf.text(line, margin + 20, 80);
      }
      break;

    case 'section_header':
      // Modern section headers with accent color
      currentY += 15;
      
      // Add accent line
      pdf.setFillColor(231, 76, 60); // Red accent
      pdf.rect(margin, currentY - 5, 30, 3, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(52, 73, 94); // Dark blue-gray
      
      const headerLines = pdf.splitTextToSize(section.content.toUpperCase(), contentWidth - 50);
      for (const line of headerLines) {
        pdf.text(line, margin + 40, currentY + 8);
        currentY += lineHeight;
      }
      
      currentY += 8;
      break;

    case 'content':
      const contentParts = processModernText(section.content);
      
      // Check if it's a job title or company (make it stand out)
      const isJobTitle = section.content.includes('|') && !section.content.includes('@');
      
      if (isJobTitle) {
        pdf.setFontSize(12);
        pdf.setTextColor(52, 73, 94); // Dark blue-gray
      } else {
        pdf.setFontSize(10);
        pdf.setTextColor(85, 85, 85); // Medium gray
      }
      
      // Handle multi-format text properly
      let currentText = '';
      
      for (let i = 0; i < contentParts.length; i++) {
        const part = contentParts[i];
        currentText += part.text;
        
        // If this is the last part or formatting changes, render the text
        if (i === contentParts.length - 1 || 
            (i < contentParts.length - 1 && 
             (contentParts[i + 1].isBold !== part.isBold || 
              contentParts[i + 1].isItalic !== part.isItalic))) {
          
          // Set font style
          let fontStyle = 'normal';
          if (part.isBold && part.isItalic) fontStyle = 'bolditalic';
          else if (part.isBold) fontStyle = 'bold';
          else if (part.isItalic) fontStyle = 'italic';
          
          pdf.setFont('helvetica', fontStyle);
          
          // Split and render text
          const lines = pdf.splitTextToSize(currentText, contentWidth - 20);
          
          for (const line of lines) {
            if (currentY > pageHeight - margin) {
              pdf.addPage();
              currentY = margin + 20;
            }
            
            pdf.text(line, margin + 20, currentY);
            currentY += lineHeight;
          }
          
          currentText = '';
        }
      }
      
      if (isJobTitle) {
        currentY += 5; // Extra spacing after job titles
      }
      break;

    case 'bullet':
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(85, 85, 85);
      
      // Modern bullet point
      pdf.setFillColor(231, 76, 60); // Red accent
      pdf.circle(margin + 25, currentY - 3, 2, 'F');
      
      // Process bullet content with markdown
      const bulletParts = processModernText(section.content);
      let bulletText = '';
      
      for (const part of bulletParts) {
        bulletText += part.text;
      }
      
      const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 40);
      
      for (let i = 0; i < bulletLines.length; i++) {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin + 20;
        }
        
        // Handle mixed formatting within the line
        let lineText = bulletLines[i];
        let hasFormatting = false;
        
        for (const part of bulletParts) {
          if (lineText.includes(part.text) && (part.isBold || part.isItalic)) {
            hasFormatting = true;
            break;
          }
        }
        
        if (hasFormatting) {
          // Render with formatting
          let xPosition = margin + 35;
          let remainingText = lineText;
          
          for (const part of bulletParts) {
            if (remainingText.includes(part.text)) {
              const beforeText = remainingText.substring(0, remainingText.indexOf(part.text));
              
              if (beforeText) {
                pdf.setFont('helvetica', 'normal');
                pdf.text(beforeText, xPosition, currentY);
                xPosition += pdf.getTextWidth(beforeText);
              }
              
              let fontStyle = 'normal';
              if (part.isBold && part.isItalic) fontStyle = 'bolditalic';
              else if (part.isBold) fontStyle = 'bold';
              else if (part.isItalic) fontStyle = 'italic';
              
              pdf.setFont('helvetica', fontStyle);
              pdf.text(part.text, xPosition, currentY);
              xPosition += pdf.getTextWidth(part.text);
              
              remainingText = remainingText.substring(remainingText.indexOf(part.text) + part.text.length);
            }
          }
          
          if (remainingText) {
            pdf.setFont('helvetica', 'normal');
            pdf.text(remainingText, xPosition, currentY);
          }
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.text(lineText, margin + 35, currentY);
        }
        
        if (i < bulletLines.length - 1) {
          currentY += lineHeight;
        }
      }
      
      currentY += lineHeight + 3;
      break;

    case 'separator':
      currentY += 10;
      break;

    default:
      break;
  }
  
  return currentY;
}
