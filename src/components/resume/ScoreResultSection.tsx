
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ScoreData } from "@/pages/ResumeScoring";
import { handleDownloadReport } from "@/helpers/resumeReportDownload";

interface ScoreResultSectionProps {
  scoreData: ScoreData;
}

export const ScoreResultSection = ({ scoreData }: ScoreResultSectionProps) => {
  return (
    <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-10">
      <div className="absolute top-0 right-0 m-4 z-10">
        <Button variant="secondary" size="sm" onClick={() => handleDownloadReport(scoreData)} className="font-semibold">
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-3xl font-extrabold text-indigo-700 drop-shadow">
            Resume Score Results
          </CardTitle>
          <CardDescription className="text-indigo-600 font-medium">
            Analyzed on {scoreData.timestamp} ({scoreData.scoringMode === "resumeOnly" ? "Resume Only" : "Job Description"})
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ScoreBreakdown scoreData={scoreData} />
        {scoreData.scoringMode === "resumeOnly" && (
          <div className="mt-8 text-center text-fuchsia-600 text-sm font-semibold">
            You are in the top <span className="font-bold">{scoreData.percentile}%</span> of resumes for <span className="font-bold">{scoreData.industry}</span>! Compete and improve to climb higher!
          </div>
        )}
      </CardContent>
    </Card>
  );
};
