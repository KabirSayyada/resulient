
export interface QualificationGap {
  skill: string;
  importance: string;
  howToAcquire: string;
}

export interface ScoreData {
  overallScore: number;
  skillsAlignment: number;
  WorkExperience: number;
  Achievements: number;
  EducationQuality: number;
  Certifications: number;
  ContentStructure: number;
  keywordRelevance: number;
  Industry: string;
  percentile: string;  // Can be textual ranking like "Top 1%" or "Above Average"
  numSimilarResumes: number;
  suggestedSkills: string[];
  eliteIndicatorsFound: string[];
  improvementTips: string[];
  missingQualifications?: QualificationGap[];
  timestamp: string;
  id: string;
  scoringMode?: "resumeOnly";
}
