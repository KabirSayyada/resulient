
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QualificationGap } from "@/types/resume";
import { QualificationWarnings } from "./components/QualificationWarnings";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { useLocation } from "react-router-dom";
import { AnalysisCards } from "./components/AnalysisCards";
import { ReportHeader } from "./components/ReportHeader";
import { OptimizedResumeContent } from "./components/OptimizedResumeContent";
import { DownloadReportButton } from "./components/DownloadReportButton";
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";
import { ResumeActions } from "./components/ResumeActions";
import { ATSFriendlyResumePdfTemplate } from "./components/ATSFriendlyResumePdfTemplate";
import { 
  formatResumeContent, 
  formatResumeForATS,
  calculateKeywordScore, 
  calculateStructureScore, 
  calculateATSScore,
  generateSuggestions 
} from "@/utils/resumeFormatters";

interface OptimizedResumeDisplayProps {
  optimizedResume: string | any;
  jobDescription?: string;
  originalResume?: string;
  qualificationGaps?: QualificationGap[];
}

export const OptimizedResumeDisplay = ({
  optimizedResume,
  jobDescription,
  originalResume,
  qualificationGaps
}: OptimizedResumeDisplayProps) => {
  const location = useLocation();
  const isAtsOptimizerPage = location.pathname === "/";
  const optimizationReportRef = useRef<HTMLDivElement>(null);
  const pdfExportRef = useRef<HTMLDivElement>(null);
  const atsResumeRef = useRef<HTMLDivElement>(null);

  const handleOptimizationReportDownload = async () => {
    // First prepare a clean version for PDF export
    if (!optimizationReportRef.current || !pdfExportRef.current) return;
    
    // Copy content to the hidden PDF element for clean export
    pdfExportRef.current.innerHTML = optimizationReportRef.current.innerHTML;
    
    // Generate the PDF from the hidden element
    await generatePDFFromElement(
      pdfExportRef.current,
      `resume-optimization-report-${new Date().toISOString().split("T")[0]}.pdf`, 
      false
    );
  };

  if (!optimizedResume) return null;

  const formattedResumeContent = formatResumeContent(optimizedResume);
  const atsFormattedResume = formatResumeForATS(optimizedResume);
  const keywordScore = calculateKeywordScore(formattedResumeContent, jobDescription || "");
  const structureScore = calculateStructureScore(formattedResumeContent);
  const atsScore = calculateATSScore(formattedResumeContent);
  const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);
  const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, formattedResumeContent, jobDescription || "");
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  // Extract job title from job description, if available
  let jobTitle = "";
  if (jobDescription) {
    const titleMatch = jobDescription.match(/^(.*?job title|.*?position|.*?role):?\s*(.*?)$/im);
    if (titleMatch && titleMatch[2]) {
      jobTitle = titleMatch[2].trim().replace(/[^\w\s]/gi, '');
    }
  }

  if (isAtsOptimizerPage) {
    return (
      <>
        <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-6 sm:mt-10 animate-fade-in">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6" ref={optimizationReportRef}>
              <ReportHeader 
                date={formattedDate}
                time={formattedTime}
                overallScore={overallScore}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h2 className="text-lg font-bold text-indigo-800 mb-2 sm:mb-4">Analysis</h2>
                  <AnalysisCards
                    overallScore={overallScore}
                    atsScore={atsScore}
                    keywordScore={keywordScore}
                    structureScore={structureScore}
                  />
                </div>
                
                <div>
                  <h2 className="text-lg font-bold text-indigo-800 mb-2 sm:mb-4">Improvement Suggestions</h2>
                  <ImprovementSuggestions suggestions={suggestions} />
                </div>
              </div>

              {qualificationGaps && qualificationGaps.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <QualificationWarnings qualificationGaps={qualificationGaps} />
                </div>
              )}

              <OptimizedResumeContent content={formattedResumeContent} />
            </div>
            
            <ResumeActions 
              scoreCardRef={optimizationReportRef} 
              completeReportRef={optimizationReportRef}
              atsResumeRef={atsResumeRef}
              scoreData={{
                overallScore,
                keywordRelevance: keywordScore,
                skillsAlignment: keywordScore,  // Using keywordScore as a fallback
                WorkExperience: keywordScore,   // Using keywordScore as a fallback
                Achievements: keywordScore,     // Using keywordScore as a fallback
                EducationQuality: keywordScore, // Using keywordScore as a fallback
                Certifications: keywordScore,   // Using keywordScore as a fallback
                ContentStructure: structureScore,
                Industry: "General",
                percentile: "Top 10%",
                numSimilarResumes: 1000,
                suggestedSkills: suggestions.length > 0 ? suggestions.map(s => s.split(":")[0].trim()) : [],
                eliteIndicatorsFound: [],
                improvementTips: suggestions,
                missingQualifications: [],
                timestamp: `${formattedDate} ${formattedTime}`,
                id: "local-" + Date.now().toString(),
                scoringMode: "resumeOnly"
              }}
              optimizedResume={formattedResumeContent}
            />
          </CardContent>
        </Card>
        
        {/* Hidden element for PDF export */}
        <div 
          ref={pdfExportRef} 
          className="fixed left-[-9999px] top-0 z-[-1] bg-white p-8 print-export"
          style={{ width: "800px" }}
        ></div>

        {/* Hidden element for ATS-friendly resume PDF export */}
        <div 
          ref={atsResumeRef} 
          className="fixed left-[-9999px] top-0 z-[-1] bg-white print-export"
          style={{ width: "800px" }}
        >
          <ATSFriendlyResumePdfTemplate 
            content={atsFormattedResume}
            jobTitle={jobTitle}
          />
        </div>
      </>
    );
  }

  return (
    <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-6 sm:mt-10 animate-fade-in">
      <CardContent className="p-4 sm:p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Resume Score</h2>
          <div className="font-bold text-2xl">{overallScore}/100</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedResumeDisplay;
