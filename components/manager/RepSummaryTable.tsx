'use client';

import { useRouter } from 'next/navigation';
import type { RepSummary } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

interface RepSummaryTableProps {
  summaries: RepSummary[];
}

export default function RepSummaryTable({ summaries }: RepSummaryTableProps) {
  const router = useRouter();

  return (
    <div className="card overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Team Forecast Rollup</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left p-2 font-semibold">Rep Name</th>
            <th className="text-right p-2 font-semibold">Quota</th>
            <th className="text-right p-2 font-semibold">Closed-Won</th>
            <th className="text-right p-2 font-semibold">Raw Pipeline</th>
            <th className="text-right p-2 font-semibold">Stale (60+d)</th>
            <th className="text-right p-2 font-semibold">Weighted</th>
            <th className="text-right p-2 font-semibold">Best Case</th>
            <th className="text-right p-2 font-semibold">Commit</th>
            <th className="text-right p-2 font-semibold">Conservative</th>
            <th className="text-right p-2 font-semibold">Best Case %</th>
            <th className="text-right p-2 font-semibold">Commit %</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((summary) => (
            <tr
              key={summary.rep_id}
              className="table-row cursor-pointer"
              onClick={() => router.push(`/rep/${summary.rep_id}`)}
            >
              <td className="p-2 font-medium text-blue-600 hover:text-blue-800">
                {summary.rep_name}
              </td>
              <td className="text-right p-2">{formatCurrency(summary.quota)}</td>
              <td className="text-right p-2 text-green-600">
                {formatCurrency(summary.closed_won)}
              </td>
              <td className="text-right p-2">
                {formatCurrency(summary.raw_pipeline)}
              </td>
              <td className="text-right p-2 text-yellow-600">
                {formatCurrency(summary.stale_pipeline)}
              </td>
              <td className="text-right p-2">
                {formatCurrency(summary.weighted_pipeline)}
              </td>
              <td className="text-right p-2">
                {formatCurrency(summary.best_case)}
              </td>
              <td className="text-right p-2">
                {formatCurrency(summary.commit_forecast)}
              </td>
              <td className="text-right p-2">
                {formatCurrency(summary.conservative)}
              </td>
              <td className="text-right p-2">
                {formatPercent(summary.best_case_pct)}
              </td>
              <td className="text-right p-2">
                {formatPercent(summary.commit_pct)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
