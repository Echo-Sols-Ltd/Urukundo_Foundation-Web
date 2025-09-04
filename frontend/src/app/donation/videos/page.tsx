'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/donation/Header';
import Sidebar from '../../../components/donation/Sidebar';
import { Search } from 'lucide-react';

import { generateStableId } from '../../../hooks/useStableId';

interface Video {
  id: string;
  title: string;
  description: string;
  views: number;
  thumbnail: string;
  videoUrl: string;
}

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
  thumbnail: be.thumbnailUrl ?? '/api/placeholder/400/225',
  videoUrl: be.url ?? '',
});

export default function VideosPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);

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
        const res = await fetch('/api/videos');
        if (!res.ok) return;
        const data = await res.json();
        setVideos(Array.isArray(data) ? data.map(mapBackendToUi) : []);
      } catch {}
    };
    load();
  }, []);

  return (
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
                <p className="text-gray-600">Here are some videos of impact.</p>
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
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <video
                      src={video.videoUrl}
                      className="w-full h-48 object-cover bg-black"
                      controls
                      onPlay={() => incrementViews(video.id)}
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        {video.views.toLocaleString()} views
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        Click the video above to play
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
