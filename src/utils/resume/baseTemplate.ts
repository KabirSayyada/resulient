
import { ParsedResume } from '@/types/resumeStructure';
import { TemplateConfig, ValidatedContent } from '@/types/resumeTemplate';
import { TemplateValidator } from './templateValidator';
import { EnhancedPDFGenerator } from '../enhancedPdfGenerator';

export abstract class BaseTemplate {
  protected config: TemplateConfig;
  protected validator: TemplateValidator;

  constructor(config: TemplateConfig) {
    this.config = config;
    this.validator = new TemplateValidator(config);
  }

  abstract renderHTML(resume: ParsedResume): string;

  async renderPDF(resume: ParsedResume, filename?: string): Promise<boolean> {
    try {
      const htmlContent = this.renderHTML(resume);
      const templateName = this.config.metadata.name.toLowerCase().replace(/\s+/g, '-');
      const pdfFilename = filename || `resume-${templateName}.pdf`;
      
      return await EnhancedPDFGenerator.generateFromHTML(htmlContent, {
        filename: pdfFilename,
        format: 'a4',
        orientation: 'portrait',
        quality: 1.0
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      return false;
    }
  }

  validateAndProcess(resume: ParsedResume): ValidatedContent {
    return this.validator.validateContent(resume);
  }

  protected formatDate(dateStr?: string): string {
    if (!dateStr) return 'Present';
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  }

  protected truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  protected ensureContent(content: string, fallback: string): string {
    return content && content.trim() ? content : fallback;
  }

  protected createPrintableHTML(htmlContent: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              * { -webkit-print-color-adjust: exact !important; }
            }
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.3;
              color: #000;
              background: white;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
  }
}
