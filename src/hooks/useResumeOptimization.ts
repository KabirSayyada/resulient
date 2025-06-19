
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";

export const useResumeOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const { callFunction } = useSupabaseFunction();

  const optimizeResume = async (resumeContent: string, jobDescription: string) => {
    if (!resumeContent || !jobDescription) {
      toast({
        title: "Missing Content",
        description: "Please provide both resume content and job description.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const response = await callFunction("optimize-resume", {
        resumeContent,
        jobDescription,
      });
      
      if (response?.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Resume Optimized",
        description: "Your resume has been optimized for the job description.",
      });

      return response;
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize resume",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    isOptimizing,
    optimizeResume,
  };
};
