import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const alt = 'ShellSignal Daily Brief';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  // 1. Await params for Next.js 15 compatibility
  const resolvedParams = await params;
  const { date } = resolvedParams;

  // 2. Fetch the actual JetBrains Mono font file as an ArrayBuffer
  const fontData = await fetch(
    new URL('https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf')
  ).then((res) => res.arrayBuffer());

  // 3. Fetch from Supabase
  const { data, error } = await supabase
    .from('daily_briefs')
    .select('summary')
    .eq('date', date)
    .single();

  // 4. Fallback text
  const displaySummary = data?.summary 
    ? data.summary.substring(0, 180) + "..." 
    : "Daily technical takeaways for senior developers. Real-time signal from HN & GitHub.";

  return new ImageResponse(
    (
      <div style={{
        background: '#0b0d11',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        border: '12px solid #39d98a',
        fontFamily: '"JetBrains Mono"', // 🔥 Now this will actually work!
      }}>
        {/* Terminal Header */}
        <div style={{ display: 'flex', fontSize: 40, color: '#39d98a', marginBottom: 40, letterSpacing: '2px' }}>
          {`> cat /var/log/shell_signal/${date}.log`}
        </div>
        
        {/* The AI Summary Content */}
        <div style={{ display: 'flex', fontSize: 52, color: '#f8f8f2', lineHeight: 1.5 }}>
          {displaySummary}
        </div>
        
        {/* The blinking cursor / URL footer */}
        <div style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 60, 
          display: 'flex', 
          alignItems: 'center',
          fontSize: 32, 
          color: '#f0a023' 
        }}>
          guest@shellsignal:~$ <span style={{ color: '#39d98a', marginLeft: '12px' }}> https://shellsignal.brgt.site</span>
        </div>
      </div>
    ),
    { 
      ...size,
      // 5. Inject the font into Satori's engine
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
          }      }}>
        <div style={{ fontSize: 40, color: '#39d98a', marginBottom: 30, letterSpacing: '2px', display: 'flex' }}>
          {`> SHELL_SIGNAL // ${date}`}
        </div>
        
        <div style={{ fontSize: 54, color: '#f8f8f2', lineHeight: 1.4, display: 'flex' }}>
          {displaySummary}
        </div>
        
        <div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 24, color: '#f0a023', display: 'flex' }}>
          https://shellsignal.brgt.site
        </div>
      </div>
    ),
    { ...size }
  );
}
