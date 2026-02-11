'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Rep } from '@/lib/types';

export function useReps() {
  const [reps, setReps] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchReps() {
      try {
        const { data, error: fetchError } = await supabase
          .from('reps')
          .select('*')
          .order('display_order');

        if (fetchError) throw fetchError;
        setReps(data || []);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchReps();

    // Subscribe to changes
    const channel = supabase
      .channel('reps-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reps' },
        () => {
          fetchReps();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { reps, loading, error };
}
