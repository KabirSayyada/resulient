
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";

export const OptimizationHistory = ({ userId }: { userId: string | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { optimizationHistory, fetchOptimizationHistory } = useResumeOptimizationHistory(userId);

  const handleOpen = (open: boolean) => {
    if (open) {
      fetchOptimizationHistory();
    }
    setIsOpen(open);
  };

  // Function to truncate long text
  const truncateText = (text: string, maxLength: number = 200) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <History className="h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Optimization History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-6rem)] mt-6">
          <div className="space-y-4 pr-4">
            {optimizationHistory.map((item, index) => (
              <Card key={item.id} className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">
                    Optimization #{optimizationHistory.length - index}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Job Description Preview */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Job Description</h3>
                    <div className="text-sm bg-gray-50 p-3 rounded-md">
                      {truncateText(item.job_description)}
                    </div>
                  </div>
                  
                  {/* Optimized Resume Preview */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Optimized Resume</h3>
                    <div className="text-sm bg-gray-50 p-3 rounded-md">
                      {truncateText(item.optimized_resume)}
                    </div>
                  </div>
                  
                  {/* Improvement Suggestions */}
                  {item.suggestions && item.suggestions.length > 0 && (
                    <ImprovementSuggestions suggestions={item.suggestions} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
