
import { ScoreData } from "@/pages/ResumeScoring";

export function handleDownloadReport(scoreData: ScoreData) {
  if (!scoreData) return;
  const reportContent = `
RESUME SCORING REPORT
---------------------
Date: ${scoreData.timestamp}

OVERALL SCORE: ${scoreData.overallScore}/100
Industry: ${scoreData.Industry}
Percentile: Top ${scoreData.percentile}%

SCORE BREAKDOWN:
- Keyword Relevance: ${scoreData.keywordRelevance}/100
- Skills Alignment: ${scoreData.skillsAlignment}/100
- Work Experience: ${scoreData.WorkExperience}/100
- Content Structure: ${scoreData.ContentStructure}/100
- ATS Readiness: ${scoreData.atsReadiness}/100

SUGGESTED SKILLS TO ADD:
${scoreData.suggestedSkills.join(", ")}

IMPROVEMENT TIPS:
1. Add the suggested skills to your resume if you have experience with them
2. Use more keywords from the job description
3. Structure your resume with clear sections and bullet points
4. Quantify your achievements where possible
5. Use a clean, ATS-friendly format
`;
  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-score-report-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
