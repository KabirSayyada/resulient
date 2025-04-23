
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadReportButtonProps {
  onClick: () => void;
}

export const DownloadReportButton = ({ onClick }: DownloadReportButtonProps) => {
  return (
    <div className="flex justify-center mt-8 w-full">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100 w-full sm:w-auto">
        <div className="text-center mb-2">
          <p className="text-sm text-gray-600">Save this report for your records or to share with others</p>
        </div>
        <Button 
          size="lg"
          onClick={onClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center"
        >
          <Download className="h-5 w-5" />
          Download Full Report (PDF)
        </Button>
      </div>
    </div>
  );
};
