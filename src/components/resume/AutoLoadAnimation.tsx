import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Database, 
  Sparkles,
  CheckCircle,
  Wand2,
  Target,
  Brain,
  Zap
} from "lucide-react";

interface AutoLoadAnimationProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const loadingStages = [
  {
    icon: Target,
    title: "Analyzing Job Requirements",
    description: "Processing the job description you selected",
    duration: 1000,
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Database,
    title: "Finding Your Best Resume",
    description: "Retrieving your highest-scoring resume from database",
    duration: 1500,
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Brain,
    title: "Preparing AI Optimization",
    description: "Setting up intelligent resume enhancement",
    duration: 800,
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Sparkles,
    title: "Ready for Optimization",
    description: "Everything is set up for maximum job matching",
    duration: 500,
    color: "from-orange-500 to-amber-500"
  }
];

export const AutoLoadAnimation: React.FC<AutoLoadAnimationProps> = ({
  isLoading,
  onComplete
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);

  useEffect(() => {
    console.log('AutoLoadAnimation - isLoading changed:', isLoading);
    
    if (!isLoading) {
      setCurrentStage(0);
      setProgress(0);
      setStageProgress(0);
      return;
    }

    let stageTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const runStage = (index: number) => {
      console.log('Running stage:', index);
      
      if (index >= loadingStages.length) {
        setProgress(100);
        console.log('All stages complete, calling onComplete');
        setTimeout(() => {
          onComplete?.();
        }, 500);
        return;
      }

      setCurrentStage(index);
      setStageProgress(0);

      const stage = loadingStages[index];
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
        setProgress(((index + 1) / loadingStages.length) * 100);
        runStage(index + 1);
      }, stage.duration);
    };

    runStage(0);

    return () => {
      clearTimeout(stageTimer);
      clearInterval(progressTimer);
    };
  }, [isLoading, onComplete]);

  if (!isLoading) {
    console.log('AutoLoadAnimation not loading, returning null');
    return null;
  }

  console.log('AutoLoadAnimation rendering, current stage:', currentStage);

  const currentStageData = loadingStages[currentStage];
  const IconComponent = currentStageData?.icon || Zap;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-lg w-full mx-4 relative overflow-hidden">
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
              Setting Up Your Optimization
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing everything for the perfect resume match...
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
            {loadingStages.map((stage, index) => {
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
                </div>
              );
            })}
          </div>

          {/* Fun Fact */}
          <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                Smart Optimization
              </span>
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              Our AI will analyze the job requirements and automatically tailor your resume for maximum compatibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
