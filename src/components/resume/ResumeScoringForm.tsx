
import { FileUploadSection } from "./FileUploadSection";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Target, Award } from "lucide-react";

interface ResumeScoringFormProps {
  scoringMode: "resumeOnly";
  setScoringMode: (mode: "resumeOnly") => void;
  resumeContent: string;
  setResumeContent: (content: string) => void;
  isScoring: boolean;
  onScore: () => void;
  disableButton?: boolean;
}

export const ResumeScoringForm = ({
  resumeContent,
  setResumeContent,
  isScoring,
  onScore,
  disableButton = false
}: ResumeScoringFormProps) => {
  const wordCount = resumeContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isResumeTooLong = wordCount > 800;
  const isButtonDisabled = isScoring || !resumeContent.trim() || isResumeTooLong || disableButton;

  const features = [
    {
      icon: TrendingUp,
      title: "Industry Benchmarking",
      description: "Compare against thousands of resumes"
    },
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Advanced scoring algorithms"
    },
    {
      icon: Target,
      title: "Targeted Insights",
      description: "Personalized improvement tips"
    },
    {
      icon: Award,
      title: "Elite Indicators",
      description: "Discover what makes you stand out"
    }
  ];

  const handleScoreClick = () => {
    console.log('Score button clicked', { isButtonDisabled, resumeContent: resumeContent.length });
    if (!isButtonDisabled) {
      onScore();
    }
  };

  return (
    <div className="space-y-8">
      {/* Animated Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500/10 to-indigo-500/10 rounded-full border border-fuchsia-200 dark:border-fuchsia-700">
          <Award className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
          <span className="text-sm font-medium text-fuchsia-700 dark:text-fuchsia-300">
            AI-Powered Resume Analysis
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Discover Your Resume's True Potential
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get instant feedback on how your resume performs against industry standards and discover the skills that will make you irresistible to employers.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-md"
          >
            <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-2" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* File Upload Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-700/50 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-6 shadow-sm"
      >
        <FileUploadSection
          resumeContent={resumeContent}
          setResumeContent={setResumeContent}
        />
        
        {/* Word Count Indicator */}
        {resumeContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex items-center justify-between text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400">
              Word count: {wordCount}
            </span>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
                <div 
                  className={`h-full transition-all duration-300 ${
                    wordCount > 800 ? 'bg-red-500' : 
                    wordCount > 600 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((wordCount / 800) * 100, 100)}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${
                wordCount > 800 ? 'text-red-600 dark:text-red-400' :
                wordCount > 600 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {wordCount > 800 ? 'Too long' : wordCount > 600 ? 'Good length' : 'Optimal'}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Error Message with Animation */}
      {isResumeTooLong && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
        >
          <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-full">
            <InfoCircledIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">
              Resume Too Long
            </h4>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Your resume is {wordCount} words. Please shorten it to 800 words or less for optimal scoring and better ATS compatibility.
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Score Button with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-center"
      >
        <motion.div
          whileHover={{ scale: isButtonDisabled ? 1 : 1.02 }}
          whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
          className="relative"
        >
          <Button
            onClick={handleScoreClick}
            disabled={isButtonDisabled}
            className="relative px-12 py-4 text-lg font-bold rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white border-0 overflow-hidden group"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button content */}
            <div className="relative flex items-center gap-3">
              {isScoring ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Analyzing Your Resume...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Score My Resume
                </>
              )}
            </div>
          </Button>
          
          {/* Glow effect */}
          {!isButtonDisabled && (
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Info Section with Better Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="space-y-4"
      >
        <div className="bg-gradient-to-r from-fuchsia-50 via-white to-indigo-50 dark:from-fuchsia-950/20 dark:via-gray-800 dark:to-indigo-950/20 border border-fuchsia-200 dark:border-fuchsia-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-fuchsia-100 dark:bg-fuchsia-900/40 p-2 rounded-full mt-0.5">
              <Target className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <div>
              <h4 className="font-semibold text-fuchsia-800 dark:text-fuchsia-200 mb-1">
                What You'll Discover
              </h4>
              <p className="text-fuchsia-700 dark:text-fuchsia-300 text-sm">
                Your resume will be analyzed against estimated industry standards. You'll see where you stand versus your competition and get skills to pursue.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InfoCircledIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-blue-700 dark:text-blue-300 text-sm">
              <p><span className="font-semibold">Note:</span> Scoring the same resume multiple times may produce slightly different scores. This is because your resume is being compared against dynamic industry standards that reflect the overall quality of resumes scored at that time.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
