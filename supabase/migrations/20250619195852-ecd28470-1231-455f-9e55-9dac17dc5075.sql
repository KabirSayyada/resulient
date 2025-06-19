
-- Create usage tracking table to monitor user activity across all features
CREATE TABLE public.user_usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL, -- 'resume_scoring', 'resume_optimization', 'resume_building'
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_type, usage_date)
);

-- Create indexes for better performance
CREATE INDEX idx_user_usage_tracking_user_feature ON public.user_usage_tracking(user_id, feature_type);
CREATE INDEX idx_user_usage_tracking_date ON public.user_usage_tracking(usage_date);

-- Enable Row Level Security
ALTER TABLE public.user_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own usage" ON public.user_usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON public.user_usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON public.user_usage_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_user_usage(
  p_user_id UUID,
  p_feature_type TEXT
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Insert or update usage for today
  INSERT INTO public.user_usage_tracking (user_id, feature_type, usage_date, usage_count)
  VALUES (p_user_id, p_feature_type, CURRENT_DATE, 1)
  ON CONFLICT (user_id, feature_type, usage_date)
  DO UPDATE SET 
    usage_count = user_usage_tracking.usage_count + 1,
    updated_at = now();
  
  -- Return current count for today
  SELECT usage_count INTO current_count
  FROM public.user_usage_tracking
  WHERE user_id = p_user_id 
    AND feature_type = p_feature_type 
    AND usage_date = CURRENT_DATE;
  
  RETURN current_count;
END;
$$;

-- Create function to get current usage count
CREATE OR REPLACE FUNCTION public.get_user_usage_count(
  p_user_id UUID,
  p_feature_type TEXT,
  p_date DATE DEFAULT CURRENT_DATE
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  usage_count INTEGER;
BEGIN
  SELECT COALESCE(usage_count, 0) INTO usage_count
  FROM public.user_usage_tracking
  WHERE user_id = p_user_id 
    AND feature_type = p_feature_type 
    AND usage_date = p_date;
  
  RETURN COALESCE(usage_count, 0);
END;
$$;

-- Create function to get total usage count (for lifetime limits like resume building)
CREATE OR REPLACE FUNCTION public.get_user_total_usage_count(
  p_user_id UUID,
  p_feature_type TEXT
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(usage_count), 0) INTO total_count
  FROM public.user_usage_tracking
  WHERE user_id = p_user_id 
    AND feature_type = p_feature_type;
  
  RETURN COALESCE(total_count, 0);
END;
$$;
