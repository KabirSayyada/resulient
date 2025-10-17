import { ParsedResume } from "@/types/resumeStructure";
import { ResumeData } from "@/components/resume/ResumeBuilderForm";

/**
 * Converts a ParsedResume (from text parsing) to ResumeData (Builder format)
 */
export function convertParsedResumeToBuilderFormat(parsed: ParsedResume): ResumeData {
  return {
    personalInfo: {
      name: parsed.contact?.name || "",
      email: parsed.contact?.email || "",
      phone: parsed.contact?.phone || "",
      location: parsed.contact?.address || ""
    },
    workExperience: (parsed.workExperience || []).map(exp => ({
      company: exp.company || "",
      position: exp.position || "",
      location: exp.location || "",
      startYear: exp.startDate || "",
      endYear: exp.endDate || "",
      description: (exp.responsibilities || []).join("\n• ")
    })),
    skills: (parsed.skills || []).filter(s => s && s.trim()),
    education: (parsed.education || []).map(edu => ({
      institution: edu.institution || "",
      degree: edu.degree || "",
      field: edu.field || "",
      year: edu.graduationDate || ""
    })),
    achievements: (parsed.achievements || [])
      .filter(ach => ach && ach.trim())
      .map(ach => ({
        title: "Achievement",
        description: ach
      }))
  };
}

/**
 * Identifies what was enhanced by comparing original and enhanced resume
 */
export function identifyEnhancements(
  original: ResumeData,
  enhanced: ResumeData
): {
  addedSkills: string[];
  addedAchievements: Array<{ title: string; description: string }>;
  originalSkills: string[];
  originalAchievements: Array<{ title: string; description: string }>;
} {
  const originalSkillsSet = new Set(
    (original.skills || []).map(s => s.toLowerCase().trim())
  );
  const originalAchievementsSet = new Set(
    (original.achievements || []).map(a => a.description.toLowerCase().trim())
  );

  const addedSkills = (enhanced.skills || []).filter(
    skill => !originalSkillsSet.has(skill.toLowerCase().trim())
  );

  const addedAchievements = (enhanced.achievements || []).filter(
    ach => !originalAchievementsSet.has(ach.description.toLowerCase().trim())
  );

  return {
    addedSkills,
    addedAchievements,
    originalSkills: original.skills || [],
    originalAchievements: original.achievements || []
  };
}
