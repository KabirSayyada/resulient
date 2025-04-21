import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";
import { ScoreData } from "@/types/resume";

const calculatePercentile = (score: number): string => {
  if (score >= 90) return "1";
  if (score >= 85) return "5";
  if (score >= 80) return "10";
  if (score >= 70) return "25";
  if (score >= 60) return "Above Average";
  if (score >= 50) return "Average";
  if (score >= 40) return "Below Average";
  return "Bottom 25";
};

// Convert string percentile to numeric value for database storage
const percentileToNumber = (percentile: string): number => {
  switch (percentile) {
    case "1": return 99;
    case "5": return 95;
    case "10": return 90;
    case "25": return 75;
    case "Above Average": return 65;
    case "Average": return 50;
    case "Below Average": return 35;
    case "Bottom 25": return 25;
    default: return 50;
  }
};

export const useResumeScoring = (userId: string | undefined) => {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreData[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const { toast } = useToast();
  const { callFunction } = useSupabaseFunction();

  const findExistingScore = async (content: string) => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from("resume_scores")
        .select("*")
        .eq("user_id", userId)
        .eq("resume_content", content)
        .eq("scoring_mode", "resumeOnly")
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error checking for existing score:", error);
        return null;
      }
      
      if (data && data.length > 0) {
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error("Error checking for existing score:", error);
      return null;
    }
  };

  const handleScoreResume = async (resumeContent: string) => {
    if (!resumeContent) {
      toast({
        title: "Missing Content",
        description: "Please upload or paste your resume content.",
        variant: "destructive",
      });
      return;
    }
    
    setIsScoring(true);
    
    try {
      const existingScore = await findExistingScore(resumeContent);
      
      if (existingScore) {
        const calculatedPercentile = calculatePercentile(existingScore.overall_score);
        
        const cachedScoreData: ScoreData = {
          overallScore: existingScore.overall_score,
          skillsAlignment: existingScore.skills_breadth || 0,
          WorkExperience: existingScore.experience_duration || 0,
          Achievements: existingScore.experience_duration || 0, // No achievements_score field yet
          EducationQuality: existingScore.content_structure || 0, // No education_score field yet
          Certifications: existingScore.ats_readiness || 0, // No certifications_score field yet
          ContentStructure: existingScore.content_structure || 0,
          keywordRelevance: existingScore.keyword_relevance || 0,
          Industry: existingScore.industry || "",
          percentile: calculatedPercentile,
          numSimilarResumes: existingScore.percentile || 12000,
          suggestedSkills: existingScore.suggested_skills || [],
          eliteIndicatorsFound: existingScore.suggested_skills || [], // No elite_indicators field yet
          improvementTips: existingScore.suggested_skills?.map(s => `Add ${s} to your resume`) || [], // No improvement_tips field yet
          timestamp: new Date().toLocaleString(),
          id: existingScore.id,
          scoringMode: "resumeOnly",
        };
        
        setScoreData(cachedScoreData);
        
        toast({
          title: "Results Retrieved",
          description: "We found existing results for this resume.",
        });
        
        return;
      }
      
      const response = await callFunction("score-resume", {
        resumeContent,
        scoringMode: "resumeOnly",
      });
      
      if (response?.error) {
        throw new Error(response.error);
      }

      const calculatedPercentile = calculatePercentile(response.overallScore);
      
      const newScoreData: ScoreData = {
        overallScore: response.overallScore,
        skillsAlignment: response.skillsAlignment,
        WorkExperience: response.WorkExperience,
        Achievements: response.Achievements,
        EducationQuality: response.EducationQuality,
        Certifications: response.Certifications,
        ContentStructure: response.ContentStructure,
        keywordRelevance: response.keywordRelevance,
        Industry: response.Industry,
        percentile: calculatedPercentile,
        numSimilarResumes: response.numSimilarResumes,
        suggestedSkills: response.suggestedSkills || [],
        eliteIndicatorsFound: response.eliteIndicatorsFound || [],
        improvementTips: response.improvementTips || [],
        timestamp: new Date().toLocaleString(),
        id: "newly-generated-" + crypto.randomUUID(),
        scoringMode: "resumeOnly",
      };
      
      setScoreData(newScoreData);
      setScoreHistory([newScoreData, ...scoreHistory]);
      
      // Convert string percentile to numeric value for database storage
      const numericPercentile = percentileToNumber(calculatedPercentile);
      
      const { error } = await supabase
        .from("resume_scores")
        .insert({
          user_id: userId,
          overall_score: newScoreData.overallScore,
          skills_breadth: newScoreData.skillsAlignment,
          experience_duration: newScoreData.WorkExperience,
          // Commenting out the missing field that's causing the error
          // achievements_score: newScoreData.Achievements,
          // education_score: newScoreData.EducationQuality,
          // certifications_score: newScoreData.Certifications,
          content_structure: newScoreData.ContentStructure,
          keyword_relevance: newScoreData.keywordRelevance,
          industry: newScoreData.Industry,
          percentile: numericPercentile,
          similar_resumes: newScoreData.numSimilarResumes,
          suggested_skills: newScoreData.suggestedSkills,
          // elite_indicators: newScoreData.eliteIndicatorsFound,
          // improvement_tips: newScoreData.improvementTips,
          resume_content: resumeContent,
          job_description: '',
          ats_readiness: 0,
          scoring_mode: "resumeOnly"
        });
      
      if (error) {
        console.error("Error saving score:", error);
      }
      
      toast({
        title: "Resume Benchmarked",
        description: "Your resume has been benchmarked for your target industry.",
      });
    } catch (error) {
      console.error("Error scoring resume:", error);
      toast({
        title: "Scoring Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to score resume",
        variant: "destructive",
      });
    } finally {
      setIsScoring(false);
    }
  };

  return {
    scoreData,
    scoreHistory,
    setScoreHistory,
    isScoring,
    handleScoreResume
  };
};
