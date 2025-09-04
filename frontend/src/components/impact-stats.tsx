'use client';

import { Rocket, Package, Globe, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';

export function ImpactStats() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    totalDonors: 0,
    totalEvents: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const generalStats = await analyticsApi.getGeneralStats();
        setStats({
          totalDonations: generalStats.totalDonations,
          totalAmount: generalStats.totalDonationAmount,
          totalDonors: generalStats.totalDonors,
          totalEvents: generalStats.totalEvents,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching impact stats:', error);
        setStats((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      number: stats.isLoading ? '...' : stats.totalEvents.toString(),
      label: 'Events Completed',
      icon: Rocket,
    },
    {
      number: stats.isLoading ? '...' : stats.totalDonations.toString(),
      label: 'Total Donations',
      icon: Package,
    },
    {
      number: stats.isLoading ? '...' : stats.totalDonors.toString(),
      label: 'Active Donors',
      icon: Globe,
    },
    {
      number: stats.isLoading
        ? '...'
        : `RWF ${stats.totalAmount.toLocaleString()}`,
      label: 'Amount Raised',
      icon: Gift,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent
                    className="w-8 h-8 text-orange-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="font-sans text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="font-serif text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
