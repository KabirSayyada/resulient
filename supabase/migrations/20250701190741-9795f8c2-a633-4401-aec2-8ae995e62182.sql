
-- Add missing columns to resume_optimizations table
ALTER TABLE public.resume_optimizations 
ADD COLUMN template_used text DEFAULT 'standard',
ADD COLUMN parsed_resume_data jsonb;
