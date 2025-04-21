
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";
import { ScoreData } from "@/types/resume";

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
        console.log("Found existing score for this resume, reusing results");
        
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
          percentile: existingScore.percentile || 50,
          numSimilarResumes: existingScore.similar_resumes || 12000,
          suggestedSkills: existingScore.suggested_skills || [],
          eliteIndicatorsFound: existingScore.elite_indicators || [],
          improvementTips: existingScore.improvement_tips || [],
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
        percentile: response.percentile,
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
          percentile: newScoreData.percentile,
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
