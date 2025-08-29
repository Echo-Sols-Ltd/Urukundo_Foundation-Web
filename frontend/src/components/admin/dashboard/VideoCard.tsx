import { Play, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

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

interface VideoCardProps {
  video: Video;
  showOptions: string | null;
  onOptionsToggle: (videoId: string) => void;
  onViewDetails: (video: Video) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (videoId: string) => void;
}

export default function VideoCard({
  video,
  showOptions,
  onOptionsToggle,
  onViewDetails,
  onEditVideo,
  onDeleteVideo,
}: VideoCardProps) {
  const [durationText, setDurationText] = useState<string>('00:00');

  const formatDuration = (totalSeconds: number) => {
    if (!isFinite(totalSeconds) || totalSeconds <= 0) return '00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const hh = String(hours);
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Video Thumbnail / Preview */}
      <div className="relative">
        {video.url ? (
          <video
            className="w-full h-48 object-cover bg-black"
            src={video.url}
            preload="metadata"
            onLoadedMetadata={(e) => setDurationText(formatDuration(e.currentTarget.duration))}
            onClick={() => onViewDetails(video)}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-orange-600 ml-1" />
            </div>
          </div>
        )}

        {/* Clickable Play overlay */}
        {video.url && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="bg-black/30 rounded-full p-3">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
            {video.status}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded bg-black bg-opacity-70 text-white text-xs font-medium">
            {durationText}
          </span>
        </div>
      </div>

      {/* Video Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {video.title}
          </h4>
          <div className="relative z-50">
            <button
              onClick={() => onOptionsToggle(video.id)}
              title="More options"
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showOptions === video.id && (
              <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-visible">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onViewDetails(video);
                      onOptionsToggle(video.id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => {
                      onEditVideo(video);
                      onOptionsToggle(video.id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>Edit Details</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <span>Share Video</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <span>Download</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onDeleteVideo(video.id);
                      onOptionsToggle(video.id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{video.views.toLocaleString()} views</span>
          <span>{video.id}</span>
        </div>

        {/* Removed bottom Play button; video itself is clickable */}
      </div>
    </div>
  );
}
