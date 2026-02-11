'use client';

import { useRepSummary } from '@/lib/hooks/useRepSummary';
import RepSummaryTable from './RepSummaryTable';
import TeamMetrics from './TeamMetrics';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ManagerView() {
  const { summaries, loading, error } = useRepSummary();

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="card bg-red-50 text-red-800">
        <p>Error loading data: {error.message}</p>
        <p className="text-sm mt-2">
          Make sure you&apos;ve set up your Supabase database and added the environment
          variables.
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <TeamMetrics summaries={summaries} />
      <RepSummaryTable summaries={summaries} />
    </div>
  );
}
