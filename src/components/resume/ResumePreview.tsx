
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';
import { ResumeTemplateSelector } from './ResumeTemplateSelector';

interface ResumePreviewProps {
  resume: ParsedResume;
  className?: string;
}

export const ResumePreview = ({ resume, className = '' }: ResumePreviewProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <ResumeTemplateSelector resume={resume} />
    </div>
  );
};
