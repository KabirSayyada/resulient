-- Drop resume optimization, jobs, and job applications tables
DROP TABLE IF EXISTS public.resume_optimizations CASCADE;
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;

-- Update user_usage_tracking to remove optimization and job fetch tracking
-- (Keep the table but users won't create new records for these features)

-- Note: Existing usage tracking records will remain for historical data