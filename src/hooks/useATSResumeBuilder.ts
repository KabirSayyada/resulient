
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ATSResumeData } from "@/types/atsResume";
import { generateTextFormattedPDF } from "@/utils/textFormattedPdfGenerator";
import { generateResumeWithTemplate, getRecommendedTemplate, ResumeTemplateType } from "@/utils/resumeTemplates/templateSelector";
import { ParsedResume } from "@/types/resumeStructure";

export const useATSResumeBuilder = (userId?: string) => {
  const [resumeData, setResumeData] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateType>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateResume = async (formData: ATSResumeData, templateType?: ResumeTemplateType) => {
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

      if (data?.parsedResume) {
        const parsedResume = data.parsedResume as ParsedResume;
        
        // Determine template to use
        const template = templateType || getRecommendedTemplate(parsedResume);
        setSelectedTemplate(template);
        
        // Generate resume with selected template
        const formattedResume = generateResumeWithTemplate(parsedResume, template);
        setResumeData(formattedResume);
        
        // Store the resume data to track usage
        await supabase
          .from("user_resume_data")
          .upsert({
            user_id: userId,
            resume_data: { 
              content: formattedResume, 
              formData: formData as any,
              template: template,
              parsedResume: parsedResume
            }
          });

        // Increment usage count for resume building
        await supabase.rpc('increment_user_usage', {
          p_user_id: userId,
          p_feature_type: 'resume_building'
        });

        toast({
          title: "Resume Generated!",
          description: `Your ATS-optimized resume has been created using the ${template} template.`,
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

  const regenerateWithTemplate = async (templateType: ResumeTemplateType) => {
    if (!userId) return;

    try {
      // Get the stored resume data
      const { data: userData, error } = await supabase
        .from("user_resume_data")
        .select("resume_data")
        .eq("user_id", userId)
        .single();

      if (error || !userData?.resume_data?.parsedResume) {
        toast({
          title: "No Resume Data",
          description: "Please generate a resume first.",
          variant: "destructive"
        });
        return;
      }

      const parsedResume = userData.resume_data.parsedResume as ParsedResume;
      const formattedResume = generateResumeWithTemplate(parsedResume, templateType);
      
      setResumeData(formattedResume);
      setSelectedTemplate(templateType);

      // Update stored data with new template
      await supabase
        .from("user_resume_data")
        .update({
          resume_data: {
            ...userData.resume_data,
            content: formattedResume,
            template: templateType
          }
        })
        .eq("user_id", userId);

      toast({
        title: "Template Applied!",
        description: `Your resume has been reformatted using the ${templateType} template.`,
      });
    } catch (error) {
      console.error('Error regenerating with template:', error);
      toast({
        title: "Template Change Failed",
        description: "Failed to apply the new template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadResume = () => {
    if (!resumeData) return;

    const blob = new Blob([resumeData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-optimized-resume-${selectedTemplate}.txt`;
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
      `ats-optimized-resume-${selectedTemplate}.pdf`
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

  return {
    resumeData,
    selectedTemplate,
    isGenerating,
    generateResume,
    regenerateWithTemplate,
    downloadResume,
    downloadResumePDF
  };
};
