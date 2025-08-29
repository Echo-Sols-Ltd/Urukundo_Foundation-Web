import React from 'react';

interface ActivityItem {
  type: 'donation' | 'event';
  description: string;
  user: string;
  time: string;
  amount?: number;
  title?: string;
  id: number;
}

interface RecentActivityProps {
  donations?: Array<{
    id: number;
    amount: number;
    donationCause?: string;
    donationDate?: string;
    user?: {
      firstName?: string;
      lastName?: string;
      username?: string;
    };
  }>;
  events?: Array<{
    id: number;
    eventTitle?: string;
    eventDate?: string;
  }>;
}

export default function RecentActivity({ donations = [], events = [] }: RecentActivityProps) {
  const activities: ActivityItem[] = React.useMemo(() => {
    // Add recent donations (last 10)
    const recentDonations = [...donations]
      .sort((a, b) => new Date(b.donationDate || '').getTime() - new Date(a.donationDate || '').getTime())
      .slice(0, 5)
      .map(donation => ({
        type: 'donation' as const,
        description: 'New donation received',
        user: donation.user 
          ? `${donation.user.firstName || ''} ${donation.user.lastName || ''}`.trim() || donation.user.username || 'Anonymous'
          : 'Anonymous',
        time: getTimeAgo(donation.donationDate),
        amount: donation.amount,
        id: donation.id
      }));

    // Add recent events (last 5)
    const recentEvents = [...events]
      .sort((a, b) => new Date(b.eventDate || '').getTime() - new Date(a.eventDate || '').getTime())
      .slice(0, 3)
      .map(event => ({
        type: 'event' as const,
        description: 'Event created',
        user: 'Admin',
        time: getTimeAgo(event.eventDate),
        title: event.eventTitle,
        id: event.id
      }));

    // Combine and sort by most recent
    return [...recentDonations, ...recentEvents]
      .sort((a, b) => {
        const timeA = getTimestamp(a.time);
        const timeB = getTimestamp(b.time);
        return timeA - timeB; // Sort by most recent first
      })
      .slice(0, 8); // Show only latest 8 activities
  }, [donations, events]);

  // Helper function to convert date to "time ago" format
  function getTimeAgo(dateString?: string): string {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Helper function to convert "time ago" back to timestamp for sorting
  function getTimestamp(timeAgo: string): number {
    const now = Date.now();
    
    if (timeAgo.includes('minute')) {
      const minutes = parseInt(timeAgo.match(/\d+/)?.[0] || '0');
      return now - (minutes * 60 * 1000);
    } else if (timeAgo.includes('hour')) {
      const hours = parseInt(timeAgo.match(/\d+/)?.[0] || '0');
      return now - (hours * 60 * 60 * 1000);
    } else if (timeAgo.includes('day')) {
      const days = parseInt(timeAgo.match(/\d+/)?.[0] || '0');
      return now - (days * 24 * 60 * 60 * 1000);
    } else {
      return now; // For "Just now" and "Recently"
    }
  }

  const getActivityDetails = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'donation':
        return { 
          detail: activity.amount ? `${activity.amount.toLocaleString()} Rwf` : 'Amount not specified'
        };
      case 'event':
        return { 
          detail: activity.title || 'Event details'
        };
      default:
        return { detail: '' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const { detail } = getActivityDetails(activity);

          return (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">{detail}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-gray-700">
                  {activity.user}
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
