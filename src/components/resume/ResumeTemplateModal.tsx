
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TemplateSelector } from './TemplateSelector';
import { ParsedResume } from '@/types/resumeStructure';
import { getTemplateById } from '@/data/resumeTemplates';
import { ProfessionalClassicTemplate } from './templates/ProfessionalClassicTemplate';
import { generateResumePDFFromContent } from '@/utils/resumePdfGenerator';

interface ResumeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ParsedResume;
  userTier: 'free' | 'premium' | 'platinum';
}

export const ResumeTemplateModal: React.FC<ResumeTemplateModalProps> = ({
  isOpen,
  onClose,
  resume,
  userTier
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('professional-classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setErrors([]);
    setWarnings([]);
  };

  const handleDownloadPDF = async () => {
    if (!selectedTemplateId) return;

    setIsGenerating(true);
    try {
      const template = getTemplateById(selectedTemplateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // For now, only Professional Classic is implemented
      if (selectedTemplateId === 'professional-classic') {
        const templateInstance = new ProfessionalClassicTemplate();
        const validation = templateInstance.validateAndProcess(resume);
        
        setErrors(validation.errors);
        setWarnings(validation.warnings);

        if (validation.isValid) {
          const htmlContent = templateInstance.renderHTML(resume);
          const success = generateResumePDFFromContent(htmlContent, `resume-${template.metadata.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
          
          if (!success) {
            throw new Error('Failed to generate PDF');
          }
        } else {
          console.error('Validation errors:', validation.errors);
        }
      } else {
        throw new Error('Template not yet implemented');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrors(['Failed to generate PDF. Please try again.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadText = () => {
    if (!selectedTemplateId) return;

    try {
      const template = getTemplateById(selectedTemplateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // For now, only Professional Classic is implemented
      if (selectedTemplateId === 'professional-classic') {
        const templateInstance = new ProfessionalClassicTemplate();
        const validation = templateInstance.validateAndProcess(resume);
        
        setErrors(validation.errors);
        setWarnings(validation.warnings);

        if (validation.isValid) {
          const htmlContent = templateInstance.renderHTML(resume);
          // Convert HTML to plain text for .txt download
          const textContent = htmlContent
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          const blob = new Blob([textContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `resume-${template.metadata.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      } else {
        throw new Error('Template not yet implemented');
      }
    } catch (error) {
      console.error('Error generating text file:', error);
      setErrors(['Failed to generate text file. Please try again.']);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Download Your Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error and Warning Messages */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Please fix these issues:</div>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {warnings.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Heads up:</div>
                <ul className="list-disc list-inside space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Template Selector */}
          <TemplateSelector
            resume={resume}
            onTemplateSelect={handleTemplateSelect}
            selectedTemplateId={selectedTemplateId}
            userTier={userTier}
          />

          {/* Download Actions */}
          {selectedTemplateId && (
            <div className="sticky bottom-0 bg-background border-t pt-4 -mb-6 -mx-6 px-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    Selected: {getTemplateById(selectedTemplateId)?.metadata.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      ATS Score: {getTemplateById(selectedTemplateId)?.metadata.atsScore}%
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getTemplateById(selectedTemplateId)?.metadata.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadText}
                    disabled={isGenerating || errors.length > 0}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download TXT
                  </Button>
                  
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating || errors.length > 0}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Download PDF'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
