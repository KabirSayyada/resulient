
-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Add external_job_id column to jobs table to prevent duplicates
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS external_job_id text;

-- Create index for external_job_id for faster duplicate checking
CREATE INDEX IF NOT EXISTS idx_jobs_external_job_id ON public.jobs(external_job_id);

-- Create index for posted_date for faster cleanup queries
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON public.jobs(posted_date);

-- Schedule job scraping to run 6 times per day (every 4 hours)
-- This will run at: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC
SELECT cron.schedule(
  'auto-scrape-jobs',
  '0 */4 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://zllrplxlewqyipxxpetl.supabase.co/functions/v1/auto-scrape-jobs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbHJwbHhsZXdxeWlweHhwZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDU3NzksImV4cCI6MjA2MDU4MTc3OX0.1TRnufxXW7jdyGLw260j3i_Wl4ciKhb_eMXc3G1uRtk"}'::jsonb,
        body:='{"automated": true}'::jsonb
    ) as request_id;
  $$
);
