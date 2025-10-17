import { ScoreData } from "@/types/resume";
import { ResumeData } from "@/components/resume/ResumeBuilderForm";
import { supabase } from "@/integrations/supabase/client";
import { parseATSResumeText } from "@/utils/parseATSResumeText";
import { convertParsedResumeToBuilderFormat, identifyEnhancements } from "@/utils/resumeDataConverter";

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

  /**
   * Parse original resume from score record and merge with AI enhancements
   */
  const parseAndEnhanceResume = async (scoreId: string, scoreData: ScoreData) => {
    try {
      // 1. Fetch the score record to get original resume content
      const { data: scoreRecord, error } = await supabase
        .from('resume_scores')
        .select('resume_content')
        .eq('id', scoreId)
        .single();

      if (error) throw error;

      // 2. Parse the original resume text into structured format
      const parsedResume = parseATSResumeText(scoreRecord.resume_content);
      const originalResumeData = convertParsedResumeToBuilderFormat(parsedResume);

      // 3. Apply AI enhancements to the original data
      const enhancedResumeData = applyAllEnhancements(scoreData, originalResumeData);

      // 4. Identify what was enhanced for visual indicators
      const enhancements = identifyEnhancements(originalResumeData, enhancedResumeData);

      return {
        original: originalResumeData,
        enhanced: enhancedResumeData,
        enhancements
      };
    } catch (error) {
      console.error('Error parsing and enhancing resume:', error);
      // Fallback: just apply enhancements to empty resume
      const enhancedResume = applyAllEnhancements(scoreData, null);
      return {
        original: null,
        enhanced: enhancedResume,
        enhancements: {
          addedSkills: enhancedResume.skills,
          addedAchievements: enhancedResume.achievements,
          originalSkills: [],
          originalAchievements: []
        }
      };
    }
  };

  return {
    parseScoringSuggestions,
    applySkillsToResume,
    enhanceAchievements,
    applyAllEnhancements,
    generatePreviewSummary,
    parseAndEnhanceResume
  };
};
