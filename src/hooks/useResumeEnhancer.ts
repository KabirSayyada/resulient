import { ScoreData } from "@/types/resume";
import { ResumeData } from "@/components/resume/ResumeBuilderForm";

export interface EnhancementSummary {
  skillsToAdd: string[];
  achievementEnhancements: string[];
  totalChanges: number;
}

export const useResumeEnhancer = () => {
  const parseScoringSuggestions = (scoreData: ScoreData): EnhancementSummary => {
    const skillsToAdd = scoreData.suggestedSkills || [];
    const achievementEnhancements = scoreData.improvementTips || [];
    
    return {
      skillsToAdd,
      achievementEnhancements,
      totalChanges: skillsToAdd.length + achievementEnhancements.length
    };
  };

  const applySkillsToResume = (
    skills: string[], 
    existingResume: ResumeData | null
  ): ResumeData => {
    if (!existingResume) {
      return {
        personalInfo: { name: "", email: "", phone: "", location: "" },
        workExperience: [{ company: "", position: "", location: "", startYear: "", endYear: "", description: "" }],
        skills: skills,
        achievements: [{ title: "", description: "" }],
        education: [{ institution: "", degree: "", field: "", year: "" }]
      };
    }

    // Merge new skills with existing, avoiding duplicates
    const existingSkills = existingResume.skills.map(s => s.toLowerCase().trim());
    const newSkills = skills.filter(
      skill => !existingSkills.includes(skill.toLowerCase().trim())
    );

    return {
      ...existingResume,
      skills: [...existingResume.skills.filter(s => s.trim()), ...newSkills]
    };
  };

  const enhanceAchievements = (
    tips: string[], 
    existingResume: ResumeData | null
  ): ResumeData => {
    if (!existingResume) {
      return {
        personalInfo: { name: "", email: "", phone: "", location: "" },
        workExperience: [{ company: "", position: "", location: "", startYear: "", endYear: "", description: "" }],
        skills: [""],
        achievements: tips.map(tip => ({ title: "Improvement", description: tip })),
        education: [{ institution: "", degree: "", field: "", year: "" }]
      };
    }

    // Add tips as new achievement suggestions if achievements section is empty
    const hasAchievements = existingResume.achievements.some(a => a.title.trim() || a.description.trim());
    
    if (!hasAchievements && tips.length > 0) {
      return {
        ...existingResume,
        achievements: tips.slice(0, 3).map(tip => ({ 
          title: "Achievement to Add", 
          description: tip 
        }))
      };
    }

    return existingResume;
  };

  const applyAllEnhancements = (
    scoreData: ScoreData,
    existingResume: ResumeData | null
  ): ResumeData => {
    let enhancedResume = existingResume || {
      personalInfo: { name: "", email: "", phone: "", location: "" },
      workExperience: [{ company: "", position: "", location: "", startYear: "", endYear: "", description: "" }],
      skills: [""],
      achievements: [{ title: "", description: "" }],
      education: [{ institution: "", degree: "", field: "", year: "" }]
    };

    // Apply skills
    if (scoreData.suggestedSkills?.length > 0) {
      enhancedResume = applySkillsToResume(scoreData.suggestedSkills, enhancedResume);
    }

    // Apply achievement enhancements
    if (scoreData.improvementTips?.length > 0) {
      enhancedResume = enhanceAchievements(scoreData.improvementTips, enhancedResume);
    }

    return enhancedResume;
  };

  const generatePreviewSummary = (scoreData: ScoreData): string[] => {
    const summary: string[] = [];
    
    if (scoreData.suggestedSkills?.length > 0) {
      summary.push(`Add ${scoreData.suggestedSkills.length} new skill${scoreData.suggestedSkills.length > 1 ? 's' : ''} (${scoreData.suggestedSkills.slice(0, 3).join(', ')}${scoreData.suggestedSkills.length > 3 ? '...' : ''})`);
    }
    
    if (scoreData.improvementTips?.length > 0) {
      summary.push(`Apply ${scoreData.improvementTips.length} improvement tip${scoreData.improvementTips.length > 1 ? 's' : ''}`);
    }
    
    return summary;
  };

  return {
    parseScoringSuggestions,
    applySkillsToResume,
    enhanceAchievements,
    applyAllEnhancements,
    generatePreviewSummary
  };
};
