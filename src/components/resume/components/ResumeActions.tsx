
import { Button } from "@/components/ui/button";
import { FileDown, FileText, FileType, Download, Share2, Sparkles, Gift, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import html2canvas from "html2canvas";
import { generatePDFFromElement, handleDownloadTextReport } from "@/utils/reportGenerationUtils";
import { ScoreData } from "@/types/resume";
import { exportElementAsImage } from "@/utils/imageExportUtils";
import React, { useState } from "react";
import { DownloadReportButton } from "./DownloadReportButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResumeActionsProps {
  scoreCardRef: React.RefObject<HTMLDivElement>;
  completeReportRef: React.RefObject<HTMLDivElement>;
  scoreData?: ScoreData;
}

export const ResumeActions = ({ scoreCardRef, completeReportRef, scoreData }: ResumeActionsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showShareMessage, setShowShareMessage] = useState(true);

  // Download Scorecard as Image (PNG)
  const handleImageDownload = async () => {
    if (!scoreCardRef.current) return;

    toast({
      title: "Preparing Image",
      description: "Rendering a high-quality image of your scorecard...",
    });

    const success = await exportElementAsImage(
      scoreCardRef.current,
      `resume-scorecard-${new Date().toISOString().split("T")[0]}.png`
    );

    if (success) {
      toast({
        title: "Scorecard Image Downloaded",
        description: "Your scorecard has been downloaded as an image (PNG).",
      });
    } else {
      toast({
        title: "Image Download Failed",
        description: "There was an error downloading your scorecard as an image.",
        variant: "destructive",
      });
    }
  };

  // Download Text Report
  const handleTextReportDownload = () => {
    if (scoreData) {
      handleDownloadTextReport(scoreData);
      toast({
        title: "Text Report Downloaded",
        description: "Your text report has been downloaded for better compatibility",
      });
    }
  };

  // Download FULL REPORT as PDF
  const handleFullReportDownload = async () => {
    if (!completeReportRef.current) return;
    toast({
      title: "Preparing PDF",
      description: "Exporting your complete resume analysis as a PDF. Hang tight!",
    });

    const success = await generatePDFFromElement(
      completeReportRef.current,
      `resume-full-report-${new Date().toISOString().split("T")[0]}.pdf`,
      false // Multi-page PDF for full report
    );

    if (success) {
      toast({
        title: "Full Report PDF Downloaded",
        description: "Your full analysis has been downloaded as PDF.",
      });
    } else {
      toast({
        title: "PDF Export Failed",
        description: "There was an error downloading your full analysis as PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 dark:from-blue-950/50 dark:via-purple-950/40 dark:to-pink-950/50 rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-800/10 dark:to-purple-800/10 rounded-full -translate-y-16 translate-x-16 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 dark:from-pink-800/10 dark:to-purple-800/10 rounded-full translate-y-12 -translate-x-12 blur-2xl animate-pulse delay-1000"></div>

      <div className="relative z-10 p-6 border-2 border-blue-200/60 dark:border-blue-800/60 rounded-2xl shadow-xl backdrop-blur-sm">
        {/* Enhanced Header Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Export & Share
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                Download your results in multiple formats
              </p>
            </div>
          </div>

          {/* Enhanced Motivation Card */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-2 border-purple-200/60 dark:border-purple-800/60 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 text-xs px-2 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Pro Tip
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                      Why download your scorecard?
                    </p>
                    <p className="text-purple-700 dark:text-purple-400 text-sm leading-relaxed">
                      Track your progress over time as you improve your resume. Share with mentors or career coaches for personalized advice on your journey.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Export Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Export Options</h4>
          </div>

          {/* Enhanced Button Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleImageDownload}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                <span>Scorecard Image</span>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Button>

            {scoreData && (
              <Button 
                onClick={handleTextReportDownload}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <FileType className="h-4 w-4" />
                  <span>Text Report</span>
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Button>
            )}
          </div>

          {/* Enhanced Full Report Button */}
          <div className="pt-2">
            <Button
              onClick={handleFullReportDownload}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-lg">Download Full Report (PDF)</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
