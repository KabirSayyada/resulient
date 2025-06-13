
-- Create table to store user resume data for reuse
CREATE TABLE public.user_resume_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id) -- Each user can have only one saved resume data
);

-- Enable RLS on user_resume_data table
ALTER TABLE public.user_resume_data ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own resume data
CREATE POLICY "Users can view their own resume data" 
  ON public.user_resume_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own resume data
CREATE POLICY "Users can create their own resume data" 
  ON public.user_resume_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own resume data
CREATE POLICY "Users can update their own resume data" 
  ON public.user_resume_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own resume data
CREATE POLICY "Users can delete their own resume data" 
  ON public.user_resume_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_user_resume_data_user_id ON public.user_resume_data(user_id);

-- Add trigger to update the updated_at column
CREATE TRIGGER update_user_resume_data_updated_at
  BEFORE UPDATE ON public.user_resume_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
