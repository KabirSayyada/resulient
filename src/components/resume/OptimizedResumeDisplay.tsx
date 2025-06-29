
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, ChevronDown, ChevronUp, BarChart3, AlertTriangle } from "lucide-react";
import { QualificationGap } from "@/types/resume";
import { QualificationWarnings } from "./components/QualificationWarnings";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { useLocation } from "react-router-dom";
import { AnalysisCards } from "./components/AnalysisCards";
import { ReportHeader } from "./components/ReportHeader";
import { OptimizedResumeContent } from "./components/OptimizedResumeContent";
import { DownloadReportButton } from "./components/DownloadReportButton";
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";
import { generateTextFormattedPDF } from "@/utils/textFormattedPdfGenerator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const isAtsOptimizerPage = location.pathname === "/" || location.pathname === "/resume-optimization";
  const optimizationReportRef = useRef<HTMLDivElement>(null);
  const pdfExportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);

  const handleOptimizationReportDownload = async () => {
    if (!optimizationReportRef.current || !pdfExportRef.current) return;
    
    pdfExportRef.current.innerHTML = optimizationReportRef.current.innerHTML;
    
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
    let formatted = content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n');

    const sections = formatted.split(/\n\n+/);
    const formattedSections = sections.map(section => {
      const lines = section.split('\n');
      if (lines.length === 0) return '';
      
      if (lines[0] && lines[0] === lines[0].toUpperCase() && lines[0].length < 50 && !lines[0].startsWith('•')) {
        return lines[0] + '\n' + '='.repeat(lines[0].length) + '\n' + lines.slice(1).join('\n');
      }
      
      return section;
    });

    return formattedSections.join('\n\n').trim();
  };

  if (!optimizedResume) return null;

  const formattedResumeContent = formatResumeContent(optimizedResume);
  
  const keywordScore = Math.max(85, Math.min(100, calculateKeywordScore(formattedResumeContent, jobDescription || "") + 15));
  const structureScore = Math.max(85, Math.min(100, calculateStructureScore(formattedResumeContent) + 10));
  const atsScore = Math.max(85, Math.min(100, calculateATSScore(formattedResumeContent) + 20));
  const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);
  
  const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, formattedResumeContent, jobDescription || "");
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  if (isAtsOptimizerPage) {
    return (
      <>
        <Card className="border-t-8 border-t-emerald-600 shadow-xl bg-gradient-to-bl from-white via-emerald-50 to-green-100 dark:from-gray-800 dark:via-emerald-900/50 dark:to-green-900/50 relative mt-6 sm:mt-10 animate-fade-in">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Header with success indicator */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full text-sm font-medium mb-2">
                  <FileText className="h-4 w-4" />
                  Resume Successfully Optimized
                </div>
                <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">Your ATS-Optimized Resume is Ready!</h2>
                <p className="text-emerald-600 dark:text-emerald-300 text-sm mt-1">Download your professionally formatted resume below</p>
              </div>

              {/* Optimized Resume Content - First Priority */}
              <OptimizedResumeContent content={formattedResumeContent} />
              
              {/* Download Options - Second Priority */}
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Download Your Optimized Resume
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Download your AI-optimized resume as a professionally formatted PDF document.
                  </p>
                </div>
                
                <Button
                  onClick={handleOptimizedResumePdfDownload}
                  disabled={isPdfDownloading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  {isPdfDownloading ? 'Generating PDF...' : 'Download Resume PDF'}
                </Button>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                  <p className="font-medium mb-2">PDF Features:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>ATS-optimized formatting for better parsing</li>
                    <li>Professional typography and spacing</li>
                    <li>Selectable text content for easy copying</li>
                    <li>Consistent section organization</li>
                    <li>Print-friendly layout</li>
                  </ul>
                </div>
              </div>

              {/* Expandable Analysis Report Section */}
              <Collapsible open={showAnalysisReport} onOpenChange={setShowAnalysisReport}>
                <div className="border border-indigo-200 dark:border-indigo-700 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full p-4 justify-between hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <div className="text-left">
                          <h3 className="font-semibold text-indigo-800 dark:text-indigo-200">
                            Resume Analysis Report
                          </h3>
                          <p className="text-sm text-indigo-600 dark:text-indigo-300">
                            View detailed analysis and improvement suggestions
                          </p>
                        </div>
                      </div>
                      {showAnalysisReport ? (
                        <ChevronUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 pt-0 space-y-6" ref={optimizationReportRef}>
                      <ReportHeader 
                        date={formattedDate}
                        time={formattedTime}
                        overallScore={overallScore}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-200 mb-2 sm:mb-4">Analysis</h2>
                          <AnalysisCards
                            overallScore={overallScore}
                            atsScore={atsScore}
                            keywordScore={keywordScore}
                            structureScore={structureScore}
                          />
                        </div>
                        
                        <div>
                          <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-200 mb-2 sm:mb-4">Improvement Suggestions</h2>
                          <ImprovementSuggestions suggestions={suggestions} />
                        </div>
                      </div>

                      <DownloadReportButton
                        title="Download Full Analysis Report (PDF)"
                        onClick={handleOptimizationReportDownload}
                      />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              {/* Expandable Missing Qualifications Section */}
              {qualificationGaps && qualificationGaps.length > 0 && (
                <Collapsible>
                  <div className="border border-amber-200 dark:border-amber-700 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full p-4 justify-between hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          <div className="text-left">
                            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                              Missing Qualifications Review
                            </h3>
                            <p className="text-sm text-amber-600 dark:text-amber-300">
                              {qualificationGaps.length} potential improvement areas identified
                            </p>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="p-4 pt-0">
                        <QualificationWarnings qualificationGaps={qualificationGaps} />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )}
            </div>
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
    <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 dark:from-gray-800 dark:via-indigo-900/50 dark:to-blue-900/50 relative mt-6 sm:mt-10 animate-fade-in">
      <CardContent className="p-4 sm:p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">Resume Score</h2>
          <div className="font-bold text-2xl text-indigo-800 dark:text-indigo-200">{overallScore}/100</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedResumeDisplay;
