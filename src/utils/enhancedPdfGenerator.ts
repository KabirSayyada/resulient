
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFGenerationOptions {
  filename: string;
  format: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  quality: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const DEFAULT_OPTIONS: PDFGenerationOptions = {
  filename: 'resume.pdf',
  format: 'a4',
  orientation: 'portrait',
  quality: 1.0,
  margins: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
};

export class EnhancedPDFGenerator {
  private static readonly CANVAS_SETTINGS = {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true,
    allowTaint: false,
    foreignObjectRendering: false,
    onclone: (clonedDoc: Document) => {
      // Ensure all styles are properly applied for PDF rendering
      const style = clonedDoc.createElement('style');
      style.textContent = `
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `;
      clonedDoc.head.appendChild(style);
    }
  };

  static async generateFromHTML(
    htmlContent: string, 
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<boolean> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    try {
      // Create a temporary container for the HTML content
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 800px;
        background: white;
        font-family: 'Times New Roman', serif;
        line-height: 1.3;
        color: #000;
        padding: 40px;
      `;
      
      document.body.appendChild(container);
      
      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate canvas from HTML
      const canvas = await html2canvas(container, this.CANVAS_SETTINGS);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: opts.orientation,
        unit: 'mm',
        format: opts.format
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions
      const imgWidth = pageWidth - opts.margins.left - opts.margins.right;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', opts.quality);
      
      // Handle multi-page content
      let yPosition = opts.margins.top;
      let remainingHeight = imgHeight;
      
      while (remainingHeight > 0) {
        const pageContentHeight = Math.min(
          remainingHeight, 
          pageHeight - opts.margins.top - opts.margins.bottom
        );
        
        if (yPosition !== opts.margins.top) {
          pdf.addPage();
          yPosition = opts.margins.top;
        }
        
        pdf.addImage(
          imgData,
          'PNG',
          opts.margins.left,
          yPosition,
          imgWidth,
          pageContentHeight
        );
        
        remainingHeight -= pageContentHeight;
        yPosition = -(remainingHeight);
      }
      
      // Clean up
      document.body.removeChild(container);
      
      // Save PDF
      pdf.save(opts.filename);
      
      return true;
    } catch (error) {
      console.error('Enhanced PDF generation failed:', error);
      return false;
    }
  }

  static async generateFromElement(
    element: HTMLElement,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<boolean> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    try {
      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Create temporary container
      const container = document.createElement('div');
      container.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        background: white;
      `;
      container.appendChild(clonedElement);
      document.body.appendChild(container);
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate canvas
      const canvas = await html2canvas(clonedElement, this.CANVAS_SETTINGS);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: opts.orientation,
        unit: 'mm',
        format: opts.format
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth - opts.margins.left - opts.margins.right;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      
      const imgData = canvas.toDataURL('image/png', opts.quality);
      
      // Add image to PDF with proper scaling
      if (imgHeight <= pageHeight - opts.margins.top - opts.margins.bottom) {
        // Single page
        pdf.addImage(
          imgData,
          'PNG',
          opts.margins.left,
          opts.margins.top,
          imgWidth,
          imgHeight
        );
      } else {
        // Multi-page handling - Fixed the argument count issue
        let yPosition = opts.margins.top;
        let sourceY = 0;
        const maxPageHeight = pageHeight - opts.margins.top - opts.margins.bottom;
        
        while (sourceY < canvas.height) {
          if (yPosition !== opts.margins.top) {
            pdf.addPage();
            yPosition = opts.margins.top;
          }
          
          const remainingCanvasHeight = canvas.height - sourceY;
          const pageCanvasHeight = Math.min(
            remainingCanvasHeight,
            (maxPageHeight / imgHeight) * canvas.height
          );
          
          // Fixed: Removed the extra arguments that were causing the error
          pdf.addImage(
            imgData,
            'PNG',
            opts.margins.left,
            yPosition,
            imgWidth,
            (pageCanvasHeight / canvas.height) * imgHeight
          );
          
          sourceY += pageCanvasHeight;
          yPosition = opts.margins.top;
        }
      }
      
      // Clean up
      document.body.removeChild(container);
      
      // Save PDF
      pdf.save(opts.filename);
      
      return true;
    } catch (error) {
      console.error('Enhanced PDF generation from element failed:', error);
      return false;
    }
  }
}
