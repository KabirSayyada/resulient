
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
  percentile: string;  // Changed from number to string to accommodate textual rankings
  numSimilarResumes: number;
  suggestedSkills: string[];
  eliteIndicatorsFound: string[];
  improvementTips: string[];
  missingQualifications?: QualificationGap[];
  timestamp: string;
  id: string;
  scoringMode?: "resumeOnly";
}
