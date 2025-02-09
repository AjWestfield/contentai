import { NextResponse } from 'next/server';
import { analyzeContent } from '@/lib/perplexity';

const RATE_LIMIT = 10; // requests per minute
const rateLimit = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const minute = 60 * 1000;
  const requests = rateLimit.get(ip) || [];
  
  // Clean up old requests
  const recentRequests = requests.filter(time => now - time < minute);
  rateLimit.set(ip, recentRequests);
  
  return recentRequests.length >= RATE_LIMIT;
}

export async function POST(req: Request) {
  try {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Add request to rate limit tracking
    const requests = rateLimit.get(ip) || [];
    requests.push(Date.now());
    rateLimit.set(ip, requests);

    // Validate API key
    if (!process.env.PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: 'Perplexity API key is not configured' },
        { status: 500 }
      );
    }

    // Get and validate URL
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Perform analysis
    const analysis = await analyzeContent(url);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your API key.' },
          { status: 401 }
        );
      }
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 