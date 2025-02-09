import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function calculatePercentage(value: number, max: number = 100): number {
  return Math.min(Math.max((value / max) * 100, 0), 100);
}

export const SUPPORTED_PLATFORMS = {
  video: ['youtube.com', 'vimeo.com', 'tiktok.com'],
  post: ['reddit.com', 'threads.net', 'twitter.com', 'x.com']
} as const;

export function detectContentType(url: string): 'video' | 'post' | 'unknown' {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    if (SUPPORTED_PLATFORMS.video.some(platform => domain.includes(platform))) {
      return 'video';
    }
    if (SUPPORTED_PLATFORMS.post.some(platform => domain.includes(platform))) {
      return 'post';
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

export function generateVideoEmbed(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    if (domain.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (domain.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/')[1];
      if (!videoId) return null;
      return `https://player.vimeo.com/video/${videoId}`;
    }

    if (domain.includes('tiktok.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      if (!videoId) return null;
      return `https://www.tiktok.com/embed/${videoId}`;
    }

    return null;
  } catch {
    return null;
  }
} 