
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QualificationGap } from "@/types/resume";
import { QualificationWarnings } from "./components/QualificationWarnings";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { AnalysisCards } from "./components/AnalysisCards";
import { ReportHeader } from "./components/ReportHeader";
import { OptimizedResumeContent } from "./components/OptimizedResumeContent";
import { DownloadReportButton } from "./components/DownloadReportButton";
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

  const handleOptimizationReportDownload = async () => {
    if (!optimizationReportRef.current) return;
    
    const report = optimizationReportRef.current;
    const canvas = await html2canvas(report, { 
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: 1200,
      windowHeight: report.scrollHeight
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    
    let heightLeft = imgHeight;
    let position = 20;
    let pageNumber = 1;
    
    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft > 0) {
      position = position - pageHeight;
      pageNumber++;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`resume-optimization-report-${new Date().toISOString().split("T")[0]}.pdf`);
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
            <DownloadReportButton onClick={handleOptimizationReportDownload} />
          </div>
        </CardContent>
      </Card>
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
