
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import { ScoreBreakdown } from "@/components/resume/ScoreBreakdown";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";
import { supabase } from "@/integrations/supabase/client";
import { ScoreHistory } from "@/components/resume/ScoreHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2 } from "lucide-react";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { ScoreResultSection } from "@/components/resume/ScoreResultSection";

export interface ScoreData {
  overallScore: number;
  skillsAlignment: number;
  WorkExperience: number;
  Achievements: number;
  EducationQuality: number;
  Certifications: number;
  ContentStructure: number;
  keywordRelevance: number;
  Industry: string;
  percentile: number;
  numSimilarResumes: number;
  suggestedSkills: string[];
  eliteIndicatorsFound: string[];
  improvementTips: string[];
  timestamp: string;
  id: string;
  scoringMode?: "resumeOnly";
}

const ResumeScoring = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [scoringMode] = useState<"resumeOnly">("resumeOnly");
  const [resumeContent, setResumeContent] = useState("");
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreData[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [activeTab, setActiveTab] = useState("current");

  const { callFunction } = useSupabaseFunction();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchScoreHistory();
    }
  }, [user, authLoading, navigate]);

  const fetchScoreHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("resume_scores")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setScoreHistory(
          data.map((item: any) => ({
            overallScore: item.overall_score,
            skillsAlignment: item.skills_alignment || item.skills_breadth,
            WorkExperience: item.work_experience || item.experience_duration,
            Achievements: item.achievements || 0,
            EducationQuality: item.education_quality || 0,
            Certifications: item.certifications || 0,
            ContentStructure: item.content_structure,
            keywordRelevance: item.keyword_relevance,
            Industry: item.industry,
            percentile: item.percentile,
            numSimilarResumes: item.num_similar_resumes || 12000,
            suggestedSkills: item.suggested_skills || [],
            eliteIndicatorsFound: item.elite_indicators || [],
            improvementTips: item.improvement_tips || [],
            timestamp: new Date(item.created_at).toLocaleString(),
            id: item.id,
            scoringMode: item.scoring_mode || "resumeOnly",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching score history:", error);
      toast({
        title: "Error",
        description: "Failed to load your score history",
        variant: "destructive",
      });
    }
  };

  // New function to find an existing score with the same resume content
  const findExistingScore = async (content: string) => {
    if (!user) return null;
    
    try {
      // Query the database for a score with the exact same resume content for this user
      const { data, error } = await supabase
        .from("resume_scores")
        .select("*")
        .eq("user_id", user.id)
        .eq("resume_content", content)
        .eq("scoring_mode", scoringMode)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error checking for existing score:", error);
        return null;
      }
      
      // If we found a match, return the first (most recent) matching score
      if (data && data.length > 0) {
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error("Error checking for existing score:", error);
      return null;
    }
  };

  const handleScoreResume = async () => {
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
      // First, check if we already have a score for this exact resume content
      const existingScore = await findExistingScore(resumeContent);
      
      if (existingScore) {
        // If we found an existing score, use it instead of calling the AI
        console.log("Found existing score for this resume, reusing results");
        
        const cachedScoreData: ScoreData = {
          overallScore: existingScore.overall_score,
          skillsAlignment: existingScore.skills_alignment || existingScore.skills_breadth,
          WorkExperience: existingScore.work_experience || existingScore.experience_duration,
          Achievements: existingScore.achievements || 0,
          EducationQuality: existingScore.education_quality || 0,
          Certifications: existingScore.certifications || 0,
          ContentStructure: existingScore.content_structure,
          keywordRelevance: existingScore.keyword_relevance,
          Industry: existingScore.industry,
          percentile: existingScore.percentile,
          numSimilarResumes: existingScore.num_similar_resumes || 12000,
          suggestedSkills: existingScore.suggested_skills || [],
          eliteIndicatorsFound: existingScore.elite_indicators || [],
          improvementTips: existingScore.improvement_tips || [],
          timestamp: new Date().toLocaleString(), // Update timestamp to show it was reused now
          id: existingScore.id,
          scoringMode: existingScore.scoring_mode || "resumeOnly",
        };
        
        setScoreData(cachedScoreData);
        
        toast({
          title: "Results Retrieved",
          description: "We found existing results for this resume.",
        });
        
        return;
      }
      
      // If no existing score was found, proceed with AI scoring
      const payload = {
        resumeContent,
        scoringMode,
      };
      
      const response = await callFunction("score-resume", payload);
      
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
        id: crypto.randomUUID(),
        scoringMode,
      };
      
      setScoreData(newScoreData);
      setScoreHistory([newScoreData, ...scoreHistory]);
      
      // Insert the score into the database using the correct schema
      const { error } = await supabase
        .from("resume_scores")
        .insert({
          user_id: user?.id,
          overall_score: newScoreData.overallScore,
          skills_breadth: newScoreData.skillsAlignment,
          experience_duration: newScoreData.WorkExperience,
          content_structure: newScoreData.ContentStructure,
          keyword_relevance: newScoreData.keywordRelevance,
          industry: newScoreData.Industry,
          percentile: newScoreData.percentile,
          resume_content: resumeContent,
          suggested_skills: newScoreData.suggestedSkills,
          job_description: '', // Empty string since we're only doing resume-only scoring
          ats_readiness: 0, // Required field with default value
          scoring_mode: scoringMode
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

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight drop-shadow-md">
              🚀 Resume Score Analyzer
            </h1>
            <p className="text-indigo-600 font-medium">
              Get visually stunning insights about your resume, see your career growth and beat the competition!
            </p>
          </div>
          <UserMenu />
        </div>
        <Tabs defaultValue="current" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-lg shadow overflow-hidden border border-indigo-200">
            <TabsTrigger value="current">New Analysis</TabsTrigger>
            <TabsTrigger value="history">Score History</TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="space-y-8 mt-6">
            <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 shadow-md border-t-4 border-t-indigo-500">
              <CardHeader>
                <CardTitle className="font-bold text-2xl text-indigo-800">Submit Your Resume</CardTitle>
                <CardDescription className="text-indigo-600 font-medium">
                  Upload your resume to benchmark it against industry standards!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <ResumeScoringForm
                  scoringMode={scoringMode}
                  setScoringMode={() => {}}
                  resumeContent={resumeContent}
                  setResumeContent={setResumeContent}
                  isScoring={isScoring}
                  onScore={handleScoreResume}
                />
              </CardContent>
            </Card>
            {scoreData && (
              <ScoreResultSection scoreData={scoreData} />
            )}
          </TabsContent>
          <TabsContent value="history">
            {scoreHistory.length > 0 ? (
              <ScoreHistory scores={scoreHistory} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <BarChart2 className="h-12 w-12 text-indigo-400 mb-4" />
                  <h3 className="text-lg font-medium text-indigo-900 mb-1">No Score History</h3>
                  <p className="text-indigo-600 text-center max-w-md">
                    You haven't analyzed any resumes yet. Start by uploading your resume to get detailed, actionable feedback and colorful charts tracking your progress.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeScoring;
