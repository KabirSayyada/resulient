
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ATSResumeData } from "@/types/atsResume";
import { generateTextFormattedPDF } from "@/utils/textFormattedPdfGenerator";
import { generateTextBasedPDF } from "@/utils/textBasedPdfGenerator";
import { generateFreshTemplatePDF } from "@/utils/freshTemplatePdfGenerator";
import { useSubscription } from "@/hooks/useSubscription";

export const useATSResumeBuilder = (userId?: string) => {
  const [resumeData, setResumeData] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { subscription } = useSubscription();

  const generateResume = async (formData: ATSResumeData) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate your resume.",
        variant: "destructive"
      });
      return;
    }

    if (subscription.tier === "free") {
      toast({
        title: "Subscription Required",
        description: "Resume building requires a Premium or Platinum subscription.",
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
        
        // Store the resume data to track usage
        await supabase
          .from("user_resume_data")
          .upsert({
            user_id: userId,
            resume_data: { content: data.optimizedResume, formData: formData as any }
          });

        // Increment usage count for resume building
        await supabase.rpc('increment_user_usage', {
          p_user_id: userId,
          p_feature_type: 'resume_building'
        });

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

  const downloadResumePDF = async () => {
    if (!resumeData) return;

    toast({
      title: "Generating PDF...",
      description: "Creating your PDF resume, please wait.",
    });

    const success = await generateTextFormattedPDF(
      resumeData,
      'ats-optimized-resume.pdf'
    );

    if (success) {
      toast({
        title: "PDF Downloaded!",
        description: "Your PDF resume has been downloaded successfully.",
      });
    } else {
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadTextBasedPDF = async () => {
    if (!resumeData) return;

    toast({
      title: "Generating Text-Based PDF...",
      description: "Creating your stylized PDF resume, please wait.",
    });

    const success = await generateTextBasedPDF(
      resumeData,
      'text-based-resume.pdf'
    );

    if (success) {
      toast({
        title: "Text-Based PDF Downloaded!",
        description: "Your stylized PDF resume has been downloaded successfully.",
      });
    } else {
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate text-based PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadFreshTemplatePDF = async () => {
    if (!resumeData) return;

    toast({
      title: "Generating Fresh Template PDF...",
      description: "Creating your fresh design resume, please wait.",
    });

    const success = await generateFreshTemplatePDF(
      resumeData,
      'fresh-template-resume.pdf'
    );

    if (success) {
      toast({
        title: "Fresh Template PDF Downloaded!",
        description: "Your fresh design resume has been downloaded successfully.",
      });
    } else {
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate fresh template PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    resumeData,
    isGenerating,
    generateResume,
    downloadResume,
    downloadResumePDF,
    downloadTextBasedPDF,
    downloadFreshTemplatePDF
  };
};
