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
import { QualificationGap } from "@/types/resume";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { OptimizationHistory } from "@/components/resume/OptimizationHistory";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { 
  calculateKeywordScore, 
  calculateStructureScore, 
  calculateATSScore,
  generateSuggestions 
} from "@/utils/resumeFormatters";
import { LegalFooter } from "@/components/layout/LegalFooter";

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

        {/* NEW: About section, styled and responsive */}
        <div className="bg-gradient-to-br from-fuchsia-50 via-indigo-50 to-yellow-50 rounded-xl border border-indigo-100 shadow-md px-4 py-5 mb-5 sm:mb-8 sm:px-6 mx-auto max-w-2xl text-center">
          <p className="text-lg sm:text-xl font-semibold text-indigo-900 leading-snug mb-2">
            <span className="text-fuchsia-700 font-bold">Resulient</span> is on a mission to make your resume shine&nbsp;
            <span className="hidden sm:inline">—</span>
            <span className="block sm:inline text-base sm:text-lg font-normal text-indigo-700">
              We give everyone a fighting chance against unfair machines and "black box" ATS gatekeepers.
            </span>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Upload your resume and the job description — we help you stand out, get noticed, and get hired, no matter what automated system tries to stop you.
          </p>
        </div>
        {/* End About section */}

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
            <OptimizationHistory userId={user?.id} />
          </div>
        </div>

        <MainNavigation />

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
      <div className="mt-8">
        <LegalFooter />
      </div>
    </div>
  );
};

export default Index;
