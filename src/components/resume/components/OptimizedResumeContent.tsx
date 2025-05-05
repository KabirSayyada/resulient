
interface OptimizedResumeContentProps {
  content: string;
}

export const OptimizedResumeContent = ({ content }: OptimizedResumeContentProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-inner mt-6 overflow-hidden w-full">
      <h2 className="text-xl font-bold text-indigo-700 mb-4 sm:mb-6">Optimized Resume</h2>
      <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200 overflow-x-auto max-w-full">
        {content}
      </div>
    </div>
  );
};
