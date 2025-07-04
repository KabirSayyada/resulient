
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-indigo-900">
            {isScoring ? "Analyzing Your Resume..." : "Resume Score Results"}
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
          <AnimatePresence mode="wait">
            {/* Scoring in progress */}
            {isScoring && (
              <motion.div
                key="scoring"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-lg text-indigo-700">
                  Please wait while we analyze your resume...
                </p>
                <p className="text-sm text-gray-600 mt-2">
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
              >
                <ScoreResultSection scoreData={scoreData} />
                
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
