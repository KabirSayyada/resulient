
-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  type TEXT NOT NULL DEFAULT 'Full-time',
  description TEXT NOT NULL,
  requirements TEXT,
  tags TEXT[] DEFAULT '{}',
  posted_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  external_url TEXT,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on jobs table
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active jobs
CREATE POLICY "Anyone can view active jobs" 
  ON public.jobs 
  FOR SELECT 
  USING (is_active = true);

-- Create index for performance
CREATE INDEX idx_jobs_active_posted ON public.jobs(is_active, posted_date DESC);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_type ON public.jobs(type);
CREATE INDEX idx_jobs_tags ON public.jobs USING GIN(tags);

-- Add trigger to update the updated_at column
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
