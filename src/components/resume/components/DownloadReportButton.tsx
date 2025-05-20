
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";

interface DownloadReportButtonProps {
  title?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const DownloadReportButton = ({ 
  title = "Download Full Report (PDF)", 
  onClick, 
  disabled = false 
}: DownloadReportButtonProps) => {
  return (
    <div className="mt-4">
      <Button
        variant="default"
        size="lg"
        className="w-full py-6 font-semibold text-lg"
        onClick={onClick}
        disabled={disabled}
      >
        {disabled ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <FileDown className="mr-2 h-5 w-5" />
        )}
        {title}
      </Button>
      <p className="text-xs text-center mt-1 text-muted-foreground">
        Includes detailed analysis and all recommendations
      </p>
    </div>
  );
};
