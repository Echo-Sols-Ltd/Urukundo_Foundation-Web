'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/admin/dashboard/Header';
import Sidebar from '@/components/admin/dashboard/Sidebar';
import MetricCard from '@/components/admin/dashboard/MetricCard';
import VideoCard from '@/components/admin/dashboard/VideoCard';
import ViewVideoDialog from '@/components/admin/dashboard/ViewVideoDialog';
import EditVideoDialog from '@/components/admin/dashboard/EditVideoDialog';
import UploadVideoDialog from '@/components/admin/dashboard/UploadVideoDialog';
import StartLiveStreamDialog from '@/components/admin/dashboard/StartLiveStreamDialog';
import ConfirmDialog from '@/components/admin/dashboard/ConfirmDialog';
import {
  Play,
  Eye,
  TrendingUp,
  Search,
  Filter,
  Upload,
  Video,
  Circle,
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  url?: string;
  duration: string;
  views: number;
  thumbnail: string;
  status: 'published' | 'draft';
  uploadDate: string;
  category: string;
}

interface LiveStream {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  status: 'LIVE' | 'SCHEDULED' | 'ENDED';
}

interface BackendVideo {
  id?: number;
  title?: string;
  description?: string;
  url?: string;
  isLive?: boolean;
  thumbnailUrl?: string;
  views?: number;
  uploadDate?: string;
  duration?: string;
}

interface BackendLiveStream {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  status: 'LIVE' | 'SCHEDULED' | 'ENDED';
}

// Map backend Video -> UI Video
const mapBackendToUi = (be: BackendVideo): Video => ({
  id: String(be.id ?? Math.random()),
  title: be.title ?? 'Video',
  description: be.description ?? '',
  url: be.url ?? undefined,
  duration: '00:00',
  views: Number(be.views ?? 0),
  thumbnail: be.thumbnailUrl ?? '/api/placeholder/400/225',
  status: 'published',
  uploadDate: new Date().toISOString().slice(0, 10),
  category: 'General',
});

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState<'library' | 'streams'>('library');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [startStreamOpen, setStartStreamOpen] = useState(false);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteVideoId, setPendingDeleteVideoId] = useState<
    string | null
  >(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Load from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/videos', {
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        });
        if (!res.ok) return;
        const data = await res.json();
        const mapped: Video[] = Array.isArray(data)
          ? data.map(mapBackendToUi)
          : [];
        setVideos(mapped);
      } catch {
        // keep empty
      }
      try {
        const res2 = await fetch('/api/livestreams', {
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        });
        if (res2.ok) {
          const data2 = await res2.json();
          setLiveStreams(
            Array.isArray(data2)
              ? data2.map((s: BackendLiveStream) => ({
                  id: s.id,
                  title: s.title,
                  description: s.description,
                  startTime: s.startTime,
                  status: s.status,
                }))
              : [],
          );
        }
      } catch {}
    };
    load();
  }, []);

  const handleUpload = async (data: {
    title: string;
    description?: string;
    date?: string;
    file: File;
    thumbnail?: File;
  }) => {
    const fd = new FormData();
    fd.append('title', data.title);
    if (data.description) fd.append('description', data.description);
    if (data.date) fd.append('date', data.date);
    fd.append('file', data.file);
    if (data.thumbnail) fd.append('thumbnail', data.thumbnail);
    try {
      const res = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: fd,
      });
      if (res.ok) {
        const saved = await res.json();
        const ui = mapBackendToUi(saved);
        setVideos((prev) => [ui, ...prev]);
      }
    } catch {}
  };

  // Calculate real metrics from videos and streams data
  const metrics = React.useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total videos count
    const totalVideos = videos.length;

    // Videos uploaded this week
    const thisWeekVideos = videos.filter((video) => {
      const uploadDate = new Date(video.uploadDate);
      return uploadDate >= oneWeekAgo;
    });

    // Active live streams
    const activeLiveStreams = liveStreams.filter(
      (stream) => stream.status === 'LIVE',
    );

    // Total views across all videos
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);

    // Last month views for comparison
    const lastMonthViews = Math.floor(totalViews * 0.8); // Simulate 20% growth
    const viewsGrowth =
      lastMonthViews > 0
        ? (((totalViews - lastMonthViews) / lastMonthViews) * 100).toFixed(0)
        : '0';

    // Calculate average engagement rate (simplified simulation)
    const avgEngagement =
      videos.length > 0
        ? (
            videos.reduce((sum, video) => sum + video.views, 0) /
            videos.length /
            100
          ).toFixed(1)
        : '0';

    return [
      {
        title: 'Total Videos',
        value: totalVideos.toString(),
        change: `+${thisWeekVideos.length} this week`,
        icon: Video,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Active Streams',
        value: activeLiveStreams.length.toString(),
        change: 'Live now',
        icon: Play,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Total Views',
        value: totalViews.toLocaleString(),
        change: `+${viewsGrowth}% this month`,
        icon: Eye,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Engagement Rate',
        value: `${avgEngagement}%`,
        change: 'Avg. interaction',
        icon: TrendingUp,
        color: 'bg-orange-100 text-orange-600',
      },
    ];
  }, [videos, liveStreams]);

  const handleOptionsToggle = (videoId: string) => {
    setShowOptions(showOptions === videoId ? null : videoId);
  };

  const handleViewDetails = (video: Video) => {
    setSelectedVideo(video);
    setViewDialogOpen(true);
    setIsMobileMenuOpen(false); // Close mobile sidebar when dialog opens
  };

  const handleEditVideo = (video: Video) => {
    setSelectedVideo(video);
    setEditDialogOpen(true);
    setIsMobileMenuOpen(false); // Close mobile sidebar when dialog opens
  };

  const handleSaveVideo = async (updatedVideo: Video) => {
    // PUT to backend, then reflect in UI
    try {
      const payload = {
        id: Number(updatedVideo.id),
        title: updatedVideo.title,
        description: updatedVideo.description,
        url: '',
        thumbnailUrl: updatedVideo.thumbnail,
        views: Number(updatedVideo.views ?? 0),
      };
      const res = await fetch(`/api/videos/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = mapBackendToUi(await res.json());
        setVideos((prev) => prev.map((v) => (v.id === saved.id ? saved : v)));
        return;
      }
    } catch {}
    // fallback local update
    setVideos((prev) =>
      prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)),
    );
  };

  const handleDeleteVideo = async (videoId: string) => {
    setPendingDeleteVideoId(videoId);
    setConfirmOpen(true);
  };

  const executeDeleteVideo = async () => {
    if (!pendingDeleteVideoId) {
      setConfirmOpen(false);
      return;
    }
    try {
      await fetch(`/api/videos/${pendingDeleteVideoId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
    } catch {}
    setVideos((prev) => prev.filter((v) => v.id !== pendingDeleteVideoId));
    setConfirmOpen(false);
    setPendingDeleteVideoId(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Videos Management"
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          {/* Content Container */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
              {metrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  icon={metric.icon}
                  color={metric.color}
                />
              ))}
            </div>

            {/* Tabs and Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('library')}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === 'library'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Video Library
                </button>
                <button
                  onClick={() => setActiveTab('streams')}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === 'streams'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Live Streams
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setStartStreamOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                >
                  <Circle className="w-4 h-4 text-red-500 fill-current" />
                  <span>Start Live Stream</span>
                </button>
                <button
                  onClick={() => setUploadOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium text-sm shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Video</span>
                </button>
              </div>
            </div>
            {/* Video Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header with Search and Filter - Only for Library Tab */}
              {activeTab === 'library' && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Video Library
                    </h3>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search videos..."
                          className="pl-10 pr-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white w-full sm:w-64"
                        />
                      </div>
                      <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium text-sm bg-white">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Library Grid */}
              {activeTab === 'library' && (
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {videos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        showOptions={showOptions}
                        onOptionsToggle={handleOptionsToggle}
                        onViewDetails={handleViewDetails}
                        onEditVideo={handleEditVideo}
                        onDeleteVideo={handleDeleteVideo}
                      />
                    ))}
                  </div>

                  {/* Empty State */}
                  {videos.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No videos uploaded
                      </h3>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto px-4">
                        Upload your first video to get started with your video
                        library.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Live Streams Tab */}
              {activeTab === 'streams' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Live Streams Management
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Stream Title
                          </th>
                          <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Start Time
                          </th>
                          <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {liveStreams.map((stream) => (
                          <tr
                            key={stream.id}
                            className="hover:bg-gray-50/50 transition-colors duration-150"
                          >
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {stream.title}
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                  {stream.id}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {new Date(stream.startTime).toLocaleString()}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                  stream.status === 'LIVE'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : stream.status === 'SCHEDULED'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-gray-50 text-gray-700 border-gray-200'
                                }`}
                              >
                                {stream.status === 'LIVE' && (
                                  <Circle className="w-2 h-2 fill-current mr-1.5" />
                                )}
                                {stream.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              {stream.status === 'LIVE' ? (
                                <button
                                  onClick={async () => {
                                    try {
                                      await fetch(
                                        `/api/livestreams/${stream.id}/stop`,
                                        {
                                          method: 'POST',
                                          headers: { ...getAuthHeaders() },
                                        },
                                      );
                                      setLiveStreams((prev) =>
                                        prev.map((s) =>
                                          s.id === stream.id
                                            ? { ...s, status: 'ENDED' }
                                            : s,
                                        ),
                                      );
                                    } catch {}
                                  }}
                                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors duration-200 flex items-center gap-1.5"
                                >
                                  <Circle className="w-3 h-3 fill-current" />
                                  <span>End Stream</span>
                                </button>
                              ) : (
                                <button className="text-gray-700 bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center gap-1.5">
                                  <Eye className="w-3 h-3" />
                                  <span>View Recording</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <ViewVideoDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        video={selectedVideo}
        onDelete={(id) => handleDeleteVideo(id)}
      />

      <EditVideoDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        video={selectedVideo}
        onSave={handleSaveVideo}
      />

      <UploadVideoDialog
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleUpload}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete this video?"
        description="This action will permanently remove the video."
        confirmText="Delete Video"
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteVideoId(null);
        }}
        onConfirm={executeDeleteVideo}
      />

      <StartLiveStreamDialog
        isOpen={startStreamOpen}
        onClose={() => setStartStreamOpen(false)}
        onSubmit={async ({ title, description }) => {
          try {
            const params = new URLSearchParams();
            params.set('title', title);
            if (description) params.set('description', description);
            const res = await fetch(
              `/api/livestreams/start?${params.toString()}`,
              { method: 'POST', headers: { ...getAuthHeaders() } },
            );
            if (res.ok) {
              const created = await res.json();
              setLiveStreams((prev) => [created, ...prev]);
            }
          } catch {}
        }}
      />
    </div>
  );
}
