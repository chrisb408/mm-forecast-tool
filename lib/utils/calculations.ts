import { differenceInDays } from 'date-fns';
import { STAGE_PROBABILITIES, AGE_THRESHOLDS } from './constants';
import type { Deal, DealCalculation } from '@/lib/types';

export function calculateDaysInStage(s2Date: string): number {
  return differenceInDays(new Date(), new Date(s2Date));
}

export function calculateAgeAdjustment(daysInStage: number): number {
  if (daysInStage <= AGE_THRESHOLDS.STALE) return 1.0;
  if (daysInStage <= AGE_THRESHOLDS.VERY_STALE) return 0.6;
  return 0.5;
}

export function calculateWeightedValue(
  acv: number,
  stage: 2 | 3 | 4 | 5,
  daysInStage: number
): number {
  const stageProbability = STAGE_PROBABILITIES[stage];
  const ageAdjustment = calculateAgeAdjustment(daysInStage);
  return acv * stageProbability * ageAdjustment;
}

export function enrichDealWithCalculations(deal: Deal): DealCalculation {
  const daysInStage = calculateDaysInStage(deal.s2_date);
  const ageAdjustment = calculateAgeAdjustment(daysInStage);
  const stageProbability = STAGE_PROBABILITIES[deal.stage];
  const adjustedProbability = stageProbability * ageAdjustment;
  const weightedValue = deal.acv * adjustedProbability;

  return {
    ...deal,
    days_in_stage: daysInStage,
    age_adjustment: ageAdjustment,
    stage_probability: stageProbability,
    adjusted_probability: adjustedProbability,
    weighted_value: weightedValue,
    is_stale: daysInStage > AGE_THRESHOLDS.STALE,
  };
}
