'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, X, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const FALLBACK_VIDEO = '/videos/children.mp4';
const FALLBACK_THUMBNAIL = '/image/support.png';

export interface VideoLike {
  id: string;
  title: string;
  description: string;
  views: number | string;
  thumbnail: string;
  videoUrl: string;
}

export interface VideoModalProps {
  open: boolean;
  video: VideoLike | null;
  onClose: () => void;
  onFirstPlayIncrement?: (id: string) => Promise<void> | void;
  videoElementId?: string;
}

const normalizeAssetUrl = (raw?: string): string => {
  if (!raw || typeof raw !== 'string') return '';
  if (raw.startsWith('@image/')) return `/image/${raw.slice('@image/'.length)}`;
  return raw;
};

export default function VideoModal({
  open,
  video,
  onClose,
  onFirstPlayIncrement,
  videoElementId = 'video-modal-player',
}: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const hasIncrementedRef = useRef(false);

  useEffect(() => {
    // reset on open change
    setIsPlaying(false);
    setIsMuted(false);
    setCurrentTime(0);
    setDuration(0);
    hasIncrementedRef.current = false;
  }, [open, video?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !video) return null;

  const togglePlay = async () => {
    const el = document.getElementById(
      videoElementId,
    ) as HTMLVideoElement | null;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      if (!hasIncrementedRef.current) {
        hasIncrementedRef.current = true;
        if (onFirstPlayIncrement) {
          await onFirstPlayIncrement(video.id);
        }
      }
      await el.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    setCurrentTime(vid.currentTime);
    setDuration(vid.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    const el = document.getElementById(
      videoElementId,
    ) as HTMLVideoElement | null;
    if (el) el.currentTime = time;
  };

  const handleFullscreen = () => {
    const el = document.getElementById(
      videoElementId,
    ) as HTMLVideoElement | null;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          title="Close video"
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 hover:bg-black/70"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="relative">
          <video
            id={videoElementId}
            className="w-full h-auto max-h-[70vh] object-contain"
            poster={normalizeAssetUrl(video.thumbnail) || FALLBACK_THUMBNAIL}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            muted={isMuted}
            src={video.videoUrl || FALLBACK_VIDEO}
            onClick={togglePlay}
            style={{ cursor: 'pointer' }}
            onError={(e) => {
              const el = e.currentTarget as HTMLVideoElement;
              const fallbackUrl = `${window.location.origin}${FALLBACK_VIDEO}`;
              if (el.currentSrc !== fallbackUrl) {
                el.src = FALLBACK_VIDEO;
                el.load();
                setIsPlaying(false);
                setCurrentTime(0);
              }
            }}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-4 text-white">
              <button
                onClick={togglePlay}
                className="hover:text-gray-300 transition-colors"
              >
                {isPlaying ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-sm" />
                  </div>
                ) : (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8" />
                )}
              </button>

              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <span className="text-xs sm:text-sm hidden sm:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <button
                onClick={() => setIsMuted((m) => !m)}
                className="hover:text-gray-300 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <button
                title="Toggle fullscreen"
                onClick={handleFullscreen}
                className="hover:text-gray-300 transition-colors"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {video.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            {video.description}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            {typeof video.views === 'number'
              ? video.views.toLocaleString()
              : video.views}{' '}
            views
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
