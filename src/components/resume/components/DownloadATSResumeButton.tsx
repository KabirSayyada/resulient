
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DownloadATSResumeButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const DownloadATSResumeButton = ({ onClick, disabled = false }: DownloadATSResumeButtonProps) => {
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full mt-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400 font-medium"
      onClick={onClick}
      disabled={disabled}
    >
      <FileText className="mr-2 h-5 w-5" />
      Download ATS-Friendly Resume (PDF)
    </Button>
  );
};
