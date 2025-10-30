import type { ParsedResume } from "./resumeStructure";

export type ColorScheme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
};

export type TemplateCustomization = {
  fontSize: number;
  spacing: 'compact' | 'normal' | 'relaxed';
  showSections: string[];
  sectionOrder: string[];
};

export type { ParsedResume };

export interface TemplateProps {
  resume: ParsedResume;
  colorScheme: ColorScheme;
  customization?: TemplateCustomization;
}

export type TemplateId = 
  | 'modern' 
  | 'professional' 
  | 'creative' 
  | 'executive' 
  | 'minimalist'
  | 'tech'
  | 'healthcare'
  | 'finance'
  | 'academic'
  | 'two-column'
  | 'timeline'
  | 'compact'
  | 'elegant'
  | 'bold';

export type TemplateMetadata = {
  id: TemplateId;
  name: string;
  description: string;
  category: 'classic' | 'industry' | 'modern';
  industry?: string[];
  recommended?: boolean;
  features: string[];
};
