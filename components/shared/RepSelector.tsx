'use client';

import { useReps } from '@/lib/hooks/useReps';
import { useRouter } from 'next/navigation';

interface RepSelectorProps {
  currentRepId?: string;
}

export default function RepSelector({ currentRepId }: RepSelectorProps) {
  const { reps, loading } = useReps();
  const router = useRouter();

  const handleChange = (value: string) => {
    if (value === 'manager') {
      router.push('/');
    } else {
      router.push(`/rep/${value}`);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <select
      value={currentRepId || 'manager'}
      onChange={(e) => handleChange(e.target.value)}
      className="input-field text-sm"
    >
      <option value="manager">Manager View</option>
      <optgroup label="Reps">
        {reps.map((rep) => (
          <option key={rep.id} value={rep.id}>
            {rep.name}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
