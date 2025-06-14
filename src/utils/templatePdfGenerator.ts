
import jsPDF from 'jspdf';
import { ParsedResume } from '@/types/resumeStructure';

export async function generateTemplatePDF(
  resume: ParsedResume,
  templateType: string,
  filename: string
): Promise<boolean> {
  try {
    console.log('=== GENERATING TEMPLATE PDF ===');
    console.log('Template type:', templateType);
    console.log('Resume data:', resume);
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // Helper functions
    const checkPageBreak = (neededHeight: number) => {
      if (currentY + neededHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
    };

    const addText = (
      text: string,
      fontSize: number = 10,
      fontStyle: 'normal' | 'bold' = 'normal',
      color: string = '#000000',
      indent: number = 0,
      maxWidth?: number
    ) => {
      if (!text || !text.trim()) return;

      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.setTextColor(color);

      const effectiveWidth = maxWidth || (contentWidth - indent);
      const lines = pdf.splitTextToSize(text.trim(), effectiveWidth);
      const lineHeight = fontSize * 1.4;

      checkPageBreak(lines.length * lineHeight);

      lines.forEach((line: string) => {
        pdf.text(line, margin + indent, currentY);
        currentY += lineHeight;
      });
    };

    const addSection = (title: string) => {
      currentY += 12;
      checkPageBreak(25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#1f2937');
      pdf.text(title.toUpperCase(), margin, currentY);
      currentY += 18;
      
      // Add underline
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY - 4, pageWidth - margin, currentY - 4);
      currentY += 8;
    };

    // Header - Contact Information
    console.log('Adding contact information...');
    if (resume.contact.name) {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#1f2937');
      pdf.text(resume.contact.name, pageWidth / 2, currentY, { align: 'center' });
      currentY += 24;
    }

    // Contact details - always on one line with separators
    const contactDetails = [];
    if (resume.contact.email) contactDetails.push(resume.contact.email);
    if (resume.contact.phone) contactDetails.push(resume.contact.phone);
    if (resume.contact.linkedin) contactDetails.push(resume.contact.linkedin);
    if (resume.contact.website) contactDetails.push(resume.contact.website);
    if (resume.contact.address) contactDetails.push(resume.contact.address);

    if (contactDetails.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor('#4b5563');
      const contactLine = contactDetails.join(' | ');
      pdf.text(contactLine, pageWidth / 2, currentY, { align: 'center' });
      currentY += 20;
    }

    // Professional Summary
    if (resume.professionalSummary && resume.professionalSummary.trim()) {
      console.log('Adding professional summary...');
      addSection('Professional Summary');
      addText(resume.professionalSummary, 10, 'normal', '#374151');
      currentY += 8;
    }

    // Work Experience
    if (resume.workExperience && resume.workExperience.length > 0) {
      console.log('Adding work experience...', resume.workExperience.length, 'items');
      addSection('Professional Experience');

      resume.workExperience.forEach((exp, index) => {
        checkPageBreak(60);
        
        const titleLine = `${exp.position || 'Position'} - ${exp.company || 'Company'}`;
        addText(titleLine, 11, 'bold', '#1f2937');

        if (exp.startDate || exp.endDate || exp.location) {
          const dateLocation = [];
          if (exp.startDate) dateLocation.push(exp.startDate);
          if (exp.endDate) dateLocation.push(`- ${exp.endDate}`);
          if (exp.location) dateLocation.push(`| ${exp.location}`);
          
          addText(dateLocation.join(' '), 9, 'normal', '#6b7280');
        }

        currentY += 4;

        if (exp.responsibilities && exp.responsibilities.length > 0) {
          exp.responsibilities.forEach((resp: string) => {
            addText(`• ${resp}`, 10, 'normal', '#374151', 15);
          });
        }

        if (index < resume.workExperience.length - 1) {
          currentY += 8;
        }
      });
      currentY += 8;
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      console.log('Adding skills...', resume.skills.length, 'items');
      addSection('Technical Skills');
      const skillsText = resume.skills.join(' • ');
      addText(skillsText, 10, 'normal', '#374151');
      currentY += 8;
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      console.log('Adding education...', resume.education.length, 'items');
      addSection('Education');

      resume.education.forEach((edu) => {
        const degreeLine = edu.degree && edu.field ? 
          `${edu.degree} in ${edu.field}` : 
          edu.degree || 'Degree';
        
        addText(degreeLine, 11, 'bold', '#1f2937');
        
        const details = [];
        if (edu.institution) details.push(edu.institution);
        if (edu.graduationDate) details.push(edu.graduationDate);
        if (edu.gpa) details.push(`GPA: ${edu.gpa}`);
        
        if (details.length > 0) {
          addText(details.join(' | '), 10, 'normal', '#6b7280');
        }
        
        currentY += 6;
      });
      currentY += 8;
    }

    // Projects
    if (resume.projects && resume.projects.length > 0) {
      console.log('Adding projects...', resume.projects.length, 'items');
      addSection('Projects');

      resume.projects.forEach((project) => {
        addText(project.name || 'Project', 11, 'bold', '#1f2937');
        
        if (project.description) {
          addText(project.description, 10, 'normal', '#374151');
        }
        
        if (project.technologies && project.technologies.length > 0) {
          addText(`Technologies: ${project.technologies.join(', ')}`, 9, 'normal', '#6b7280');
        }
        
        currentY += 6;
      });
      currentY += 8;
    }

    // Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      console.log('Adding certifications...', resume.certifications.length, 'items');
      addSection('Certifications');

      resume.certifications.forEach((cert) => {
        const certLine = [];
        if (cert.name) certLine.push(cert.name);
        if (cert.issuer && cert.issuer !== 'Unknown') certLine.push(`- ${cert.issuer}`);
        if (cert.date) certLine.push(`(${cert.date})`);
        
        addText(certLine.join(' '), 10, 'normal', '#374151');
        currentY += 4;
      });
      currentY += 8;
    }

    // Achievements
    if (resume.achievements && resume.achievements.length > 0) {
      console.log('Adding achievements...', resume.achievements.length, 'items');
      addSection('Achievements');

      resume.achievements.forEach((achievement) => {
        addText(`• ${achievement}`, 10, 'normal', '#374151', 15);
      });
      currentY += 8;
    }

    // Languages
    if (resume.languages && resume.languages.length > 0) {
      console.log('Adding languages...', resume.languages.length, 'items');
      addSection('Languages');
      const languagesText = resume.languages.join(' • ');
      addText(languagesText, 10, 'normal', '#374151');
      currentY += 8;
    }

    // Additional Sections
    if (resume.additionalSections && Object.keys(resume.additionalSections).length > 0) {
      console.log('Adding additional sections...', Object.keys(resume.additionalSections));
      
      Object.entries(resume.additionalSections).forEach(([sectionName, content]) => {
        if (Array.isArray(content) && content.length > 0) {
          // Convert section name to title case
          const titleCaseName = sectionName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          
          addSection(titleCaseName);
          
          content.forEach((item) => {
            addText(`• ${item}`, 10, 'normal', '#374151', 15);
          });
          currentY += 8;
        }
      });
    }

    console.log('Saving PDF...', filename);
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error generating template PDF:', error);
    return false;
  }
}
