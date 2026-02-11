-- Sales Forecast Tool - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Reps table
CREATE TABLE reps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  quota NUMERIC DEFAULT 150000,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table (active pipeline)
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES reps(id) ON DELETE CASCADE,
  deal_name TEXT NOT NULL,
  account TEXT NOT NULL,
  acv NUMERIC NOT NULL CHECK (acv >= 0),
  stage INTEGER NOT NULL CHECK (stage IN (2, 3, 4, 5)),
  s2_date DATE NOT NULL,
  expected_close DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Closed deals table (won deals)
CREATE TABLE closed_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID NOT NULL REFERENCES reps(id) ON DELETE CASCADE,
  deal_name TEXT NOT NULL,
  account TEXT NOT NULL,
  acv NUMERIC NOT NULL,
  close_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_deals_rep_id ON deals(rep_id);
CREATE INDEX idx_deals_expected_close ON deals(expected_close);
CREATE INDEX idx_closed_deals_rep_id ON closed_deals(rep_id);

-- =============================================
-- 2. SEED INITIAL REPS
-- =============================================

INSERT INTO reps (name, quota, display_order) VALUES
  ('Rishabh', 150000, 1),
  ('Claire', 150000, 2),
  ('Sunah', 150000, 3),
  ('Matt', 150000, 4),
  ('Jake', 150000, 5),
  ('Ron', 150000, 6),
  ('TBH 1', 150000, 7),
  ('TBH 2', 150000, 8);

-- =============================================
-- 3. CREATE REP SUMMARY VIEW
-- =============================================

CREATE OR REPLACE VIEW rep_summary AS
SELECT
  r.id AS rep_id,
  r.name AS rep_name,
  r.quota,
  r.display_order,

  -- Closed Won
  COALESCE(SUM(cd.acv), 0) AS closed_won,

  -- Raw Pipeline (sum of all ACVs)
  COALESCE(SUM(d.acv), 0) AS raw_pipeline,

  -- Weighted Pipeline (sum of all weighted values)
  COALESCE(SUM(
    d.acv *
    -- Stage probability
    (CASE d.stage WHEN 2 THEN 0.57 WHEN 3 THEN 0.78 WHEN 4 THEN 0.88 WHEN 5 THEN 0.96 END) *
    -- Age adjustment
    (CASE
      WHEN CURRENT_DATE - d.s2_date <= 60 THEN 1.0
      WHEN CURRENT_DATE - d.s2_date <= 90 THEN 0.6
      ELSE 0.5
    END)
  ), 0) AS weighted_pipeline,

  -- Stale Pipeline (deals 60+ days old)
  COALESCE(SUM(CASE WHEN CURRENT_DATE - d.s2_date > 60 THEN d.acv ELSE 0 END), 0) AS stale_pipeline,

  -- Best Case = Closed-Won + All deals (stage >= 2)
  COALESCE(SUM(cd.acv), 0) + COALESCE(SUM(
    CASE WHEN d.stage >= 2 THEN
      d.acv *
      (CASE d.stage WHEN 2 THEN 0.57 WHEN 3 THEN 0.78 WHEN 4 THEN 0.88 WHEN 5 THEN 0.96 END) *
      (CASE WHEN CURRENT_DATE - d.s2_date <= 60 THEN 1.0 WHEN CURRENT_DATE - d.s2_date <= 90 THEN 0.6 ELSE 0.5 END)
    ELSE 0 END
  ), 0) AS best_case,

  -- Commit = Closed-Won + Stage 4-5 deals
  COALESCE(SUM(cd.acv), 0) + COALESCE(SUM(
    CASE WHEN d.stage >= 4 THEN
      d.acv *
      (CASE d.stage WHEN 4 THEN 0.88 WHEN 5 THEN 0.96 END) *
      (CASE WHEN CURRENT_DATE - d.s2_date <= 60 THEN 1.0 WHEN CURRENT_DATE - d.s2_date <= 90 THEN 0.6 ELSE 0.5 END)
    ELSE 0 END
  ), 0) AS commit_forecast,

  -- Conservative = Closed-Won + Stage 5 only
  COALESCE(SUM(cd.acv), 0) + COALESCE(SUM(
    CASE WHEN d.stage = 5 THEN
      d.acv * 0.96 *
      (CASE WHEN CURRENT_DATE - d.s2_date <= 60 THEN 1.0 WHEN CURRENT_DATE - d.s2_date <= 90 THEN 0.6 ELSE 0.5 END)
    ELSE 0 END
  ), 0) AS conservative,

  -- Best Case Percentage
  CASE WHEN r.quota > 0 THEN (
    COALESCE(SUM(cd.acv), 0) + COALESCE(SUM(
      CASE WHEN d.stage >= 2 THEN d.acv * (CASE d.stage WHEN 2 THEN 0.57 WHEN 3 THEN 0.78 WHEN 4 THEN 0.88 WHEN 5 THEN 0.96 END) * (CASE WHEN CURRENT_DATE - d.s2_date <= 60 THEN 1.0 WHEN CURRENT_DATE - d.s2_date <= 90 THEN 0.6 ELSE 0.5 END) ELSE 0 END
    ), 0)
  ) / r.quota * 100 ELSE 0 END AS best_case_pct,

  -- Commit Percentage
  CASE WHEN r.quota > 0 THEN (
    COALESCE(SUM(cd.acv), 0) + COALESCE(SUM(
      CASE WHEN d.stage >= 4 THEN d.acv * (CASE d.stage WHEN 4 THEN 0.88 WHEN 5 THEN 0.96 END) * (CASE WHEN CURRENT_DATE - d.s2_date <= 60 THEN 1.0 WHEN CURRENT_DATE - d.s2_date <= 90 THEN 0.6 ELSE 0.5 END) ELSE 0 END
    ), 0)
  ) / r.quota * 100 ELSE 0 END AS commit_pct

FROM reps r
LEFT JOIN deals d ON r.id = d.rep_id
LEFT JOIN closed_deals cd ON r.id = cd.rep_id
GROUP BY r.id, r.name, r.quota, r.display_order
ORDER BY r.display_order;

-- =============================================
-- 4. ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE closed_deals ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no authentication required)
CREATE POLICY "Enable all for reps" ON reps FOR ALL USING (true);
CREATE POLICY "Enable all for deals" ON deals FOR ALL USING (true);
CREATE POLICY "Enable all for closed_deals" ON closed_deals FOR ALL USING (true);

-- =============================================
-- 5. ENABLE REAL-TIME (Do this in Dashboard)
-- =============================================

-- After running this SQL, go to:
-- Database > Replication
-- Enable replication for: reps, deals, closed_deals
