
import { FileUploadSection } from "./FileUploadSection";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { OptimizationAnimation } from "./OptimizationAnimation";

interface ResumeScoringFormProps {
  scoringMode: "resumeOnly";
  setScoringMode: (mode: "resumeOnly") => void;
  resumeContent: string;
  setResumeContent: (content: string) => void;
  isScoring: boolean;
  onScore: () => void;
  disableButton?: boolean;
}

export const ResumeScoringForm = ({
  resumeContent,
  setResumeContent,
  isScoring,
  onScore,
  disableButton
}: ResumeScoringFormProps) => {
  const wordCount = resumeContent.trim().split(/\s+/).length;
  const isResumeTooLong = wordCount > 800;

  return (
    <>
      <OptimizationAnimation 
        isOptimizing={isScoring} 
        onComplete={() => {}} 
        mode="scoring"
      />
      
      <div className="space-y-8">
        <FileUploadSection
          resumeContent={resumeContent}
          setResumeContent={setResumeContent}
        />
        
        {isResumeTooLong && (
          <div className="text-red-600 dark:text-red-400 mt-2 font-medium border-l-4 border-red-400 dark:border-red-500 pl-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            Your resume is too long ({wordCount} words). Please shorten it to 800 words or less for optimal scoring.
          </div>
        )}
        
        <div className="flex justify-center">
          <Button
            onClick={onScore}
            disabled={isScoring || !resumeContent || isResumeTooLong || disableButton}
            className="px-10 py-3 text-lg font-bold rounded-full shadow transition-all bg-gradient-to-r from-fuchsia-500 to-indigo-400 hover:from-fuchsia-600 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScoring ? "Analyzing..." : "🕹️ Score My Resume"}
          </Button>
        </div>
        
        <div className="text-xs text-fuchsia-600 dark:text-fuchsia-400 mt-2 font-medium border-l-4 border-fuchsia-400 dark:border-fuchsia-500 pl-2">
          Your resume will be analyzed against estimated industry standards. You'll see where you stand versus your competition and get skills to pursue.
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 flex gap-2 text-sm">
          <InfoCircledIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-blue-700 dark:text-blue-300">
            <p><span className="font-semibold">Note:</span> Scoring the same resume multiple times may produce slightly different scores. This is because your resume is being compared against dynamic industry standards that reflect the overall quality of resumes scored at that time.</p>
          </div>
        </div>
      </div>
    </>
  );
};
