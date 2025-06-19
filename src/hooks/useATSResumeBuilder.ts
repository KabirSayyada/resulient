
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ATSResumeData } from "@/types/atsResume";

export const useATSResumeBuilder = (userId?: string) => {
  const [resumeData, setResumeData] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateResume = async (formData: ATSResumeData) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate your resume.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-ats-resume', {
        body: { formData }
      });

      if (error) throw error;

      if (data?.optimizedResume) {
        setResumeData(data.optimizedResume);
        toast({
          title: "Resume Generated!",
          description: "Your ATS-optimized resume has been created successfully.",
        });
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = () => {
    if (!resumeData) return;

    const blob = new Blob([resumeData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ats-optimized-resume.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Downloaded!",
      description: "Your resume has been downloaded successfully.",
    });
  };

  return {
    resumeData,
    isGenerating,
    generateResume,
    downloadResume
  };
};
