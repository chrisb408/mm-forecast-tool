import type { DealCalculation } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/formatters';

interface RepMetricsProps {
  deals: DealCalculation[];
}

export default function RepMetrics({ deals }: RepMetricsProps) {
  const metrics = deals.reduce(
    (acc, deal) => ({
      rawPipeline: acc.rawPipeline + deal.acv,
      weightedPipeline: acc.weightedPipeline + deal.weighted_value,
      staleCount: acc.staleCount + (deal.is_stale ? 1 : 0),
      staleValue: acc.staleValue + (deal.is_stale ? deal.acv : 0),
      bestCase: acc.bestCase + (deal.stage >= 2 ? deal.weighted_value : 0),
      commit: acc.commit + (deal.stage >= 4 ? deal.weighted_value : 0),
      conservative: acc.conservative + (deal.stage === 5 ? deal.weighted_value : 0),
    }),
    {
      rawPipeline: 0,
      weightedPipeline: 0,
      staleCount: 0,
      staleValue: 0,
      bestCase: 0,
      commit: 0,
      conservative: 0,
    }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Raw Pipeline</h3>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(metrics.rawPipeline)}
        </p>
        <p className="text-sm text-gray-500 mt-1">{deals.length} deals</p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Weighted Pipeline
        </h3>
        <p className="text-2xl font-bold text-blue-600">
          {formatCurrency(metrics.weightedPipeline)}
        </p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Stale Deals</h3>
        <p className="text-2xl font-bold text-yellow-600">{metrics.staleCount}</p>
        <p className="text-sm text-gray-500 mt-1">
          {formatCurrency(metrics.staleValue)} value
        </p>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Best Case</h3>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(metrics.bestCase)}
        </p>
      </div>
    </div>
  );
}
