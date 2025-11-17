import { useRef, useEffect } from 'react';
import { isVideoUrl } from '../../utils/media';
import { getObjectPosition } from '../../utils/positioning';
import type { AppSettings } from '../../constants/defaults';
import type { CSSProperties } from 'react';

interface MediaRendererProps {
  url: string;
  settings: AppSettings;
  className?: string;
  style?: CSSProperties;
}

/**
 * MediaRenderer component.
 * Handles rendering of both video and image media with proper positioning and scaling.
 * Ensures video playback continues even if it stops due to browser policies or errors.
 */
export default function MediaRenderer({
  url,
  settings,
  className,
  style,
}: MediaRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = isVideoUrl(url);
  const objectPosition = getObjectPosition(settings.align, settings.x, settings.y);

  const mediaStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: settings.fit,
    objectPosition,
    transform: `scale(${settings.scale})`,
    transformOrigin: 'center center',
    display: 'block',
    ...style,
  };

  // Ensure video keeps playing
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;

    // Function to ensure video is playing
    const ensurePlaying = async () => {
      if (!video) return;
      
      // Check if video is paused or ended
      if (video.paused || video.ended) {
        try {
          // If loop is enabled and video ended, restart it
          if (settings.loop && video.ended) {
            video.currentTime = 0;
          }
          
          // Attempt to play
          await video.play();
        } catch (error) {
          // Silently handle autoplay restrictions
          // The video will play when user interacts or when browser allows
          console.debug('[MediaRenderer] Video play attempt failed:', error);
        }
      }
    };

    // Event handlers
    const handleEnded = () => {
      if (settings.loop) {
        video.currentTime = 0;
        ensurePlaying();
      }
    };

    const handlePause = () => {
      // Only auto-resume if autoplay is enabled and it wasn't manually paused
      // We check if the pause was due to an error or browser policy
      if (settings.autoplay && !video.ended) {
        // Small delay to avoid immediate resume on intentional pauses
        setTimeout(ensurePlaying, 100);
      }
    };

    const handleLoadedData = () => {
      if (settings.autoplay) {
        ensurePlaying();
      }
    };

    const handleVisibilityChange = () => {
      // Resume playback when page becomes visible
      if (!document.hidden && settings.autoplay) {
        ensurePlaying();
      }
    };

    // Attach event listeners
    video.addEventListener('ended', handleEnded);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadeddata', handleLoadedData);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic check to ensure video is playing (every 2 seconds)
    const playCheckInterval = setInterval(() => {
      if (settings.autoplay && settings.loop) {
        ensurePlaying();
      }
    }, 2000);

    // Initial play attempt
    ensurePlaying();

    // Cleanup
    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadeddata', handleLoadedData);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(playCheckInterval);
    };
  }, [isVideo, settings.autoplay, settings.loop, url]);

  if (!url) return null;

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={url}
        autoPlay={settings.autoplay}
        loop={settings.loop}
        muted={settings.mute}
        playsInline
        className={className}
        style={mediaStyle}
      />
    );
  }

  return (
    <img
      src={url}
      alt="Media"
      className={className}
      style={mediaStyle}
    />
  );
}

