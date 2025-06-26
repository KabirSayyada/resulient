
-- Add policy to allow anyone to insert jobs (for now, can be restricted later)
CREATE POLICY "Anyone can insert jobs" 
  ON public.jobs 
  FOR INSERT 
  WITH CHECK (true);

-- Add policy to allow anyone to update jobs (for future admin functionality)
CREATE POLICY "Anyone can update jobs" 
  ON public.jobs 
  FOR UPDATE 
  USING (true);

-- Add policy to allow anyone to delete jobs (for future admin functionality)
CREATE POLICY "Anyone can delete jobs" 
  ON public.jobs 
  FOR DELETE 
  USING (true);
