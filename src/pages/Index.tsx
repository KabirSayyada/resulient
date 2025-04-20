
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { FileUploadSection } from "@/components/resume/FileUploadSection";
import { OptimizedResumeDisplay } from "@/components/resume/OptimizedResumeDisplay";

const Index = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!jobDescription.trim() || !resumeContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both job description and resume content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("optimize-resume", {
        body: {
          jobDescription,
          resumeContent,
        }
      });

      if (error) {
        throw new Error(error.message || "Failed to optimize resume");
      }

      setOptimizedResume(data.optimizedResume);
      toast({
        title: "Success!",
        description: "Your resume has been optimized for ATS.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ATS Resume Optimizer
          </h1>
          <p className="text-gray-600">
            Optimize your resume to beat Applicant Tracking Systems (ATS)
          </p>
        </div>

        <div className="space-y-6">
          <JobDescriptionInput
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />

          <FileUploadSection
            resumeContent={resumeContent}
            setResumeContent={setResumeContent}
          />

          <div className="text-center">
            <Button
              onClick={handleOptimize}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Optimizing..." : "Optimize Resume"}
            </Button>
          </div>

          <OptimizedResumeDisplay optimizedResume={optimizedResume} />
        </div>
      </div>
    </div>
  );
};

export default Index;
