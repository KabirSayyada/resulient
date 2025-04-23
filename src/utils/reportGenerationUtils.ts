import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ScoreData } from "@/types/resume";

/**
 * Consistent settings for all canvas capture operations
 */
const CANVAS_SETTINGS = {
  scale: 2,
  backgroundColor: '#ffffff',
  logging: false,
  useCORS: true,
  allowTaint: true,
  windowWidth: 1200,
  imageTimeout: 15000, // Increased timeout for images
  foreignObjectRendering: false, // Disable for better compatibility
  onclone: (clonedDoc: Document) => {
    // Apply explicit CSS rules needed for PDF rendering
    const newStyleEl = clonedDoc.createElement('style');
    newStyleEl.textContent = `
      /* Force background colors for PDF export */
      .pdf-header, .from-indigo-400, .via-fuchsia-300, .to-blue-300, 
      .bg-gradient-to-r, .bg-gradient-to-br, .profile-header {
        background-color: #9b87f5 !important;
        color: #000000 !important;
      }
      
      /* Fix avatar images */
      .pdf-avatar, .avatar {
        overflow: visible !important;
        position: relative !important;
      }
      
      .pdf-avatar img, .avatar img, .pdf-image {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      
      /* Make sure text is visible */
      .pdf-skills-text, .text-fuchsia-700 {
        white-space: normal !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
        overflow: visible !important;
      }
    `;
    clonedDoc.head.appendChild(newStyleEl);
    
    // Apply styles to avatar images for PDF rendering
    const avatarImgs = clonedDoc.querySelectorAll('.avatar img, .pdf-avatar img');
    avatarImgs.forEach(img => {
      img.setAttribute('crossorigin', 'anonymous');
      (img as HTMLElement).style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      `;
    });
    
    // Apply background colors explicitly to gradient elements
    const gradientElements = clonedDoc.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-br, .from-indigo-400, .via-fuchsia-300, .to-blue-300, .profile-header, .pdf-header');
    gradientElements.forEach(el => {
      (el as HTMLElement).style.backgroundColor = '#9b87f5';
      (el as HTMLElement).style.color = '#000000';
    });
    
    // Fix all other images
    const allImages = clonedDoc.querySelectorAll('img');
    allImages.forEach(img => {
      img.setAttribute('crossorigin', 'anonymous');
      (img as HTMLElement).style.display = 'block';
      (img as HTMLElement).style.visibility = 'visible';
      (img as HTMLElement).style.opacity = '1';
    });
    
    // Fix text overflow in suggested skills section
    const skillsText = clonedDoc.querySelectorAll('.text-fuchsia-700, .pdf-skills-text');
    skillsText.forEach(el => {
      (el as HTMLElement).style.whiteSpace = 'normal';
      (el as HTMLElement).style.wordBreak = 'break-word';
      (el as HTMLElement).style.overflowWrap = 'break-word';
      (el as HTMLElement).style.maxWidth = '100%';
      (el as HTMLElement).style.overflow = 'visible';
    });
  }
};

/**
 * Generate a PDF from a DOM element with reliable rendering
 */
export async function generatePDFFromElement(
  element: HTMLElement, 
  filename: string, 
  singlePage: boolean = false
) {
  if (!element) return false;
  
  try {
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
    const canvas = await html2canvas(element, CANVAS_SETTINGS);
    
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

/**
 * Generate a text-based report for better compatibility
 */
export function handleDownloadTextReport(scoreData: ScoreData) {
  if (!scoreData) return;
  
  const reportContent = `
RESUME SCORING REPORT
---------------------
Date: ${scoreData.timestamp}

OVERALL SCORE: ${scoreData.overallScore}/100
Industry: ${scoreData.Industry}
Percentile: Top ${scoreData.percentile}%

SCORE BREAKDOWN:
- Keyword Relevance: ${scoreData.keywordRelevance}/100
- Skills Alignment: ${scoreData.skillsAlignment}/100
- Work Experience: ${scoreData.WorkExperience}/100
- Content Structure: ${scoreData.ContentStructure}/100

SUGGESTED SKILLS TO ADD:
${scoreData.suggestedSkills.join(", ")}

IMPROVEMENT TIPS:
1. Add the suggested skills to your resume if you have experience with them
2. Use more keywords from the job description
3. Structure your resume with clear sections and bullet points
4. Quantify your achievements where possible
5. Use a clean, ATS-friendly format
`;

  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-score-report-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
