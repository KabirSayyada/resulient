
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ScoreData } from "@/types/resume";
import { handleDownloadReport } from "@/helpers/resumeReportDownload";
import ResumeScoreCard from "./ResumeScoreCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { Facebook, Linkedin, Twitter, Download, Share, History } from "lucide-react";

interface ScoreResultSectionProps {
  scoreData: ScoreData;
}

export const ScoreResultSection = ({ scoreData }: ScoreResultSectionProps) => {
  const scoreCardRef = useRef<HTMLDivElement | null>(null);

  // Download as PDF
  const handlePDFDownload = async () => {
    if (!scoreCardRef.current) return;
    const card = scoreCardRef.current;

    // Make sure the card is visible for capture
    card.style.display = "block";
    const canvas = await html2canvas(card, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Center image in PDF page
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = Math.min(400, pageWidth - 40);
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    pdf.addImage(imgData, "PNG", (pageWidth - imgWidth) / 2, 40, imgWidth, imgHeight);
    pdf.save(`resume-scorecard-${new Date().toISOString().split("T")[0]}.pdf`);

    // Hide card after capture if needed (restore state)
    card.style.display = "";
  };

  // Download as PNG image (for social/media shares)
  const handlePNGDownload = async () => {
    if (!scoreCardRef.current) return;
    const card = scoreCardRef.current;
    const canvas = await html2canvas(card, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = img;
    a.download = `resume-scorecard-${new Date().toISOString().split("T")[0]}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper for sharing to LinkedIn/Twitter/Facebook
  const handleShare = async (platform: "linkedin" | "facebook" | "twitter") => {
    if (!scoreCardRef.current) return;
    const card = scoreCardRef.current;
    const canvas = await html2canvas(card, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    // Share image using Web Share API or fallback with a message
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
      } catch (e) {
        // fallback to custom share
      }
    }
    // Fallback: open social share links (cannot auto-upload image)
    let shareUrl = "";
    if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.origin
      )}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        "Check out my resume scorecard! 🚀 How does yours compare? "
      )}&url=${encodeURIComponent(window.location.origin)}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.origin
      )}`;
    }
    window.open(shareUrl, "_blank");
  };

  // Check if this was a cached result by examining the id
  // If it was reused, the ID would be an existing UUID from the database
  // rather than a newly generated one that has "newly-generated" prefix
  const isCachedResult = scoreData.id && !scoreData.id.includes("newly-generated");

  return (
    <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-10 animate-fade-in">
      {isCachedResult && (
        <div className="absolute top-0 left-0 m-4 z-10 flex gap-2 items-center">
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <History className="w-3 h-3 mr-1" /> Cached Result
          </div>
        </div>
      )}
      <div className="absolute top-0 right-0 m-4 z-10 flex gap-2 items-center">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handlePDFDownload}
          className="font-semibold"
        >
          <Download className="mr-2 h-4 w-4" /> PDF
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handlePNGDownload}
          className="font-semibold"
        >
          <Share className="mr-2 h-4 w-4" /> PNG
        </Button>
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
      <div className="flex flex-col items-center justify-center py-10">
        {/* Hidden ScoreCard for export, absolutely positioned but visible for capture */}
        <div ref={scoreCardRef} className="fixed left-[-9999px] top-0 z-[-1] bg-white">
          <ResumeScoreCard scoreData={scoreData} />
        </div>
        {/* Visible pretty preview! */}
        <div className="w-full flex items-center justify-center px-2">
          <ResumeScoreCard scoreData={scoreData} />
        </div>
      </div>
      <CardContent>
        <ScoreBreakdown scoreData={scoreData} />
        {scoreData.scoringMode === "resumeOnly" && (
          <div className="mt-8 text-center text-fuchsia-600 text-sm font-semibold">
            You are in the top <span className="font-bold">{scoreData.percentile}%</span> of resumes for <span className="font-bold">{scoreData.Industry}</span>! Compete and improve to climb higher!
          </div>
        )}
      </CardContent>
    </Card>
  );
};
