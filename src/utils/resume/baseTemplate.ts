
import { ParsedResume } from '@/types/resumeStructure';
import { TemplateConfig, ValidatedContent } from '@/types/resumeTemplate';
import { TemplateValidator } from './templateValidator';

export abstract class BaseTemplate {
  protected config: TemplateConfig;
  protected validator: TemplateValidator;

  constructor(config: TemplateConfig) {
    this.config = config;
    this.validator = new TemplateValidator(config);
  }

  abstract renderHTML(resume: ParsedResume): string;
  abstract renderPDF(resume: ParsedResume): Promise<Blob>;

  validateAndProcess(resume: ParsedResume): ValidatedContent {
    return this.validator.validateContent(resume);
  }

  protected formatDate(dateStr?: string): string {
    if (!dateStr) return 'Present';
    
    // Try to parse and format the date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr; // Return as-is if can't parse
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
}
