
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Palette } from 'lucide-react';
import { ResumeTemplateModal } from '../ResumeTemplateModal';
import { parseOptimizedResumeContent } from '@/utils/resumePdfGenerator';
import { useSubscription } from '@/hooks/useSubscription';

interface OptimizedResumeContentProps {
  content: string;
}

export const OptimizedResumeContent = ({ content }: OptimizedResumeContentProps) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { subscription } = useSubscription();

  // Enhanced content formatting to ensure complete display
  const formatContentForDisplay = (text: string): string => {
    if (!text || typeof text !== 'string') {
      return '';
    }

    // Clean up any potential JSON artifacts or malformed content
    let cleanedContent = text;
    
    // Remove any surrounding quotes or braces that might have been added
    cleanedContent = cleanedContent.replace(/^["'\{]+|["'\}]+$/g, '');
    
    // Handle escaped characters properly
    cleanedContent = cleanedContent
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\');
    
    // Normalize line endings
    cleanedContent = cleanedContent
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
    
    // Remove excessive blank lines but preserve intentional spacing
    cleanedContent = cleanedContent.replace(/\n{4,}/g, '\n\n\n');
    
    // Ensure proper section separation
    cleanedContent = cleanedContent.replace(/([A-Z\s]{3,})\n([A-Z\s]{3,})/g, '$1\n\n$2');
    
    return cleanedContent.trim();
  };

  const formattedContent = formatContentForDisplay(content);

  // Add safety check for empty content
  if (!formattedContent) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-inner mt-6">
        <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">Optimized Resume</h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-700">
          <p className="text-yellow-800 dark:text-yellow-200">
            There was an issue displaying the optimized resume content. Please try optimizing again.
          </p>
        </div>
      </div>
    );
  }

  const handleTemplateDownload = () => {
    setIsTemplateModalOpen(true);
  };

  // Parse the resume content for template modal
  const parsedResume = parseOptimizedResumeContent(formattedContent);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-inner mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Optimized Resume</h2>
          
          <div className="flex gap-2">
            <Button
              onClick={handleTemplateDownload}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Palette className="h-4 w-4 mr-2" />
              Choose Template
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words">
            {formattedContent}
          </pre>
        </div>

        <div className="mt-4">
          <div className="flex flex-col sm:flex-row gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex-1">
              <p className="font-medium mb-1">📝 Text Format Preview:</p>
              <p>This is how your resume will appear when downloaded as a text file. The formatting is optimized for ATS systems and easy editing.</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md flex-1">
              <p className="font-medium mb-1">🎨 Professional Templates:</p>
              <p>Click "Choose Template" to download your resume in beautiful, professionally designed formats including PDF.</p>
            </div>
          </div>
        </div>
      </div>

      <ResumeTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        resume={parsedResume}
        userTier={subscription.tier}
      />
    </>
  );
};
