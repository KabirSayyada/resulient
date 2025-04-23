
import { ScoreData } from "@/types/resume";
import { handleDownloadTextReport } from "@/utils/reportGenerationUtils";

export function handleDownloadReport(scoreData: ScoreData) {
  handleDownloadTextReport(scoreData);
}
