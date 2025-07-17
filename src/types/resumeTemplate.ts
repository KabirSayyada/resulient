
export interface TemplateMetadata {
  id: string;
  name: string;
  category: 'professional' | 'modern' | 'executive' | 'technical' | 'creative';
  description: string;
  atsScore: number;
  bestFor: string[];
  preview: string;
  isPremium?: boolean;
}

export interface TemplateSection {
  name: string;
  maxLength?: number;
  required: boolean;
  fallbackText?: string;
}

export interface TemplateConfig {
  metadata: TemplateMetadata;
  sections: TemplateSection[];
  maxPages: number;
  fontSizes: {
    name: number;
    header: number;
    body: number;
    small: number;
  };
}

export interface ValidatedContent {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  processedContent: any;
}
