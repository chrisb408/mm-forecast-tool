'use client';

import type { DealCalculation } from '@/lib/types';
import {
  formatCurrency,
  formatDate,
  formatProbability,
} from '@/lib/utils/formatters';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';

interface DealTableProps {
  deals: DealCalculation[];
  onEdit: (deal: DealCalculation) => void;
  onDelete: (dealId: string) => void;
  onMarkClosed: (deal: DealCalculation) => void;
}

export default function DealTable({
  deals,
  onEdit,
  onDelete,
  onMarkClosed,
}: DealTableProps) {
  if (deals.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No deals in pipeline. Add your first deal!</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Active Pipeline</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left p-2 font-semibold">Deal Name</th>
            <th className="text-left p-2 font-semibold">Account</th>
            <th className="text-right p-2 font-semibold">ACV</th>
            <th className="text-center p-2 font-semibold">Stage</th>
            <th className="text-left p-2 font-semibold">S2 Date</th>
            <th className="text-right p-2 font-semibold">Days</th>
            <th className="text-right p-2 font-semibold">Age Adj</th>
            <th className="text-right p-2 font-semibold">Stage Prob</th>
            <th className="text-right p-2 font-semibold">Adj Prob</th>
            <th className="text-right p-2 font-semibold">Weighted $</th>
            <th className="text-left p-2 font-semibold">Expected Close</th>
            <th className="text-center p-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr
              key={deal.id}
              className={deal.is_stale ? 'stale-row' : 'table-row'}
            >
              <td className="p-2 font-medium">{deal.deal_name}</td>
              <td className="p-2">{deal.account}</td>
              <td className="text-right p-2">{formatCurrency(deal.acv)}</td>
              <td className="text-center p-2">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {deal.stage}
                </span>
              </td>
              <td className="p-2 text-sm">{formatDate(deal.s2_date)}</td>
              <td className="text-right p-2">{deal.days_in_stage}</td>
              <td className="text-right p-2">
                {formatProbability(deal.age_adjustment)}
              </td>
              <td className="text-right p-2">
                {formatProbability(deal.stage_probability)}
              </td>
              <td className="text-right p-2">
                {formatProbability(deal.adjusted_probability)}
              </td>
              <td className="text-right p-2 font-semibold">
                {formatCurrency(deal.weighted_value)}
              </td>
              <td className="p-2 text-sm">{formatDate(deal.expected_close)}</td>
              <td className="p-2">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => onEdit(deal)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onMarkClosed(deal)}
                    className="text-green-600 hover:text-green-800 transition"
                    title="Mark as Closed-Won"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(deal.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
