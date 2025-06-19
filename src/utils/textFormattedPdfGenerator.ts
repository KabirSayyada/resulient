
import jsPDF from 'jspdf';

export async function generateTextFormattedPDF(
  textContent: string,
  filename: string = 'optimized-resume.pdf'
): Promise<boolean> {
  try {
    console.log('Generating PDF from text content...');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    const lineHeight = 14;
    const fontSize = 10;
    
    let currentY = margin;

    // Set default font
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(fontSize);
    pdf.setTextColor('#000000');

    const lines = textContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we need a new page
      if (currentY + lineHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      // Handle empty lines
      if (line.trim() === '') {
        currentY += lineHeight * 0.5; // Half line spacing for empty lines
        continue;
      }

      // Check if line is a section header underline pattern
      const isUnderline = line.match(/^=+$/);
      
      if (isUnderline) {
        // Draw underline for the previous section title
        const prevY = currentY - lineHeight;
        pdf.setDrawColor(150, 150, 150);
        pdf.setLineWidth(0.5);
        pdf.line(margin, prevY + 2, pageWidth - margin, prevY + 2);
        currentY += lineHeight * 0.3;
        continue;
      }

      // Check if line is a section title (next line might be underline)
      const nextLineIsUnderline = i + 1 < lines.length && lines[i + 1].match(/^=+$/);
      
      if (nextLineIsUnderline) {
        // This is a section header - clean it from # symbols and bullet points
        let cleanHeader = line.replace(/^#+\s*/, '').replace(/^[•\-*]\s*/, '').trim();
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor('#1f2937');
        
        const wrappedLines = pdf.splitTextToSize(cleanHeader, contentWidth);
        for (const wrappedLine of wrappedLines) {
          pdf.text(wrappedLine, margin, currentY);
          currentY += lineHeight * 1.2;
        }
        
        // Reset font for next content
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(fontSize);
        pdf.setTextColor('#000000');
        continue;
      }

      // Handle bullet points (but not for job titles/company roles)
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        // Check if this looks like a job title/company role (contains common separators)
        const isJobTitle = line.includes(' - ') || line.includes(' at ') || line.includes(' | ');
        
        if (isJobTitle) {
          // This is a job title, don't treat as bullet point
          const cleanJobTitle = line.replace(/^[•\-*]\s*/, '').trim();
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor('#1f2937');
          
          const wrappedLines = pdf.splitTextToSize(cleanJobTitle, contentWidth);
          for (const wrappedLine of wrappedLines) {
            pdf.text(wrappedLine, margin, currentY);
            currentY += lineHeight;
          }
          
          // Reset font
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(fontSize);
          pdf.setTextColor('#000000');
          continue;
        } else {
          // This is a real bullet point
          const indent = 15;
          const bulletText = line.startsWith('•') ? line : `• ${line.substring(1).trim()}`;
          
          pdf.setFontSize(fontSize);
          pdf.setTextColor('#000000');
          
          const wrappedLines = pdf.splitTextToSize(bulletText, contentWidth - indent);
          for (const wrappedLine of wrappedLines) {
            pdf.text(wrappedLine, margin + indent, currentY);
            currentY += lineHeight;
          }
          continue;
        }
      }

      // Handle regular text - clean any # symbols from the beginning
      let cleanLine = line.replace(/^#+\s*/, '').trim();
      
      const wrappedLines = pdf.splitTextToSize(cleanLine, contentWidth);
      for (const wrappedLine of wrappedLines) {
        // Check for contact info or dates (smaller, gray text)
        if (cleanLine.includes('@') || cleanLine.includes('|') || cleanLine.match(/\d{4}/)) {
          pdf.setFontSize(9);
          pdf.setTextColor('#666666');
        } else {
          pdf.setFontSize(fontSize);
          pdf.setTextColor('#000000');
        }
        
        pdf.text(wrappedLine, margin, currentY);
        currentY += lineHeight;
      }

      // Add extra spacing after certain content
      if (cleanLine.includes('@') || cleanLine.match(/\d{4}/)) {
        currentY += lineHeight * 0.3;
      }
    }

    console.log('PDF generation completed, saving...');
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error generating text-formatted PDF:', error);
    return false;
  }
}
