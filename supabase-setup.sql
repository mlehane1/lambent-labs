-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Creates the visitor tracking tables and RLS policies

-- Visitors table (one row per new session)
CREATE TABLE visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  company TEXT,
  isp TEXT,
  first_page TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_visitors_session ON visitors(session_id);
CREATE INDEX idx_visitors_created ON visitors(created_at DESC);

-- Visitor events table (page views, clicks, form events, scroll depth)
CREATE TABLE visitor_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  page_path TEXT,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_session ON visitor_events(session_id);
CREATE INDEX idx_events_created ON visitor_events(created_at DESC);
CREATE INDEX idx_events_type ON visitor_events(event_type);

-- RLS: server inserts with service role key (bypasses RLS)
-- Admin dashboard reads with anon key (SELECT only)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read on visitors" ON visitors FOR SELECT USING (true);
CREATE POLICY "Allow anon read on visitor_events" ON visitor_events FOR SELECT USING (true);
