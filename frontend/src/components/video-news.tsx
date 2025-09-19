'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Play, X, Volume2, VolumeX, Maximize2 } from 'lucide-react';

import { generateStableId } from '../hooks/useStableId';

interface Video {
  id: string;
  title: string;
  date?: string;
  description: string;
  thumbnail: string;
  videoUrl: string;

  duration: string;
}

export function VideoNewsSection() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const [videos, setVideos] = useState<Video[]>([]);

  const mapBackendToUi = (be: {
    id?: string | number;
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    url?: string;
    views?: number;
  }): Video => ({
    id: generateStableId(be, 'video'),
    title: be.title ?? 'Video',
    description: be.description ?? '',
    thumbnail: be.thumbnailUrl ?? '/image/community.jpg',
    videoUrl: be.url ?? '',
    duration: '00:00',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/videos');
        if (!res.ok) return;
        const data = await res.json();
        const all = Array.isArray(data) ? data.map(mapBackendToUi) : [];
        setVideos(all.slice(-3).reverse());
      } catch {}
    };
    load();
  }, []);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const videoElement = document.getElementById(
      'video-player',
    ) as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) videoElement.pause();
      else videoElement.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  // eslint-clean: destructure currentTarget to avoid unused 'e'
  const handleTimeUpdate = ({
    currentTarget,
  }: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(currentTarget.currentTime);
    setDuration(currentTarget.duration);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (selectedVideo) {
      const videoElement = document.getElementById(
        'video-player',
      ) as HTMLVideoElement;
      if (videoElement) videoElement.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    const videoElement = document.getElementById(
      'video-player',
    ) as HTMLVideoElement;
    if (videoElement) {
      if (document.fullscreenElement) document.exitFullscreen();
      else videoElement.requestFullscreen();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedVideo) return;
    const videoElement = document.getElementById(
      'video-player',
    ) as HTMLVideoElement;
    if (!videoElement) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        videoElement.currentTime += 10;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        videoElement.currentTime -= 10;
        break;
      case 'ArrowUp':
        e.preventDefault();
        videoElement.volume = Math.min(1, videoElement.volume + 0.1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        videoElement.volume = Math.max(0, videoElement.volume - 0.1);
        break;
      case 'f':
        e.preventDefault();
        handleFullscreen();
        break;
      case 'm':
        e.preventDefault();
        toggleMute();
        break;
      case 'Escape':
        closeModal();
        break;
    }
  };

  return (
    <>
      <section id="videos" className="py-16 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-20">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-sans text-3xl lg:text-4xl font-bold text-foreground">
              Live videos and news
            </h2>
            <Button
              variant="outline"
              className="border-border hover:bg-muted bg-transparent"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/donation/videos';
                }
              }}
            >
              MORE VIDEOS
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12">
                No videos available yet. Please check back later.
              </div>
            )}
            {videos.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-card p-0 cursor-pointer group"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative h-48 w-full">
                  {imageErrors.has(video.id) ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-600 text-sm font-medium px-4 text-center">
                        {video.title}
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={() =>
                        setImageErrors((prev) => new Set(prev).add(video.id))
                      }
                    />
                  )}

                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-medium">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {video.date}
                  </div>
                  <h3 className="font-sans text-xl font-semibold text-card-foreground mb-3">
                    {video.title}
                  </h3>
                  <p className="font-serif text-muted-foreground mb-4 leading-relaxed">
                    {video.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="text-orange-500 hover:text-orange-600 p-0 h-auto font-medium"
                  >
                    WATCH NOW →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-2 sm:p-4"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              title="Close video"
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="relative">
              <video
                onClick={togglePlay}
                style={{ cursor: 'pointer' }}
                id="video-player"
                className="w-full h-auto max-h-[70vh] object-contain"
                poster={selectedVideo.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                muted={isMuted}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-4 text-white">
                  <button
                    onClick={togglePlay}
                    className="hover:text-gray-300 transition-colors"
                  >
                    <Play className="w-6 h-6 sm:w-8 sm:h-8" />
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
                    onClick={toggleMute}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  <button
                    title="Enter fullscreen"
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
                {selectedVideo.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                {selectedVideo.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {selectedVideo.date}
              </p>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}
