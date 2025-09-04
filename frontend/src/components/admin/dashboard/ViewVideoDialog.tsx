'use client';

import { X, Play, Eye, Calendar, Tag, User } from 'lucide-react';
import { ViewVideoDialogProps } from '../../../types/admin';

export default function ViewVideoDialog({
  isOpen,
  onClose,
  video,
  onDelete,
}: ViewVideoDialogProps & { onDelete?: (id: string) => void }) {
  if (!isOpen || !video) return null;
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
    <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Video Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Video Preview */}
          <div className="relative">
            {video.videoUrl ? (
              <div className="relative">
                <video
                  className="w-full h-64 bg-black rounded-xl"
                  src={video.videoUrl}
                  controls
                  onLoadedMetadata={(e) => {
                    const label = document.getElementById(
                      'video-duration-badge',
                    );
                    if (label)
                      label.textContent = formatDuration(
                        e.currentTarget.duration,
                      );
                  }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/30 rounded-full p-3">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-8 h-8 text-orange-600 ml-1" />
                </div>
              </div>
            )}

            {/* Status and Duration Badges */}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  video.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {video.status}
              </span>
            </div>
            <div className="absolute bottom-4 right-4">
              <span
                id="video-duration-badge"
                className="inline-flex items-center px-2 py-1 rounded bg-black bg-opacity-70 text-white text-xs font-medium"
              >
                {video.duration}
              </span>
            </div>
          </div>

          {/* Video Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {video.title}
              </h3>
              <p className="text-gray-600">{video.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="font-medium text-gray-900">
                    {video.views.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upload Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{video.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Video ID</p>
                  <p className="font-medium text-gray-900">{video.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between space-x-3 pt-4 border-t border-gray-200">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {
                if (video && onDelete) onDelete(video.id);
              }}
            >
              Delete Video
            </button>
            <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Play Video</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
