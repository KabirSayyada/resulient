-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a daily cron job to clean up old jobs (runs at 2 AM UTC daily)
SELECT cron.schedule(
  'cleanup-old-jobs-daily',
  '0 2 * * *', -- At 2:00 AM UTC every day
  $$
  SELECT
    net.http_post(
        url:='https://zllrplxlewqyipxxpetl.supabase.co/functions/v1/cleanup-old-jobs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbHJwbHhsZXdxeWlweHhwZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDU3NzksImV4cCI6MjA2MDU4MTc3OX0.1TRnufxXW7jdyGLw260j3i_Wl4ciKhb_eMXc3G1uRtk"}'::jsonb,
        body:=concat('{"triggered_at": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Also run an immediate cleanup for existing old jobs
SELECT
  net.http_post(
      url:='https://zllrplxlewqyipxxpetl.supabase.co/functions/v1/cleanup-old-jobs',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbHJwbHhsZXdxeWlweHhwZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDU3NzksImV4cCI6MjA2MDU4MTc3OX0.1TRnufxXW7jdyGLw260j3i_Wl4ciKhb_eMXc3G1uRtk"}'::jsonb,
      body:='{"manual_trigger": true}'::jsonb
  ) as initial_cleanup;