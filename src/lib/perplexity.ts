import { OpenAI } from 'openai';

interface AnalysisResult {
  engagementScore: number;
  viralityScore: number;
  trendData: Array<{ x: string; y: number }>;
  insights: string[];
  relatedCommunities?: string[];
}

const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY || '',
  baseURL: 'https://api.perplexity.ai'
});

export async function analyzeContent(url: string): Promise<AnalysisResult> {
  try {
    const response = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: `You are an expert content analyst. Analyze the URL for video/content potential and provide a detailed analysis in the following format:

Engagement Score: [score 1-100]
Virality Score: [score 1-100]

Key Insights:
- [insight about content quality]
- [insight about audience engagement]
- [insight about viral potential]
- [insight about SEO optimization]
- [insight about call-to-action effectiveness]

Related Communities:
- [community 1] - [reason for relevance]
- [community 2] - [reason for relevance]
- [community 3] - [reason for relevance]`
        },
        {
          role: "user",
          content: `Analyze this content: ${url}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9
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
      .map(line => {
        const [community] = line.trim().replace(/^-\s*/, '').split(' - ');
        return community;
      }) || [];

    // Generate trend data
    const trendData = generateTrendData();

    return {
      engagementScore: engagementMatch ? parseInt(engagementMatch[1]) : 75,
      viralityScore: viralityMatch ? parseInt(viralityMatch[1]) : 80,
      trendData,
      insights: insights.length > 0 ? insights : ['Analyzing content patterns...'],
      relatedCommunities: communities
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