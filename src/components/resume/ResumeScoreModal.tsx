
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScoreData } from "@/types/resume";
import { ResumeScoreAnimations } from './components/ResumeScoreAnimations';
import { ScoreResultSection } from './ScoreResultSection';
import { OptimizationAnimation } from './OptimizationAnimation';
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
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  // Reset states when modal opens/closes or when scoring starts
  React.useEffect(() => {
    if (isOpen && isScoring) {
      setShowAnimations(false);
      setShowResults(false);
      setOptimizationComplete(false);
    } else if (!isOpen) {
      setShowAnimations(false);
      setShowResults(false);
      setOptimizationComplete(false);
    }
  }, [isOpen, isScoring]);

  const handleOptimizationComplete = () => {
    setOptimizationComplete(true);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      if (scoreData && !isScoring) {
        setShowAnimations(true);
      }
    }, 300);
  };

  const handleAnimationsComplete = () => {
    setShowAnimations(false);
    setShowResults(true);
  };

  return (
    <>
      {/* Optimization Animation - Full Screen Overlay */}
      <OptimizationAnimation
        isOptimizing={isScoring}
        onComplete={handleOptimizationComplete}
        mode="scoring"
      />

      {/* Score Modal - Show when optimization is complete */}
      <Dialog open={isOpen && optimizationComplete} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {/* Header with close button */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-indigo-900">
              Resume Score Results
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
              {/* Animations phase */}
              {showAnimations && scoreData && (
                <motion.div
                  key="animations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
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
                  transition={{ duration: 0.5 }}
                >
                  <ScoreResultSection scoreData={scoreData} skipAnimations={true} />
                  
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
    </>
  );
};
