
import jsPDF from 'jspdf';
import { parseATSResumeText } from './parseATSResumeText';

export const generateProfessionalTemplatePDF = async (
  resumeText: string,
  filename: string = 'professional-template-resume.pdf'
): Promise<boolean> => {
  try {
    const parsedResume = parseATSResumeText(resumeText);
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Professional color scheme - deep navy and gold
    const colors = {
      primary: [25, 42, 86], // Deep navy
      accent: [218, 165, 32], // Gold
      text: [44, 44, 44], // Dark gray
      lightGray: [128, 128, 128],
      background: [248, 250, 252] // Very light blue-gray
    };

    let yPosition = 15;
    const pageWidth = 210;
    const leftMargin = 15;
    const rightMargin = 15;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    // Add subtle background
    doc.setFillColor(...colors.background);
    doc.rect(0, 0, pageWidth, 297, 'F');

    // Header section with professional styling
    if (parsedResume.contact.name) {
      // Name with underline
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text(parsedResume.contact.name.toUpperCase(), leftMargin, yPosition);
      
      // Gold underline
      doc.setDrawColor(...colors.accent);
      doc.setLineWidth(2);
      doc.line(leftMargin, yPosition + 3, leftMargin + 120, yPosition + 3);
      
      yPosition += 15;
    }

    // Contact information in a professional grid layout
    const contactInfo = [];
    if (parsedResume.contact.email) contactInfo.push(`📧 ${parsedResume.contact.email}`);
    if (parsedResume.contact.phone) contactInfo.push(`📞 ${parsedResume.contact.phone}`);
    if (parsedResume.contact.address) contactInfo.push(`🏠 ${parsedResume.contact.address}`);
    if (parsedResume.contact.linkedin) contactInfo.push(`💼 ${parsedResume.contact.linkedin}`);

    if (contactInfo.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.text);
      
      // Create contact boxes
      const boxHeight = 6;
      const boxSpacing = 2;
      contactInfo.forEach((info, index) => {
        const xPos = leftMargin + (index % 2) * (contentWidth / 2);
        const yPos = yPosition + Math.floor(index / 2) * (boxHeight + boxSpacing);
        
        // Light background box
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...colors.accent);
        doc.setLineWidth(0.5);
        doc.roundedRect(xPos, yPos - 3, contentWidth / 2 - 5, boxHeight, 2, 2, 'FD');
        
        doc.text(info, xPos + 3, yPos);
      });
      
      yPosition += Math.ceil(contactInfo.length / 2) * (boxHeight + boxSpacing) + 8;
    }

    // Section header function with professional styling
    const addSectionHeader = (title: string) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 15;
      }
      
      // Header background
      doc.setFillColor(...colors.primary);
      doc.rect(leftMargin, yPosition - 4, contentWidth, 10, 'F');
      
      // Header text
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), leftMargin + 3, yPosition + 2);
      
      yPosition += 12;
    };

    // Professional Summary
    if (parsedResume.professionalSummary) {
      addSectionHeader('EXECUTIVE SUMMARY');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.text);
      
      const summaryLines = doc.splitTextToSize(parsedResume.professionalSummary, contentWidth - 10);
      summaryLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 15;
        }
        doc.text(line, leftMargin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 3;
    }

    // Work Experience with professional formatting
    if (parsedResume.workExperience.length > 0) {
      addSectionHeader('PROFESSIONAL EXPERIENCE');
      
      parsedResume.workExperience.forEach((job, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 15;
        }
        
        // Job title and company
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text(job.position, leftMargin + 5, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.accent);
        const companyText = `${job.company}${job.location ? ` | ${job.location}` : ''}`;
        doc.text(companyText, leftMargin + 5, yPosition + 5);
        
        // Date range
        if (job.startDate || job.endDate) {
          const dateText = `${job.startDate || 'Start'} - ${job.endDate || 'Present'}`;
          doc.setTextColor(...colors.lightGray);
          doc.text(dateText, pageWidth - rightMargin - doc.getTextWidth(dateText), yPosition + 5);
        }
        
        yPosition += 12;
        
        // Responsibilities with professional bullets
        if (job.responsibilities && job.responsibilities.length > 0) {
          doc.setFontSize(10);
          doc.setTextColor(...colors.text);
          
          job.responsibilities.forEach((resp) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 15;
            }
            
            // Professional diamond bullet
            doc.setFillColor(...colors.accent);
            doc.circle(leftMargin + 8, yPosition - 1, 1, 'F');
            
            const respLines = doc.splitTextToSize(resp, contentWidth - 20);
            respLines.forEach((line: string, lineIndex: number) => {
              doc.text(line, leftMargin + 12, yPosition);
              yPosition += 4;
            });
          });
        }
        
        yPosition += 3;
      });
    }

    // Education with academic styling
    if (parsedResume.education.length > 0) {
      addSectionHeader('EDUCATION');
      
      parsedResume.education.forEach((edu) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 15;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text(edu.degree, leftMargin + 5, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.accent);
        doc.text(edu.institution, leftMargin + 5, yPosition + 5);
        
        if (edu.graduationDate) {
          doc.setTextColor(...colors.lightGray);
          doc.text(edu.graduationDate, pageWidth - rightMargin - doc.getTextWidth(edu.graduationDate), yPosition + 5);
        }
        
        yPosition += 12;
      });
    }

    // Skills in professional columns
    if (parsedResume.skills.length > 0) {
      addSectionHeader('CORE COMPETENCIES');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.text);
      
      const skillsPerColumn = Math.ceil(parsedResume.skills.length / 3);
      parsedResume.skills.forEach((skill, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 15;
        }
        
        const columnIndex = Math.floor(index / skillsPerColumn);
        const xPos = leftMargin + 5 + columnIndex * (contentWidth / 3);
        const yPos = yPosition + (index % skillsPerColumn) * 5;
        
        // Skill with accent dot
        doc.setFillColor(...colors.accent);
        doc.circle(xPos, yPos - 1, 0.8, 'F');
        doc.text(skill, xPos + 4, yPos);
      });
      
      yPosition += skillsPerColumn * 5 + 5;
    }

    // Projects and Certifications with consistent styling
    if (parsedResume.projects.length > 0) {
      addSectionHeader('KEY PROJECTS');
      
      parsedResume.projects.forEach((project) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 15;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text(project.name, leftMargin + 5, yPosition);
        
        if (project.date) {
          doc.setTextColor(...colors.lightGray);
          doc.text(project.date, pageWidth - rightMargin - doc.getTextWidth(project.date), yPosition);
        }
        
        yPosition += 5;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.text);
        const descLines = doc.splitTextToSize(project.description, contentWidth - 10);
        descLines.forEach((line: string) => {
          doc.text(line, leftMargin + 5, yPosition);
          yPosition += 4;
        });
        
        yPosition += 3;
      });
    }

    if (parsedResume.certifications.length > 0) {
      addSectionHeader('CERTIFICATIONS');
      
      parsedResume.certifications.forEach((cert) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 15;
        }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text(cert.name, leftMargin + 5, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.accent);
        doc.text(cert.issuer, leftMargin + 5, yPosition + 4);
        
        if (cert.date) {
          doc.setTextColor(...colors.lightGray);
          doc.text(cert.date, pageWidth - rightMargin - doc.getTextWidth(cert.date), yPosition + 4);
        }
        
        yPosition += 10;
      });
    }

    // Professional footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(...colors.lightGray);
      doc.text(`${parsedResume.contact.name || 'Professional Resume'} - Page ${i} of ${pageCount}`, 
               leftMargin, 287);
      
      // Footer line
      doc.setDrawColor(...colors.accent);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, 285, pageWidth - rightMargin, 285);
    }

    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating Professional template PDF:', error);
    return false;
  }
};
