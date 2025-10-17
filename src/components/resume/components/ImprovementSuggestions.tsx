
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Copy, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImprovementSuggestionsProps {
  suggestions: string[];
}

export const ImprovementSuggestions = ({ suggestions }: ImprovementSuggestionsProps) => {
  const { toast } = useToast();
  
  // Ensure suggestions is an array before proceeding
  if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
    return null;
  }

  const handleCopy = (tip: string) => {
    navigator.clipboard.writeText(tip);
    toast({
      title: "Copied!",
      description: "Suggestion copied to clipboard",
    });
  };
  
  return (
    <Card className="border-t-4 border-t-blue-500 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Improvement Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg space-y-3">
          {suggestions.map((tip, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 bg-white/80 dark:bg-background/80 p-4 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800 hover:shadow-md transition-shadow"
            >
              <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-400" />
              <div className="flex-1 space-y-2">
                <span className="text-gray-700 dark:text-gray-300 block">{tip}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(tip)}
                    className="h-8 px-3 text-xs gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                    onClick={() => window.open('https://blog.resulient.com', '_blank')}
                  >
                    <BookOpen className="h-3 w-3" />
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
