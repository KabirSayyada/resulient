
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Target, 
  Brain, 
  Search, 
  CheckCircle, 
  Sparkles,
  FileText,
  BarChart3,
  Rocket,
  TrendingUp
} from "lucide-react";

interface OptimizationAnimationProps {
  isOptimizing: boolean;
  onComplete?: () => void;
}

const optimizationStages = [
  {
    icon: FileText,
    title: "Analyzing Resume",
    description: "Parsing your experience and skills",
    duration: 2000,
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Search,
    title: "Processing Job Description",
    description: "Identifying key requirements and keywords",
    duration: 1800,
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Brain,
    title: "AI Optimization Engine",
    description: "Matching your profile to job requirements",
    duration: 2200,
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Target,
    title: "ATS Compatibility Check",
    description: "Ensuring maximum ATS pass-through rate",
    duration: 1500,
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "Performance Analysis",
    description: "Calculating optimization scores",
    duration: 1200,
    color: "from-orange-500 to-amber-500"
  },
  {
    icon: Sparkles,
    title: "Final Polish",
    description: "Adding finishing touches",
    duration: 1000,
    color: "from-violet-500 to-purple-500"
  }
];

export const OptimizationAnimation: React.FC<OptimizationAnimationProps> = ({
  isOptimizing,
  onComplete
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);

  useEffect(() => {
    if (!isOptimizing) {
      setCurrentStage(0);
      setProgress(0);
      setStageProgress(0);
      return;
    }

    let stageTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const runStage = (index: number) => {
      if (index >= optimizationStages.length) {
        setProgress(100);
        setTimeout(() => {
          onComplete?.();
        }, 500);
        return;
      }

      setCurrentStage(index);
      setStageProgress(0);

      const stage = optimizationStages[index];
      const progressIncrement = 100 / (stage.duration / 50);

      progressTimer = setInterval(() => {
        setStageProgress(prev => {
          const newProgress = prev + progressIncrement;
          if (newProgress >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return newProgress;
        });
      }, 50);

      stageTimer = setTimeout(() => {
        setProgress(((index + 1) / optimizationStages.length) * 100);
        runStage(index + 1);
      }, stage.duration);
    };

    runStage(0);

    return () => {
      clearTimeout(stageTimer);
      clearInterval(progressTimer);
    };
  }, [isOptimizing, onComplete]);

  if (!isOptimizing) return null;

  const currentStageData = optimizationStages[currentStage];
  const IconComponent = currentStageData?.icon || Zap;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full mx-4 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${currentStageData?.color || 'from-blue-500 to-cyan-500'} rounded-full blur-3xl opacity-20 animate-pulse`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br ${currentStageData?.color || 'from-purple-500 to-indigo-500'} rounded-full blur-3xl opacity-20 animate-pulse delay-1000`}></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${currentStageData?.color || 'from-blue-500 to-cyan-500'} shadow-lg transform transition-all duration-500 hover:scale-110`}>
                <IconComponent className="h-8 w-8 text-white animate-pulse" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Optimizing Your Resume
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI is working its magic...
            </p>
          </div>

          {/* Current Stage */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${currentStageData?.color || 'from-blue-500 to-cyan-500'} shadow-md`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {currentStageData?.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentStageData?.description}
                </p>
              </div>
            </div>
            
            {/* Stage Progress */}
            <Progress 
              value={stageProgress} 
              className="h-2 mb-2"
              indicatorClassName={`bg-gradient-to-r ${currentStageData?.color || 'from-blue-500 to-cyan-500'} transition-all duration-300`}
            />
          </div>

          {/* Overall Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-3"
              indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
            />
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between items-center">
            {optimizationStages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isCompleted = index < currentStage;
              const isCurrent = index === currentStage;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? `bg-gradient-to-br ${stage.color} text-white animate-pulse`
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <StageIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`mt-1 w-1 h-1 rounded-full transition-all duration-300 ${
                    isCompleted || isCurrent ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                </div>
              );
            })}
          </div>

          {/* Fun Facts */}
          <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                Did you know?
              </span>
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              {currentStage < 2 && "Our AI analyzes over 500 resume factors to ensure maximum ATS compatibility."}
              {currentStage >= 2 && currentStage < 4 && "Optimized resumes have a 5x higher interview callback rate."}
              {currentStage >= 4 && "Your resume will be tailored to match the exact language used in the job description."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
