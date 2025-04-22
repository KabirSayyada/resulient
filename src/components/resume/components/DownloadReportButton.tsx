
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DownloadReportButtonProps {
  onClick: () => void;
}

export const DownloadReportButton = ({ onClick }: DownloadReportButtonProps) => {
  return (
    <div className="flex justify-center mt-8">
      <Button 
        size="lg"
        onClick={onClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-3"
      >
        <FileText className="h-5 w-5" />
        Download Full Report (PDF)
      </Button>
    </div>
  );
};
