import { Button } from "@/components/ui/button";
import { FileDown, FileText, Facebook, Twitter, Linkedin, FileType } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import html2canvas from "html2canvas";
import { generatePDFFromElement, handleDownloadTextReport } from "@/utils/reportGenerationUtils";
import { ScoreData } from "@/types/resume";
import { exportElementAsImage } from "@/utils/imageExportUtils";
import React, { useState } from "react";
import { DownloadReportButton } from "./DownloadReportButton"; // ADD this for "Full Report (PDF)"

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

  // Share to Social Media: Capture scorecard image and include in post/share
  const handleShare = async (platform: "linkedin" | "facebook" | "twitter") => {
    if (!scoreCardRef.current) return;
    try {
      toast({
        title: "Preparing Scorecard",
        description: "Creating image for sharing...",
      });
      const card = scoreCardRef.current;
      // Ensure all images in the card are loaded & crossOrigin set
      const images = Array.from(card.querySelectorAll('img'));
      for (const img of images) {
        img.setAttribute('crossorigin', 'anonymous');
        if (!img.complete) {
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
      }
      const canvas = await html2canvas(card, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc: Document) => {
          // Force gradient backgrounds to appropriate color
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

      // Web Share API with file if possible
      if ((navigator as any).canShare && (navigator as any).canShare({ files: [] })) {
        const blob = await (await fetch(img)).blob();
        const file = new File([blob], "resume-scorecard.png", { type: "image/png" });
        await (navigator as any).share({
          files: [file],
          title: "Check out my resume scorecard!",
          text: "Check out my resume scorecard from Resulient! How does yours compare?",
          url: "https://resulient.com/"
        });
        return;
      }

      // Fallback: Open social URLs with image in clipboard or instruct user to paste
      let shareUrl = "";
      const shareText = "Check out my resume scorecard from Resulient! 🚀 How does yours compare?";
      const shareImage = "/lovable-uploads/f9fefb3b-54f2-4f28-bf70-dc66aa84e9e0.png"; // Use the new image for sharing
      
      if (platform === "linkedin") {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
      } else if (platform === "twitter") {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`;
      } else if (platform === "facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
      }

      // Try to copy image to clipboard for pasting
      if (navigator.clipboard && (window as any).ClipboardItem) {
        const blob = await (await fetch(img)).blob();
        const clipboardItem = new (window as any).ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        toast({
          title: "Image Copied!",
          description: "Your scorecard image has been copied. Paste it in your post on the social platform tab that opens.",
        });
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
      {/* Encouragement message for sharing, always visible above export/share buttons */}
      <div className="mb-4 bg-fuchsia-100 border border-fuchsia-200 px-3 py-2 rounded text-sm text-fuchsia-800 flex flex-col gap-1 sm:flex-row sm:items-center justify-between">
        <span>
          <span className="font-medium">Why share your scorecard?</span> Sharing your scorecard on social media helps you stand out to employers, demonstrates your commitment to personal growth, and encourages your friends to level up their resumes too. Add the photo with your post to boost engagement!
        </span>
      </div>
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
        {/* REMOVE Scorecard PDF option */}
        {/* {PDF export disabled as requested} */}
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
      {/* Button for exporting full report PDF (add below all other export options) */}
      <DownloadReportButton 
        title="Download Full Report (PDF)"
        onClick={handleFullReportDownload} 
      />
    </div>
  );
};
