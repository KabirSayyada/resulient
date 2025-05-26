
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { QualificationGap } from "@/types/resume";
import { QualificationWarnings } from "./components/QualificationWarnings";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { useLocation } from "react-router-dom";
import { AnalysisCards } from "./components/AnalysisCards";
import { ReportHeader } from "./components/ReportHeader";
import { OptimizedResumeContent } from "./components/OptimizedResumeContent";
import { DownloadReportButton } from "./components/DownloadReportButton";
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";
import { parseResumeContent } from "@/utils/resumeParser";
import { 
  formatResumeContent, 
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

  const handleOptimizedResumeDownload = async () => {
    try {
      const { generateResumePDFFromContent } = await import('@/utils/resumePdfGenerator');
      
      const success = generateResumePDFFromContent(
        formattedResumeContent,
        `optimized-resume-${new Date().toISOString().split('T')[0]}.pdf`
      );
      
      if (success) {
        console.log('Optimized resume PDF generated successfully');
      } else {
        console.error('Failed to generate optimized resume PDF');
      }
    } catch (error) {
      console.error('Error importing PDF generator:', error);
    }
  };

  if (!optimizedResume) return null;

  const formattedResumeContent = formatResumeContent(optimizedResume);
  const keywordScore = calculateKeywordScore(formattedResumeContent, jobDescription || "");
  const structureScore = calculateStructureScore(formattedResumeContent);
  const atsScore = calculateATSScore(formattedResumeContent);
  const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);
  const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, formattedResumeContent, jobDescription || "");
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

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
              
              {/* Direct Optimized Resume Download */}
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Download Optimized Resume
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get your AI-optimized resume as a clean, ATS-friendly PDF with selectable text
                    </p>
                  </div>
                  <Button 
                    onClick={handleOptimizedResumeDownload}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Resume PDF
                  </Button>
                </div>
              </div>
            </div>
            
            <DownloadReportButton
              title="Download Full Report (PDF)"
              onClick={handleOptimizationReportDownload}
            />
          </CardContent>
        </Card>
        
        {/* Hidden element for PDF export */}
        <div 
          ref={pdfExportRef} 
          className="fixed left-[-9999px] top-0 z-[-1] bg-white p-8 print-export"
          style={{ width: "800px" }}
        ></div>
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
