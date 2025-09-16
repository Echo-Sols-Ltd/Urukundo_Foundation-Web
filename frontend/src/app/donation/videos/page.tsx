'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/donation/Header';
import Sidebar from '../../../components/donation/Sidebar';
import { Search, Play } from 'lucide-react';
import Image from 'next/image';
import VideoModal from '../../../components/media/VideoModal';

import { generateStableId } from '../../../hooks/useStableId';

const FALLBACK_VIDEO = '/videos/children.mp4';
const FALLBACK_THUMBNAIL = '/image/support.png';

interface Video {
  id: string;
  title: string;
  description: string;
  views: number;
  thumbnail: string;
  videoUrl: string;
}

const normalizeAssetUrl = (raw?: string): string => {
  if (!raw || typeof raw !== 'string') return '';
  if (raw.startsWith('@image/')) return `/image/${raw.slice('@image/'.length)}`;
  return raw;
};

const mapBackendToUi = (be: {
  id?: string | number;
  title?: string;
  description?: string;
  views?: number;
  thumbnailUrl?: string;
  url?: string;
}): Video => ({
  id: generateStableId(be, 'video'),
  title: be.title ?? 'Video',
  description: be.description ?? '',
  views: Number(be.views ?? 0),
  thumbnail: (() => {
    const normalized = normalizeAssetUrl(be.thumbnailUrl);
    return normalized && normalized.trim().length > 0
      ? normalized
      : FALLBACK_THUMBNAIL;
  })(),
  videoUrl:
    typeof be.url === 'string' && be.url.trim().length > 0
      ? be.url
      : FALLBACK_VIDEO,
});

export default function VideosPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const incrementViews = async (id: string) => {
    try {
      await fetch(`/api/videos/${id}/views`, { method: 'POST' });
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, views: v.views + 1 } : v)),
      );
    } catch {}
  };

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/videos');
        if (!res.ok) return;
        const data = await res.json();
        setVideos(Array.isArray(data) ? data.map(mapBackendToUi) : []);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const openVideo = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  // removed local player state; VideoModal handles it

  // Close modal with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedVideo) {
        closeModal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedVideo]);

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="Videos"
            onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Header with Search */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Videos
                  </h2>
                  <p className="text-gray-600">
                    Here are some videos of impact.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="SEARCH VIDEOS"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
                    >
                      <div className="aspect-video w-full bg-gray-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}

                {!isLoading &&
                  videos
                    .filter((v) =>
                      searchQuery.trim()
                        ? `${v.title} ${v.description}`
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : true,
                    )
                    .map((video) => (
                      <div
                        key={video.id}
                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:-translate-y-0.5"
                        onClick={() => openVideo(video)}
                      >
                        <div className="relative bg-black">
                          <div className="relative w-full aspect-video">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover object-center"
                              unoptimized={
                                video.thumbnail.startsWith('/uploads') ||
                                video.thumbnail.startsWith('http')
                              }
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                const fallback = `${window.location.origin}${FALLBACK_THUMBNAIL}`;
                                if (img.src !== fallback) {
                                  img.src = FALLBACK_THUMBNAIL;
                                }
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <Play className="w-8 h-8 text-orange-500 ml-1" />
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {video.description}
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              {video.views.toLocaleString()} views
                            </span>
                            <span className="text-gray-400">
                              Click to watch
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                {!isLoading &&
                  videos.filter((v) =>
                    searchQuery.trim()
                      ? `${v.title} ${v.description}`
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      : true,
                  ).length === 0 && (
                    <div className="col-span-full">
                      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-300 rounded-xl bg-white">
                        <div className="text-gray-900 font-semibold mb-1">
                          No videos found
                        </div>
                        <div className="text-gray-500 text-sm">
                          Try a different search term.
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {selectedVideo && (
        <VideoModal
          open={!!selectedVideo}
          video={{
            id: selectedVideo.id,
            title: selectedVideo.title,
            description: selectedVideo.description,
            views: selectedVideo.views,
            thumbnail: selectedVideo.thumbnail,
            videoUrl: selectedVideo.videoUrl,
          }}
          onClose={closeModal}
          videoElementId="donation-video-player"
          onFirstPlayIncrement={(id: string) => incrementViews(id)}
        />
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
