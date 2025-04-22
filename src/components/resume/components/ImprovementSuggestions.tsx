
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface ImprovementSuggestionsProps {
  suggestions: string[];
}

export const ImprovementSuggestions = ({ suggestions }: ImprovementSuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  
  return (
    <Card className="border-t-4 border-t-blue-500 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Improvement Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg space-y-3">
          {suggestions.map((tip, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 bg-white/80 p-3 rounded-md shadow-sm border border-blue-100"
            >
              <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-400" />
              <span className="text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
