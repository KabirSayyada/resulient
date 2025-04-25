
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CANVAS_SETTINGS, SECURE_PDF_SETTINGS } from "./pdfConfig";
import { sanitizePdfContent } from "./pdfSecurity";

export async function generatePDFFromElement(
  element: HTMLElement, 
  filename: string, 
  singlePage: boolean = false
) {
  if (!element) return false;
  
  try {
    // Sanitize the element before processing
    const sanitizedElement = sanitizePdfContent(element);
    
    // Make element visible for capture if it was hidden
    const originalDisplay = element.style.display;
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    const originalZIndex = element.style.zIndex;
    
    // Apply temporary positioning for capture
    if (element.classList.contains('fixed')) {
      element.style.position = 'absolute';
      element.style.left = '0';
      element.style.zIndex = '9999';
    }
    
    if (originalDisplay === 'none') {
      element.style.display = 'block';
    }
    
    // Add temporary class for export to ensure proper styling
    element.classList.add('pdf-export-in-progress');
    
    // Add a small delay to ensure styles are applied
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture the element as an image
    const canvas = await html2canvas(sanitizedElement, CANVAS_SETTINGS);
    
    // Create PDF
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    if (singlePage) {
      // For scorecards - fit the entire content on one page with proper scaling
      const imgWidth = pageWidth - 40; // margins
      const scaleFactor = imgWidth / canvas.width;
      const imgHeight = canvas.height * scaleFactor;
      
      // Center vertically if there's room
      const yPosition = imgHeight < pageHeight - 40 
        ? (pageHeight - imgHeight) / 2 
        : 20;
        
      pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
    } else {
      // For full reports - handle multi-page properly
      const imgWidth = pageWidth - 40; // margins
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      
      let heightLeft = imgHeight;
      let position = 20; // initial y-position
      
      // First page
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 40);
      
      // Additional pages if needed
      while (heightLeft > 0) {
        position = position - pageHeight + 40; // 40px combined margin
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 40);
      }
    }
    
    // Add security settings to PDF
    pdf.viewerPreferences({
      DisplayDocTitle: true,
      HideToolbar: true,
      HideMenubar: true,
      HideWindowUI: true,
      FitWindow: true,
      CenterWindow: true
    });
    
    // Restore original element properties
    element.classList.remove('pdf-export-in-progress');
    
    // Restore original positioning
    if (element.classList.contains('fixed')) {
      element.style.position = originalPosition;
      element.style.left = originalLeft;
      element.style.zIndex = originalZIndex;
    }
    
    if (originalDisplay === 'none') {
      element.style.display = originalDisplay;
    }
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("PDF generation error:", error);
    return false;
  }
}

