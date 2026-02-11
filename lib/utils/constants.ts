export const STAGE_PROBABILITIES = {
  2: 0.57,
  3: 0.78,
  4: 0.88,
  5: 0.96,
} as const;

export const STAGES = [2, 3, 4, 5] as const;

export const STAGE_LABELS = {
  2: 'Stage 2',
  3: 'Stage 3',
  4: 'Stage 4',
  5: 'Stage 5',
} as const;

export const AGE_THRESHOLDS = {
  STALE: 60,
  VERY_STALE: 90,
} as const;

export const DEFAULT_QUOTA = 150000;
