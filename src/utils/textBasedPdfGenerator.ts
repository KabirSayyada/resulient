
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
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    const lineHeight = 14; // Increased from 12
    
    let currentY = margin + 15; // Increased initial spacing

    // Parse the text content into structured sections
    const sections = parseTextContent(textContent);
    
    // Render each section with different styling
    for (const section of sections) {
      currentY = renderSection(pdf, section, currentY, margin, contentWidth, pageWidth, pageHeight, lineHeight);
      
      // Add page break if needed
      if (currentY > pageHeight - 80) { // Increased bottom margin
        pdf.addPage();
        currentY = margin + 15;
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

function processMarkdownText(text: string): { text: string; isBold: boolean }[] {
  const parts: { text: string; isBold: boolean }[] = [];
  const regex = /(\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        isBold: false
      });
    }
    
    // Add the bold part (remove the ** markers)
    parts.push({
      text: match[1].replace(/\*\*/g, ''),
      isBold: true
    });
    
    lastIndex = match.index + match[1].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isBold: false
    });
  }
  
  return parts.length > 0 ? parts : [{ text, isBold: false }];
}

function renderSection(
  pdf: jsPDF, 
  section: ResumeSection, 
  currentY: number, 
  margin: number, 
  contentWidth: number,
  pageWidth: number,
  pageHeight: number,
  lineHeight: number
): number {
  
  switch (section.type) {
    case 'header':
      // Section headers with blue background and white text
      pdf.setFillColor(59, 130, 246); // Blue-500
      pdf.rect(margin, currentY - 14, contentWidth, 22, 'F'); // Increased height
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255); // White text
      
      const headerLines = pdf.splitTextToSize(section.content.toUpperCase(), contentWidth - 16);
      for (const line of headerLines) {
        pdf.text(line, margin + 8, currentY);
        currentY += lineHeight;
      }
      
      currentY += 10; // Increased spacing after headers
      break;

    case 'content':
      const contentParts = processMarkdownText(section.content);
      
      // Check if it's contact info or dates (make it smaller and lighter)
      const isContactOrDate = section.content.includes('@') || section.content.includes('|') || section.content.match(/\d{4}/);
      
      if (isContactOrDate) {
        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128); // Gray-500
      } else {
        pdf.setFontSize(10);
        pdf.setTextColor(51, 51, 51); // Dark gray
      }
      
      // Handle multi-line content properly
      let currentText = '';
      let isBoldText = false;
      
      for (let i = 0; i < contentParts.length; i++) {
        const part = contentParts[i];
        currentText += part.text;
        
        // If this is the last part or the next part has different formatting, render the accumulated text
        if (i === contentParts.length - 1 || contentParts[i + 1].isBold !== part.isBold) {
          if (part.isBold) {
            pdf.setFont('helvetica', 'bold');
          } else {
            pdf.setFont('helvetica', 'normal');
          }
          
          // Split text into lines that fit within the content width
          const lines = pdf.splitTextToSize(currentText, contentWidth);
          
          for (const line of lines) {
            if (currentY > pageHeight - margin) {
              pdf.addPage();
              currentY = margin + 15;
            }
            
            pdf.text(line, margin, currentY);
            currentY += lineHeight;
          }
          
          // Reset for next part
          currentText = '';
        }
      }
      
      // Add spacing after contact info or dates
      if (isContactOrDate) {
        currentY += 6; // Increased spacing
      }
      break;

    case 'bullet':
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      
      // Process markdown in bullet content
      const bulletParts = processMarkdownText(section.content);
      
      // Add bullet point
      pdf.text('•', margin + 12, currentY);
      
      // Handle bullet content with proper text wrapping
      let bulletText = '';
      for (const part of bulletParts) {
        bulletText += part.text;
      }
      
      // Split bullet text into lines that fit within the available width
      const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 24);
      
      for (let i = 0; i < bulletLines.length; i++) {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin + 15;
        }
        
        // Check if any part of this line should be bold
        let lineText = bulletLines[i];
        let hasBoldContent = false;
        
        for (const part of bulletParts) {
          if (part.isBold && lineText.includes(part.text)) {
            hasBoldContent = true;
            break;
          }
        }
        
        if (hasBoldContent) {
          // Handle mixed formatting within the line
          let xPosition = margin + 24;
          let remainingText = lineText;
          
          for (const part of bulletParts) {
            if (remainingText.includes(part.text)) {
              const beforeText = remainingText.substring(0, remainingText.indexOf(part.text));
              
              if (beforeText) {
                pdf.setFont('helvetica', 'normal');
                pdf.text(beforeText, xPosition, currentY);
                xPosition += pdf.getTextWidth(beforeText);
              }
              
              if (part.isBold) {
                pdf.setFont('helvetica', 'bold');
              } else {
                pdf.setFont('helvetica', 'normal');
              }
              
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
          pdf.text(lineText, margin + 24, currentY);
        }
        
        if (i < bulletLines.length - 1) {
          currentY += lineHeight;
        }
      }
      
      currentY += lineHeight + 2; // Added extra spacing between bullet points
      break;

    case 'separator':
      currentY += 8; // Increased spacing for separators
      break;

    default:
      break;
  }
  
  return currentY;
}
