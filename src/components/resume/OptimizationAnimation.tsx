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
  TrendingUp,
  Award,
  Users,
  Calculator,
  Settings,
  Wand2,
  Shield
} from "lucide-react";

interface OptimizationAnimationProps {
  isOptimizing: boolean;
  onComplete?: () => void;
  mode?: "optimization" | "scoring" | "ats-building";
}

const optimizationStages = [
  {
    icon: FileText,
    title: "Analyzing Resume",
    description: "Parsing your experience and skills",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Search,
    title: "Processing Job Description",
    description: "Identifying key requirements and keywords",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Brain,
    title: "AI Optimization Engine",
    description: "Matching your profile to job requirements",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Target,
    title: "ATS Compatibility Check",
    description: "Ensuring maximum ATS pass-through rate",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "Performance Analysis",
    description: "Calculating optimization scores",
    color: "from-orange-500 to-amber-500"
  },
  {
    icon: Sparkles,
    title: "Final Polish",
    description: "Adding finishing touches",
    color: "from-violet-500 to-purple-500"
  }
];

const scoringStages = [
  {
    icon: FileText,
    title: "Analyzing Resume Structure",
    description: "Evaluating format and content organization",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Industry Benchmarking",
    description: "Comparing against thousands of similar profiles",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Brain,
    title: "AI Skills Assessment",
    description: "Evaluating technical and soft skills depth",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Award,
    title: "Achievement Analysis",
    description: "Scoring quantifiable accomplishments",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Calculator,
    title: "Score Calculation",
    description: "Computing percentile rankings",
    color: "from-orange-500 to-amber-500"
  },
  {
    icon: TrendingUp,
    title: "Generating Insights",
    description: "Creating improvement recommendations",
    color: "from-violet-500 to-purple-500"
  }
];

const atsBuildingStages = [
  {
    icon: Brain,
    title: "Processing Your Information",
    description: "Understanding your background and experience",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Settings,
    title: "Structuring Content",
    description: "Organizing information into professional sections",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: Wand2,
    title: "AI Content Enhancement",
    description: "Crafting compelling descriptions and bullet points",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "ATS Optimization",
    description: "Ensuring compatibility with applicant tracking systems",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Target,
    title: "Keyword Integration",
    description: "Strategically placing industry-relevant keywords",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Rocket,
    title: "Final Assembly",
    description: "Creating your professional ATS-ready resume",
    color: "from-violet-500 to-purple-500"
  }
];

export const OptimizationAnimation: React.FC<OptimizationAnimationProps> = ({
  isOptimizing,
  onComplete,
  mode = "optimization"
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  const stages = mode === "scoring" ? scoringStages : mode === "ats-building" ? atsBuildingStages : optimizationStages;
  const title = mode === "scoring" ? "Benchmarking Your Resume" : mode === "ats-building" ? "Building Your ATS Resume" : "Optimizing Your Resume";
  const subtitle = mode === "scoring" ? "Our AI is analyzing your competitive position..." : mode === "ats-building" ? "Our AI is crafting your professional resume..." : "Our AI is working its magic...";

  const STAGE_DURATION = 4000; // 4 seconds per stage
  const TOTAL_DURATION = stages.length * STAGE_DURATION; // 24 seconds total
  const PROGRESS_UPDATE_INTERVAL = 50; // Update every 50ms for smooth animation

  useEffect(() => {
    if (!isOptimizing) {
      // Reset all states when not optimizing
      setCurrentStage(0);
      setProgress(0);
      setStageProgress(0);
      setAnimationStarted(false);
      return;
    }

    // Only start animation once when optimization begins
    if (!animationStarted) {
      setAnimationStarted(true);
      
      let animationStartTime = Date.now();
      let animationTimer: NodeJS.Timeout;

      const updateAnimation = () => {
        const elapsed = Date.now() - animationStartTime;
        
        // Calculate overall progress (0-100)
        const overallProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
        setProgress(overallProgress);

        // Calculate current stage (0 to stages.length - 1)
        const currentStageIndex = Math.min(Math.floor(elapsed / STAGE_DURATION), stages.length - 1);
        setCurrentStage(currentStageIndex);

        // Calculate progress within current stage (0-100)
        const stageElapsed = elapsed - (currentStageIndex * STAGE_DURATION);
        const currentStageProgress = Math.min((stageElapsed / STAGE_DURATION) * 100, 100);
        setStageProgress(currentStageProgress);

        // Check if animation is complete
        if (elapsed >= TOTAL_DURATION) {
          setProgress(100);
          setStageProgress(100);
          setCurrentStage(stages.length - 1);
          
          // Call onComplete after animation finishes
          setTimeout(() => {
            onComplete?.();
          }, 500);
          
          return;
        }

        // Continue animation
        animationTimer = setTimeout(updateAnimation, PROGRESS_UPDATE_INTERVAL);
      };

      // Start the animation
      updateAnimation();

      // Cleanup function
      return () => {
        clearTimeout(animationTimer);
      };
    }
  }, [isOptimizing, animationStarted, onComplete, stages.length, TOTAL_DURATION]);

  if (!isOptimizing) return null;

  const currentStageData = stages[currentStage];
  const IconComponent = currentStageData?.icon || Zap;

  const funFacts = mode === "scoring" ? {
    early: "Our AI analyzes over 500 resume factors to ensure maximum ATS compatibility.",
    mid: "Benchmarked resumes show 3x higher interview callback rates.",
    late: "Your score will reflect how you compare to thousands of professionals in your field."
  } : mode === "ats-building" ? {
    early: "ATS-optimized resumes are 67% more likely to pass initial screening.",
    mid: "Our AI uses proven resume formats preferred by 95% of Fortune 500 companies.",
    late: "Your resume will be formatted for maximum readability by both ATS and human recruiters."
  } : {
    early: "Our AI analyzes over 500 resume factors to ensure maximum ATS compatibility.",
    mid: "Optimized resumes have a 5x higher interview callback rate.",
    late: "Your resume will be tailored to match the exact language used in the job description."
  };

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
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {subtitle}
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
            {stages.map((stage, index) => {
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
              {currentStage < 2 && funFacts.early}
              {currentStage >= 2 && currentStage < 4 && funFacts.mid}
              {currentStage >= 4 && funFacts.late}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
