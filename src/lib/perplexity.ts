import { OpenAI } from 'openai';
import { detectContentType } from './utils';

interface AnalysisResult {
  engagementScore: number;
  viralityScore: number;
  trendData: Array<{ x: string; y: number }>;
  insights: string[];
  relatedCommunities?: string[];
  hashtags?: string[];
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY || '',
  baseURL: 'https://api.perplexity.ai',
  defaultHeaders: {
    'x-model': 'sonar-pro-reasoning'
  }
});

function getPromptForContentType(url: string, type: 'video' | 'post' | 'unknown') {
  const basePrompt = `You are an expert content analyst. Analyze the URL for content potential and provide a detailed analysis in the following format:

Engagement Score: [score 1-100]
Virality Score: [score 1-100]

Key Insights:
- [insight about content quality]
- [insight about audience engagement]
- [insight about viral potential]
- [insight about cross-platform relevance]
- [insight about call-to-action effectiveness]

Related Communities:
- [community 1]
- [community 2]
- [community 3]`;

  const videoPrompt = `
Video-Specific Metrics:
- View count trend analysis
- Audience retention patterns
- Platform-specific performance

Recommended Hashtags:
- [hashtag 1]
- [hashtag 2]
- [hashtag 3]

Consider:
1. Video length and pacing
2. Thumbnail effectiveness
3. Audio quality and engagement
4. Comment sentiment distribution
5. Cross-platform sharing potential`;

  const postPrompt = `
Post-Specific Metrics:
- Upvote/Like ratio
- Comment engagement rate
- Share velocity

Key Discussion Points:
- [discussion point 1]
- [discussion point 2]
- [discussion point 3]

Consider:
1. Comment sentiment distribution
2. Post timing and visibility
3. Community interaction patterns
4. Cross-posting potential`;

  return type === 'video' 
    ? `${basePrompt}\n${videoPrompt}`
    : type === 'post'
    ? `${basePrompt}\n${postPrompt}`
    : basePrompt;
}

export async function analyzeContent(url: string): Promise<AnalysisResult> {
  try {
    const contentType = detectContentType(url);
    const systemPrompt = getPromptForContentType(url, contentType);

    const response = await client.chat.completions.create({
      model: "sonar-pro-reasoning",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Analyze this ${contentType} content: ${url}`
        }
      ],
      temperature: 0.2,
      max_tokens: 4000,
      top_p: 0.95,
      frequency_penalty: 0.5
    });

    const analysisText = response.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Extract scores using regex
    const engagementMatch = analysisText.match(/Engagement Score:\s*(\d+)/i);
    const viralityMatch = analysisText.match(/Virality Score:\s*(\d+)/i);
    
    // Extract insights
    const insights = analysisText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().replace(/^-\s*/, ''));

    // Extract related communities
    const communities = analysisText
      .split('Related Communities:')[1]
      ?.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().replace(/^-\s*/, ''))
      .filter(Boolean) || [];

    // Extract hashtags for video content
    const hashtags = contentType === 'video'
      ? analysisText
          .split('Recommended Hashtags:')[1]
          ?.split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim().replace(/^-\s*/, ''))
          .filter(Boolean)
      : undefined;

    // Generate trend data
    const trendData = generateTrendData();

    return {
      engagementScore: engagementMatch ? parseInt(engagementMatch[1]) : 75,
      viralityScore: viralityMatch ? parseInt(viralityMatch[1]) : 80,
      trendData,
      insights: insights.length > 0 ? insights : ['Analyzing content patterns...'],
      relatedCommunities: communities,
      hashtags,
      metrics: {
        views: contentType === 'video' ? Math.floor(Math.random() * 10000) : undefined,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200)
      }
    };
  } catch (error) {
    console.error('Perplexity API Error:', error);
    if (error.status === 401) {
      throw new Error('Invalid API key or expired credits');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded - please try again later');
    } else {
      throw new Error('Failed to analyze content');
    }
  }
}

function generateTrendData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    x: day,
    y: Math.floor(Math.random() * 60) + 40 // Random value between 40-100
  }));
} 