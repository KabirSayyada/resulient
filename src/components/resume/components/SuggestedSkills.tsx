import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, X, Plus, Star, TrendingUp, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SuggestedSkillsProps {
  skills: string[];
  selectable?: boolean;
  onSelect?: (skill: string) => void;
  selectedSkills?: string[];
  variant?: 'default' | 'compact' | 'scorecard' | 'enhanced';
}

export const SuggestedSkills = ({ 
  skills, 
  selectable = false, 
  onSelect, 
  selectedSkills = [],
  variant = 'default'
}: SuggestedSkillsProps) => {
  const navigate = useNavigate();
  const { resumeData, saveResumeData } = useResumeBuilder();
  const { user } = useAuth();
  const { toast } = useToast();
  const [localSelectedSkills, setLocalSelectedSkills] = useState<string[]>([]);

  const handleAddSelectedSkills = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (localSelectedSkills.length === 0) {
      toast({
        title: "No skills selected",
        description: "Please select at least one skill to add.",
        variant: "destructive"
      });
      return;
    }

    try {
      const currentResume = resumeData || {
        personalInfo: { name: "", email: "", phone: "", location: "" },
        workExperience: [{ company: "", position: "", location: "", startYear: "", endYear: "", description: "" }],
        skills: [""],
        achievements: [{ title: "", description: "" }],
        education: [{ institution: "", degree: "", field: "", year: "" }]
      };

      const existingSkills = currentResume.skills.map(s => s.toLowerCase().trim());
      const newSkills = localSelectedSkills.filter(
        skill => !existingSkills.includes(skill.toLowerCase().trim())
      );

      const updatedResume = {
        ...currentResume,
        skills: [...currentResume.skills.filter(s => s.trim()), ...newSkills]
      };

      await saveResumeData(updatedResume);
      
      toast({
        title: "✨ Skills Added!",
        description: `Added ${newSkills.length} skill${newSkills.length > 1 ? 's' : ''} to your resume.`,
      });

      navigate("/ats-resume-builder?enhanced=true");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skills. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleSkillSelection = (skill: string) => {
    setLocalSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };
  if (!skills || skills.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic text-center p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
        <Star className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium">No additional skills suggested</p>
        <p className="text-xs text-gray-400 mt-1">Your current skills look comprehensive!</p>
      </div>
    );
  }

  if (variant === 'enhanced') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill, index) => {
            const isSelected = selectedSkills.includes(skill);
            
            return (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  isSelected 
                    ? 'border-indigo-400 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/60 dark:to-blue-900/60 shadow-lg' 
                    : 'border-blue-200/60 bg-gradient-to-br from-white to-blue-50/80 dark:from-gray-800/80 dark:to-blue-950/40 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
                        isSelected 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20'
                      }`}>
                        {isSelected ? (
                          <BadgeCheck className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingUp className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <span className={`text-sm font-medium break-words transition-colors duration-200 ${
                        isSelected 
                          ? 'text-indigo-900 dark:text-indigo-100' 
                          : 'text-gray-800 dark:text-gray-200 group-hover:text-blue-900 dark:group-hover:text-blue-100'
                      }`}>
                        {skill}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-7 w-7 p-0 rounded-full transition-all duration-200 ${
                        isSelected
                          ? 'hover:bg-indigo-200 dark:hover:bg-indigo-800'
                          : 'hover:bg-blue-100 dark:hover:bg-blue-900'
                      }`}
                      onClick={() => selectable && onSelect ? onSelect(skill) : toggleSkillSelection(skill)}
                    >
                      {isSelected ? (
                        <X className="h-3 w-3 text-indigo-700 dark:text-indigo-300" />
                      ) : (
                        <Plus className="h-3 w-3 text-blue-700 dark:text-blue-300" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Skill impact indicator */}
                  <div className="mt-2 flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      High impact skill
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary footer with Add Button */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {skills.length} skill{skills.length !== 1 ? 's' : ''} recommended
            </span>
            <Badge variant="outline" className="border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              Score boost potential
            </Badge>
          </div>
          
          {localSelectedSkills.length > 0 && (
            <Button 
              onClick={handleAddSelectedSkills}
              className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="sm"
            >
              <Sparkles className="h-4 w-4" />
              Add Selected Skills ({localSelectedSkills.length})
            </Button>
          )}
        </div>
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
            className={`flex items-center justify-between gap-2 p-2 sm:p-3 rounded-md transition-all duration-200 ${
              isSelected 
                ? 'bg-indigo-100 dark:bg-indigo-800/50 border-l-2 border-l-indigo-500 dark:border-l-indigo-400' 
                : 'bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words">{skill}</span>
            </div>
            
            {selectable && onSelect && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 rounded-full flex-shrink-0"
                onClick={() => onSelect(skill)}
              >
                {isSelected ? (
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-indigo-700 dark:text-indigo-300" />
                ) : (
                  <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-indigo-700 dark:text-indigo-300" />
                )}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
