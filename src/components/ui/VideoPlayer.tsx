'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  onReady?: (player: Player) => void;
  options?: any;
}

export function VideoPlayer({ 
  src, 
  poster,
  className = '',
  onReady,
  options = {} 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      if (!videoRef.current) return;

      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        fluid: true,
        responsive: true,
        poster: poster,
        sources: [{
          src: src,
          type: 'video/mp4'
        }],
        ...options
      });

      // Pass the player to the onReady prop if provided
      if (onReady) {
        onReady(playerRef.current);
      }
    } else {
      // Update the player's source if it changes
      const player = playerRef.current;
      player.src({
        src: src,
        type: 'video/mp4'
      });
      if (poster) {
        player.poster(poster);
      }
    }
  }, [src, poster, options, onReady]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} className={className} />
    </div>
  );
} 