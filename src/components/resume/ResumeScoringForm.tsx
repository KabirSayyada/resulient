
import { FileUploadSection } from "./FileUploadSection";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ResumeScoringFormProps {
  scoringMode: "resumeOnly";
  setScoringMode: (mode: "resumeOnly") => void;
  resumeContent: string;
  setResumeContent: (content: string) => void;
  isScoring: boolean;
  onScore: () => void;
}

export const ResumeScoringForm = ({
  resumeContent,
  setResumeContent,
  isScoring,
  onScore,
}: ResumeScoringFormProps) => {
  return (
    <div className="space-y-8">
      <FileUploadSection
        resumeContent={resumeContent}
        setResumeContent={setResumeContent}
      />
      <div className="flex justify-center">
        <Button
          onClick={onScore}
          disabled={isScoring || !resumeContent}
          className="px-10 py-3 text-lg font-bold rounded-full shadow transition-all bg-gradient-to-r from-fuchsia-500 to-indigo-400 hover:from-fuchsia-600 hover:to-indigo-500"
        >
          {isScoring ? "Analyzing..." : "🕹️ Benchmark Resume"}
        </Button>
      </div>
      <div className="text-xs text-fuchsia-600 mt-2 font-medium border-l-4 border-fuchsia-400 pl-2">
        Your resume will be analyzed against estimated industry standards. You'll see where you stand versus your competition and get skills to pursue.
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex gap-2 text-sm">
        <InfoCircledIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-blue-700">
          <p><span className="font-semibold">Note:</span> Scoring the same resume multiple times may produce slightly different scores. This is because your resume is being compared against dynamic industry standards that reflect the overall quality of resumes scored at that time.</p>
        </div>
      </div>
    </div>
  );
};
