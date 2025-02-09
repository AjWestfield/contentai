"use client";

import { motion } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';
import { formatNumber } from '@/lib/utils';

interface VideoEmbedProps {
  embedUrl: string;
  directVideoUrl?: string;
  poster?: string;
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    engagementScore?: number;
    viralityScore?: number;
  };
  hashtags?: string[];
  insights?: string[];
}

export function VideoEmbed({ 
  embedUrl, 
  directVideoUrl,
  poster,
  metrics, 
  hashtags,
  insights
}: VideoEmbedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-white/10"
    >
      <div className="aspect-video w-full mb-4">
        {directVideoUrl ? (
          <VideoPlayer
            src={directVideoUrl}
            poster={poster}
            className="rounded-lg overflow-hidden"
            options={{
              playbackRates: [0.5, 1, 1.5, 2],
              userActions: {
                hotkeys: true
              }
            }}
          />
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {metrics && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {metrics.engagementScore !== undefined && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-indigo-400">
                  {metrics.engagementScore}%
                </div>
                <div className="text-sm text-gray-400">Engagement Score</div>
              </div>
            )}
            {metrics.viralityScore !== undefined && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-indigo-400">
                  {metrics.viralityScore}%
                </div>
                <div className="text-sm text-gray-400">Virality Score</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {metrics.views !== undefined && (
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-400">{formatNumber(metrics.views)}</div>
                <div className="text-sm text-gray-400">Views</div>
              </div>
            )}
            {metrics.likes !== undefined && (
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-400">{formatNumber(metrics.likes)}</div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
            )}
            {metrics.comments !== undefined && (
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-400">{formatNumber(metrics.comments)}</div>
                <div className="text-sm text-gray-400">Comments</div>
              </div>
            )}
            {metrics.shares !== undefined && (
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-400">{formatNumber(metrics.shares)}</div>
                <div className="text-sm text-gray-400">Shares</div>
              </div>
            )}
          </div>
        </>
      )}

      {insights && insights.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Key Insights</h3>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-300 flex items-start"
              >
                <span className="text-indigo-400 mr-2">•</span>
                {insight}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {hashtags && hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
} 