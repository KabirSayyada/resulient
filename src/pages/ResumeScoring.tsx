import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { UserMenu } from "@/components/auth/UserMenu";
import { ScoreResultSection } from "@/components/resume/ScoreResultSection";
import { ScoreHistory } from "@/components/resume/ScoreHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2 } from "lucide-react";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { supabase } from "@/integrations/supabase/client";
import { ScoreData } from "@/types/resume";

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
              <CardContent className="space-y-8 pt-6">
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
