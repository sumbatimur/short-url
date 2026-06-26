import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export default async function ShortLinkPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const supabase = await createClient();
  
  // Gunakan .maybeSingle() agar tidak error jika data ganda atau tidak ada
  const { data, error } = await supabase
    .from('short_links')
    .select('original_url')
    .eq('short_code', slug)
    .maybeSingle();

  // Jika error atau data kosong, lempar 404
  if (error || !data) {
    notFound();
  }

  // Redirect ke URL asli
  redirect(data.original_url);
}