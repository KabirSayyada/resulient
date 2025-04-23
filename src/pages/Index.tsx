
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { FileUploadSection } from "@/components/resume/FileUploadSection";
import { OptimizedResumeDisplay } from "@/components/resume/OptimizedResumeDisplay";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { BarChart2, Award } from "lucide-react";
import { QualificationGap } from "@/types/resume";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { OptimizationHistory } from "@/components/resume/OptimizationHistory";
import { 
  calculateKeywordScore, 
  calculateStructureScore, 
  calculateATSScore,
  generateSuggestions 
} from "@/utils/resumeFormatters";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [qualificationGaps, setQualificationGaps] = useState<QualificationGap[]>([]);
  const [optimizing, setOptimizing] = useState(false);

  const { callFunction, loading: functionLoading, error: functionError } = useSupabaseFunction();
  const { saveOptimization } = useResumeOptimizationHistory(user?.id);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleOptimizeResume = async () => {
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
        description: "Please paste the job description to optimize against.",
        variant: "destructive",
      });
      return;
    }

    setOptimizing(true);

    try {
      const response = await callFunction("optimize-resume", {
        jobDescription,
        resumeContent,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      setOptimizedResume(response.optimizedResume);
      setQualificationGaps(response.qualificationGaps || []);

      const keywordScore = calculateKeywordScore(response.optimizedResume, jobDescription);
      const structureScore = calculateStructureScore(response.optimizedResume);
      const atsScore = calculateATSScore(response.optimizedResume);
      const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);
      const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, response.optimizedResume, jobDescription);

      await saveOptimization({
        optimizedResume: response.optimizedResume,
        originalResume: resumeContent,
        jobDescription,
        qualificationGaps: response.qualificationGaps || [],
        overallScore,
        keywordScore,
        structureScore,
        atsScore,
        suggestions
      });

      toast({
        title: "Resume Optimized",
        description: "Your resume has been successfully optimized for ATS.",
      });
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize resume",
        variant: "destructive",
      });
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <span className="font-brand text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
              Resulient
            </span>
            <span className="rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-indigo-100 text-indigo-700 shadow border border-indigo-200 animate-fade-in">
              ATS Resume Optimization
            </span>
          </div>
          <UserMenu />
        </div>

        {/* Main functional area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              ATS Resume Optimizer
            </h1>
            <p className="text-gray-600">
              Optimize your resume to beat Applicant Tracking Systems (ATS)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] gap-3 p-4">
                      <li className="row-span-3">
                        <Link
                          to="/resume-scoring"
                          className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-gradient-to-b from-indigo-200 to-blue-100 p-6 no-underline outline-none focus:shadow-md border border-indigo-400 hover:border-indigo-600"
                        >
                          <BarChart2 className="h-7 w-7 text-indigo-600" />
                          <div className="mb-2 mt-4 text-xl font-bold text-indigo-900">
                            Resume Score Analysis
                          </div>
                          <p className="text-md leading-tight text-indigo-800">
                            Analyze your resume before optimizing. Get a gorgeous, actionable scoring breakdown, see improvement history, and compete on the leaderboard!
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-blue-500 mr-2" />
                            <div className="text-sm font-medium leading-none">
                              Resume Optimizer
                            </div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                            Optimize your resume to beat ATS systems
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <OptimizationHistory userId={user?.id} />
          </div>
        </div>

        <div className="gap-6 space-y-8 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <JobDescriptionInput 
              jobDescription={jobDescription} 
              setJobDescription={setJobDescription} 
            />
            <FileUploadSection 
              resumeContent={resumeContent} 
              setResumeContent={setResumeContent} 
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleOptimizeResume} 
              disabled={optimizing || !resumeContent || !jobDescription}
              className="px-7 py-3 text-lg font-bold rounded-full shadow transition-all bg-gradient-to-r from-fuchsia-500 to-indigo-400 hover:from-fuchsia-600 hover:to-indigo-500"
            >
              {optimizing ? "Optimizing..." : "Optimize Resume"}
            </Button>
          </div>
          
          {optimizedResume && (
            <OptimizedResumeDisplay 
              optimizedResume={optimizedResume}
              jobDescription={jobDescription}
              originalResume={resumeContent}
              qualificationGaps={qualificationGaps}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
