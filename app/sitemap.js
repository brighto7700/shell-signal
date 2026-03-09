import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables for sitemap generation');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 86400; // Cache for 24 hours

export default async function sitemap() {
  const baseUrl = 'https://shellsignal.brgt.site';
  
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/daily-brief`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  try {
    const { data, error } = await supabase
      .from('daily_briefs')
      .select('date')
      .order('date', { ascending: false });

    if (error) {
      console.error('Failed to fetch daily briefs for sitemap:', error.message);
      return staticRoutes; 
    }

    if (!data || data.length === 0) {
      return staticRoutes;
    }

    // 🔥 THE FIX: Force every database row into a strict YYYY-MM-DD string
    const uniqueDates = [...new Set(data.map(row => {
      if (!row.date) return null;
      // This strips the time/timezone off the Supabase timestamp
      return new Date(row.date).toISOString().split('T')[0];
    }).filter(Boolean))];

    const dynamicRoutes = uniqueDates.map((dateString) => ({
      url: `${baseUrl}/daily-brief/${dateString}`,
      lastModified: new Date(dateString), // Valid for sitemap XML
      changeFrequency: 'never',
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];

  } catch (err) {
    console.error('Unexpected error generating dynamic sitemap:', err);
    return staticRoutes; 
  }
      }
