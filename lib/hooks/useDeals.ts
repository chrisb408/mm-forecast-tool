'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Deal, DealCalculation } from '@/lib/types';
import { enrichDealWithCalculations } from '@/lib/utils/calculations';

export function useDeals(repId?: string) {
  const [deals, setDeals] = useState<DealCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchDeals() {
      try {
        let query = supabase.from('deals').select('*');

        if (repId) {
          query = query.eq('rep_id', repId);
        }

        const { data, error: fetchError } = await query.order('expected_close');

        if (fetchError) throw fetchError;

        // Enrich with calculations on client side
        const enrichedDeals = (data || []).map(enrichDealWithCalculations);
        setDeals(enrichedDeals);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();

    // Subscribe to changes
    const channel = supabase
      .channel(`deals-changes-${repId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deals',
          filter: repId ? `rep_id=eq.${repId}` : undefined,
        },
        () => {
          fetchDeals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [repId]);

  return { deals, loading, error, refetch: async () => {} };
}
