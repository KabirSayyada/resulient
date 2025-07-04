
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { QualificationGap } from "@/types/resume";
import { OptimizedResumeDisplay } from './OptimizedResumeDisplay';

interface ResumeOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  optimizedResume: string;
  jobDescription: string;
  originalResume: string;
  qualificationGaps: QualificationGap[];
  sourceJobData?: any;
}

export const ResumeOptimizationModal = ({ 
  isOpen, 
  onClose, 
  optimizedResume,
  jobDescription,
  originalResume,
  qualificationGaps,
  sourceJobData
}: ResumeOptimizationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-6xl h-[90vh] max-h-[90vh] overflow-y-auto p-0 gap-0 m-2 sm:m-4">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b px-2 sm:px-6 py-2 sm:py-4 flex items-center justify-between z-10">
          <h2 className="text-sm sm:text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-100 truncate pr-2">
            Resume Optimization Results
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-6 min-h-0 flex-1">
          <OptimizedResumeDisplay 
            optimizedResume={optimizedResume}
            jobDescription={jobDescription}
            originalResume={originalResume}
            qualificationGaps={qualificationGaps}
          />
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-8 pt-3 sm:pt-6 border-t px-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-8 text-sm sm:text-base"
            >
              Close
            </Button>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full sm:w-auto px-4 sm:px-8 bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base"
            >
              Optimize Another Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
