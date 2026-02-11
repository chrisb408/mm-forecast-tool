import { createClient } from '@/lib/supabase/server';
import RepView from '@/components/rep/RepView';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ repId: string }>;
}

export default async function RepPage({ params }: PageProps) {
  const { repId } = await params;
  const supabase = await createClient();

  const { data: rep } = await supabase
    .from('reps')
    .select('*')
    .eq('id', repId)
    .single();

  if (!rep) {
    notFound();
  }

  return <RepView repId={rep.id} repName={rep.name} />;
}
