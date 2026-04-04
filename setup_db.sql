-- BrainHireAI Database Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com)

-- 1. Create Jobs Table
-- This table stores the high-level job descriptions and metadata.
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- 2. Create Candidates Table
-- This table stores the results of the AI/Heuristic scans.
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  score INTEGER DEFAULT 0,
  reasoning TEXT,
  matched_keywords TEXT[],
  status TEXT DEFAULT 'Pending',
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Set Up Row Level Security (RLS)
-- Ensuring that recruiters can only see and edit their own candidates.
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own job records
CREATE POLICY "Users can view their own jobs" ON public.jobs
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own job records
CREATE POLICY "Users can insert their own jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view candidates related to their own jobs
CREATE POLICY "Users can view candidates for their jobs" ON public.candidates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = candidates.job_id AND jobs.user_id = auth.uid()
    )
  );

-- Policy: Admin/System can insert candidates (backend only)
CREATE POLICY "System can insert candidates" ON public.candidates
  FOR INSERT WITH CHECK (true);
