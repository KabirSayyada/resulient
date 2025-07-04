
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Target, Award } from 'lucide-react';

interface MotivationalQuoteAnimationProps {
  score: number;
  onComplete: () => void;
}

const motivationalQuotes = {
  high: [
    {
      quote: "Outstanding work! Your resume demonstrates exceptional quality.",
      author: "Keep pushing boundaries!",
      icon: Award,
      gradient: "from-green-400 to-emerald-600"
    },
    {
      quote: "Excellent! You're in the top tier of candidates.",
      author: "Success is within reach!",
      icon: Star,
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      quote: "Impressive! Your skills and experience shine through.",
      author: "You're ready to excel!",
      icon: TrendingUp,
      gradient: "from-blue-400 to-indigo-600"
    }
  ],
  medium: [
    {
      quote: "Good progress! You're on the right track to success.",
      author: "Keep building momentum!",
      icon: TrendingUp,
      gradient: "from-blue-400 to-purple-600"
    },
    {
      quote: "Solid foundation! A few tweaks will make you stand out.",
      author: "Your potential is showing!",
      icon: Target,
      gradient: "from-indigo-400 to-blue-600"
    },
    {
      quote: "You're making great strides in your career journey.",
      author: "Success is building!",
      icon: Star,
      gradient: "from-purple-400 to-pink-600"
    }
  ],
  low: [
    {
      quote: "Every expert was once a beginner. You're just getting started!",
      author: "Your journey begins now!",
      icon: TrendingUp,
      gradient: "from-pink-400 to-rose-600"
    },
    {
      quote: "Great potential ahead! Small improvements lead to big wins.",
      author: "Your breakthrough is coming!",
      icon: Target,
      gradient: "from-orange-400 to-red-500"
    },
    {
      quote: "The best time to improve is now. You've got this!",
      author: "Growth starts here!",
      icon: Star,
      gradient: "from-indigo-400 to-purple-600"
    }
  ]
};

export const MotivationalQuoteAnimation = ({ score, onComplete }: MotivationalQuoteAnimationProps) => {
  const [currentQuote, setCurrentQuote] = useState<any>(null);

  useEffect(() => {
    // Select quote category based on score
    let quotes;
    if (score >= 80) {
      quotes = motivationalQuotes.high;
    } else if (score >= 60) {
      quotes = motivationalQuotes.medium;
    } else {
      quotes = motivationalQuotes.low;
    }

    // Pick a random quote from the category
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);

    // Auto complete after animation with shorter duration
    const timer = setTimeout(() => {
      console.log("Quote animation timer completed, calling onComplete");
      onComplete();
    }, 3000); // Reduced from 4000 to 3000

    return () => clearTimeout(timer);
  }, [score, onComplete]);

  if (!currentQuote) return null;

  const IconComponent = currentQuote.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-12 px-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`bg-gradient-to-r ${currentQuote.gradient} p-1 rounded-2xl shadow-2xl max-w-2xl mx-auto`}
      >
        <div className="bg-white rounded-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${currentQuote.gradient} rounded-full mb-6 shadow-lg`}
          >
            <IconComponent className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed"
          >
            "{currentQuote.quote}"
          </motion.blockquote>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className={`text-lg font-semibold bg-gradient-to-r ${currentQuote.gradient} bg-clip-text text-transparent`}
          >
            {currentQuote.author}
          </motion.p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex items-center gap-2 mt-6 text-indigo-600"
      >
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
              className="w-2 h-2 bg-indigo-400 rounded-full"
            />
          ))}
        </div>
        <span className="text-sm font-medium">Preparing your detailed scorecard...</span>
      </motion.div>
    </motion.div>
  );
};
