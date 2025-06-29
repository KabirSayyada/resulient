
-- Add the missing external_job_id column to the jobs table
ALTER TABLE public.jobs ADD COLUMN external_job_id TEXT;

-- Create an index on external_job_id for better performance when checking duplicates
CREATE INDEX idx_jobs_external_job_id ON public.jobs(external_job_id);
