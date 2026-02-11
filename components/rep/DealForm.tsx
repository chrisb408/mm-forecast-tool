'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Deal } from '@/lib/types';
import { STAGES, STAGE_LABELS } from '@/lib/utils/constants';
import { X } from 'lucide-react';

interface DealFormProps {
  repId: string;
  deal?: Deal;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DealForm({
  repId,
  deal,
  onClose,
  onSuccess,
}: DealFormProps) {
  const [formData, setFormData] = useState({
    deal_name: deal?.deal_name || '',
    account: deal?.account || '',
    acv: deal?.acv?.toString() || '',
    stage: deal?.stage?.toString() || '2',
    s2_date: deal?.s2_date || '',
    expected_close: deal?.expected_close || '',
    notes: deal?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const payload = {
        rep_id: repId,
        deal_name: formData.deal_name,
        account: formData.account,
        acv: parseFloat(formData.acv),
        stage: parseInt(formData.stage) as 2 | 3 | 4 | 5,
        s2_date: formData.s2_date,
        expected_close: formData.expected_close,
        notes: formData.notes || null,
      };

      if (deal) {
        // Update existing deal
        const { error: updateError } = await supabase
          .from('deals')
          .update(payload)
          .eq('id', deal.id);

        if (updateError) throw updateError;
      } else {
        // Create new deal
        const { error: insertError } = await supabase
          .from('deals')
          .insert([payload]);

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {deal ? 'Edit Deal' : 'Add New Deal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Name *
            </label>
            <input
              type="text"
              required
              value={formData.deal_name}
              onChange={(e) =>
                setFormData({ ...formData, deal_name: e.target.value })
              }
              className="input-field w-full"
              placeholder="Q1 Enterprise Deal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account *
            </label>
            <input
              type="text"
              required
              value={formData.account}
              onChange={(e) =>
                setFormData({ ...formData, account: e.target.value })
              }
              className="input-field w-full"
              placeholder="Acme Corp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ACV ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.acv}
                onChange={(e) =>
                  setFormData({ ...formData, acv: e.target.value })
                }
                className="input-field w-full"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage *
              </label>
              <select
                required
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value })
                }
                className="input-field w-full"
              >
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                S2 Date *
              </label>
              <input
                type="date"
                required
                value={formData.s2_date}
                onChange={(e) =>
                  setFormData({ ...formData, s2_date: e.target.value })
                }
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Close *
              </label>
              <input
                type="date"
                required
                value={formData.expected_close}
                onChange={(e) =>
                  setFormData({ ...formData, expected_close: e.target.value })
                }
                className="input-field w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="input-field w-full"
              rows={3}
              placeholder="Additional notes about this deal..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : deal ? 'Update Deal' : 'Add Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
