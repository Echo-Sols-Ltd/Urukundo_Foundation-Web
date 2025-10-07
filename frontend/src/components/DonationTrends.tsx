'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, Calendar, BarChart3 } from 'lucide-react';
import { donationsApi } from '@/lib/api';

interface DonationStats {
  totalAmount: number;
  totalCount: number;
  monthlyTrends: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  topDonors: Array<{
    name: string;
    amount: number;
  }>;
}

export default function DonationTrends() {
  const [stats, setStats] = useState<DonationStats>({
    totalAmount: 0,
    totalCount: 0,
    monthlyTrends: [],
    topDonors: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all donations
        const donations = await donationsApi.getAll();
        
        if (!donations || donations.length === 0) {
          setStats({
            totalAmount: 0,
            totalCount: 0,
            monthlyTrends: [],
            topDonors: []
          });
          setIsLoading(false);
          return;
        }

        // Calculate total amount and count
        const totalAmount = donations.reduce((sum: number, donation: { amount?: number }) => 
          sum + (Number(donation.amount) || 0), 0
        );
        const totalCount = donations.length;

        // Calculate monthly trends (last 6 months)
        const currentDate = new Date();
        const monthlyData: { [key: string]: { amount: number; count: number } } = {};
        
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          monthlyData[monthKey] = { amount: 0, count: 0 };
        }

        // Group donations by month
        donations.forEach((donation: { donationTime?: string; createdAt?: string; amount?: number }) => {
          const donationDate = new Date(donation.donationTime || donation.createdAt || new Date());
          const monthKey = donationDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].amount += Number(donation.amount) || 0;
            monthlyData[monthKey].count += 1;
          }
        });

        const monthlyTrends = Object.entries(monthlyData).map(([month, data]) => ({
          month,
          amount: data.amount,
          count: data.count
        }));

        // Calculate top donors
        const donorMap: { [key: string]: number } = {};
        donations.forEach((donation: { donor?: { firstName?: string; lastName?: string }; amount?: number }) => {
          if (donation.donor) {
            const donorName = `${donation.donor.firstName || ''} ${donation.donor.lastName || ''}`.trim() || 'Anonymous';
            donorMap[donorName] = (donorMap[donorName] || 0) + (Number(donation.amount) || 0);
          }
        });

        const topDonors = Object.entries(donorMap)
          .map(([name, amount]) => ({ name, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        setStats({
          totalAmount,
          totalCount,
          monthlyTrends,
          topDonors
        });

      } catch (error) {
        console.error('Error fetching donation stats:', error);
        setError('Failed to load donation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationStats();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg font-medium">Error Loading Data</div>
        <div className="text-gray-500 text-sm mt-1">{error}</div>
      </div>
    );
  }

  if (stats.totalCount === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-full p-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No donation data available</h3>
        <p className="text-gray-500">Donation trends will appear here once donations are made.</p>
      </div>
    );
  }

  const maxAmount = Math.max(...stats.monthlyTrends.map(t => t.amount));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Donations</p>
              <p className="text-2xl font-bold text-green-800">{formatAmount(stats.totalAmount)}</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Donors</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalCount}</p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Average Donation</p>
              <p className="text-2xl font-bold text-orange-800">
                {formatAmount(stats.totalAmount / stats.totalCount)}
              </p>
            </div>
            <div className="bg-orange-500 bg-opacity-20 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Donation Trends</h3>
            <p className="text-sm text-gray-500">Donation activity over the last 6 months</p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Last 6 months</span>
          </div>
        </div>

        <div className="space-y-4">
          {stats.monthlyTrends.map((trend, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-600">
                {trend.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-900">{formatAmount(trend.amount)}</span>
                  <span className="text-xs text-gray-500">{trend.count} donations</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${maxAmount > 0 ? (trend.amount / maxAmount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Donors */}
      {stats.topDonors.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Donors</h3>
              <p className="text-sm text-gray-500">Most generous contributors</p>
            </div>
          </div>

          <div className="space-y-3">
            {stats.topDonors.map((donor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{donor.name}</span>
                </div>
                <span className="text-lg font-bold text-green-600">{formatAmount(donor.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}