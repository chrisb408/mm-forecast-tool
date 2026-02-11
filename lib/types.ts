export interface Rep {
  id: string;
  name: string;
  quota: number;
  display_order: number;
  created_at: string;
}

export interface Deal {
  id: string;
  rep_id: string;
  deal_name: string;
  account: string;
  acv: number;
  stage: 2 | 3 | 4 | 5;
  s2_date: string;
  expected_close: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DealCalculation extends Deal {
  days_in_stage: number;
  age_adjustment: number;
  stage_probability: number;
  adjusted_probability: number;
  weighted_value: number;
  is_stale: boolean;
}

export interface RepSummary {
  rep_id: string;
  rep_name: string;
  quota: number;
  display_order: number;
  closed_won: number;
  raw_pipeline: number;
  stale_pipeline: number;
  weighted_pipeline: number;
  best_case: number;
  commit_forecast: number;
  conservative: number;
  best_case_pct: number;
  commit_pct: number;
}

export interface ClosedDeal {
  id: string;
  rep_id: string;
  deal_name: string;
  account: string;
  acv: number;
  close_date: string;
  created_at: string;
}

export type Stage = 2 | 3 | 4 | 5;
