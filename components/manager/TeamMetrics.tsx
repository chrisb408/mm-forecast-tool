import type { RepSummary } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

interface TeamMetricsProps {
  summaries: RepSummary[];
}

export default function TeamMetrics({ summaries }: TeamMetricsProps) {
  const totals = summaries.reduce(
    (acc, summary) => ({
      quota: acc.quota + summary.quota,
      closedWon: acc.closedWon + summary.closed_won,
      rawPipeline: acc.rawPipeline + summary.raw_pipeline,
      weightedPipeline: acc.weightedPipeline + summary.weighted_pipeline,
      bestCase: acc.bestCase + summary.best_case,
      commit: acc.commit + summary.commit_forecast,
      conservative: acc.conservative + summary.conservative,
    }),
    {
      quota: 0,
      closedWon: 0,
      rawPipeline: 0,
      weightedPipeline: 0,
      bestCase: 0,
      commit: 0,
      conservative: 0,
    }
  );

  const bestCasePct = totals.quota > 0 ? (totals.bestCase / totals.quota) * 100 : 0;
  const commitPct = totals.quota > 0 ? (totals.commit / totals.quota) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Total Quota</h3>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(totals.quota)}
        </p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Closed-Won</h3>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(totals.closedWon)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {formatPercent((totals.closedWon / totals.quota) * 100)} of quota
        </p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Best Case</h3>
        <p className="text-2xl font-bold text-blue-600">
          {formatCurrency(totals.bestCase)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {formatPercent(bestCasePct)} of quota
        </p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Commit</h3>
        <p className="text-2xl font-bold text-purple-600">
          {formatCurrency(totals.commit)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {formatPercent(commitPct)} of quota
        </p>
      </div>
    </div>
  );
}
