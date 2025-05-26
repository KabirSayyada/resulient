import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { QualificationGap } from "@/types/resume";
import { QualificationWarnings } from "./components/QualificationWarnings";
import { ImprovementSuggestions } from "./components/ImprovementSuggestions";
import { useLocation } from "react-router-dom";
import { AnalysisCards } from "./components/AnalysisCards";
import { ReportHeader } from "./components/ReportHeader";
import { OptimizedResumeContent } from "./components/OptimizedResumeContent";
import { DownloadReportButton } from "./components/DownloadReportButton";
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";
import { 
  formatResumeContent, 
  calculateKeywordScore, 
  calculateStructureScore, 
  calculateATSScore,
  generateSuggestions 
} from "@/utils/resumeFormatters";
import { generateEnhancedResumePDF } from "@/utils/enhancedResumePdfGenerator";
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<string>("");

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
      setIsGeneratingPDF(true);
      setPdfProgress("Initializing PDF generation...");
      
      toast({
        title: "Generating Your Resume",
        description: "Please wait while we create your professional ATS-optimized resume PDF...",
      });

      // Step 1: Parse and structure the content
      setPdfProgress("Parsing resume content...");
      await new Promise(resolve => setTimeout(resolve, 500)); // Show progress

      // Step 2: Format sections
      setPdfProgress("Formatting sections and layout...");
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Generate PDF
      setPdfProgress("Generating PDF document...");
      const success = await generateEnhancedResumePDF(
        formattedResumeContent,
        `optimized-resume-${new Date().toISOString().split('T')[0]}.pdf`
      );
      
      if (success) {
        setPdfProgress("Download complete!");
        toast({
          title: "Resume Downloaded Successfully!",
          description: "Your ATS-optimized resume has been downloaded with all sections properly formatted.",
        });
      } else {
        throw new Error('PDF generation failed');
      }
      
    } catch (error) {
      console.error('Error generating optimized resume PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your resume PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress("");
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
              
              {/* Enhanced Optimized Resume Download Section */}
              <div className="mt-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Download Professional Resume
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get your AI-optimized resume as a clean, professional PDF with all sections properly formatted for ATS systems
                    </p>
                  </div>
                  
                  {/* Progress Indicator */}
                  {isGeneratingPDF && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-3">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Creating your resume...
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {pdfProgress}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleOptimizedResumeDownload}
                    disabled={isGeneratingPDF}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileDown className="h-4 w-4 mr-2" />
                        Download Resume PDF
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                    <p className="font-medium mb-1">✨ Premium Features:</p>
                    <ul className="space-y-1">
                      <li>• Professional multi-page layout with proper spacing</li>
                      <li>• All sections included and properly formatted</li>
                      <li>• ATS-friendly structure with selectable text</li>
                      <li>• Clean typography optimized for recruiters</li>
                    </ul>
                  </div>
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
