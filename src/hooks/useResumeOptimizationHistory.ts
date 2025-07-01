
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QualificationGap } from '@/types/resume';
import { generateResumeWithTemplate, getRecommendedTemplate, ResumeTemplateType } from "@/utils/resumeTemplates/templateSelector";
import { ParsedResume } from '@/types/resumeStructure';

interface OptimizationData {
  optimizedResume: string;
  originalResume: string;
  jobDescription: string;
  qualificationGaps: QualificationGap[];
  overallScore: number;
  keywordScore: number;
  structureScore: number;
  atsScore: number;
  suggestions: string[];
  parsedResume?: ParsedResume;
  template?: ResumeTemplateType;
}

export const useResumeOptimizationHistory = (userId: string | undefined) => {
  const [optimizationHistory, setOptimizationHistory] = useState<any[]>([]);
  const { toast } = useToast();

  const saveOptimization = async (data: OptimizationData) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your resume optimization.",
        variant: "destructive",
      });
      return null;
    }

    try {
      // If we have parsed resume data, apply recommended template
      let finalOptimizedResume = data.optimizedResume;
      let selectedTemplate = data.template || 'standard';
      
      if (data.parsedResume) {
        selectedTemplate = data.template || getRecommendedTemplate(data.parsedResume);
        finalOptimizedResume = generateResumeWithTemplate(data.parsedResume, selectedTemplate);
      }

      const { data: savedData, error } = await supabase
        .from('resume_optimizations')
        .insert({
          user_id: userId,
          optimized_resume: finalOptimizedResume,
          original_resume: data.originalResume,
          job_description: data.jobDescription,
          qualification_gaps: data.qualificationGaps as any,
          overall_score: data.overallScore,
          keyword_score: data.keywordScore,
          structure_score: data.structureScore,
          ats_score: data.atsScore,
          suggestions: data.suggestions,
          template_used: selectedTemplate,
          parsed_resume_data: data.parsedResume as any
        })
        .select('*');

      if (error) throw error;

      if (savedData) {
        setOptimizationHistory(prev => [savedData[0], ...prev]);
        toast({
          title: "Optimization Saved",
          description: `Resume optimization saved using ${selectedTemplate} template.`,
        });
        return savedData[0];
      }
    } catch (error) {
      console.error("Error saving optimization:", error);
      toast({
        title: "Save Failed",
        description: "Unable to save resume optimization.",
        variant: "destructive",
      });
    }
    return null;
  };

  const regenerateOptimizationWithTemplate = async (optimizationId: string, templateType: ResumeTemplateType) => {
    try {
      // Get the optimization record
      const { data: optimization, error: fetchError } = await supabase
        .from('resume_optimizations')
        .select('*')
        .eq('id', optimizationId)
        .single();

      if (fetchError || !optimization) {
        throw new Error('Optimization not found');
      }

      if (!optimization.parsed_resume_data) {
        toast({
          title: "Template Change Failed",
          description: "This optimization doesn't have parsed resume data for template changes.",
          variant: "destructive"
        });
        return;
      }

      const parsedResume = optimization.parsed_resume_data as ParsedResume;
      const newOptimizedResume = generateResumeWithTemplate(parsedResume, templateType);

      // Update the optimization record
      const { error: updateError } = await supabase
        .from('resume_optimizations')
        .update({
          optimized_resume: newOptimizedResume,
          template_used: templateType
        })
        .eq('id', optimizationId);

      if (updateError) throw updateError;

      // Update local state
      setOptimizationHistory(prev => 
        prev.map(opt => 
          opt.id === optimizationId 
            ? { ...opt, optimized_resume: newOptimizedResume, template_used: templateType }
            : opt
        )
      );

      toast({
        title: "Template Applied",
        description: `Resume has been reformatted using the ${templateType} template.`,
      });

    } catch (error) {
      console.error("Error regenerating with template:", error);
      toast({
        title: "Template Change Failed",
        description: "Failed to apply the new template.",
        variant: "destructive",
      });
    }
  };

  const fetchOptimizationHistory = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('resume_optimizations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOptimizationHistory(data || []);
    } catch (error) {
      console.error("Error fetching optimization history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch optimization history.",
        variant: "destructive",
      });
    }
  };

  return {
    saveOptimization,
    fetchOptimizationHistory,
    regenerateOptimizationWithTemplate,
    optimizationHistory
  };
};
