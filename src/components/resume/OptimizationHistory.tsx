
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { ScoreBreakdown } from "./ScoreBreakdown";

export const OptimizationHistory = ({ userId }: { userId: string | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { optimizationHistory, fetchOptimizationHistory } = useResumeOptimizationHistory(userId);

  const handleOpen = (open: boolean) => {
    if (open) {
      fetchOptimizationHistory();
    }
    setIsOpen(open);
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
                <CardContent>
                  <ScoreBreakdown 
                    scoreData={{
                      overallScore: item.overall_score || 0,
                      keywordRelevance: item.keyword_score || 0,
                      ContentStructure: item.structure_score || 0,
                      atsScore: item.ats_score || 0,
                      suggestions: item.suggestions || [],
                      missingQualifications: item.qualification_gaps || [],
                      timestamp: item.created_at,
                      id: item.id
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
