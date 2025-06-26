
-- Create job postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  job_type TEXT, -- full-time, part-time, contract, etc.
  work_arrangement TEXT, -- remote, hybrid, onsite
  description TEXT NOT NULL,
  requirements TEXT,
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  source_url TEXT NOT NULL,
  source_platform TEXT NOT NULL, -- indeed, linkedin, glassdoor
  company_size TEXT,
  industry TEXT,
  experience_level TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create user job preferences table
CREATE TABLE public.user_job_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_locations TEXT[],
  salary_min INTEGER,
  salary_max INTEGER,
  job_types TEXT[],
  work_arrangements TEXT[],
  industries TEXT[],
  experience_levels TEXT[],
  keywords TEXT[],
  exclude_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job applications tracking table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  application_method TEXT NOT NULL, -- direct, email, company_website
  cover_letter TEXT,
  resume_version TEXT,
  status TEXT NOT NULL DEFAULT 'applied', -- applied, viewed, interview, rejected, hired
  status_updated_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job matches table for AI scoring
CREATE TABLE public.job_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL, -- 0-100 relevance score
  skills_match INTEGER NOT NULL, -- 0-100 skills alignment
  experience_match INTEGER NOT NULL, -- 0-100 experience alignment
  location_match INTEGER NOT NULL, -- 0-100 location preference match
  salary_match INTEGER NOT NULL, -- 0-100 salary expectation match
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_posting_id)
);

-- Add indexes for better performance
CREATE INDEX idx_job_postings_posted_at ON public.job_postings(posted_at DESC);
CREATE INDEX idx_job_postings_active ON public.job_postings(is_active) WHERE is_active = true;
CREATE INDEX idx_job_postings_company ON public.job_postings(company);
CREATE INDEX idx_job_postings_location ON public.job_postings(location);
CREATE INDEX idx_job_matches_user_score ON public.job_matches(user_id, match_score DESC);
CREATE INDEX idx_job_applications_user ON public.job_applications(user_id, applied_at DESC);

-- Enable Row Level Security
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_postings (public read access)
CREATE POLICY "Anyone can view active job postings" 
  ON public.job_postings 
  FOR SELECT 
  USING (is_active = true);

-- RLS Policies for user_job_preferences
CREATE POLICY "Users can view their own job preferences" 
  ON public.user_job_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job preferences" 
  ON public.user_job_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job preferences" 
  ON public.user_job_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job preferences" 
  ON public.user_job_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for job_applications
CREATE POLICY "Users can view their own job applications" 
  ON public.job_applications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job applications" 
  ON public.job_applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job applications" 
  ON public.job_applications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for job_matches
CREATE POLICY "Users can view their own job matches" 
  ON public.job_matches 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create job matches" 
  ON public.job_matches 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update job matches" 
  ON public.job_matches 
  FOR UPDATE 
  USING (true);
