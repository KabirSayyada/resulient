
import { useState } from "react";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { FileUploadSection } from "./FileUploadSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResumeScoringFormProps {
  scoringMode: "jobDescription" | "resumeOnly";
  setScoringMode: (mode: "jobDescription" | "resumeOnly") => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  resumeContent: string;
  setResumeContent: (content: string) => void;
  isScoring: boolean;
  onScore: () => void;
}

export const ResumeScoringForm = ({
  scoringMode,
  setScoringMode,
  jobDescription,
  setJobDescription,
  resumeContent,
  setResumeContent,
  isScoring,
  onScore,
}: ResumeScoringFormProps) => {
  const { toast } = useToast();
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={() => setScoringMode("jobDescription")}
          className={`px-6 py-2 rounded-full font-bold border transition-all shadow-sm
            ${scoringMode === "jobDescription"
              ? "bg-indigo-600 text-white border-indigo-700"
              : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"}
          `}
        >
          Score with Job Description
        </button>
        <button
          onClick={() => setScoringMode("resumeOnly")}
          className={`px-6 py-2 rounded-full font-bold border transition-all shadow-sm
            ${scoringMode === "resumeOnly"
              ? "bg-fuchsia-500 text-white border-fuchsia-600"
              : "bg-white text-fuchsia-600 border-fuchsia-200 hover:bg-fuchsia-50"}
          `}
        >
          Score Resume Only
        </button>
      </div>
      {scoringMode === "jobDescription" && (
        <JobDescriptionInput
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
        />
      )}
      <FileUploadSection
        resumeContent={resumeContent}
        setResumeContent={setResumeContent}
      />
      <div className="flex justify-center">
        <Button
          onClick={onScore}
          disabled={
            isScoring ||
            !resumeContent ||
            (scoringMode === "jobDescription" && !jobDescription)
          }
          className={`px-10 py-3 text-lg font-bold rounded-full shadow transition-all ${
            scoringMode === "resumeOnly"
              ? "bg-gradient-to-r from-fuchsia-500 to-indigo-400 hover:from-fuchsia-600 hover:to-indigo-500"
              : "bg-gradient-to-r from-indigo-600 to-fuchsia-500 hover:from-indigo-700 hover:to-fuchsia-600"
          }`}
        >
          {isScoring ? "Analyzing..." : (
            scoringMode === "resumeOnly" ? "🕹️ Benchmark Resume" : "✨ Analyze Resume"
          )}
        </Button>
      </div>
      {scoringMode === "resumeOnly" && (
        <div className="text-xs text-fuchsia-600 mt-2 font-medium border-l-4 border-fuchsia-400 pl-2">
          In <span className="font-bold">Resume Only</span> mode, your resume will be analyzed against estimated industry standards—no job description needed! You’ll see where you stand versus your competition and get skills to pursue.
        </div>
      )}
    </div>
  );
};
