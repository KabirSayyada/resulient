
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, X, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuggestedSkillsProps {
  skills: string[];
  selectable?: boolean;
  onSelect?: (skill: string) => void;
  selectedSkills?: string[];
}

export const SuggestedSkills = ({ 
  skills, 
  selectable = false, 
  onSelect, 
  selectedSkills = [] 
}: SuggestedSkillsProps) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic text-center p-4">
        No skills suggested
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill, index) => {
        const isSelected = selectedSkills.includes(skill);
        
        return (
          <div 
            key={index}
            className={`group relative overflow-hidden transition-all duration-300 ${
              isSelected 
                ? 'bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 dark:from-cyan-900/60 dark:via-blue-900/60 dark:to-indigo-900/60 border-2 border-cyan-400 dark:border-cyan-600 shadow-lg scale-105' 
                : 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/40 dark:via-blue-950/40 dark:to-indigo-950/40 hover:from-cyan-100 hover:via-blue-100 hover:to-indigo-100 dark:hover:from-cyan-900/50 dark:hover:via-blue-900/50 dark:hover:to-indigo-900/50 border-2 border-cyan-200/60 dark:border-cyan-800/60 hover:border-cyan-300 dark:hover:border-cyan-700 shadow-md hover:shadow-xl hover:scale-[1.02]'
            } rounded-xl p-4`}
          >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 dark:from-cyan-800/10 dark:to-blue-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-xl shadow-md transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg' 
                    : 'bg-gradient-to-br from-cyan-400 to-blue-500 group-hover:shadow-lg group-hover:scale-110'
                }`}>
                  <BadgeCheck className="h-4 w-4 text-white flex-shrink-0" />
                </div>
                <span className={`font-semibold transition-colors duration-300 ${
                  isSelected 
                    ? 'text-cyan-800 dark:text-cyan-200' 
                    : 'text-cyan-700 dark:text-cyan-300 group-hover:text-cyan-800 dark:group-hover:text-cyan-200'
                }`}>
                  {skill}
                </span>
              </div>
              
              {selectable && onSelect && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-full transition-all duration-300 ${
                    isSelected 
                      ? 'bg-cyan-200/80 dark:bg-cyan-800/80 hover:bg-cyan-300/80 dark:hover:bg-cyan-700/80' 
                      : 'hover:bg-cyan-200/60 dark:hover:bg-cyan-800/60'
                  }`}
                  onClick={() => onSelect(skill)}
                >
                  {isSelected ? (
                    <X className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
                  ) : (
                    <Plus className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
                  )}
                </Button>
              )}
            </div>
            
            {/* Sparkle Effect for Enhanced Skills */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <Sparkles className="h-4 w-4 text-cyan-500 animate-pulse" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
