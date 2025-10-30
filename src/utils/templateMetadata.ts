import { TemplateMetadata } from "@/types/templateTypes";

export const templateMetadata: TemplateMetadata[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    category: 'classic',
    recommended: true,
    features: ['ATS-friendly', 'Clean layout', 'Professional'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional business style',
    category: 'classic',
    features: ['Conservative', 'ATS-optimized', 'Corporate'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Senior leadership resume',
    category: 'classic',
    features: ['Premium', 'Leadership-focused', 'Achievement-driven'],
  },
  {
    id: 'tech',
    name: 'Tech Professional',
    description: 'Perfect for developers and engineers',
    category: 'industry',
    industry: ['Technology', 'Software', 'Engineering'],
    recommended: true,
    features: ['Two-column', 'Skills sidebar', 'GitHub/Portfolio links'],
  },
  {
    id: 'two-column',
    name: 'Two-Column Modern',
    description: 'Sidebar layout with skills and contact',
    category: 'modern',
    recommended: true,
    features: ['Visual timeline', 'Skill bars', 'Modern accent'],
  },
  {
    id: 'elegant',
    name: 'Minimalist Elegant',
    description: 'Ultra-clean design with maximum impact',
    category: 'modern',
    features: ['Premium feel', 'Serif fonts', 'Whitespace focus'],
  },
];

export const getTemplateById = (id: string) => {
  return templateMetadata.find(t => t.id === id) || templateMetadata[0];
};
