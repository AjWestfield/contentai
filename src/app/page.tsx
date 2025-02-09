"use client";

import { useState } from 'react';
import { HeroInput } from '@/components/ui/HeroInput';
import { AnalysisGrid } from '@/components/ui/AnalysisGrid';
import { motion } from 'framer-motion';

interface AnalysisData {
  engagementScore: number;
  viralityScore: number;
  trendData: Array<{ x: string; y: number }>;
  insights: string[];
  relatedCommunities?: string[];
}

export default function Home() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalyze = async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze content');
      }

      const data = await response.json();
      setAnalysisData(data);
      setShowAnalysis(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content');
      setShowAnalysis(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 mb-4">
            Content Analysis AI
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Analyze your content's performance and get AI-powered insights to improve engagement
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-4 mb-16">
          <HeroInput onSubmit={handleAnalyze} />
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-indigo-400"
            >
              Analyzing content...
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400"
            >
              {error}
            </motion.div>
          )}
        </div>

        {showAnalysis && analysisData && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnalysisGrid
              engagementScore={analysisData.engagementScore}
              viralityScore={analysisData.viralityScore}
              trendData={analysisData.trendData}
              relatedCommunities={analysisData.relatedCommunities}
            />
            {analysisData.insights.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 p-6 glass-dark rounded-xl"
              >
                <h2 className="text-xl font-semibold mb-4 text-indigo-400">Key Insights</h2>
                <ul className="space-y-2">
                  {analysisData.insights.map((insight, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-gray-300"
                    >
                      • {insight}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
