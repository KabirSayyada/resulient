
import { TemplateConfig } from '@/types/resumeTemplate';

export const RESUME_TEMPLATES: TemplateConfig[] = [
  {
    metadata: {
      id: 'professional-classic',
      name: 'Professional Classic',
      category: 'professional',
      description: 'Clean, traditional layout perfect for corporate environments',
      atsScore: 95,
      bestFor: ['Finance', 'Consulting', 'Legal', 'Healthcare'],
      preview: '/template-previews/professional-classic.png'
    },
    sections: [
      { name: 'contact', required: true },
      { name: 'summary', required: false, maxLength: 600 },
      { name: 'experience', required: true },
      { name: 'education', required: true },
      { name: 'skills', required: true }
    ],
    maxPages: 2,
    fontSizes: {
      name: 18,
      header: 14,
      body: 11,
      small: 9
    }
  },
  {
    metadata: {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'modern',
      description: 'Sleek, contemporary design with clean lines and modern typography',
      atsScore: 90,
      bestFor: ['Tech', 'Design', 'Marketing', 'Startups'],
      preview: '/template-previews/modern-minimal.png'
    },
    sections: [
      { name: 'contact', required: true },
      { name: 'summary', required: false, maxLength: 500 },
      { name: 'experience', required: true },
      { name: 'skills', required: true },
      { name: 'education', required: true },
      { name: 'projects', required: false }
    ],
    maxPages: 2,
    fontSizes: {
      name: 20,
      header: 13,
      body: 10,
      small: 8
    }
  },
  {
    metadata: {
      id: 'executive-premium',
      name: 'Executive Premium',
      category: 'executive',
      description: 'Sophisticated layout for senior-level positions and C-suite roles',
      atsScore: 88,
      bestFor: ['Executive', 'Senior Management', 'Director Level', 'VP Roles'],
      preview: '/template-previews/executive-premium.png',
      isPremium: true
    },
    sections: [
      { name: 'contact', required: true },
      { name: 'summary', required: true, maxLength: 800 },
      { name: 'experience', required: true },
      { name: 'achievements', required: false },
      { name: 'education', required: true },
      { name: 'skills', required: true }
    ],
    maxPages: 3,
    fontSizes: {
      name: 16,
      header: 12,
      body: 10,
      small: 9
    }
  },
  {
    metadata: {
      id: 'technical-focused',
      name: 'Technical Focused',
      category: 'technical',
      description: 'Optimized for software engineers and technical professionals',
      atsScore: 92,
      bestFor: ['Software Engineering', 'DevOps', 'Data Science', 'Cybersecurity'],
      preview: '/template-previews/technical-focused.png'
    },
    sections: [
      { name: 'contact', required: true },
      { name: 'summary', required: false, maxLength: 400 },
      { name: 'skills', required: true },
      { name: 'experience', required: true },
      { name: 'projects', required: false },
      { name: 'certifications', required: false },
      { name: 'education', required: true }
    ],
    maxPages: 2,
    fontSizes: {
      name: 18,
      header: 13,
      body: 10,
      small: 8
    }
  },
  {
    metadata: {
      id: 'creative-standout',
      name: 'Creative Standout',
      category: 'creative',
      description: 'Eye-catching design for creative professionals while maintaining ATS compatibility',
      atsScore: 85,
      bestFor: ['Graphic Design', 'Marketing', 'Advertising', 'Media'],
      preview: '/template-previews/creative-standout.png',
      isPremium: true
    },
    sections: [
      { name: 'contact', required: true },
      { name: 'summary', required: false, maxLength: 500 },
      { name: 'experience', required: true },
      { name: 'skills', required: true },
      { name: 'projects', required: false },
      { name: 'education', required: true },
      { name: 'achievements', required: false }
    ],
    maxPages: 2,
    fontSizes: {
      name: 22,
      header: 14,
      body: 11,
      small: 9
    }
  }
];

export function getTemplateById(id: string): TemplateConfig | undefined {
  return RESUME_TEMPLATES.find(template => template.metadata.id === id);
}

export function getTemplatesByCategory(category: string): TemplateConfig[] {
  return RESUME_TEMPLATES.filter(template => template.metadata.category === category);
}

export function getFreeTemplates(): TemplateConfig[] {
  return RESUME_TEMPLATES.filter(template => !template.metadata.isPremium);
}

export function getPremiumTemplates(): TemplateConfig[] {
  return RESUME_TEMPLATES.filter(template => template.metadata.isPremium);
}
