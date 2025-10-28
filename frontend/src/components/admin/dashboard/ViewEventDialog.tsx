'use client';

import {
  X,
  Calendar,
  Users,
  MapPin,
  Clock,
  User,
  TrendingUp,
} from 'lucide-react';
import { ViewEventDialogProps } from '../../../types/admin';

export default function ViewEventDialog({
  isOpen,
  onClose,
  event,
  onViewAttendees,
  onDelete,
}: ViewEventDialogProps & {
  onViewAttendees?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}) {
  if (!isOpen || !event) return null;

  const statusColors = {
    upcoming: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Event Details
            </h2>
            <p className="text-sm text-gray-500">ID: {event.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Title and Status */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500">{event.category}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[event.status]}`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">
                Event Information
              </h4>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-500">Date</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{event.time}</p>
                  <p className="text-sm text-gray-500">Time</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{event.location}</p>
                  <p className="text-sm text-gray-500">Location</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{event.organizer}</p>
                  <p className="text-sm text-gray-500">Organizer</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">
                Statistics
              </h4>

              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {event.currentAttendees} / {event.maxAttendees} attendees
                  </p>
                  <p className="text-sm text-gray-500">
                    Registered / Max Capacity
                  </p>
                </div>
              </div>

              {/* Show completed event data if available */}
              {event.status === 'completed' && (
                <>
                  {event.actualAttendees !== undefined && (
                    <div className="flex items-center space-x-3 bg-green-50 p-3 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          {event.actualAttendees} people attended
                        </p>
                        <p className="text-sm text-green-700">
                          Actual Attendance
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {event.totalMoneyCollected !== undefined && (
                    <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">
                          ${event.totalMoneyCollected.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700">
                          Total Money Collected
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">${event.cost}</p>
                  <p className="text-sm text-gray-500">Projected Cost of Event</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Visibility</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  {event.isPublic ? 'Public Event' : 'Private Event'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Event Description
              </h4>
              <p className="text-sm text-blue-800">{event.description}</p>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between space-x-3 p-6 border-t bg-gray-50">
          <div>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {
                if (event && onDelete) onDelete(event.id);
              }}
            >
              Delete Event
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              onViewAttendees?.(event.id);
              onClose();
            }}
          >
            View Attendees
          </button>
        </div>
      </div>
    </div>
  );
}
