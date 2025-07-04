
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GaugeAnimation } from './GaugeAnimation';
import { MotivationalQuoteAnimation } from './MotivationalQuoteAnimation';

interface ResumeScoreAnimationsProps {
  score: number;
  onComplete: () => void;
}

export const ResumeScoreAnimations = ({ score, onComplete }: ResumeScoreAnimationsProps) => {
  const [showGauge, setShowGauge] = useState(true);
  const [showQuote, setShowQuote] = useState(false);

  const handleGaugeComplete = () => {
    console.log("Gauge animation completed");
    setShowGauge(false);
    setShowQuote(true);
  };

  const handleQuoteComplete = () => {
    console.log("Quote animation completed");
    setShowQuote(false);
    onComplete();
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950 dark:via-gray-900 dark:to-blue-950 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-lg mb-8">
      <AnimatePresence mode="wait">
        {/* Gauge Animation */}
        {showGauge && (
          <motion.div
            key="gauge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <GaugeAnimation score={score} onComplete={handleGaugeComplete} />
          </motion.div>
        )}
        
        {/* Motivational Quote Animation */}
        {showQuote && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <MotivationalQuoteAnimation score={score} onComplete={handleQuoteComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
