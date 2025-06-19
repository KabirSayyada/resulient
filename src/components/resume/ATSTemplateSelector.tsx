
import React, { useState } from 'react';
import { ParsedResume } from '@/types/resumeStructure';
import { Button } from '@/components/ui/button';
import { CleanATSTemplate } from './templates/CleanATSTemplate';
import { ProfessionalATSTemplate } from './templates/ProfessionalATSTemplate';
import { ModernATSTemplate } from './templates/ModernATSTemplate';
import { MinimalATSTemplate } from './templates/MinimalATSTemplate';
import { CreativeATSTemplate } from './templates/CreativeATSTemplate';
import { CompactATSTemplate } from './templates/CompactATSTemplate';
import { TechATSTemplate } from './templates/TechATSTemplate';
import { BorderATSTemplate } from './templates/BorderATSTemplate';
import { ExecutiveATSTemplate } from './templates/ExecutiveATSTemplate';

interface ATSTemplateSelectorProps {
  resume: ParsedResume;
}

const templates = [
  { name: 'Clean', component: CleanATSTemplate },
  { name: 'Professional', component: ProfessionalATSTemplate },
  { name: 'Modern', component: ModernATSTemplate },
  { name: 'Minimal', component: MinimalATSTemplate },
  { name: 'Creative', component: CreativeATSTemplate },
  { name: 'Compact', component: CompactATSTemplate },
  { name: 'Tech', component: TechATSTemplate },
  { name: 'Border', component: BorderATSTemplate },
  { name: 'Executive', component: ExecutiveATSTemplate },
];

export const ATSTemplateSelector = ({ resume }: ATSTemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const SelectedTemplateComponent = templates[selectedTemplate].component;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {templates.map((template, index) => (
          <Button
            key={template.name}
            variant={selectedTemplate === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTemplate(index)}
            className="text-xs"
          >
            {template.name}
          </Button>
        ))}
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="max-h-[600px] overflow-y-auto">
          <SelectedTemplateComponent resume={resume} />
        </div>
      </div>
    </div>
  );
};
