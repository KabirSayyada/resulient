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
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(scoreId)) {
        console.error('Invalid UUID format:', scoreId);
        throw new Error(`Invalid score ID format: ${scoreId}`);
      }
      
      // 1. Fetch the score record to get original resume content
      const { data: scoreRecord, error } = await supabase
        .from('resume_scores')
        .select('resume_content')
        .eq('id', scoreId)
        .single();

      if (error) {
        console.error('Error fetching score record:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!scoreRecord || !scoreRecord.resume_content) {
        console.error('No resume content found in score record');
        throw new Error('Resume content not found');
      }

      // 2. Parse the original resume text into structured format
      console.log('Parsing resume text...');
      const parsedResume = parseATSResumeText(scoreRecord.resume_content);
      console.log('Parsed resume:', parsedResume);
      
      const originalResumeData = convertParsedResumeToBuilderFormat(parsedResume);
      console.log('Converted to builder format:', originalResumeData);

      // 3. Apply AI enhancements to the original data
      const enhancedResumeData = applyAllEnhancements(scoreData, originalResumeData);
      console.log('Enhanced resume data:', enhancedResumeData);

      // 4. Identify what was enhanced for visual indicators
      const enhancements = identifyEnhancements(originalResumeData, enhancedResumeData);

      return {
        original: originalResumeData,
        enhanced: enhancedResumeData,
        enhancements
      };
    } catch (error) {
      console.error('Error parsing and enhancing resume:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback: just apply enhancements to empty resume
      const enhancedResume = applyAllEnhancements(scoreData, null);
      return {
        original: null,
        enhanced: enhancedResume,
        enhancements: {
          addedSkills: enhancedResume.skills || [],
          addedAchievements: enhancedResume.achievements || [],
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
