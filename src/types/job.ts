
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string | null;
  salary_min: number | null;
  salary_max: number | null;
  job_type: string | null;
  work_arrangement: string | null;
  description: string;
  requirements: string | null;
  posted_at: string;
  expires_at: string | null;
  source_url: string;
  source_platform: string;
  company_size: string | null;
  industry: string | null;
  experience_level: string | null;
  scraped_at: string;
  created_at: string;
  is_active: boolean;
}

export interface JobMatch {
  id: string;
  user_id: string;
  job_posting_id: string;
  match_score: number;
  skills_match: number;
  experience_match: number;
  location_match: number;
  salary_match: number;
  calculated_at: string;
  job_posting?: JobPosting;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_posting_id: string;
  applied_at: string;
  application_method: string;
  cover_letter: string | null;
  resume_version: string | null;
  status: string;
  status_updated_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface UserJobPreferences {
  id: string;
  user_id: string;
  preferred_locations: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  job_types: string[] | null;
  work_arrangements: string[] | null;
  industries: string[] | null;
  experience_levels: string[] | null;
  keywords: string[] | null;
  exclude_keywords: string[] | null;
  created_at: string;
  updated_at: string;
}
