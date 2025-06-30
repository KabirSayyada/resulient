
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Zap, Target, Brain, Sparkles, CheckCircle } from "lucide-react";

interface JobOptimizationAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const JobOptimizationAnimation = ({ isVisible, onComplete }: JobOptimizationAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: FileText, text: "Analyzing job requirements", color: "text-blue-500" },
    { icon: Brain, text: "Loading your highest scoring resume", color: "text-purple-500" },
    { icon: Target, text: "Matching skills and experience", color: "text-green-500" },
    { icon: Zap, text: "Preparing optimization engine", color: "text-orange-500" },
    { icon: Sparkles, text: "Setting up personalized analysis", color: "text-pink-500" },
    { icon: CheckCircle, text: "Ready for optimization!", color: "text-emerald-500" }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const totalDuration = 20000; // 20 seconds
    const stepDuration = totalDuration / steps.length;
    let progressInterval: NodeJS.Timeout;
    let stepInterval: NodeJS.Timeout;

    // Progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (totalDuration / 100));
        return Math.min(newProgress, 100);
      });
    }, 100);

    // Step animation
    stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= steps.length) {
          clearInterval(stepInterval);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return prev;
        }
        return nextStep;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isVisible, onComplete, steps.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 p-8 bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl">
        <div className="text-center space-y-8">
          {/* Main Icon with Pulse Effect */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-30"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            <div className="relative z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center">
              {steps[currentStep] && (
                <steps[currentStep].icon className={`h-6 w-6 ${steps[currentStep].color}`} />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-white/80">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Preparing Your Resume Optimization
            </h3>
            
            {steps[currentStep] && (
              <div className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <steps[currentStep].icon className={`h-5 w-5 ${steps[currentStep].color} animate-pulse`} />
                <span className="text-white font-medium">
                  {steps[currentStep].text}
                </span>
              </div>
            )}
          </div>

          {/* Steps Indicator */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 -left-6 w-4 h-4 bg-pink-500/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>
      </Card>
    </div>
  );
};
