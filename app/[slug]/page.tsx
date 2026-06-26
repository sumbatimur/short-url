import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export default async function ShortLinkPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('tb_short_links')  // Pastikan nama tabel sesuai (tb_short_links)
      .select('original_url')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Database error');
    }

    if (!data) {
      notFound();
    }

    redirect(data.original_url);
  } catch (err) {
    console.error('Server error:', err);
    notFound();
  }
}