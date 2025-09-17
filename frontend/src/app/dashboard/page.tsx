'use client';

import { withAuth } from '@/components/auth/withAuth';
import Sidebar from '@/components/donation/Sidebar';
import VideoModal from '@/components/media/VideoModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Download, Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const FALLBACK_THUMBNAIL = '/image/children.jpg';

const normalizeAssetUrl = (raw?: string): string => {
  if (!raw || typeof raw !== 'string') return '';
  if (raw.startsWith('@image/')) return `/image/${raw.slice('@image/'.length)}`;
  return raw;
};

// Define the Video interface
interface Video {
  id: string;
  title: string;
  description: string;
  views: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

// Define the Donation interface (matching backend structure)
interface Donation {
  id: number;
  amount: number;
  donationText?: string;
  donationTime: string;
  status: string;
}

// Dummy data for upcoming events
const defaultUpcomingEvents = [
  {
    title: 'Community Health Workshop',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    description:
      'Join us for a comprehensive health workshop covering nutrition, hygiene, and preventive care for families in our community.',
    image: '/image/plant.jpg',
  },
  {
    title: "Children's Education Fundraiser",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    description:
      'Help us raise funds to provide school supplies, books, and educational materials for children in need.',
    image: '/image/plant.jpg',
  },
  {
    title: 'Environmental Cleanup Drive',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    description:
      'Participate in our community cleanup initiative to make our neighborhoods cleaner and more sustainable.',
    image: '/image/plant.jpg',
  },
  {
    title: "Women's Empowerment Seminar",
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    description:
      'An inspiring seminar focused on skill development, entrepreneurship, and leadership for women in our community.',
    image: '/image/plant.jpg',
  },
];

function DashboardPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<
    { title: string; date: string; description: string; image: string }[]
  >([]);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);

  // Update useState to use Video | null
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Helper function to get auth headers (same pattern as other pages)
  const getHeaders = (): Record<string, string> => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch donations and other data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch donations
        const donationsRes = await fetch('/api/donation', {
          headers: getHeaders(),
        });
        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setDonations(Array.isArray(donationsData) ? donationsData : []);
        }

        // Fetch events
        try {
          const eventsRes = await fetch('/api/events', {
            headers: getHeaders(),
          });
          if (eventsRes.ok) {
            const eventsData = await eventsRes.json();
            const transformedEvents = Array.isArray(eventsData)
              ? eventsData
                  .filter(
                    (event) =>
                      event.status === 'UPCOMING' || event.status === 'ONGOING',
                  )
                  .map((event) => ({
                    title: event.eventName || 'Event',
                    date: new Date(event.startDate).toLocaleDateString(),
                    description: event.description || '',
                    image: event.imageUrl || '/image/plant.jpg',
                  }))
                  .slice(0, 4)
              : [];

            // If no events from API, use dummy data
            if (transformedEvents.length === 0) {
              setUpcomingEvents(defaultUpcomingEvents);
            } else {
              setUpcomingEvents(transformedEvents);
            }
          } else {
            // If API call fails, use dummy data
            setUpcomingEvents(defaultUpcomingEvents);
          }
        } catch {
          // If there's an error, use dummy data
          setUpcomingEvents(defaultUpcomingEvents);
        }

        // Fetch videos
        try {
          const videosRes = await fetch('/api/videos', {
            headers: getHeaders(),
          });
          if (videosRes.ok) {
            const videosData = await videosRes.json();
            const transformedVideos = Array.isArray(videosData)
              ? videosData.slice(0, 4).map((video) => ({
                  id: video.id || Math.random().toString(),
                  title: video.title || 'Video',
                  description: video.description || '',
                  views: video.views || '0 views',
                  thumbnail: video.thumbnail || '/image/support.png',
                  videoUrl: video.videoUrl || '',
                  duration: video.duration || '0:00',
                }))
              : [];
            setRecentVideos(transformedVideos);
          }
        } catch {
          setRecentVideos([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Calculate stats from donations
  const totalAmount = donations.reduce(
    (sum, donation) => sum + (Number(donation.amount) || 0),
    0,
  );

  // Transform donations for donation history
  const donationHistory = donations
    .sort(
      (a, b) =>
        new Date(b.donationTime).getTime() - new Date(a.donationTime).getTime(),
    )
    .slice(0, 10)
    .map((donation) => ({
      date: new Date(donation.donationTime).toLocaleDateString(),
      amount: `${Number(donation.amount).toLocaleString()} Rwf`,
      cause: donation.donationText || 'General Fund',
      status: donation.status || 'COMPLETED',
    }));

  // Update handleVideoClick to use Video type
  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {user?.firstName || 'User'}
              </h1>
              <p className="text-gray-600">
                Thank you for making a difference in the world
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Donations</p>
                <p className="text-2xl font-bold text-orange-500">
                  {isLoading
                    ? 'Loading...'
                    : `${totalAmount.toLocaleString()} Rwf`}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {user?.firstName && user?.lastName ? (
                  <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <Image
                    src="/image/profile.png"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <Card key={index} className="overflow-hidden p-0">
                    <div className="h-48 relative w-full">
                      <Image
                        src={
                          normalizeAssetUrl(event.image) || FALLBACK_THUMBNAIL
                        }
                        alt={event.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={
                          event.image?.startsWith('/uploads') ||
                          event.image?.startsWith('http')
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
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {event.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {event.date}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <Button
                        variant="outline"
                        className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
                      >
                        LEARN MORE
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p className="text-lg">No upcoming events at the moment.</p>
                  <p className="text-sm">
                    Check back later for new events and activities.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Videos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Videos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recentVideos.length > 0 ? (
                recentVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="overflow-hidden p-0 cursor-pointer group"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="h-48 relative w-full">
                      <Image
                        src={
                          normalizeAssetUrl(video.thumbnail) ||
                          FALLBACK_THUMBNAIL
                        }
                        alt={video.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={
                          video.thumbnail?.startsWith('/uploads') ||
                          video.thumbnail?.startsWith('http')
                        }
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          const fallback = `${window.location.origin}${FALLBACK_THUMBNAIL}`;
                          if (img.src !== fallback) {
                            img.src = FALLBACK_THUMBNAIL;
                          }
                        }}
                      />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black group-hover:bg-opacity-20 transition-all">
                        <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-xl">
                          <Play className="w-10 h-10 text-orange-500 ml-1 group-hover:ml-2 transition-all" />
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-medium">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{video.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {video.views}
                        </span>
                        <Button
                          variant="outline"
                          className="border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
                        >
                          WATCH NOW
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p className="text-lg">No videos available at the moment.</p>
                  <p className="text-sm">
                    Videos showcasing our impact will appear here.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Donation History */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Donation history
            </h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-900">
                        Amount
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-900">
                        Cause
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-900">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.length > 0 ? (
                      donationHistory.map((donation, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-4 text-gray-600">{donation.date}</td>
                          <td className="p-4 text-gray-900 font-medium">
                            {donation.amount}
                          </td>
                          <td className="p-4 text-gray-600">
                            {donation.cause}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              {donation.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-500 hover:text-orange-600"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-12 text-center text-gray-500"
                        >
                          <p className="text-lg">No donation history found.</p>
                          <p className="text-sm">
                            Your donation history will appear here once you make
                            a donation.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </div>
      </div>

      {/* Video Modal */}
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
          videoElementId="dashboard-video-player"
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
    </div>
  );
}

export default withAuth(DashboardPage);
