
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Facebook, Twitter, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResumeActionsProps {
  scoreCardRef: React.RefObject<HTMLDivElement>;
  completeReportRef: React.RefObject<HTMLDivElement>;
}

export const ResumeActions = ({ scoreCardRef, completeReportRef }: ResumeActionsProps) => {
  const { toast } = useToast();

  const handlePDFDownload = async () => {
    if (!scoreCardRef.current) return;
    const card = scoreCardRef.current;

    card.style.display = "block";
    const canvas = await html2canvas(card, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = Math.min(400, pageWidth - 40);
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    pdf.addImage(imgData, "PNG", (pageWidth - imgWidth) / 2, 40, imgWidth, imgHeight);
    pdf.save(`resume-scorecard-${new Date().toISOString().split("T")[0]}.pdf`);

    card.style.display = "";
  };

  const handleCompleteReportDownload = async () => {
    if (!completeReportRef.current) return;
    
    const report = completeReportRef.current;
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
    
    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft > 0) {
      position = position - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`complete-resume-analysis-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleShare = async (platform: "linkedin" | "facebook" | "twitter") => {
    if (!scoreCardRef.current) return;
    const card = scoreCardRef.current;
    const canvas = await html2canvas(card, { scale: 2 });
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
      } catch (e) {
        // fallback to custom share
      }
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
  };

  return (
    <div className="absolute top-0 right-0 m-4 z-10 flex gap-2 items-center">
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handlePDFDownload}
        className="font-semibold"
      >
        <FileDown className="mr-2 h-4 w-4" /> Scorecard
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleCompleteReportDownload}
        className="font-semibold text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100"
      >
        <FileText className="mr-2 h-4 w-4" /> Complete Report
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
  );
};
