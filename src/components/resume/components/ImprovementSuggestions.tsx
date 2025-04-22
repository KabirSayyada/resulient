
interface ImprovementSuggestionsProps {
  suggestions: string[];
}

export const ImprovementSuggestions = ({ suggestions }: ImprovementSuggestionsProps) => {
  return (
    <div className="mt-8 mb-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Improvement Suggestions</h2>
      <div className="bg-indigo-50 p-4 rounded-lg shadow-inner">
        <ul className="space-y-3">
          {suggestions.map((tip, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
