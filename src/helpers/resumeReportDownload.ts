
import { ScoreData } from "@/types/resume";
import { handleDownloadTextReport } from "@/utils/reports/textReportGenerator";

export function handleDownloadReport(scoreData: ScoreData) {
  handleDownloadTextReport(scoreData);
}

