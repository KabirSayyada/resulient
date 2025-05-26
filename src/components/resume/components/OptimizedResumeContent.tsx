
interface OptimizedResumeContentProps {
  content: string;
}

export const OptimizedResumeContent = ({ content }: OptimizedResumeContentProps) => {
  // Format content for better display
  const formatContentForDisplay = (text: string): string => {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const formattedContent = formatContentForDisplay(content);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-inner mt-6">
      <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">Optimized Resume</h2>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          {formattedContent}
        </pre>
      </div>
      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
        <p className="font-medium mb-1">📝 Text Format Preview:</p>
        <p>This is how your resume will appear when downloaded as a text file. The formatting is optimized for ATS systems and easy editing.</p>
      </div>
    </div>
  );
};
