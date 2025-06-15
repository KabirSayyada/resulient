
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ParsedResume } from '@/types/resumeStructure';
import { ATSFriendlyResumePdfTemplate } from './ATSFriendlyResumePdfTemplate';
import { ModernATSTemplate } from './templates/ModernATSTemplate';
import { MinimalATSTemplate } from './templates/MinimalATSTemplate';
import { ExecutiveATSTemplate } from './templates/ExecutiveATSTemplate';
import { CreativeATSTemplate } from './templates/CreativeATSTemplate';
import { TechATSTemplate } from './templates/TechATSTemplate';
import { ProfessionalATSTemplate } from './templates/ProfessionalATSTemplate';
import { CompactATSTemplate } from './templates/CompactATSTemplate';
import { CleanATSTemplate } from './templates/CleanATSTemplate';
import { BorderATSTemplate } from './templates/BorderATSTemplate';
import { FileDown, Eye } from 'lucide-react';
import { generateTemplatePDF } from '@/utils/templatePdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface ResumeTemplateSelectorProps {
  resume: ParsedResume;
  className?: string;
}

type TemplateType = 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'tech' | 'professional' | 'compact' | 'clean' | 'border';

const templates = {
  classic: {
    name: 'Classic ATS',
    description: 'Traditional format with clean sections and clear hierarchy',
    component: ATSFriendlyResumePdfTemplate
  },
  modern: {
    name: 'Modern Professional',
    description: 'Contemporary design with color accents and modern layout',
    component: ModernATSTemplate
  },
  minimal: {
    name: 'Minimal Elegant',
    description: 'Clean, sophisticated design with serif typography',
    component: MinimalATSTemplate
  },
  executive: {
    name: 'Executive',
    description: 'Bold, leadership-focused layout for senior positions',
    component: ExecutiveATSTemplate
  },
  creative: {
    name: 'Creative Professional',
    description: 'Stylish design with gradient accents and modern touches',
    component: CreativeATSTemplate
  },
  tech: {
    name: 'Tech Developer',
    description: 'Code-inspired layout perfect for developers and tech roles',
    component: TechATSTemplate
  },
  professional: {
    name: 'Professional Serif',
    description: 'Classic serif design with centered layout for formal roles',
    component: ProfessionalATSTemplate
  },
  compact: {
    name: 'Compact Layout',
    description: 'Space-efficient design that fits more content on one page',
    component: CompactATSTemplate
  },
  clean: {
    name: 'Clean Simple',
    description: 'Ultra-clean design with minimal styling and maximum readability',
    component: CleanATSTemplate
  },
  border: {
    name: 'Bordered Professional',
    description: 'Distinctive bordered sections with bold visual hierarchy',
    component: BorderATSTemplate
  }
};

export const ResumeTemplateSelector = ({ resume, className = '' }: ResumeTemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownloadPDF = async (templateType: TemplateType) => {
    setIsDownloading(templateType);
    
    toast({
      title: "Generating PDF",
      description: `Creating your resume with the ${templates[templateType].name} template...`,
    });

    try {
      const filename = `resume-${templateType}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      const success = await generateTemplatePDF(resume, templateType, filename);

      if (success) {
        toast({
          title: "Resume Downloaded",
          description: `Your ${templates[templateType].name.toLowerCase()} resume has been downloaded successfully!`,
        });
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your resume PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  const SelectedTemplateComponent = templates[selectedTemplate].component;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Choose Your Resume Template
        </h3>
        <Button
          variant="outline"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {isPreviewMode ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(templates).map(([key, template]) => (
          <Card 
            key={key}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === key ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
            }`}
            onClick={() => setSelectedTemplate(key as TemplateType)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDF(key as TemplateType);
                  }}
                  disabled={isDownloading === key}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  {isDownloading === key ? 'Generating...' : 'Download'}
                </Button>
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
              {selectedTemplate === key && (
                <div className="mt-2 text-xs text-indigo-600 font-medium">
                  ✓ Selected Template
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Preview */}
      {isPreviewMode && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Preview: {templates[selectedTemplate].name}
            </h4>
          </div>
          <div className="bg-white p-4 max-h-96 overflow-y-auto">
            <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
              <SelectedTemplateComponent resume={resume} />
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="font-medium mb-2">All Templates Include:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>ATS-optimized formatting for better parsing</li>
          <li>Professional typography and spacing</li>
          <li>Selectable text content for easy copying</li>
          <li>Consistent section organization</li>
          <li>Mobile and print-friendly layouts</li>
          <li>Industry-standard formatting</li>
        </ul>
      </div>
    </div>
  );
};
