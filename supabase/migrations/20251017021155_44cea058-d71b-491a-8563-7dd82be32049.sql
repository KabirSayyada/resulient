-- Add enhancement tracking to user_resume_data table
ALTER TABLE user_resume_data 
ADD COLUMN IF NOT EXISTS enhancements JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS applied_from_score_id UUID REFERENCES resume_scores(id);