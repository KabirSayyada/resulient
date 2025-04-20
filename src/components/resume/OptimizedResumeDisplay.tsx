
interface OptimizedResumeDisplayProps {
  optimizedResume: string;
}

export const OptimizedResumeDisplay = ({ optimizedResume }: OptimizedResumeDisplayProps) => {
  if (!optimizedResume) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Optimized Resume
      </label>
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <pre className="whitespace-pre-wrap text-sm text-gray-800">
          {optimizedResume}
        </pre>
      </div>
    </div>
  );
};
