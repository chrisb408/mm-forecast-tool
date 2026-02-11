'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RepSummary } from '@/lib/types';

export function useRepSummary() {
  const [summaries, setSummaries] = useState<RepSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchSummary() {
      try {
        const { data, error: fetchError } = await supabase
          .from('rep_summary')
          .select('*')
          .order('display_order');

        if (fetchError) throw fetchError;
        setSummaries(data || []);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();

    // Subscribe to changes in deals and closed_deals
    const dealsChannel = supabase
      .channel('summary-deals-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deals' },
        () => {
          fetchSummary();
        }
      )
      .subscribe();

    const closedChannel = supabase
      .channel('summary-closed-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'closed_deals' },
        () => {
          fetchSummary();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dealsChannel);
      supabase.removeChannel(closedChannel);
    };
  }, []);

  return { summaries, loading, error };
}
