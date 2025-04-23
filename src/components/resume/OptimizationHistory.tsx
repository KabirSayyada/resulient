
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { useIsMobile } from "@/hooks/use-mobile";

export const OptimizationHistory = ({ userId }: { userId: string | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { optimizationHistory, fetchOptimizationHistory } = useResumeOptimizationHistory(userId);
  const isMobile = useIsMobile();

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
      <SheetContent 
        side="right" 
        className={`${isMobile ? 'w-full' : 'w-full sm:max-w-md md:max-w-xl lg:max-w-2xl'} overflow-hidden p-0`}
      >
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Optimization History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)] px-6">
          <div className="space-y-4 pb-6 pr-2">
            {optimizationHistory.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No optimization history found</p>
              </div>
            ) : (
              optimizationHistory.map((item, index) => (
                <Card key={item.id} className="border shadow-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Optimization #{optimizationHistory.length - index}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-6">
                    {/* Job Description Preview */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Job Description</h3>
                      <div className="text-sm bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto break-words">
                        {item.job_description || "No job description provided"}
                      </div>
                    </div>
                    
                    {/* Optimized Resume Preview */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Optimized Resume</h3>
                      <div className="text-sm bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto break-words">
                        {item.optimized_resume || "No optimized resume available"}
                      </div>
                    </div>
                    
                    {/* Improvement Suggestions */}
                    {item.suggestions && item.suggestions.length > 0 && (
                      <ImprovementSuggestions suggestions={item.suggestions} />
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
