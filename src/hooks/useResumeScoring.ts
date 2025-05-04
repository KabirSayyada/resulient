
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";
import { ScoreData, ResumeScoreRecord } from "@/types/resume";

const calculatePercentile = (score: number): string => {
  if (score >= 90) return "Top 1%";
  if (score >= 85) return "Top 5%";
  if (score >= 80) return "Top 10%";
  if (score >= 70) return "Top 25%";
  if (score >= 60) return "Above Average";
  if (score >= 50) return "Average";
  if (score >= 40) return "Below Average";
  return "Bottom 25%";
};

// Convert string percentile to numeric value for database storage
const percentileToNumber = (percentile: string): number => {
  switch (percentile) {
    case "Top 1%": return 99;
    case "Top 5%": return 95;
    case "Top 10%": return 90;
    case "Top 25%": return 75;
    case "Above Average": return 65;
    case "Average": return 50;
    case "Below Average": return 35;
    case "Bottom 25%": return 25;
    default: return 50;
  }
};

export const useResumeScoring = (userId: string | undefined) => {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreData[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const { toast } = useToast();
  const { callFunction } = useSupabaseFunction();

  const checkDailyLimits = async (limitCount: number): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Count scorings done today
      const { count, error } = await supabase
        .from("resume_scores")
        .select("id", { count: 'exact', head: false })
        .eq("user_id", userId)
        .eq("scoring_mode", "resumeOnly")
        .gte("created_at", today.toISOString());
      
      if (error) throw error;
      
      // If limit is -1, it means unlimited
      if (limitCount === -1) return true;
      
      // Otherwise check if count is less than limit
      return (count || 0) < limitCount;
    } catch (error) {
      console.error("Error checking daily limits:", error);
      return false;
    }
  };

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
        return data[0] as ResumeScoreRecord;
      }
      
      return null;
    } catch (error) {
      console.error("Error checking for existing score:", error);
      return null;
    }
  };

  const handleScoreResume = async (resumeContent: string, limitCount: number) => {
    if (!resumeContent) {
      toast({
        title: "Missing Content",
        description: "Please upload or paste your resume content.",
        variant: "destructive",
      });
      return;
    }
    
    setIsScoring(true);
    setHasReachedLimit(false);
    
    try {
      const existingScore = await findExistingScore(resumeContent);
      
      if (existingScore) {
        const calculatedPercentile = calculatePercentile(existingScore.overall_score);
        
        const cachedScoreData: ScoreData = {
          overallScore: existingScore.overall_score,
          skillsAlignment: existingScore.skills_breadth || 0,
          WorkExperience: existingScore.experience_duration || 0,
          Achievements: existingScore.achievements_score || 0,
          EducationQuality: existingScore.education_score || 0,
          Certifications: existingScore.certifications_score || 0,
          ContentStructure: existingScore.content_structure || 0,
          keywordRelevance: existingScore.keyword_relevance || 0,
          Industry: existingScore.industry || "",
          percentile: calculatedPercentile,
          numSimilarResumes: existingScore.similar_resumes || 12000,
          suggestedSkills: existingScore.suggested_skills || [],
          eliteIndicatorsFound: existingScore.elite_indicators || [],
          improvementTips: existingScore.improvement_tips || [],
          missingQualifications: [],
          timestamp: new Date(existingScore.created_at).toLocaleString(),
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
      
      // Check if user has reached their daily limit
      const hasAccess = await checkDailyLimits(limitCount);
      
      if (!hasAccess) {
        setHasReachedLimit(true);
        toast({
          title: "Daily Limit Reached",
          description: "You've reached your daily limit for resume scoring. Upgrade your plan for unlimited access.",
          variant: "destructive",
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
        missingQualifications: response.missingQualifications || [],
        timestamp: new Date().toLocaleString(),
        id: "newly-generated-" + crypto.randomUUID(),
        scoringMode: "resumeOnly",
      };
      
      setScoreData(newScoreData);
      setScoreHistory([newScoreData, ...scoreHistory]);
      
      try {
        // Store ALL score fields in the database
        const { error } = await supabase
          .from("resume_scores")
          .insert({
            user_id: userId,
            overall_score: newScoreData.overallScore,
            skills_breadth: newScoreData.skillsAlignment,
            experience_duration: newScoreData.WorkExperience,
            achievements_score: newScoreData.Achievements,
            education_score: newScoreData.EducationQuality,
            certifications_score: newScoreData.Certifications,
            content_structure: newScoreData.ContentStructure,
            keyword_relevance: newScoreData.keywordRelevance,
            industry: newScoreData.Industry,
            percentile: percentileToNumber(calculatedPercentile),
            similar_resumes: newScoreData.numSimilarResumes,
            suggested_skills: newScoreData.suggestedSkills,
            elite_indicators: newScoreData.eliteIndicatorsFound,
            improvement_tips: newScoreData.improvementTips,
            resume_content: resumeContent,
            job_description: '',
            ats_readiness: 0,
            scoring_mode: "resumeOnly"
          });
        
        if (error) {
          console.error("Error saving score:", error);
          throw error;
        }
      } catch (dbError) {
        console.error("Database error when saving score:", dbError);
        // If we get a database error, check if it's related to missing columns
        console.log("Falling back to basic storage with required fields only");
        // Try again with only essential fields
        try {
          const { error: fallbackError } = await supabase
            .from("resume_scores")
            .insert({
              user_id: userId,
              overall_score: newScoreData.overallScore,
              skills_breadth: newScoreData.skillsAlignment,
              experience_duration: newScoreData.WorkExperience,
              content_structure: newScoreData.ContentStructure,
              keyword_relevance: newScoreData.keywordRelevance,
              industry: newScoreData.Industry,
              percentile: percentileToNumber(calculatedPercentile),
              suggested_skills: newScoreData.suggestedSkills,
              resume_content: resumeContent,
              job_description: '',
              ats_readiness: 0,
              scoring_mode: "resumeOnly"
            });
          
          if (fallbackError) {
            console.error("Error saving score with fallback method:", fallbackError);
          }
        } catch (fallbackError) {
          console.error("Even fallback storage failed:", fallbackError);
        }
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
    hasReachedLimit,
    handleScoreResume,
    checkDailyLimits
  };
};
