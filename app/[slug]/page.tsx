import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';

export default async function ShortLinkPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tb_short_links')
    .select('original_url, is_active, expires_at')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  // Cek expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    notFound();
  }

  redirect(data.original_url);
}