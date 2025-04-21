
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { FileUploadSection } from "@/components/resume/FileUploadSection";
import { ScoreBreakdown } from "@/components/resume/ScoreBreakdown";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";
import { supabase } from "@/integrations/supabase/client";
import { ScoreHistory } from "@/components/resume/ScoreHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BarChart2 } from "lucide-react";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { ScoreResultSection } from "@/components/resume/ScoreResultSection";

export interface ScoreData {
  overall: number;
  keywordRelevance: number;
  skillsBreadth: number;
  experienceDuration: number;
  contentStructure: number;
  atsReadiness: number;
  achievements?: number;
  educationQuality?: number;
  certifications?: number;
  industry: string;
  percentile: number;
  suggestedSkills: string[];
  timestamp: string;
  id: string;
  scoringMode?: "jobDescription" | "resumeOnly";
  numSimilarResumes?: number;
  eliteIndicatorsFound?: string[];
}

const ResumeScoring = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [scoringMode, setScoringMode] = useState<"jobDescription" | "resumeOnly">("jobDescription");
  const [jobDescription, setJobDescription] = useState("");
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
            overall: item.overall_score,
            keywordRelevance: item.keyword_relevance,
            skillsBreadth: item.skills_breadth,
            experienceDuration: item.experience_duration,
            contentStructure: item.content_structure,
            atsReadiness: item.ats_readiness,
            industry: item.industry,
            percentile: item.percentile,
            suggestedSkills: item.suggested_skills || [],
            timestamp: new Date(item.created_at).toLocaleString(),
            id: item.id,
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

  const handleScoreResume = async () => {
    if (!resumeContent) {
      toast({
        title: "Missing Content",
        description: "Please upload or paste your resume content.",
        variant: "destructive",
      });
      return;
    }
    if (scoringMode === "jobDescription" && !jobDescription) {
      toast({
        title: "Missing Job Description",
        description: "Please paste the job description to score against.",
        variant: "destructive",
      });
      return;
    }
    setIsScoring(true);
    try {
      const payload = {
        resumeContent,
        ...(scoringMode === "jobDescription" ? { jobDescription } : {}),
        scoringMode,
      };
      const response = await callFunction("score-resume", payload);
      if (response?.error) {
        throw new Error(response.error);
      }
      const newScoreData: ScoreData = {
        overall: response.overallScore,
        keywordRelevance: response.keywordRelevance,
        skillsBreadth: response.skillsBreadth,
        experienceDuration: response.experienceDuration,
        contentStructure: response.contentStructure,
        atsReadiness: response.atsReadiness,
        achievements: response.achievements,
        educationQuality: response.educationQuality,
        certifications: response.certifications,
        industry: response.industry,
        percentile: response.percentile,
        suggestedSkills: response.suggestedSkills || [],
        timestamp: new Date().toLocaleString(),
        id: crypto.randomUUID(),
        scoringMode,
        numSimilarResumes: response.numSimilarResumes,
        eliteIndicatorsFound: response.eliteIndicatorsFound || []
      };
      setScoreData(newScoreData);
      setScoreHistory([newScoreData, ...scoreHistory]);
      const { error } = await supabase
        .from("resume_scores")
        .insert({
          user_id: user?.id,
          overall_score: newScoreData.overall,
          keyword_relevance: newScoreData.keywordRelevance,
          skills_breadth: newScoreData.skillsBreadth,
          experience_duration: newScoreData.experienceDuration,
          content_structure: newScoreData.contentStructure,
          ats_readiness: newScoreData.atsReadiness,
          achievements: newScoreData.achievements,
          education_quality: newScoreData.educationQuality, 
          certifications: newScoreData.certifications,
          industry: newScoreData.industry,
          percentile: newScoreData.percentile,
          suggested_skills: newScoreData.suggestedSkills,
          resume_content: resumeContent,
          job_description: scoringMode === "jobDescription" ? jobDescription : "",
          elite_indicators: newScoreData.eliteIndicatorsFound
        });
      if (error) {
        console.error("Error saving score:", error);
      }
      toast({
        title: scoringMode === "jobDescription" ? "Resume Scored" : "Resume Benchmarked",
        description: scoringMode === "jobDescription"
          ? "Your resume has been analyzed for ATS compatibility."
          : "Your resume has been benchmarked for your target industry.",
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
                  Upload your resume and choose how to analyze it!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <ResumeScoringForm
                  scoringMode={scoringMode}
                  setScoringMode={setScoringMode}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
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
                    You haven't analyzed any resumes yet. Start by uploading your resume and a job description to get detailed, actionable feedback and colorful charts tracking your progress.
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
