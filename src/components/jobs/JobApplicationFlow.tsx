
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ArrowRight, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobContext } from "@/hooks/useJobContext";

interface JobApplicationFlowProps {
  isOptimized?: boolean;
}

export const JobApplicationFlow = ({ isOptimized = false }: JobApplicationFlowProps) => {
  const { jobContext, isJobContextActive } = useJobContext();
  const navigate = useNavigate();

  if (!isJobContextActive || !jobContext) return null;

  const { jobData } = jobContext;

  return (
    <Card className="border-t-4 border-t-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-lg animate-fade-in sticky bottom-4 z-10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <ArrowRight className="h-5 w-5" />
          {isOptimized ? 'Ready to Apply!' : 'Job Application Ready'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {jobData.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {jobData.company} • {jobData.location}
            </p>
            {jobData.salary && (
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                {jobData.salary}
              </p>
            )}
          </div>
          
          {isOptimized && (
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-300 dark:border-green-700">
              <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                ✓ Your resume has been optimized for this position
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            {jobData.external_url && (
              <Button 
                asChild 
                className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
              >
                <a 
                  href={jobData.external_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 justify-center"
                >
                  Apply to {jobData.company}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/jobs")}
              className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/jobs")}
              className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Find Similar Jobs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
