
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { UserMenu } from "@/components/auth/UserMenu";
import { ScoreResultSection } from "@/components/resume/ScoreResultSection";
import { ScoreHistory } from "@/components/resume/ScoreHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText } from "lucide-react";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { supabase } from "@/integrations/supabase/client";
import { ScoreData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { MainNavigation } from "@/components/resume/MainNavigation";

const ResumeScoring = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resumeContent, setResumeContent] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const { scoreData, scoreHistory, setScoreHistory, isScoring, handleScoreResume } = useResumeScoring(user?.id);

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

      if (error) throw error;

      if (data) {
        const formattedHistory: ScoreData[] = data.map((item) => {
          // Format percentile without prefixes/suffixes
          const percentileString = (() => {
            const percentile = item.percentile || 50;
            if (percentile >= 99) return "1";
            if (percentile >= 95) return "5";
            if (percentile >= 90) return "10";
            if (percentile >= 75) return "25";
            if (percentile >= 65) return "Above Average";
            if (percentile >= 45) return "Average";
            if (percentile >= 30) return "Below Average";
            return "Bottom 25";
          })();

          return {
            overallScore: item.overall_score,
            skillsAlignment: item.skills_breadth || 0,
            WorkExperience: item.experience_duration || 0,
            Achievements: item.experience_duration || 0,
            EducationQuality: item.content_structure || 0,
            Certifications: item.ats_readiness || 0,
            ContentStructure: item.content_structure || 0,
            keywordRelevance: item.keyword_relevance || 0,
            Industry: item.industry || "",
            percentile: percentileString,
            numSimilarResumes: item.percentile || 12000,
            suggestedSkills: item.suggested_skills || [],
            eliteIndicatorsFound: item.suggested_skills || [],
            improvementTips: item.suggested_skills?.map(s => `Add ${s} to your resume`) || [],
            timestamp: new Date(item.created_at).toLocaleString(),
            id: item.id,
            scoringMode: "resumeOnly",
          };
        });
        setScoreHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Error fetching score history:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  const onScore = () => {
    handleScoreResume(resumeContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center">
              <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                Resulient
              </span>
            </Link>
            <span className="rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-fuchsia-100 text-fuchsia-700 shadow border border-fuchsia-200 animate-fade-in whitespace-nowrap">
              Resume Score Analyzer
            </span>
          </div>
          <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 sm:hidden"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <UserMenu />
          </div>
        </div>

        {/* Info block for Resume Scoring */}
        <div className="bg-gradient-to-br from-fuchsia-50 via-indigo-50 to-blue-50 rounded-xl border border-indigo-100 shadow-md px-4 py-5 mb-6 sm:px-7 max-w-2xl mx-auto text-center">
          <div className="text-lg sm:text-xl font-semibold text-indigo-900 leading-snug mb-0">
            <span className="text-fuchsia-700 font-bold">New!</span> 
            &nbsp;Unlock insights with <span className="text-fuchsia-700 font-bold">Resulient Resume Scoring</span>
          </div>
          <p className="text-gray-700 text-sm mt-3 max-w-2xl mx-auto">
            Instantly compare your resume to <span className="font-bold text-indigo-700">hundreds of thousands</span> of real career journeys. 
            Using Artificial Intelligence, Resulient shows you exactly where you stand among your competition—so you know how to outshine other applicants.
          </p>
        </div>
        {/* End info block */}

        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 hidden sm:flex items-center gap-1"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <MainNavigation />

        <Tabs defaultValue="current" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-lg shadow overflow-hidden border border-indigo-200">
            <TabsTrigger value="current">New Analysis</TabsTrigger>
            <TabsTrigger value="history">Score History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6 mt-6">
            <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 shadow-md border-t-4 border-t-indigo-500">
              <CardContent className="space-y-6 pt-6">
                <ResumeScoringForm
                  scoringMode="resumeOnly"
                  setScoringMode={() => {}}
                  resumeContent={resumeContent}
                  setResumeContent={setResumeContent}
                  isScoring={isScoring}
                  onScore={onScore}
                />
              </CardContent>
            </Card>

            {scoreData && (
              <ScoreResultSection scoreData={scoreData} />
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {scoreHistory.length > 0 ? (
              <ScoreHistory scores={scoreHistory} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-12 w-12 text-indigo-400 mb-4" />
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
