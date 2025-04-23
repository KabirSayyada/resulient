
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
};

/**
 * Generate a PDF from a DOM element with reliable rendering
 */
export async function generatePDFFromElement(
  element: HTMLElement, 
  filename: string, 
  singlePage: boolean = false
) {
  if (!element) return;
  
  try {
    // Make element visible for capture if it was hidden
    const originalDisplay = element.style.display;
    if (originalDisplay === 'none') {
      element.style.display = 'block';
    }
    
    // Capture the element as an image
    const canvas = await html2canvas(element, { 
      ...CANVAS_SETTINGS, 
      windowHeight: element.scrollHeight
    });
    
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
