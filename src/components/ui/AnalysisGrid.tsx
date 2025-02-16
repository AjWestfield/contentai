"use client";

import { motion } from 'framer-motion';
import { ScoreRadial } from './ScoreRadial';
import { TrendSparkline, type TrendData } from './TrendSparkline';

interface AnalysisGridProps {
  engagementScore: number;
  viralityScore: number;
  trendData: TrendData[];
  relatedCommunities?: string[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AnalysisGrid({
  engagementScore,
  viralityScore,
  trendData,
  relatedCommunities = []
}: AnalysisGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6"
    >
      <motion.div
        variants={item}
        className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-white/10"
      >
        <ScoreRadial
          value={engagementScore}
          metric="Engagement Potential"
        />
      </motion.div>

      <motion.div
        variants={item}
        className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-white/10"
      >
        <ScoreRadial
          value={viralityScore}
          metric="Virality Score"
        />
      </motion.div>

      <motion.div
        variants={item}
        className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-white/10"
      >
        <TrendSparkline
          data={trendData}
          title="Engagement Over Time"
        />
      </motion.div>

      {relatedCommunities.length > 0 && (
        <motion.div
          variants={item}
          className="md:col-span-3 bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-indigo-400 mb-3">Related Communities</h3>
          <div className="flex flex-wrap gap-2">
            {relatedCommunities.map((community, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm"
              >
                {community}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 