
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface GaugeAnimationProps {
  score: number;
  onComplete: () => void;
}

export const GaugeAnimation = ({ score, onComplete }: GaugeAnimationProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  const [showScore, setShowScore] = useState(false);

  // Calculate rotation angle based on score (0-100 maps to -90 to 90 degrees)
  const rotation = (score / 100) * 180 - 90;

  useEffect(() => {
    if (inView) {
      const animateGauge = async () => {
        // Animate the needle from left to target position
        await controls.start({
          rotate: rotation,
          transition: {
            duration: 2,
            ease: "easeOut",
          },
        });
        
        // Show score number
        setShowScore(true);
        
        // Wait a bit then complete
        setTimeout(() => {
          onComplete();
        }, 1000);
      };
      
      animateGauge();
    }
  }, [inView, controls, rotation, onComplete]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  const getGradientStops = () => {
    return [
      { offset: "0%", color: "#EF4444" },
      { offset: "50%", color: "#F59E0B" },
      { offset: "100%", color: "#10B981" }
    ];
  };

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Gauge Background */}
        <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-xl">
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {getGradientStops().map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
          
          {/* Gauge arc background */}
          <path
            d="M 50 150 A 100 100 0 0 1 250 150"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Colored gauge arc */}
          <path
            d="M 50 150 A 100 100 0 0 1 250 150"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Center circle */}
          <circle
            cx="150"
            cy="150"
            r="15"
            fill="#374151"
            className="drop-shadow-md"
          />
          
          {/* Animated needle */}
          <motion.line
            x1="150"
            y1="150"
            x2="150"
            y2="70"
            stroke={getScoreColor(score)}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ transformOrigin: "150px 150px" }}
            initial={{ rotate: -90 }}
            animate={controls}
            className="drop-shadow-lg"
          />
          
          {/* Needle tip */}
          <motion.circle
            cx="150"
            cy="70"
            r="6"
            fill={getScoreColor(score)}
            style={{ transformOrigin: "150px 150px" }}
            initial={{ rotate: -90 }}
            animate={controls}
            className="drop-shadow-md"
          />
        </svg>
        
        {/* Score labels */}
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4 text-sm font-semibold text-gray-600">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        
        {/* Animated score display */}
        {showScore && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white rounded-full shadow-xl border-4 border-indigo-200 px-6 py-4">
              <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
                {score}
              </div>
              <div className="text-sm text-gray-600 text-center">Score</div>
            </div>
          </motion.div>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <h3 className="text-2xl font-bold text-indigo-900 mb-2">
          Resume Analysis Complete!
        </h3>
        <p className="text-indigo-600">
          Your resume has been benchmarked against industry standards
        </p>
      </motion.div>
    </div>
  );
};
