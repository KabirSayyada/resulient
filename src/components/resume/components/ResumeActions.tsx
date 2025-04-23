import { Button } from "@/components/ui/button";
import { FileDown, FileText, Facebook, Twitter, Linkedin, FileType } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import html2canvas from "html2canvas";
import { generatePDFFromElement, handleDownloadTextReport } from "@/utils/reportGenerationUtils";
import { ScoreData } from "@/types/resume";
import { exportElementAsImage } from "@/utils/imageExportUtils";

interface ResumeActionsProps {
  scoreCardRef: React.RefObject<HTMLDivElement>;
  completeReportRef: React.RefObject<HTMLDivElement>;
  scoreData?: ScoreData;
}

export const ResumeActions = ({ scoreCardRef, completeReportRef, scoreData }: ResumeActionsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleCompleteReportDownload = async () => {
    if (!completeReportRef.current) return;

    toast({
      title: "Preparing Report",
      description: "Creating a detailed PDF report...",
    });

    const images = Array.from(completeReportRef.current.querySelectorAll('img'));
    for (const img of images) {
      if (!img.complete) {
        img.setAttribute('crossorigin', 'anonymous');
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          const src = img.src;
          img.src = '';
          img.src = src;
        });
      }
    }

    const success = await generatePDFFromElement(
      completeReportRef.current,
      `complete-resume-analysis-${new Date().toISOString().split("T")[0]}.pdf`,
      false // multi-page for complete reports
    );

    if (success) {
      toast({
        title: "Report Downloaded",
        description: "Your complete report has been downloaded as a PDF",
      });
    } else {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your report",
        variant: "destructive",
      });
    }
  };

  const handleTextReportDownload = () => {
    if (scoreData) {
      handleDownloadTextReport(scoreData);
      toast({
        title: "Text Report Downloaded",
        description: "Your text report has been downloaded for better compatibility",
      });
    }
  };

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

  const handleShare = async (platform: "linkedin" | "facebook" | "twitter") => {
    if (!scoreCardRef.current) return;
    try {
      toast({
        title: "Preparing Scorecard",
        description: "Creating image for sharing...",
      });
      const card = scoreCardRef.current;
      const images = Array.from(card.querySelectorAll('img'));
      for (const img of images) {
        if (!img.complete) {
          img.setAttribute('crossorigin', 'anonymous');
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            const src = img.src;
            img.src = '';
            img.src = src;
          });
        }
      }
      const canvas = await html2canvas(card, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc: Document) => {
          const gradientElements = clonedDoc.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-br');
          gradientElements.forEach(el => {
            (el as HTMLElement).style.backgroundColor = '#9b87f5';
          });
          const headerElements = clonedDoc.querySelectorAll('.scorecard-for-export .from-indigo-400');
          headerElements.forEach(el => {
            (el as HTMLElement).style.backgroundColor = '#9b87f5';
          });
          const allImages = clonedDoc.querySelectorAll('img');
          allImages.forEach(img => {
            img.setAttribute('crossorigin', 'anonymous');
            (img as HTMLElement).style.display = 'block';
            (img as HTMLElement).style.visibility = 'visible';
            (img as HTMLElement).style.opacity = '1';
          });
        }
      });
      const img = canvas.toDataURL("image/png");
      if ((navigator as any).canShare && (navigator as any).canShare({ files: [] })) {
        try {
          const blob = await (await fetch(img)).blob();
          const file = new File([blob], "resume-scorecard.png", { type: "image/png" });
          await (navigator as any).share({
            files: [file],
            title: "Check out my resume scorecard!",
            text: "Check out my resume scorecard! How does yours compare?",
          });
          return;
        } catch (e) { }
      }

      let shareUrl = "";
      if (platform === "linkedin") {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
      } else if (platform === "twitter") {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my resume scorecard! 🚀 How does yours compare? ")}&url=${encodeURIComponent(window.location.origin)}`;
      } else if (platform === "facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
      }
      window.open(shareUrl, "_blank");
      toast({
        title: "Sharing",
        description: `Opening ${platform} to share your scorecard`,
      });
    } catch (error) {
      toast({
        title: "Sharing Failed",
        description: "There was an error sharing your scorecard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 shadow-sm">
      <h3 className="text-sm font-medium text-indigo-800 mb-3">Export Options</h3>
      <div className={`flex ${isMobile ? 'flex-wrap' : ''} gap-2 items-center`}>
        <Button
          variant="secondary"
          size={isMobile ? "sm" : "default"}
          onClick={handleImageDownload}
          className="font-semibold text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100"
        >
          <FileDown className="mr-2 h-4 w-4" /> Scorecard (Image)
        </Button>
        <Button 
          variant="secondary" 
          size={isMobile ? "sm" : "default"}
          onClick={handleCompleteReportDownload}
          className="font-semibold text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100"
        >
          <FileText className="mr-2 h-4 w-4" /> Complete Report
        </Button>
        {scoreData && (
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={handleTextReportDownload}
            className="font-semibold text-gray-700"
          >
            <FileType className="mr-2 h-4 w-4" /> Text Report
          </Button>
        )}
        <div className={`${isMobile ? 'w-full mt-2' : 'ml-auto'} flex gap-1`}>
          <span className="text-xs text-gray-500 mr-2 self-center hidden sm:inline-block">Share:</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleShare("linkedin")}
            aria-label="Share to LinkedIn"
            className="hover:bg-blue-100"
          >
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleShare("twitter")}
            aria-label="Share to Twitter"
            className="hover:bg-blue-50"
          >
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleShare("facebook")}
            aria-label="Share to Facebook"
            className="hover:bg-blue-50"
          >
            <Facebook className="h-5 w-5 text-[#1877F3]" />
          </Button>
        </div>
      </div>
    </div>
  );
};
