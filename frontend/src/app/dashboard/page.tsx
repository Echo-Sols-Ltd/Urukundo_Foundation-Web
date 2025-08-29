'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Heart,
  Calendar,
  Video,
  Bell,
  Play,
  Download,
  X,
  Volume2,
  VolumeX,
  Maximize2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/donation/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from '@/components/auth/withAuth';

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

function DashboardPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Update useState to use Video | null
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Helper function to get auth headers (same pattern as other pages)
  const getHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch donations using existing pattern
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/donation', { headers: getHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        const donationsArray = Array.isArray(data) ? data : [];
        setDonations(donationsArray);
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDonations();
    }
  }, [user]);

  // Calculate stats from donations
  const totalAmount = donations.reduce((sum, donation) => sum + (Number(donation.amount) || 0), 0);
  const totalDonations = donations.length;

  const sidebarItems = [
    { icon: Home, label: 'Home', href: '/dashboard', active: true },
    { icon: Heart, label: 'Donate', href: '/events' },
    { icon: Calendar, label: 'Events', href: '/events' },
    { icon: Video, label: 'Videos', href: '#' },
    { icon: Bell, label: 'Notifications', href: '#' },
  ];

  const upcomingEvents = [
    {
      title: 'Community Outreach',
      date: '24 March 2025',
      description: 'An evening of elegance and giving to support our causes.',
      image: '/image/outreach.png',
    },
    {
      title: 'Fundraising Gala',
      date: '24 March 2025',
      description: 'An evening of elegance and giving to support our causes.',
      image: '/image/fund.png',
    },
  ];

  const recentVideos: Video[] = [
    {
      id: '1',
      title: 'Impact Story: Meet Sarah',
      description: 'An evening of elegance and giving to support our causes.',
      views: '1024 views',
      thumbnail: '/image/reporter.png',
      videoUrl: '/videos/impact.mp4',
      duration: '3:45',
    },
    {
      id: '2',
      title: 'Volunteer Spotlight',
      description: 'An evening of elegance and giving to support our causes.',
      views: '1024 views',
      thumbnail: '/image/planting.png',
      videoUrl: '/videos/volunteer-spotlight.mp4',
      duration: '2:30',
    },
  ];

  // Update handleVideoClick to use Video type
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
      'dashboard-video-player',
    ) as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setCurrentTime(video.currentTime);
    setDuration(video.duration);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (selectedVideo) {
      const videoElement = document.getElementById(
        'dashboard-video-player',
      ) as HTMLVideoElement;
      if (videoElement) {
        videoElement.currentTime = time;
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    const videoElement = document.getElementById(
      'dashboard-video-player',
    ) as HTMLVideoElement;
    if (videoElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoElement.requestFullscreen();
      }
    }
  };

  const donationHistory = [
    {
      date: '2025-08-01',
      amount: '50 000 rwf',
      cause: 'Nyamasheke Earthquake',
      status: 'Completed',
    },
    {
      date: '2025-08-01',
      amount: '50 000 rwf',
      cause: 'Nyamasheke Earthquake',
      status: 'Completed',
    },
    {
      date: '2025-08-01',
      amount: '50 000 rwf',
      cause: 'Nyamasheke Earthquake',
      status: 'Completed',
    },
    {
      date: '2025-08-01',
      amount: '50 000 rwf',
      cause: 'Nyamasheke Earthquake',
      status: 'Completed',
    },
  ];

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
                  {isLoading ? 'Loading...' : `${totalAmount.toLocaleString()} Rwf`}
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

          {/* Featured Causes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Causes
            </h2>
            <Card className="p-6">
              <div className="flex gap-6">
                <div className="w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/image/support.png"
                    alt="Earthquake Relief"
                    width={256}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Support Families Affected by the Nyamasheke Earthquake
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your donation will provide essential supplies and support to
                    families impacted by the earthquake.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Raised: $45,000</span>
                      <span className="text-gray-600">Goal: $100,000</span>
                    </div>
                    <Progress
                      value={45}
                      className="h-2 [&>div]:bg-orange-500"
                    />
                    <p className="text-sm text-gray-500 mt-2">1250 donors</p>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    DONATE NOW
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Upcoming Events */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="overflow-hidden p-0">
                  <div className="h-48 relative w-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
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
              ))}
            </div>
          </section>

          {/* Recent Videos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Videos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recentVideos.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden p-0 cursor-pointer group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="h-48 relative w-full">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
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
              ))}
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
                    {donationHistory.map((donation, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-4 text-gray-600">{donation.date}</td>
                        <td className="p-4 text-gray-900 font-medium">
                          {donation.amount}
                        </td>
                        <td className="p-4 text-gray-600">{donation.cause}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              title='Close video'
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Video Player */}
            <div className="relative">
              <video
                onClick={togglePlay}
                style={{ cursor: 'pointer' }}
                id="dashboard-video-player"
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

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-4 text-white">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {isPlaying ? (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-sm"></div>
                      </div>
                    ) : (
                      <Play className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                  </button>

                  {/* Progress Bar */}
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

                  {/* Time Display */}
                  <span className="text-xs sm:text-sm hidden sm:block">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  {/* Volume Control */}
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

                  {/* Fullscreen Button */}
                  <button
                    title='Toggle fullscreen'
                    onClick={handleFullscreen}
                    className="hover:text-gray-300 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4 sm:p-6 bg-white">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {selectedVideo.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                {selectedVideo.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {selectedVideo.views}
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
    </div>
  );
}

export default withAuth(DashboardPage);
