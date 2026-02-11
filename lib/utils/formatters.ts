import { format } from 'date-fns';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(date: string): string {
  try {
    return format(new Date(date), 'MMM d, yyyy');
  } catch {
    return date;
  }
}

export function formatMonth(date: string): string {
  try {
    return format(new Date(date), 'MMM yyyy');
  } catch {
    return date;
  }
}

export function formatProbability(probability: number): string {
  return `${(probability * 100).toFixed(0)}%`;
}
