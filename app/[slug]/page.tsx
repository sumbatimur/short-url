import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ShortLinkPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const supabase = createClient();
  const { data, error } = await supabase
    .from('short_links')
    .select('original_url')
    .eq('short_code', slug)
    .single();

  if (error || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>404 - Link Tidak Ditemukan</h1>
        <p>Short link yang Anda scan tidak valid.</p>
      </div>
    );
  }

  redirect(data.original_url);
}