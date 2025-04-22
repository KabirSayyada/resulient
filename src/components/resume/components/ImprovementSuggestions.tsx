
interface ImprovementSuggestionsProps {
  suggestions: string[];
}

export const ImprovementSuggestions = ({ suggestions }: ImprovementSuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-2">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Improvement Suggestions</h3>
      <div className="bg-indigo-50 p-3 rounded-md">
        <ul className="space-y-2">
          {suggestions.map((tip, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="text-indigo-500 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
