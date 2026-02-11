'use client';

import { useState } from 'react';
import { useDeals } from '@/lib/hooks/useDeals';
import { createClient } from '@/lib/supabase/client';
import DealTable from './DealTable';
import DealForm from './DealForm';
import RepMetrics from './RepMetrics';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import type { DealCalculation } from '@/lib/types';
import { Plus } from 'lucide-react';

interface RepViewProps {
  repId: string;
  repName: string;
}

export default function RepView({ repId, repName }: RepViewProps) {
  const { deals, loading, error } = useDeals(repId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealCalculation | null>(null);

  const handleEdit = (deal: DealCalculation) => {
    setEditingDeal(deal);
    setIsFormOpen(true);
  };

  const handleDelete = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (deleteError) throw deleteError;
    } catch (err) {
      alert(`Error deleting deal: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleMarkClosed = async (deal: DealCalculation) => {
    if (!confirm(`Mark "${deal.deal_name}" as Closed-Won?`)) return;

    try {
      const supabase = createClient();

      // Insert into closed_deals
      const { error: insertError } = await supabase.from('closed_deals').insert([
        {
          rep_id: deal.rep_id,
          deal_name: deal.deal_name,
          account: deal.account,
          acv: deal.acv,
          close_date: new Date().toISOString().split('T')[0],
        },
      ]);

      if (insertError) throw insertError;

      // Delete from deals
      const { error: deleteError } = await supabase
        .from('deals')
        .delete()
        .eq('id', deal.id);

      if (deleteError) throw deleteError;
    } catch (err) {
      alert(`Error marking deal as closed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDeal(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="card bg-red-50 text-red-800">
        <p>Error loading deals: {error.message}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{repName}&apos;s Pipeline</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Deal</span>
        </button>
      </div>

      <RepMetrics deals={deals} />

      <DealTable
        deals={deals}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMarkClosed={handleMarkClosed}
      />

      {isFormOpen && (
        <DealForm
          repId={repId}
          deal={editingDeal || undefined}
          onClose={handleCloseForm}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
