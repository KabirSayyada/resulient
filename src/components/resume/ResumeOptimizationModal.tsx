
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">
            Resume Optimization Results
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <OptimizedResumeDisplay 
            optimizedResume={optimizedResume}
            jobDescription={jobDescription}
            originalResume={originalResume}
            qualificationGaps={qualificationGaps}
          />
          
          {/* Action buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-8"
            >
              Close
            </Button>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 bg-indigo-600 hover:bg-indigo-700"
            >
              Optimize Another Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
