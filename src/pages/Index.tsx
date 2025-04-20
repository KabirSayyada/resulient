
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { FileUploadSection } from "@/components/resume/FileUploadSection";
import { OptimizedResumeDisplay } from "@/components/resume/OptimizedResumeDisplay";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  
  // Hook to call the Supabase function
  const { callFunction, loading: functionLoading, error: functionError } = useSupabaseFunction();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleOptimizeResume = async () => {
    if (!resumeContent) {
      toast({
        title: "Missing Content",
        description: "Please upload or paste your resume content.",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription) {
      toast({
        title: "Missing Job Description",
        description: "Please paste the job description to optimize against.",
        variant: "destructive",
      });
      return;
    }

    setOptimizing(true);
    
    try {
      const response = await callFunction("optimize-resume", {
        jobDescription,
        resumeContent,
      });
      
      if (response?.error) {
        throw new Error(response.error);
      }
      
      setOptimizedResume(response.optimizedResume);
      
      toast({
        title: "Resume Optimized",
        description: "Your resume has been successfully optimized for ATS.",
      });
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize resume",
        variant: "destructive",
      });
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ATS Resume Optimizer
            </h1>
            <p className="text-gray-600">
              Optimize your resume to beat Applicant Tracking Systems (ATS)
            </p>
          </div>
          <UserMenu />
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
          
          <div className="flex justify-center">
            <Button 
              onClick={handleOptimizeResume} 
              disabled={optimizing || !resumeContent || !jobDescription}
              className="px-6 py-2 text-lg"
            >
              {optimizing ? "Optimizing..." : "Optimize Resume"}
            </Button>
          </div>
          
          {optimizedResume && (
            <OptimizedResumeDisplay 
              optimizedResume={optimizedResume}
              jobDescription={jobDescription}
              originalResume={resumeContent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
