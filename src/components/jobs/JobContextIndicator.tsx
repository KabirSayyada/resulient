
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, X, Bookmark } from "lucide-react";
import { useJobContext } from "@/hooks/useJobContext";
import { useToast } from "@/hooks/use-toast";

export const JobContextIndicator = () => {
  const { jobContext, isJobContextActive, clearJobContext, saveJobForLater } = useJobContext();
  const { toast } = useToast();

  if (!isJobContextActive || !jobContext) return null;

  const handleSaveForLater = () => {
    saveJobForLater();
    toast({
      title: "Job Saved",
      description: "This job has been saved for later reference.",
    });
  };

  const handleClearContext = () => {
    clearJobContext();
    toast({
      title: "Job Context Cleared",
      description: "You can now optimize your resume for a different job.",
    });
  };

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-blue-900 dark:text-blue-100 truncate">
                  Optimizing for: {jobContext.jobData.title}
                </span>
                <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900/30">
                  {jobContext.jobData.company}
                </Badge>
              </div>
              {jobContext.jobData.location && (
                <div className="flex items-center gap-1 mt-1 text-sm text-blue-700 dark:text-blue-300">
                  <MapPin className="h-3 w-3" />
                  {jobContext.jobData.location}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveForLater}
              className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearContext}
              className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
