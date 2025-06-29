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
  scoringMode?: "resumeOnly" | "jobDescription";
}

// Interface to help with type safety when accessing Supabase resume_scores table
export interface ResumeScoreRecord {
  id: string;
  user_id: string;
  overall_score: number;
  keyword_relevance: number;
  skills_breadth: number;
  experience_duration: number;
  content_structure: number;
  ats_readiness: number;
  percentile: number;
  achievements_score?: number;
  education_score?: number;
  certifications_score?: number;
  similar_resumes?: number;
  industry: string;
  resume_content: string;
  job_description: string;
  scoring_mode?: string;
  elite_indicators?: string[];
  improvement_tips?: string[];
  suggested_skills?: string[];
  created_at: string;
}
