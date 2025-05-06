
interface OptimizedResumeContentProps {
  content: string;
}

export const OptimizedResumeContent = ({ content }: OptimizedResumeContentProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-inner mt-6">
      <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">Optimized Resume</h2>
      <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto text-gray-800 dark:text-gray-200">
        {content}
      </div>
    </div>
  );
};
