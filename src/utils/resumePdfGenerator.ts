
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ParsedResume } from '@/types/resumeStructure';

const PDF_SETTINGS = {
  format: 'a4' as const,
  orientation: 'portrait' as const,
  unit: 'pt' as const,
  margin: 40,
  scale: 2,
  backgroundColor: '#ffffff',
  logging: false,
  useCORS: true,
  allowTaint: true,
  windowWidth: 800,
  imageTimeout: 10000,
};

export async function generateATSResumePDF(
  element: HTMLElement,
  filename: string = 'optimized-resume.pdf'
): Promise<boolean> {
  if (!element) {
    console.error('Element not found for PDF generation');
    return false;
  }

  try {
    // Temporarily make the element visible if it's hidden
    const originalDisplay = element.style.display;
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    const originalZIndex = element.style.zIndex;
    
    // Ensure element is visible for capture
    element.style.display = 'block';
    element.style.position = 'relative';
    element.style.left = '0';
    element.style.zIndex = '9999';
    
    // Add a small delay to ensure styles are applied
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the element as a high-quality image
    const canvas = await html2canvas(element, {
      scale: PDF_SETTINGS.scale,
      backgroundColor: PDF_SETTINGS.backgroundColor,
      logging: PDF_SETTINGS.logging,
      useCORS: PDF_SETTINGS.useCORS,
      allowTaint: PDF_SETTINGS.allowTaint,
      windowWidth: PDF_SETTINGS.windowWidth,
      imageTimeout: PDF_SETTINGS.imageTimeout,
      onclone: (clonedDoc: Document) => {
        // Apply specific styles for better PDF rendering
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .ats-resume-template {
            background: white !important;
            color: black !important;
            font-family: Arial, sans-serif !important;
            font-size: 11px !important;
            line-height: 1.3 !important;
          }
          
          h1, h2, h3, h4, h5, h6 {
            color: black !important;
            font-weight: bold !important;
          }
          
          .text-gray-900 { color: #111827 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          
          .border-gray-300 { border-color: #d1d5db !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          
          ul {
            margin: 0 !important;
            padding-left: 16px !important;
          }
          
          li {
            margin-bottom: 2px !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: PDF_SETTINGS.orientation,
      unit: PDF_SETTINGS.unit,
      format: PDF_SETTINGS.format,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit content on single page
    const imgWidth = pageWidth - (PDF_SETTINGS.margin * 2);
    const scaleFactor = imgWidth / canvas.width;
    const imgHeight = canvas.height * scaleFactor;
    
    // If content is too tall for one page, scale it down further
    const maxHeight = pageHeight - (PDF_SETTINGS.margin * 2);
    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    
    if (imgHeight > maxHeight) {
      const heightScaleFactor = maxHeight / imgHeight;
      finalWidth = imgWidth * heightScaleFactor;
      finalHeight = maxHeight;
    }
    
    // Center the content on the page
    const xPosition = (pageWidth - finalWidth) / 2;
    const yPosition = (pageHeight - finalHeight) / 2;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalWidth, finalHeight);

    // Restore original element properties
    element.style.display = originalDisplay;
    element.style.position = originalPosition;
    element.style.left = originalLeft;
    element.style.zIndex = originalZIndex;

    // Save the PDF
    pdf.save(filename);
    
    console.log('ATS Resume PDF generated successfully');
    return true;
    
  } catch (error) {
    console.error('Error generating ATS resume PDF:', error);
    return false;
  }
}

export function generateDirectResumePDF(resume: ParsedResume, filename: string = 'optimized-resume.pdf'): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const margin = 40;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;
  
  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number, fontWeight: 'normal' | 'bold' = 'normal', indent: number = 0) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontWeight);
    
    const lines = pdf.splitTextToSize(text, contentWidth - indent);
    const lineHeight = fontSize * 1.2;
    
    for (const line of lines) {
      if (yPosition + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
        // Start new page if needed (though we want to avoid this)
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.text(line, margin + indent, yPosition);
      yPosition += lineHeight;
    }
    
    return yPosition;
  };

  // Header
  if (resume.contact.name) {
    addText(resume.contact.name, 16, 'bold');
    yPosition += 5;
  }
  
  // Contact Info
  const contactInfo = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.linkedin,
    resume.contact.address
  ].filter(Boolean).join(' | ');
  
  if (contactInfo) {
    addText(contactInfo, 10);
    yPosition += 10;
  }

  // Professional Summary
  if (resume.professionalSummary) {
    addText('PROFESSIONAL SUMMARY', 12, 'bold');
    yPosition += 3;
    addText(resume.professionalSummary, 10);
    yPosition += 8;
  }

  // Work Experience
  if (resume.workExperience.length > 0) {
    addText('PROFESSIONAL EXPERIENCE', 12, 'bold');
    yPosition += 3;
    
    resume.workExperience.forEach(exp => {
      addText(`${exp.position} - ${exp.company}`, 11, 'bold');
      if (exp.startDate || exp.endDate) {
        const dates = `${exp.startDate || ''} ${exp.endDate ? `- ${exp.endDate}` : ''}`.trim();
        addText(dates, 9);
      }
      
      exp.responsibilities.slice(0, 4).forEach(resp => {
        addText(`• ${resp}`, 9, 'normal', 10);
      });
      
      yPosition += 5;
    });
  }

  // Skills
  if (resume.skills.length > 0) {
    addText('TECHNICAL SKILLS', 12, 'bold');
    yPosition += 3;
    addText(resume.skills.slice(0, 20).join(', '), 10);
    yPosition += 8;
  }

  // Education
  if (resume.education.length > 0) {
    addText('EDUCATION', 12, 'bold');
    yPosition += 3;
    
    resume.education.forEach(edu => {
      const eduText = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''} - ${edu.institution}`;
      addText(eduText, 10, 'bold');
      if (edu.graduationDate) {
        addText(edu.graduationDate, 9);
      }
      yPosition += 3;
    });
  }

  pdf.save(filename);
}
