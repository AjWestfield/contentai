"use client";

import { motion } from 'framer-motion';
import { formatNumber } from '@/lib/utils';

interface VideoMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

interface VideoEmbedProps {
  embedUrl: string;
  metrics?: VideoMetrics;
  hashtags?: string[];
}

export function VideoEmbed({ embedUrl, metrics, hashtags }: VideoEmbedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 border border-white/10"
    >
      <div className="aspect-video w-full mb-4">
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {metrics && (
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