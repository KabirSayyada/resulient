
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
import { ArrowRight, Star, FileText, Award, BarChart4 } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const GuidedTour = () => {
  const [showTour, setShowTour] = useLocalStorage('resulient-tour-completed', true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      title: "Welcome to Resulient!",
      description: "Let's take a quick tour to help you get started with our resume optimization and scoring tools.",
      icon: <Star className="h-10 w-10 text-indigo-500" />,
    },
    {
      title: "ATS Resume Optimization",
      description: "Upload your resume and job description to tailor your resume for specific job applications and beat the ATS systems.",
      icon: <FileText className="h-10 w-10 text-indigo-500" />,
    },
    {
      title: "Resume Scoring",
      description: "Get your resume scored against industry standards and see how you stack up against other candidates in your field.",
      icon: <Award className="h-10 w-10 text-indigo-500" />,
    },
    {
      title: "Track Your Progress",
      description: "Compare different versions of your resume over time to see how your improvements are affecting your score.",
      icon: <BarChart4 className="h-10 w-10 text-indigo-500" />,
    }
  ];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      setShowTour(false);
    } else {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const handleSkip = () => {
    setShowTour(false);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            {steps[currentStep].icon}
          </div>
          <DialogTitle className="text-xl text-center mt-4">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between mt-6">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tour
          </Button>
          <Button onClick={handleNext} className="flex items-center gap-1">
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
