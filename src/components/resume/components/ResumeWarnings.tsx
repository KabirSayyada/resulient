
import { AlertTriangle } from "lucide-react";
import React from "react";

interface ResumeWarningsProps {
  completenessWarning?: string | null;
  missingOrLowSections?: string[];
  eliteIndicators?: string[];
}

export const ResumeWarnings: React.FC<ResumeWarningsProps> = ({
  completenessWarning,
  missingOrLowSections,
  eliteIndicators
}) => {
  if (!completenessWarning && !missingOrLowSections?.length && !eliteIndicators?.length) {
    return null;
  }

  return (
    <>
      {completenessWarning && (
        <div className="w-full mt-1 mb-2">
          <div className="text-xs font-semibold text-red-700 bg-red-50 p-3 rounded-md border border-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Critical Issue:</strong> {completenessWarning}
            </span>
          </div>
        </div>
      )}
      
      {missingOrLowSections && missingOrLowSections.length > 0 && !completenessWarning && (
        <div className="w-full mt-1 mb-2">
          <div className="text-xs font-semibold text-red-700 bg-red-50 p-2 rounded-md border border-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>
              Missing or underdeveloped sections: {missingOrLowSections.join(", ")}
            </span>
          </div>
        </div>
      )}

      {eliteIndicators && eliteIndicators.length > 0 && (
        <div className="w-full mt-1 mb-2">
          <div className="text-xs font-semibold text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
            Notable achievements detected: {eliteIndicators.join(", ")}
          </div>
        </div>
      )}
    </>
  );
};
