import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge'; // High performance
export const alt = 'The Dev Signal Brief';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { date } = params;

  // 1. Fetch the summary from Supabase ONLY
  const { data } = await supabase
    .from('daily_briefs')
    .select('summary')
    .eq('date', date)
    .single();

  return new ImageResponse(
    (
      <div style={{
        background: '#0a0a0a', // Your terminal black
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px',
        border: '4px solid #00ff41', // Matrix/Terminal green
      }}>
        <div style={{ fontSize: 32, color: '#00ff41', marginBottom: 20 }}>
          THE DEV SIGNAL // {date}
        </div>
        <div style={{ fontSize: 48, color: 'white', lineHeight: 1.4 }}>
          {data?.summary ? data.summary.substring(0, 150) + '...' : 'Daily technical brief for developers.'}
        </div>
      </div>
    ),
    { ...size }
  );
}
