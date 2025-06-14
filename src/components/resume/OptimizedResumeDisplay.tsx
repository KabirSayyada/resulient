
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { QualificationGap } from "@/types/resume";
import { QualificationWarnings } from "./components/QualificationWarnings";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { useLocation } from "react-router-dom";
import { AnalysisCards } from "./components/AnalysisCards";
import { ReportHeader } from "./components/ReportHeader";
import { OptimizedResumeContent } from "./components/OptimizedResumeContent";
import { DownloadReportButton } from "./components/DownloadReportButton";
import { ResumeTemplateSelector } from "./ResumeTemplateSelector";
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";
import { generateTextFormattedPDF } from "@/utils/textFormattedPdfGenerator";
import { parseOptimizedResumeContent } from "@/utils/resumeContentParser";
import { 
  formatResumeContent, 
  calculateKeywordScore, 
  calculateStructureScore, 
  calculateATSScore,
  generateSuggestions 
} from "@/utils/resumeFormatters";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);

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

  const handleOptimizedResumePdfDownload = async () => {
    try {
      setIsPdfDownloading(true);
      
      toast({
        title: "Preparing PDF Resume",
        description: "Generating your ATS-optimized resume in PDF format...",
      });

      const formattedContent = formatResumeForTextDownload(formattedResumeContent);
      const success = await generateTextFormattedPDF(
        formattedContent,
        `optimized-resume-${new Date().toISOString().split('T')[0]}.pdf`
      );

      if (success) {
        toast({
          title: "PDF Resume Downloaded Successfully!",
          description: "Your ATS-optimized resume has been downloaded as a PDF with professional formatting.",
        });
      } else {
        throw new Error("PDF generation failed");
      }
      
    } catch (error) {
      console.error('Error downloading PDF resume:', error);
      toast({
        title: "PDF Download Failed",
        description: "There was an error generating your PDF resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfDownloading(false);
    }
  };

  const formatResumeForTextDownload = (content: string): string => {
    // Clean up and format the content for better text presentation
    let formatted = content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n');

    // Add proper spacing and formatting for text file
    const sections = formatted.split(/\n\n+/);
    const formattedSections = sections.map(section => {
      const lines = section.split('\n');
      if (lines.length === 0) return '';
      
      // Check if this looks like a section header (all caps, short)
      if (lines[0] && lines[0] === lines[0].toUpperCase() && lines[0].length < 50 && !lines[0].startsWith('•')) {
        return lines[0] + '\n' + '='.repeat(lines[0].length) + '\n' + lines.slice(1).join('\n');
      }
      
      return section;
    });

    return formattedSections.join('\n\n').trim();
  };

  if (!optimizedResume) return null;

  const formattedResumeContent = formatResumeContent(optimizedResume);
  const keywordScore = calculateKeywordScore(formattedResumeContent, jobDescription || "");
  const structureScore = calculateStructureScore(formattedResumeContent);
  const atsScore = calculateATSScore(formattedResumeContent);
  const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);
  const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, formattedResumeContent, jobDescription || "");
  
  // Parse the optimized resume content for template rendering
  const parsedResume = parseOptimizedResumeContent(formattedResumeContent);
  
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
              
              {/* Template Selector for Optimized Resume Download */}
              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Download Your Optimized Resume
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose from professional templates and download your AI-optimized resume in your preferred style.
                  </p>
                </div>
                
                <ResumeTemplateSelector resume={parsedResume} />
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
