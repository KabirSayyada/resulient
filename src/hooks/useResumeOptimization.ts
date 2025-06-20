
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useResumeOptimization = (userId?: string) => {
  const [optimizedResume, setOptimizedResume] = useState<string>("");
  const [qualificationGaps, setQualificationGaps] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const optimizeResume = async (resumeContent: string, jobDescription: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to optimize your resume.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-resume', {
        body: { 
          resumeContent: resumeContent.trim(),
          jobDescription: jobDescription.trim()
        }
      });

      if (error) throw error;

      if (data?.optimizedResume) {
        setOptimizedResume(data.optimizedResume);
        setQualificationGaps(data.qualificationGaps || []);
        
        // Store the optimization result
        await supabase
          .from("resume_optimizations")
          .insert({
            user_id: userId,
            original_resume: resumeContent,
            optimized_resume: data.optimizedResume,
            job_description: jobDescription,
            qualification_gaps: data.qualificationGaps || []
          });

        // Increment usage count for resume optimization
        await supabase.rpc('increment_user_usage', {
          p_user_id: userId,
          p_feature_type: 'resume_optimizations'
        });

        toast({
          title: "Resume Optimized!",
          description: "Your resume has been optimized for the job description.",
        });

        return true;
      }
    } catch (error) {
      console.error('Error optimizing resume:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize your resume. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsOptimizing(false);
    }
  };

  const downloadOptimizedResume = () => {
    if (!optimizedResume) return;

    const blob = new Blob([optimizedResume], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-resume.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Downloaded!",
      description: "Your optimized resume has been downloaded successfully.",
    });
  };

  return {
    optimizedResume,
    qualificationGaps,
    isOptimizing,
    optimizeResume,
    downloadOptimizedResume
  };
};
