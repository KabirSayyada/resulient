
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ParsedResume } from '@/types/resumeStructure';
import { ATSFriendlyResumePdfTemplate } from '@/components/resume/ATSFriendlyResumePdfTemplate';
import { ModernATSTemplate } from '@/components/resume/templates/ModernATSTemplate';
import { MinimalATSTemplate } from '@/components/resume/templates/MinimalATSTemplate';
import { ExecutiveATSTemplate } from '@/components/resume/templates/ExecutiveATSTemplate';
import { createRoot } from 'react-dom/client';
import React from 'react';

type TemplateType = 'classic' | 'modern' | 'minimal' | 'executive';

const templates = {
  classic: ATSFriendlyResumePdfTemplate,
  modern: ModernATSTemplate,
  minimal: MinimalATSTemplate,
  executive: ExecutiveATSTemplate
};

export const generateTemplatePDF = async (
  resume: ParsedResume,
  templateType: TemplateType,
  filename: string
): Promise<boolean> => {
  try {
    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '0';
    tempDiv.style.margin = '0';
    document.body.appendChild(tempDiv);

    // Get the template component
    const TemplateComponent = templates[templateType];
    
    // Create React element and render it
    const element = React.createElement(TemplateComponent, { 
      resume,
      className: 'print-optimized'
    });
    
    const root = createRoot(tempDiv);
    root.render(element);

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Convert to canvas with high quality
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight,
      windowWidth: 800,
      windowHeight: tempDiv.scrollHeight
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit A4
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF
    pdf.addImage(
      canvas.toDataURL('image/png', 1.0),
      'PNG',
      0,
      0,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );

    // If content is too tall, add additional pages
    if (imgHeight > 297) { // A4 height in mm
      let remainingHeight = imgHeight - 297;
      let pageCount = 1;
      
      while (remainingHeight > 0) {
        pdf.addPage();
        pageCount++;
        
        const yOffset = -297 * (pageCount - 1);
        const currentPageHeight = Math.min(remainingHeight, 297);
        
        pdf.addImage(
          canvas.toDataURL('image/png', 1.0),
          'PNG',
          0,
          yOffset,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );
        
        remainingHeight -= 297;
      }
    }

    // Save the PDF
    pdf.save(filename);

    // Cleanup
    root.unmount();
    document.body.removeChild(tempDiv);

    return true;
  } catch (error) {
    console.error('Error generating template PDF:', error);
    return false;
  }
};
