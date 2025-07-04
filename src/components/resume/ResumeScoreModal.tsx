
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScoreData } from "@/types/resume";
import { ResumeScoreAnimations } from './components/ResumeScoreAnimations';
import { ScoreResultSection } from './ScoreResultSection';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: ScoreData | null;
  isScoring: boolean;
}

export const ResumeScoreModal = ({ 
  isOpen, 
  onClose, 
  scoreData, 
  isScoring 
}: ResumeScoreModalProps) => {
  const [showAnimations, setShowAnimations] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Reset states when modal opens/closes
  React.useEffect(() => {
    if (isOpen && isScoring) {
      setShowAnimations(true);
      setShowResults(false);
    } else if (!isOpen) {
      setShowAnimations(false);
      setShowResults(false);
    }
  }, [isOpen, isScoring]);

  // Show results when scoring is complete and we have data
  React.useEffect(() => {
    if (scoreData && !isScoring && showAnimations) {
      const timer = setTimeout(() => {
        setShowAnimations(false);
        setShowResults(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scoreData, isScoring, showAnimations]);

  const handleAnimationsComplete = () => {
    setShowAnimations(false);
    setShowResults(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto p-0 gap-0 m-2 sm:m-4">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b px-2 sm:px-6 py-2 sm:py-4 flex items-center justify-between z-10">
          <h2 className="text-sm sm:text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-100 truncate pr-2">
            {isScoring ? "Analyzing Your Resume..." : "Resume Score Results"}
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
          <AnimatePresence mode="wait">
            {/* Scoring in progress */}
            {isScoring && (
              <motion.div
                key="scoring"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-6 sm:py-12"
              >
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-sm sm:text-base md:text-lg text-indigo-700 dark:text-indigo-300 px-2">
                  Please wait while we analyze your resume...
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 px-2">
                  This may take a few moments
                </p>
              </motion.div>
            )}

            {/* Animations phase */}
            {showAnimations && scoreData && !isScoring && (
              <motion.div
                key="animations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ResumeScoreAnimations 
                  score={scoreData.overallScore} 
                  onComplete={handleAnimationsComplete}
                />
              </motion.div>
            )}

            {/* Results phase */}
            {showResults && scoreData && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-0"
              >
                <ScoreResultSection scoreData={scoreData} />
                
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
                    Score Another Resume
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
