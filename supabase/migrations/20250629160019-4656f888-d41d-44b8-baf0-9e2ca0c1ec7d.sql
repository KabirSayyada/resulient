
-- Add user_id column to jobs table to link jobs to specific users
ALTER TABLE public.jobs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Clear all existing jobs since we're starting fresh with user-specific jobs
DELETE FROM public.jobs;

-- Enable Row Level Security on jobs table
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view only their own jobs
CREATE POLICY "Users can view their own jobs" 
  ON public.jobs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own jobs
CREATE POLICY "Users can create their own jobs" 
  ON public.jobs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own jobs
CREATE POLICY "Users can update their own jobs" 
  ON public.jobs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own jobs
CREATE POLICY "Users can delete their own jobs" 
  ON public.jobs 
  FOR DELETE 
  USING (auth.uid() = user_id);
