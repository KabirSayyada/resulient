
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, FileText, Award, BarChart4, Sparkles, CompareIcon } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  animationClass: string;
}

export const GuidedTour = () => {
  const [showTour, setShowTour] = useLocalStorage('resulient-tour-completed', true);
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const steps: TourStep[] = [
    {
      title: "Welcome to Resulient!",
      description: "Let's take a quick tour to help you get started with our resume optimization and scoring tools. We're here to help you stand out in the job market!",
      icon: <Sparkles className="h-12 w-12 text-yellow-400 animate-pulse" />,
      bgColor: "bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40",
      animationClass: "animate-fade-in"
    },
    {
      title: "ATS Resume Optimization",
      description: "Upload your resume and job description to tailor your resume for specific job applications. Our AI will help you beat the ATS systems and get noticed by recruiters.",
      icon: <FileText className="h-12 w-12 text-indigo-500" />,
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40",
      animationClass: "animate-fade-in"
    },
    {
      title: "Resume Scoring",
      description: "Get your resume scored against industry standards and see how you stack up against other candidates in your field. We'll give you detailed feedback on how to improve.",
      icon: <Award className="h-12 w-12 text-fuchsia-500" />,
      bgColor: "bg-gradient-to-br from-fuchsia-50 to-pink-100 dark:from-fuchsia-900/40 dark:to-pink-900/40",
      animationClass: "animate-fade-in"
    },
    {
      title: "Compare Your Progress",
      description: "Use our powerful comparison tool to see how your resume has improved over time. Select any two scores to see a detailed side-by-side analysis.",
      icon: <CompareIcon className="h-12 w-12 text-emerald-500" />,
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40",
      animationClass: "animate-fade-in"
    },
    {
      title: "Track Your Progress",
      description: "Watch your resume score improve as you apply our suggestions. Our detailed charts show your progress over time and help you identify areas for improvement.",
      icon: <BarChart4 className="h-12 w-12 text-blue-500" />,
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40",
      animationClass: "animate-fade-in"
    }
  ];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      setShowTour(false);
    } else {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(prevStep => prevStep + 1);
        setAnimating(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    setShowTour(false);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(prevStep => prevStep - 1);
        setAnimating(false);
      }, 300);
    }
  };

  // Reverse the default behavior - useLocalStorage has initialized this to true if it doesn't exist
  useEffect(() => {
    // If value was never set before, show the tour
    if (showTour === true) {
      setShowTour(true);
    }
  }, []);

  return (
    <Dialog open={showTour} onOpenChange={setShowTour}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-gray-950 border-0 shadow-2xl">
        <div className={`${steps[currentStep].bgColor} transition-all duration-500 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <DialogHeader className="pt-8 px-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md mb-2 transition-all duration-500 hover:scale-105">
              <div className={`${steps[currentStep].animationClass}`}>
                {steps[currentStep].icon}
              </div>
            </div>
            <DialogTitle className="text-2xl text-center mt-4 font-bold text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </DialogTitle>
            <DialogDescription className="text-center px-4 mt-2 text-gray-700 dark:text-gray-300">
              {steps[currentStep].description}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="flex justify-center py-6">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-indigo-500 w-6' 
                    : index < currentStep 
                      ? 'bg-indigo-300 dark:bg-indigo-700' 
                      : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between py-4 px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip} className="text-gray-500">
              Skip Tour
            </Button>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="flex items-center gap-1">
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back
              </Button>
            )}
          </div>
          <Button onClick={handleNext} className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white px-5">
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="h-4 w-4 animate-pulse" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
