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

// TypeScript interfaces
interface Donation {
  id: number;
  amount: number;
  donationTime: string;
  status: string;
  donor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Event {
  id: number;
  title: string;
  eventDate: string;
  status: string;
}

function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalDonations: 0,
    totalDonationAmount: 0,
    totalDonors: 0,
    totalEvents: 0,
    donations: [] as Donation[],
    events: [] as Event[],
    isLoading: true,
  });

  // Helper function to get auth headers
  const getHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch donations
        const donationsRes = await fetch('/api/donation', { headers: getHeaders() });
        const donations: Donation[] = donationsRes.ok ? await donationsRes.json() : [];

        // Fetch events
        const eventsRes = await fetch('/api/events', { headers: getHeaders() });
        const events: Event[] = eventsRes.ok ? await eventsRes.json() : [];

        // Calculate analytics
        const totalDonationAmount = donations.reduce((sum: number, donation: Donation) => sum + (Number(donation.amount) || 0), 0);
        const uniqueDonors = new Set(donations.map((d: Donation) => d.donor?.id).filter(Boolean)).size;

        setAnalytics({
          totalDonations: donations.length,
          totalDonationAmount,
          totalDonors: uniqueDonors,
          totalEvents: events.length,
          donations,
          events,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setAnalytics(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchAnalytics();
  }, []);

  const metrics = [
    {
      title: 'Total Donations',
      value: analytics.isLoading ? 'Loading...' : `${analytics.totalDonationAmount.toLocaleString()} Rwf`,
      change: `${analytics.totalDonations} donations`,
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Active Donors',
      value: analytics.isLoading ? 'Loading...' : analytics.totalDonors.toString(),
      change: '+8%',
      icon: Heart,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Total Events',
      value: analytics.isLoading ? 'Loading...' : analytics.totalEvents.toString(),
      change: 'All time',
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Video Views',
      value: '89.4K',
      change: '+12%',
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
              <RecentActivity donations={analytics.donations} events={analytics.events} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
