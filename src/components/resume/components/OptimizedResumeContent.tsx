
import { Button } from "@/components/ui/button";
import { FileDown, Eye } from "lucide-react";
import { useState } from "react";

interface OptimizedResumeContentProps {
  content: string;
}

export const OptimizedResumeContent = ({ content }: OptimizedResumeContentProps) => {
  const [showFormatted, setShowFormatted] = useState(true);

  // Parse and format the resume content into clean sections
  const formatResumeForDisplay = (resumeText: string): string => {
    if (!resumeText) return "No resume content available.";

    // Split into lines and clean up
    const lines = resumeText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    let formattedContent = '';
    let currentSection = '';
    
    for (const line of lines) {
      const upperLine = line.toUpperCase();
      
      // Check if this is a section header
      if (isSectionHeader(upperLine)) {
        if (formattedContent) formattedContent += '\n\n';
        formattedContent += `${line.toUpperCase()}\n`;
        formattedContent += '─'.repeat(Math.min(line.length, 50)) + '\n';
        currentSection = upperLine;
      } else {
        // Format content based on section type
        if (currentSection.includes('EXPERIENCE') || currentSection.includes('WORK')) {
          // Format experience entries
          if (line.includes(' - ') || line.includes(' at ')) {
            formattedContent += `\n${line}\n`;
          } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            formattedContent += `  ${line}\n`;
          } else if (line.match(/\d{4}/)) {
            formattedContent += `${line}\n`;
          } else {
            formattedContent += `  • ${line}\n`;
          }
        } else if (currentSection.includes('SKILLS')) {
          // Format skills nicely
          if (line.includes(',')) {
            const skills = line.split(',').map(s => s.trim()).filter(s => s);
            formattedContent += skills.map(skill => `• ${skill}`).join('\n') + '\n';
          } else {
            formattedContent += `• ${line}\n`;
          }
        } else if (currentSection.includes('EDUCATION')) {
          // Format education entries
          if (line.includes(' - ') || line.match(/\d{4}/)) {
            formattedContent += `\n${line}\n`;
          } else {
            formattedContent += `${line}\n`;
          }
        } else {
          // Default formatting for other sections
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            formattedContent += `${line}\n`;
          } else {
            formattedContent += `${line}\n`;
          }
        }
      }
    }

    return formattedContent.trim();
  };

  const isSectionHeader = (line: string): boolean => {
    const sectionKeywords = [
      'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE', 'PROFILE',
      'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE', 'EMPLOYMENT',
      'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'COMPETENCIES',
      'EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS',
      'PROJECTS', 'KEY PROJECTS', 'NOTABLE PROJECTS',
      'CERTIFICATIONS', 'CERTIFICATES', 'CREDENTIALS',
      'ACHIEVEMENTS', 'ACCOMPLISHMENTS', 'AWARDS',
      'LANGUAGES', 'LANGUAGE SKILLS'
    ];

    return sectionKeywords.some(keyword => line.includes(keyword)) && line.length < 60;
  };

  const formattedContent = formatResumeForDisplay(content);

  const downloadFormattedResume = () => {
    const blob = new Blob([formattedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-resume-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-inner mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
          Optimized Resume
        </h2>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFormatted(!showFormatted)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showFormatted ? 'Show Raw' : 'Show Formatted'}
          </Button>
          
          <Button
            onClick={downloadFormattedResume}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download TXT
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto text-gray-800 dark:text-gray-200 min-h-[400px] max-h-[600px] overflow-y-auto">
          {showFormatted ? formattedContent : content}
        </div>
        
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <p className="font-medium mb-1">📄 Text Format Benefits:</p>
          <ul className="space-y-1">
            <li>• Clean, properly structured sections with clear headers</li>
            <li>• Easy to copy and paste into any application</li>
            <li>• ATS-friendly format that preserves all content</li>
            <li>• Perfect for quick edits and customization</li>
            <li>• Toggle between formatted and raw views</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
