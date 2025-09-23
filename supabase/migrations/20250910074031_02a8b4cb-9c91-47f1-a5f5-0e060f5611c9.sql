-- Fix the last function search path issue
CREATE OR REPLACE FUNCTION public.calculate_session_volume(session_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_vol DECIMAL := 0;
BEGIN
  SELECT COALESCE(SUM(sl.weight * sl.reps), 0)
  INTO total_vol
  FROM public.set_logs sl
  JOIN public.exercise_logs el ON sl.exercise_log_id = el.id
  WHERE el.session_id = session_id_param AND sl.completed = true;
  
  RETURN total_vol;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;