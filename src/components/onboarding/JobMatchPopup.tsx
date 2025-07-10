
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Target, Sparkles, X } from "lucide-react";

interface JobMatchPopupProps {
  onClose?: () => void;
}

export const JobMatchPopup = ({ onClose }: JobMatchPopupProps) => {
  const [popupViewed, setPopupViewed] = useLocalStorage('resulient-job-match-popup-viewed', false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup after a brief delay if not viewed before
    if (!popupViewed) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000); // 3 second delay

      return () => clearTimeout(timer);
    }
  }, [popupViewed]);

  const handleTryJobMatching = () => {
    setPopupViewed(true);
    setShowPopup(false);
    navigate('/jobs');
    if (onClose) onClose();
  };

  const handleClose = () => {
    setPopupViewed(true);
    setShowPopup(false);
    if (onClose) onClose();
  };

  if (popupViewed || !showPopup) {
    return null;
  }

  return (
    <Dialog open={showPopup} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-gray-950 border-0 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 transition-all duration-500">
          <DialogHeader className="pt-8 px-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/90 dark:bg-gray-900/90 shadow-md mb-4 transition-all duration-500 hover:scale-105">
              <div className="relative">
                <Briefcase className="h-10 w-10 text-blue-500" />
                <Target className="h-6 w-6 text-indigo-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center mt-2 font-bold text-gray-900 dark:text-white">
              Discover Perfect Job Matches!
            </DialogTitle>
            <DialogDescription className="text-center px-4 mt-3 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              Our intelligent job matching system finds opportunities tailored specifically to your skills, experience, and location. Get personalized job recommendations that truly fit your profile.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Location-based matching from your resume</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <Target className="h-5 w-5 text-indigo-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">AI-powered skill and experience analysis</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Real-time compatibility scoring</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between py-4 px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <Button variant="ghost" onClick={handleClose} className="text-gray-500">
            Maybe Later
          </Button>
          <Button onClick={handleTryJobMatching} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6">
            Try Job Matching
            <Briefcase className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
