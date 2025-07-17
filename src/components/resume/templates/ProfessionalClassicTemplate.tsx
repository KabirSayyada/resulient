
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';
import { BaseTemplate } from '@/utils/resume/baseTemplate';
import { RESUME_TEMPLATES } from '@/data/resumeTemplates';

const config = RESUME_TEMPLATES.find(t => t.metadata.id === 'professional-classic')!;

export class ProfessionalClassicTemplate extends BaseTemplate {
  constructor() {
    super(config);
  }

  renderHTML(resume: ParsedResume): string {
    const validated = this.validateAndProcess(resume);
    const data = validated.processedContent;

    return `
      <div class="resume-template professional-classic" style="max-width: 8.5in; margin: 0 auto; padding: 0.75in; font-family: 'Times New Roman', serif; line-height: 1.3; color: #000; background: white;">
        <!-- Header -->
        <div class="header" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px;">
          <h1 style="font-size: ${this.config.fontSizes.name}px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">${this.ensureContent(data.contact.name, 'Your Name')}</h1>
          <div class="contact-info" style="font-size: ${this.config.fontSizes.small}px; color: #333;">
            ${data.contact.email ? `${data.contact.email}` : ''}
            ${data.contact.phone ? ` | ${data.contact.phone}` : ''}
            ${data.contact.address ? ` | ${data.contact.address}` : ''}
            ${data.contact.linkedin ? ` | ${data.contact.linkedin}` : ''}
          </div>
        </div>

        ${data.professionalSummary ? `
        <!-- Professional Summary -->
        <div class="section" style="margin-bottom: 20px;">
          <h2 style="font-size: ${this.config.fontSizes.header}px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 8px;">Professional Summary</h2>
          <p style="font-size: ${this.config.fontSizes.body}px; margin: 0; text-align: justify;">${data.professionalSummary}</p>
        </div>
        ` : ''}

        <!-- Professional Experience -->
        <div class="section" style="margin-bottom: 20px;">
          <h2 style="font-size: ${this.config.fontSizes.header}px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 12px;">Professional Experience</h2>
          ${data.workExperience.map(exp => `
            <div class="experience-item" style="margin-bottom: 14px; page-break-inside: avoid;">
              <div class="exp-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                <h3 style="font-size: ${this.config.fontSizes.body + 1}px; font-weight: bold; margin: 0;">${this.ensureContent(exp.position, 'Position Title')}</h3>
                <span style="font-size: ${this.config.fontSizes.small}px; color: #666;">${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}</span>
              </div>
              <div class="company-location" style="font-size: ${this.config.fontSizes.body}px; font-style: italic; margin-bottom: 6px; color: #444;">
                ${this.ensureContent(exp.company, 'Company Name')}${exp.location ? ` | ${exp.location}` : ''}
              </div>
              <ul style="margin: 0; padding-left: 20px; font-size: ${this.config.fontSizes.body}px;">
                ${exp.responsibilities.map(resp => `<li style="margin-bottom: 3px;">${resp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <!-- Education -->
        <div class="section" style="margin-bottom: 20px;">
          <h2 style="font-size: ${this.config.fontSizes.header}px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 12px;">Education</h2>
          ${data.education.map(edu => `
            <div class="education-item" style="margin-bottom: 8px; page-break-inside: avoid;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div>
                  <h3 style="font-size: ${this.config.fontSizes.body + 1}px; font-weight: bold; margin: 0;">${this.ensureContent(edu.degree, 'Degree')}${edu.field ? ` in ${edu.field}` : ''}</h3>
                  <div style="font-size: ${this.config.fontSizes.body}px; color: #444;">${this.ensureContent(edu.institution, 'Institution Name')}</div>
                </div>
                <span style="font-size: ${this.config.fontSizes.small}px; color: #666;">${this.formatDate(edu.graduationDate)}</span>
              </div>
              ${edu.gpa ? `<div style="font-size: ${this.config.fontSizes.small}px; color: #666;">GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Skills -->
        <div class="section" style="margin-bottom: 20px;">
          <h2 style="font-size: ${this.config.fontSizes.header}px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 8px;">Technical Skills</h2>
          <div style="font-size: ${this.config.fontSizes.body}px;">${data.skills.join(' • ')}</div>
        </div>

        ${data.achievements && data.achievements.length > 0 ? `
        <!-- Achievements -->
        <div class="section" style="margin-bottom: 20px;">
          <h2 style="font-size: ${this.config.fontSizes.header}px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 8px;">Key Achievements</h2>
          <ul style="margin: 0; padding-left: 20px; font-size: ${this.config.fontSizes.body}px;">
            ${data.achievements.map(achievement => `<li style="margin-bottom: 3px; page-break-inside: avoid;">${achievement}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        ${data.certifications && data.certifications.length > 0 ? `
        <!-- Certifications -->
        <div class="section">
          <h2 style="font-size: ${this.config.fontSizes.header}px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 8px;">Certifications</h2>
          ${data.certifications.map(cert => `
            <div style="font-size: ${this.config.fontSizes.body}px; margin-bottom: 4px; page-break-inside: avoid;">
              <strong>${cert.name}</strong>${cert.issuer !== 'Unknown' ? ` - ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    `;
  }

  async renderPDF(resume: ParsedResume, filename?: string): Promise<boolean> {
    try {
      const htmlContent = this.renderHTML(resume);
      const templateName = this.config.metadata.name.toLowerCase().replace(/\s+/g, '-');
      const pdfFilename = filename || `resume-${templateName}.pdf`;
      
      return await super.renderPDF(resume, pdfFilename);
    } catch (error) {
      console.error('Professional Classic PDF generation failed:', error);
      return false;
    }
  }
}

export const ProfessionalClassicTemplateComponent: React.FC<{ resume: ParsedResume }> = ({ resume }) => {
  const template = new ProfessionalClassicTemplate();
  const htmlContent = template.renderHTML(resume);
  
  return (
    <div 
      className="template-preview bg-white shadow-lg"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
