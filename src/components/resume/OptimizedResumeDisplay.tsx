
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
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";
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
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleOptimizedResumeDownload = () => {
    try {
      setIsDownloading(true);
      
      toast({
        title: "Preparing Your Resume",
        description: "Generating your ATS-optimized resume in text format...",
      });

      // Format the resume content for text download
      const formattedContent = formatResumeForTextDownload(formattedResumeContent);
      
      // Create and download the text file
      const blob = new Blob([formattedContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `optimized-resume-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Resume Downloaded Successfully!",
        description: "Your ATS-optimized resume has been downloaded as a text file with proper formatting.",
      });
      
    } catch (error) {
      console.error('Error downloading optimized resume:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your resume file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
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
                      Get your AI-optimized resume as a clean, properly formatted text file that's perfect for ATS systems and easy to customize
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleOptimizedResumeDownload}
                    disabled={isDownloading}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isDownloading ? (
                      <>
                        <FileText className="h-4 w-4 mr-2 animate-pulse" />
                        Preparing Download...
                      </>
                    ) : (
                      <>
                        <FileDown className="h-4 w-4 mr-2" />
                        Download Resume (.txt)
                      </>
                    )}
                  </Button>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                    <p className="font-medium mb-1">✨ Text Format Benefits:</p>
                    <ul className="space-y-1">
                      <li>• Perfect for ATS systems - 100% readable and parseable</li>
                      <li>• Easy to edit and customize in any text editor</li>
                      <li>• Clean section headers with proper formatting</li>
                      <li>• Copy-paste friendly for job applications</li>
                      <li>• Small file size and universal compatibility</li>
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
