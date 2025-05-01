
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, X, Plus } from "lucide-react";
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
      <div className="text-gray-500 italic text-center p-4">
        No skills suggested
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {skills.map((skill, index) => {
        const isSelected = selectedSkills.includes(skill);
        
        return (
          <div 
            key={index}
            className={`flex items-center justify-between gap-2 p-2 rounded-md transition-all duration-200 ${
              isSelected 
                ? 'bg-indigo-100 dark:bg-indigo-800/50 border-l-2 border-l-indigo-500' 
                : 'bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span className="text-sm">{skill}</span>
            </div>
            
            {selectable && onSelect && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full"
                onClick={() => onSelect(skill)}
              >
                {isSelected ? (
                  <X className="h-3 w-3 text-indigo-700 dark:text-indigo-300" />
                ) : (
                  <Plus className="h-3 w-3 text-indigo-700 dark:text-indigo-300" />
                )}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
