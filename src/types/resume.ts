
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
  ats_readiness: number;
  content_structure: number;
  created_at: string;
  experience_duration: number;
  id: string;
  industry: string;
  job_description: string;
  keyword_relevance: number;
  overall_score: number;
  percentile: number;
  resume_content: string;
  scoring_mode: string | null;
  skills_breadth: number;
  suggested_skills: string[] | null;
  user_id: string;
  
  // Add these optional fields that might not exist in all database records
  achievements_score?: number;
  education_score?: number;
  certifications_score?: number;
  similar_resumes?: number;
  elite_indicators?: string[];
  improvement_tips?: string[];
}
