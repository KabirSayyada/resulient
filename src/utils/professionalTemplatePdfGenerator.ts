
import jsPDF from 'jspdf';

export const generateProfessionalTemplatePDF = async (
  resumeText: string,
  filename: string = 'professional-template-resume.pdf'
): Promise<boolean> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    // Professional color scheme - Deep navy and gold
    const primaryColor = [25, 42, 86]; // Deep navy
    const accentColor = [184, 134, 11]; // Gold
    const textColor = [45, 55, 72]; // Dark gray
    const lightGray = [247, 250, 252]; // Light background
    
    let yPosition = margin;

    // Header background with gradient effect
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    // Gold accent bar
    pdf.setFillColor(...accentColor);
    pdf.rect(0, 35, pageWidth, 3, 'F');
    
    // Parse resume sections
    const sections = resumeText.split('\n\n');
    let currentSection = '';
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      const lines = section.split('\n');
      
      // Check if this is likely a name (first section, single line, all caps or title case)
      if (i === 0 && lines.length === 1) {
        // Professional name styling
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        
        const nameWidth = pdf.getTextWidth(lines[0]);
        const nameX = (pageWidth - nameWidth) / 2;
        pdf.text(lines[0], nameX, 25);
        
        yPosition = 50;
        continue;
      }
      
      // Check if this is contact info (contains email, phone, or common contact patterns)
      if (section.includes('@') || section.includes('|') || /\d{3}[\-\.\s]?\d{3}[\-\.\s]?\d{4}/.test(section)) {
        // Professional contact info in grid format
        pdf.setFillColor(...lightGray);
        pdf.rect(margin, yPosition - 5, contentWidth, 20, 'F');
        
        pdf.setTextColor(...textColor);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        const contactInfo = section.split('|').map(info => info.trim());
        const itemWidth = contentWidth / Math.min(contactInfo.length, 3);
        
        contactInfo.forEach((info, index) => {
          if (index < 3) { // Max 3 items per row
            const x = margin + (index * itemWidth) + (itemWidth / 2);
            const textWidth = pdf.getTextWidth(info);
            pdf.text(info, x - (textWidth / 2), yPosition + 5);
          }
        });
        
        yPosition += 30;
        continue;
      }
      
      // Check if this is a section header (all caps, contains common section words)
      const sectionKeywords = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROFESSIONAL', 'TECHNICAL', 'ACHIEVEMENTS', 'PROJECTS', 'CERTIFICATIONS'];
      const isHeader = sectionKeywords.some(keyword => 
        lines[0].toUpperCase().includes(keyword) || 
        lines[0] === lines[0].toUpperCase()
      );
      
      if (isHeader && lines.length === 1) {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Professional section header with geometric design
        pdf.setFillColor(...accentColor);
        pdf.circle(margin + 5, yPosition + 2, 2, 'F');
        
        pdf.setFillColor(...primaryColor);
        pdf.rect(margin + 12, yPosition - 1, contentWidth - 17, 6, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(lines[0], margin + 15, yPosition + 3);
        
        yPosition += 20;
        currentSection = lines[0];
        continue;
      }
      
      // Regular content
      pdf.setTextColor(...textColor);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        
        if (line.startsWith('•') || line.startsWith('-')) {
          // Professional bullet points with diamond shapes
          pdf.setFillColor(...accentColor);
          pdf.rect(margin + 5, yPosition - 1, 2, 2, 'F');
          
          const bulletText = line.substring(1).trim();
          const wrappedText = pdf.splitTextToSize(bulletText, contentWidth - 20);
          
          for (let j = 0; j < wrappedText.length; j++) {
            pdf.text(wrappedText[j], margin + 12, yPosition);
            yPosition += 5;
          }
        } else {
          // Handle job titles, company names, dates differently
          if (line.includes(' - ') && currentSection.includes('EXPERIENCE')) {
            // Job title and company
            const parts = line.split(' - ');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(11);
            pdf.text(parts[0], margin, yPosition);
            
            if (parts[1]) {
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(10);
              const titleWidth = pdf.getTextWidth(parts[0] + ' - ');
              pdf.text(parts[1], margin + titleWidth, yPosition);
            }
            yPosition += 7;
          } else if (currentSection.includes('SKILLS')) {
            // Skills in 3-column format
            const skills = line.split(',').map(s => s.trim());
            const skillsPerRow = 3;
            const columnWidth = contentWidth / skillsPerRow;
            
            for (let k = 0; k < skills.length; k += skillsPerRow) {
              const rowSkills = skills.slice(k, k + skillsPerRow);
              rowSkills.forEach((skill, index) => {
                pdf.text(skill, margin + (index * columnWidth), yPosition);
              });
              yPosition += 6;
            }
          } else {
            // Regular text with word wrapping
            const wrappedText = pdf.splitTextToSize(line, contentWidth);
            for (const wrappedLine of wrappedText) {
              pdf.text(wrappedLine, margin, yPosition);
              yPosition += 5;
            }
          }
        }
      }
      
      yPosition += 8; // Space between sections
    }
    
    // Professional footer
    const footerY = pageHeight - 10;
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, footerY - 5, pageWidth, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const footerText = `Generated on ${new Date().toLocaleDateString()} | Professional Resume Template`;
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, (pageWidth - footerWidth) / 2, footerY);
    
    // Save the PDF
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error generating professional template PDF:', error);
    return false;
  }
};
