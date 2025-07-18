
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

interface ParsedText {
  text: string;
  isBold: boolean;
}

function parseMarkdownText(text: string): ParsedText[] {
  const parts: ParsedText[] = [];
  const regex = /(\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText) {
        parts.push({ text: beforeText, isBold: false });
      }
    }

    // Add the bold text (remove the ** markers)
    const boldText = match[1].replace(/\*\*/g, '');
    if (boldText) {
      parts.push({ text: boldText, isBold: true });
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      parts.push({ text: remainingText, isBold: false });
    }
  }

  // If no markdown was found, return the whole text as non-bold
  if (parts.length === 0) {
    parts.push({ text: text, isBold: false });
  }

  return parts;
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

function renderTextWithFormatting(pdf: jsPDF, parsedText: ParsedText[], x: number, y: number, maxWidth: number): { finalY: number; lines: number } {
  let currentX = x;
  let currentY = y;
  let linesUsed = 0;
  const lineHeight = 16;
  
  for (const part of parsedText) {
    // Set font style based on formatting
    if (part.isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    // Split text into words to handle line wrapping
    const words = part.text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? ' ' : '');
      const wordWidth = pdf.getTextWidth(word);
      
      // Check if word fits on current line
      if (currentX + wordWidth > x + maxWidth && currentX > x) {
        // Move to next line
        currentY += lineHeight;
        currentX = x;
        linesUsed++;
      }
      
      // Render the word
      pdf.text(word, currentX, currentY);
      currentX += wordWidth;
    }
  }
  
  return { finalY: currentY, lines: Math.max(1, linesUsed + 1) };
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
      
      const headerText = section.content.toUpperCase();
      const headerLines = pdf.splitTextToSize(headerText, contentWidth - 20);
      for (const line of headerLines) {
        pdf.text(line, margin + 10, currentY);
        currentY += lineHeight;
      }
      
      currentY += 10; // Extra spacing after headers
      break;

    case 'content':
      pdf.setFontSize(11);
      pdf.setTextColor(51, 51, 51); // Dark gray
      
      // Check if it's contact info or dates (make it smaller and lighter)
      if (section.content.includes('@') || section.content.includes('|') || section.content.match(/\d{4}/)) {
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128); // Gray-500
      }
      
      // Parse markdown formatting in the content
      const parsedContent = parseMarkdownText(section.content);
      const result = renderTextWithFormatting(pdf, parsedContent, margin, currentY, contentWidth);
      currentY = result.finalY + (lineHeight * 0.5); // Add small spacing
      
      // Add extra spacing after contact info or dates
      if (section.content.includes('@') || section.content.includes('|')) {
        currentY += 5;
      }
      break;

    case 'bullet':
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(51, 51, 51);
      
      // Render bullet point
      pdf.text('•', margin + 15, currentY);
      
      // Parse and render bullet content with formatting
      const parsedBullet = parseMarkdownText(`${section.content}`);
      const bulletResult = renderTextWithFormatting(pdf, parsedBullet, margin + 25, currentY, contentWidth - 25);
      currentY = bulletResult.finalY + (lineHeight * 0.3);
      break;

    case 'separator':
      currentY += 8; // Add space for separators
      break;

    default:
      break;
  }
  
  return currentY;
}
