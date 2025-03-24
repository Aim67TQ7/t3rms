
-- Create table for anonymous feedback
CREATE TABLE IF NOT EXISTS public.anonymous_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RPC function to increment remaining analyses
CREATE OR REPLACE FUNCTION public.increment_remaining_analyses(increment_amount INTEGER)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
AS $$
  UPDATE public.t3rms_users 
  SET monthly_remaining = COALESCE(monthly_remaining, 0) + increment_amount
  WHERE user_id = auth.uid()
  RETURNING monthly_remaining;
$$;
