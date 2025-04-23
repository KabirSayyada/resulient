
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
  imageTimeout: 0, // Prevent image timeout
  onclone: (clonedDoc: Document) => {
    // Ensure all styles are applied to the cloned document
    const styles = Array.from(document.styleSheets);
    styles.forEach(styleSheet => {
      try {
        const rules = styleSheet.cssRules;
        if (rules) {
          const newStyleEl = clonedDoc.createElement('style');
          for (let i = 0; i < rules.length; i++) {
            newStyleEl.appendChild(clonedDoc.createTextNode(rules[i].cssText));
          }
          clonedDoc.head.appendChild(newStyleEl);
        }
      } catch (e) {
        console.log('Error applying styles to PDF clone', e);
      }
    });
    
    // Apply explicit background colors to elements with gradients
    const gradientElements = clonedDoc.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-br, .from-indigo-400, .via-fuchsia-300, .to-blue-300');
    gradientElements.forEach(el => {
      (el as HTMLElement).style.backgroundColor = '#9b87f5';
    });
    
    // Ensure scorecard header is visible with explicit background color
    const headerElements = clonedDoc.querySelectorAll('.scorecard-for-export .from-indigo-400, .CardHeader, header');
    headerElements.forEach(el => {
      (el as HTMLElement).style.backgroundColor = '#9b87f5';
      (el as HTMLElement).style.color = '#000000'; // Ensure text is visible
    });
    
    // Fix all images by applying inline crossOrigin
    const allImages = clonedDoc.querySelectorAll('img');
    allImages.forEach(img => {
      // Force crossOrigin for all images to allow them to render
      img.setAttribute('crossorigin', 'anonymous');
      // Make sure images are visible
      (img as HTMLElement).style.display = 'block';
      (img as HTMLElement).style.visibility = 'visible';
      (img as HTMLElement).style.opacity = '1';
    });
    
    // Fix avatar images specifically 
    const avatarImgs = clonedDoc.querySelectorAll('.rounded-full img, .avatar img');
    avatarImgs.forEach(img => {
      // Add explicit inline styles to ensure avatar visibility
      (img as HTMLElement).style.display = 'block';
      (img as HTMLElement).style.visibility = 'visible';
      (img as HTMLElement).style.width = '100%';
      (img as HTMLElement).style.height = '100%';
      img.setAttribute('crossorigin', 'anonymous');
    });
    
    // Fix text overflow in suggested skills section
    const skillsText = clonedDoc.querySelectorAll('.text-fuchsia-700.text-xs, .mb-1.px-2.w-full');
    skillsText.forEach(el => {
      (el as HTMLElement).style.whiteSpace = 'normal';
      (el as HTMLElement).style.wordBreak = 'break-word';
      (el as HTMLElement).style.maxWidth = '100%';
      (el as HTMLElement).style.overflowX = 'visible';
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
    if (originalDisplay === 'none') {
      element.style.display = 'block';
    }
    
    // Add temporary class for export to ensure proper styling
    element.classList.add('pdf-export-in-progress');
    
    // Temporarily expand offscreen elements to be visible during capture
    if (element.classList.contains('fixed')) {
      const originalPosition = element.style.position;
      const originalLeft = element.style.left;
      const originalZIndex = element.style.zIndex;
      
      element.style.position = 'absolute';
      element.style.left = '0';
      element.style.zIndex = '9999';
      
      // Add a small delay to allow images to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the element as an image
      const canvas = await html2canvas(element, CANVAS_SETTINGS);
      
      // Restore original positioning
      element.style.position = originalPosition;
      element.style.left = originalLeft;
      element.style.zIndex = originalZIndex;
      
      element.classList.remove('pdf-export-in-progress');
      
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
      
      // Reset display if it was changed
      if (originalDisplay === 'none') {
        element.style.display = originalDisplay;
      }
      
      pdf.save(filename);
      return true;
    } else {
      // Add a small delay to allow images to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the element as an image
      const canvas = await html2canvas(element, CANVAS_SETTINGS);
      element.classList.remove('pdf-export-in-progress');
      
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
      
      // Reset display if it was changed
      if (originalDisplay === 'none') {
        element.style.display = originalDisplay;
      }
      
      pdf.save(filename);
      return true;
    }
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
