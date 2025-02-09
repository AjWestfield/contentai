"use client";

import { motion } from 'framer-motion';
import { calculatePercentage } from '@/lib/utils';

interface ScoreRadialProps {
  value: number;
  metric: string;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRadial({
  value,
  metric,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
}: ScoreRadialProps) {
  const percentage = calculatePercentage(value, maxValue);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variants = {
    hidden: { strokeDashoffset: circumference },
    visible: { 
      strokeDashoffset,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg]"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-700/20"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            variants={variants}
            initial="hidden"
            animate="visible"
            className="text-indigo-500"
          />
        </svg>
        
        {/* Value text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {value}
          </motion.span>
        </div>
      </div>
      
      {/* Metric label */}
      <motion.span
        className="text-sm text-gray-400 text-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {metric}
      </motion.span>
    </div>
  );
} 