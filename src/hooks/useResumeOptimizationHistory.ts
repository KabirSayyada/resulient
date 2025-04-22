
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QualificationGap } from '@/types/resume';

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
      const { data: savedData, error } = await supabase
        .from('resume_optimizations')
        .insert({
          user_id: userId,
          optimized_resume: data.optimizedResume,
          original_resume: data.originalResume,
          job_description: data.jobDescription,
          qualification_gaps: data.qualificationGaps,
          overall_score: data.overallScore,
          keyword_score: data.keywordScore,
          structure_score: data.structureScore,
          ats_score: data.atsScore,
          suggestions: data.suggestions
        })
        .select('*');

      if (error) throw error;

      if (savedData) {
        setOptimizationHistory(prev => [savedData[0], ...prev]);
        toast({
          title: "Optimization Saved",
          description: "Your resume optimization has been saved to history.",
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
    }
  };

  return {
    saveOptimization,
    fetchOptimizationHistory,
    optimizationHistory
  };
};
