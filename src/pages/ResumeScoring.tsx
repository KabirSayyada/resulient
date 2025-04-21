
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

export interface ScoreData {
  overall: number;
  keywordRelevance: number;
  skillsBreadth: number;
  experienceDuration: number;
  contentStructure: number;
  atsReadiness: number;
  industry: string;
  percentile: number;
  suggestedSkills: string[];
  timestamp: string;
  id: string;
}

const ResumeScoring = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
        .from('resume_scores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setScoreHistory(data.map(item => ({
          ...item,
          overall: item.overall_score,
          keywordRelevance: item.keyword_relevance,
          skillsBreadth: item.skills_breadth,
          experienceDuration: item.experience_duration,
          contentStructure: item.content_structure,
          atsReadiness: item.ats_readiness,
          suggestedSkills: item.suggested_skills || [],
          percentile: item.percentile,
          timestamp: new Date(item.created_at).toLocaleString(),
          id: item.id
        })));
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

    if (!jobDescription) {
      toast({
        title: "Missing Job Description",
        description: "Please paste the job description to score against.",
        variant: "destructive",
      });
      return;
    }

    setIsScoring(true);
    
    try {
      const response = await callFunction("score-resume", {
        jobDescription,
        resumeContent,
      });
      
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
        industry: response.industry,
        percentile: response.percentile,
        suggestedSkills: response.suggestedSkills || [],
        timestamp: new Date().toLocaleString(),
        id: crypto.randomUUID()
      };
      
      setScoreData(newScoreData);
      setScoreHistory([newScoreData, ...scoreHistory]);
      
      // Save to database
      const { error } = await supabase
        .from('resume_scores')
        .insert({
          user_id: user?.id,
          overall_score: newScoreData.overall,
          keyword_relevance: newScoreData.keywordRelevance,
          skills_breadth: newScoreData.skillsBreadth,
          experience_duration: newScoreData.experienceDuration,
          content_structure: newScoreData.contentStructure,
          ats_readiness: newScoreData.atsReadiness,
          industry: newScoreData.industry,
          percentile: newScoreData.percentile,
          suggested_skills: newScoreData.suggestedSkills,
          resume_content: resumeContent,
          job_description: jobDescription
        });

      if (error) {
        console.error("Error saving score:", error);
      }
      
      toast({
        title: "Resume Scored",
        description: "Your resume has been analyzed for ATS compatibility.",
      });
    } catch (error) {
      console.error("Error scoring resume:", error);
      toast({
        title: "Scoring Failed",
        description: error instanceof Error ? error.message : "Failed to score resume",
        variant: "destructive",
      });
    } finally {
      setIsScoring(false);
    }
  };

  const handleDownloadReport = () => {
    if (!scoreData) return;
    
    const reportContent = `
    RESUME SCORING REPORT
    ---------------------
    Date: ${scoreData.timestamp}
    
    OVERALL SCORE: ${scoreData.overall}/100
    Industry: ${scoreData.industry}
    Percentile: Top ${scoreData.percentile}%
    
    SCORE BREAKDOWN:
    - Keyword Relevance: ${scoreData.keywordRelevance}/100
    - Skills Breadth: ${scoreData.skillsBreadth}/100
    - Experience Duration: ${scoreData.experienceDuration}/100
    - Content Structure: ${scoreData.contentStructure}/100
    - ATS Readiness: ${scoreData.atsReadiness}/100
    
    SUGGESTED SKILLS TO ADD:
    ${scoreData.suggestedSkills.join(', ')}
    
    IMPROVEMENT TIPS:
    1. Add the suggested skills to your resume if you have experience with them
    2. Use more keywords from the job description
    3. Structure your resume with clear sections and bullet points
    4. Quantify your achievements where possible
    5. Use a clean, ATS-friendly format
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-score-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resume Score Analyzer
            </h1>
            <p className="text-gray-600">
              Get detailed insights on how your resume stacks up against industry standards
            </p>
          </div>
          <UserMenu />
        </div>

        <Tabs defaultValue="current" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="current">New Analysis</TabsTrigger>
            <TabsTrigger value="history">Score History</TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Resume</CardTitle>
                <CardDescription>
                  Upload your resume and the job description to get a detailed score analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <JobDescriptionInput 
                  jobDescription={jobDescription} 
                  setJobDescription={setJobDescription} 
                />
                
                <FileUploadSection 
                  resumeContent={resumeContent} 
                  setResumeContent={setResumeContent} 
                />
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleScoreResume} 
                    disabled={isScoring || !resumeContent || !jobDescription}
                    className="px-6 py-2 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isScoring ? "Analyzing..." : "Analyze Resume"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {scoreData && (
              <div className="mt-8">
                <Card className="border-t-4 border-t-blue-500">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Resume Score Results</CardTitle>
                      <CardDescription>
                        Analyzed on {scoreData.timestamp}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                      <Download className="mr-2 h-4 w-4" /> Download Report
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScoreBreakdown scoreData={scoreData} />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {scoreHistory.length > 0 ? (
              <ScoreHistory scores={scoreHistory} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <BarChart2 className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Score History</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    You haven't analyzed any resumes yet. Start by uploading your resume and a job description to get insights.
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
