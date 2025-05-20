
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ScoreData } from "@/types/resume";
import { identifyResumeSections, extractCandidateName } from "./resumeFormatters";

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
  singlePage: boolean = false,
  textMode: boolean = false
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
    
    // For text mode, create a PDF with selectable text and proper formatting
    if (textMode) {
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40; // margins
      
      // Set default font
      pdf.setFont('helvetica', 'normal');
      
      // Check if this is an ATS-Resume by looking for the class
      const isATSResume = element.classList.contains('ats-resume-template') || 
                          element.querySelector('.ats-resume-template') !== null;
      
      // Special handling for ATS resumes with better formatting
      if (isATSResume) {
        return generateATSResumePDF(element, filename, pdf, pageWidth, pageHeight, margin);
      }
      
      // Add title ONLY if it exists and isn't "ATS-Optimized Resume"
      let yPosition = margin;
      const titleElement = element.querySelector('h2, h1');
      if (titleElement && !titleElement.textContent?.includes("ATS-Optimized Resume")) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(titleElement.textContent || '', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 30; // More space after title
      }
      
      // We'll analyze the content from the DOM to detect sections and structure
      const contentElements = element.querySelectorAll('.pdf-content > *');
      const lineHeight = 18; // slightly increased line height for better readability
      let currentSection = '';
      
      // Process each content element
      for (let i = 0; i < contentElements.length; i++) {
        const el = contentElements[i];
        
        // Check if we need to add a new page
        if (yPosition + lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          
          // If in a section, repeat section name on new page
          if (currentSection) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text(currentSection, margin, yPosition);
            yPosition += lineHeight * 1.5;
          }
        }
        
        // Process element based on its type/class
        if (el.tagName.toLowerCase() === 'h2') {
          // This is a section header
          currentSection = el.textContent || '';
          yPosition += lineHeight * 0.5; // Extra space before section
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(currentSection, margin, yPosition);
          yPosition += lineHeight;
          
          // Add a stronger separator line under section headers
          pdf.setDrawColor(180, 180, 180);
          pdf.line(margin, yPosition - 6, pageWidth - margin, yPosition - 6);
          yPosition += lineHeight * 0.5; // Space after section header
        } 
        else if (el.classList.contains('font-semibold') || el.classList.contains('mt-3')) {
          // Likely a job title, company name, or similar
          yPosition += lineHeight * 0.3; // Extra space before job titles
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(el.textContent || '', margin, yPosition);
          yPosition += lineHeight;
        }
        else if (el.tagName.toLowerCase() === 'div' && el.getAttribute('style')?.includes('height')) {
          // This is a spacer div, add some space
          yPosition += lineHeight * 0.5;
        }
        else if (el.tagName.toLowerCase() === 'p') {
          // Regular paragraph or bullet point
          let text = el.textContent || '';
          
          if (text.trim().startsWith('•') || text.trim().startsWith('-')) {
            // Bullet point
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            
            // Handle long bullet points with text wrapping
            const bulletText = text.trim();
            const wrappedText = pdf.splitTextToSize(bulletText, pageWidth - margin * 2 - 15);
            
            // Add each line with proper indentation
            for (let j = 0; j < wrappedText.length; j++) {
              // Indent after the first line
              const indentation = j === 0 ? margin + 10 : margin + 20;
              
              // Check for page break
              if (yPosition + lineHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
              }
              
              pdf.text(wrappedText[j], indentation, yPosition);
              yPosition += lineHeight;
            }
          } else {
            // Regular paragraph
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            
            // Handle text wrapping for paragraphs
            const wrappedText = pdf.splitTextToSize(text.trim(), pageWidth - margin * 2);
            
            for (let j = 0; j < wrappedText.length; j++) {
              // Check for page break
              if (yPosition + lineHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
              }
              
              pdf.text(wrappedText[j], margin, yPosition);
              yPosition += lineHeight;
            }
            
            // Small extra space after paragraphs
            yPosition += lineHeight * 0.2;
          }
        }
      }
      
      // Restore original element properties
      element.classList.remove('pdf-export-in-progress');
      
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
    }
    
    // For image-based PDFs (non-text mode)
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
      // For ATS resumes - fit the entire content on one page with proper scaling
      const imgWidth = pageWidth - 40; // margins
      let scaleFactor = imgWidth / canvas.width;
      let imgHeight = canvas.height * scaleFactor;
      
      // If too tall for one page, scale it down to fit
      if (imgHeight > pageHeight - 40) {
        scaleFactor = (pageHeight - 40) / canvas.height;
        imgHeight = canvas.height * scaleFactor;
        const newImgWidth = canvas.width * scaleFactor;
        
        // Center horizontally
        const leftMargin = (pageWidth - newImgWidth) / 2;
        pdf.addImage(imgData, 'PNG', leftMargin, 20, newImgWidth, imgHeight);
      } else {
        // Center vertically if there's room
        const yPosition = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
      }
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
 * Generate an ATS-friendly resume PDF with carefully formatted content
 */
async function generateATSResumePDF(
  element: HTMLElement, 
  filename: string,
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin: number
): Promise<boolean> {
  try {
    // Get the raw content of the resume
    const contentElement = element.querySelector('.pdf-content');
    if (!contentElement) return false;
    
    const rawContent = contentElement.textContent || '';
    const sections = identifyResumeSections(rawContent);
    
    // Extract candidate name for header
    const candidateName = extractCandidateName(rawContent);
    const nameElement = element.querySelector('h1');
    const titleElement = element.querySelector('h2');
    
    // Contact information (identify from the DOM)
    const contactNodes = element.querySelectorAll('.contact-info span');
    const contactInfo: string[] = [];
    contactNodes.forEach(node => {
      const text = node.textContent?.replace('|', '').trim();
      if (text) contactInfo.push(text);
    });
    
    // Constants for layout
    const lineHeight = 16;
    let yPosition = margin;
    
    // Start with header
    if (candidateName || nameElement?.textContent) {
      const name = candidateName || nameElement?.textContent || '';
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(name, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += lineHeight * 1.5;
    }
    
    // Contact info
    if (contactInfo.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(contactInfo.join(' | '), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += lineHeight * 1.5;
    }
    
    // Job title if present
    if (titleElement?.textContent?.includes('For:')) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'italic');
      pdf.text(titleElement.textContent, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += lineHeight * 2;
    } else {
      yPosition += lineHeight;
    }
    
    // Process resume sections
    const sectionKeys = Object.keys(sections);
    
    for (const section of sectionKeys) {
      // Skip the header section since we've already processed it
      if (section === 'HEADER') continue;
      
      // Check if we need to add a new page
      if (yPosition + lineHeight * 3 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // Add section heading
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(section, margin, yPosition);
      yPosition += lineHeight;
      
      // Add section separator line
      pdf.setDrawColor(100, 100, 100);
      pdf.line(margin, yPosition - 6, pageWidth - margin, yPosition - 6);
      yPosition += lineHeight * 0.5;
      
      // Process section content
      const contentLines = sections[section].split('\n').filter(line => line.trim() !== '');
      
      let inJobRole = false;
      let inBulletList = false;
      
      for (const line of contentLines) {
        // Check if we need to add a new page
        if (yPosition + lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Format based on line content type
        if (line.match(/\d{4}\s*-\s*(\d{4}|present|current|now)/i)) {
          // Date range
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'italic');
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
          inJobRole = true;
          inBulletList = false;
        } 
        else if (inJobRole && !line.startsWith('-') && !line.startsWith('•') && line.length < 60) {
          // Job title or company - first line after date is usually job title
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
          inJobRole = false;
        }
        else if (line.startsWith('-') || line.startsWith('•')) {
          // Bullet point
          inBulletList = true;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          
          // Format bullet points with proper wrapping and indentation
          const bulletText = line;
          const wrappedText = pdf.splitTextToSize(bulletText, pageWidth - margin * 2 - 20);
          
          for (let i = 0; i < wrappedText.length; i++) {
            // Check for page break
            if (yPosition + lineHeight > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            
            // First line has the bullet, subsequent lines are indented
            const xPosition = i === 0 ? margin : margin + 15;
            pdf.text(wrappedText[i], xPosition, yPosition);
            yPosition += lineHeight;
          }
          
          // Small space after each bullet
          yPosition += lineHeight * 0.2;
        }
        else {
          // Regular paragraph
          if (inBulletList) {
            // Add some space after bullet list
            yPosition += lineHeight * 0.3;
            inBulletList = false;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          
          // Wrap text properly
          const wrappedText = pdf.splitTextToSize(line, pageWidth - margin * 2);
          
          for (let i = 0; i < wrappedText.length; i++) {
            // Check for page break
            if (yPosition + lineHeight > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            
            pdf.text(wrappedText[i], margin, yPosition);
            yPosition += lineHeight;
          }
        }
      }
      
      // Add space after each section
      yPosition += lineHeight;
    }
    
    // Save and return
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("ATS PDF generation error:", error);
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
