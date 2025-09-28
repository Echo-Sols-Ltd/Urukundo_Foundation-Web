'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/admin/dashboard/Header';
import Sidebar from '../../components/admin/dashboard/Sidebar';
import MetricCard from '../../components/admin/dashboard/MetricCard';
import DonationChart from '../../components/admin/dashboard/DonationChart';
import PopularCauses from '../../components/admin/dashboard/PopularCauses';
import RecentActivity from '../../components/admin/dashboard/RecentActivity';
import { Calendar, DollarSign, Heart, TrendingUp } from 'lucide-react';
import { withAdminAuth } from '../../components/auth/withAuth';
import { eventsApi, donationsApi, videosApi, Event as ApiEvent, Donation as ApiDonation, Video as ApiVideo } from '../../lib/api';

// Use API types
type Donation = ApiDonation;
type Event = ApiEvent;
type Video = ApiVideo;

function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalDonations: 0,
    totalDonationAmount: 0,
    totalDonors: 0,
    totalEvents: 0,
    totalVideos: 0,
    totalViews: 0,
    donations: [] as Donation[],
    events: [] as Event[],
    isLoading: true,
  });



  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch donations
        const donations: Donation[] = await donationsApi.getAll();

        // Fetch events
        const events: Event[] = await eventsApi.getAll();

        // Fetch videos
        const videos: Video[] = await videosApi.getAll();

        // Calculate analytics
        const totalDonationAmount = donations.reduce(
          (sum: number, donation: Donation) =>
            sum + (Number(donation.amount) || 0),
          0,
        );
        const uniqueDonors = new Set(
          donations.map((d: Donation) => d.donor?.id).filter(Boolean),
        ).size;

        const totalViews = videos.reduce(
          (sum: number, video: Video) => sum + (parseInt(video.views) || 0),
          0,
        );

        setAnalytics({
          totalDonations: donations.length,
          totalDonationAmount,
          totalDonors: uniqueDonors,
          totalEvents: events.length,
          totalVideos: videos.length,
          totalViews,
          donations,
          events,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setAnalytics((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchAnalytics();
  }, []);

  const metrics = [
    {
      title: 'Total Donations',
      value: analytics.isLoading
        ? 'Loading...'
        : `${analytics.totalDonationAmount.toLocaleString()} Rwf`,
      change: `${analytics.totalDonations} donations`,
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Active Donors',
      value: analytics.isLoading
        ? 'Loading...'
        : analytics.totalDonors.toString(),
      change: '+8%',
      icon: Heart,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Total Events',
      value: analytics.isLoading
        ? 'Loading...'
        : analytics.totalEvents.toString(),
      change: 'All time',
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Video Views',
      value: analytics.isLoading
        ? 'Loading...'
        : analytics.totalViews.toLocaleString(),
      change: analytics.isLoading
        ? ''
        : `${analytics.totalVideos} ${analytics.totalVideos === 1 ? 'video' : 'videos'}`,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Admin Dashboard"
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {/* Content Container */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <DonationChart donations={analytics.donations} />
              <PopularCauses donations={analytics.donations} />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1">
              <RecentActivity
                donations={analytics.donations}
                events={analytics.events}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
