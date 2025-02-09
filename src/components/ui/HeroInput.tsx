"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const placeholderExamples = [
  "Paste Reddit thread URL...",
  "Enter YouTube video link...",
  "Add Twitter/X post URL...",
  "Insert TikTok video URL..."
];

export interface HeroInputProps {
  onSubmit: (url: string) => void;
  className?: string;
}

export function HeroInput({ onSubmit, className }: HeroInputProps) {
  const [url, setUrl] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && isValidUrl(url)) {
      onSubmit(url);
      setUrl('');
    } else {
      setIsValid(false);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative w-[40vw] min-w-[320px] backdrop-blur-lg rounded-xl p-1',
        'bg-gradient-to-r from-indigo-500/10 to-cyan-500/10',
        'border border-white/10 shadow-xl',
        className
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
          opacity: 0.2,
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setIsValid(true);
          }}
          placeholder={placeholderExamples[placeholderIndex]}
          className={cn(
            'w-full bg-transparent px-4 py-3 rounded-lg',
            'text-white placeholder-white/50',
            'focus:outline-none focus:ring-2',
            'transition duration-200',
            'pr-[100px]',
            isValid ? 'focus:ring-indigo-500/50' : 'ring-2 ring-red-500/50'
          )}
        />
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'absolute right-2',
            'px-4 py-1.5 rounded-lg',
            'bg-indigo-500 text-white',
            'hover:bg-indigo-600',
            'transition-colors duration-200',
            'min-w-[90px]'
          )}
        >
          Analyze
        </motion.button>
      </form>
    </motion.div>
  );
} 