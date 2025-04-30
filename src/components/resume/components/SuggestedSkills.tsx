
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, X } from "lucide-react";

interface SuggestedSkillsProps {
  skills: string[];
}

export const SuggestedSkills = ({ skills }: SuggestedSkillsProps) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="text-gray-500 italic text-center p-4">
        No skills suggested
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {skills.map((skill, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/30"
        >
          <BadgeCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span className="text-sm">{skill}</span>
        </div>
      ))}
    </div>
  );
};
