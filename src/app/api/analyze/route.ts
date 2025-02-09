import { NextResponse } from 'next/server';
import { analyzeContent } from '@/lib/perplexity';

export async function POST(req: Request) {
  if (!process.env.PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: 'Perplexity API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeContent(url);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze content' },
      { status: 500 }
    );
  }
} 