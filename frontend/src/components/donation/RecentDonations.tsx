'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Clock } from 'lucide-react';
import { donationsApi, dataTransformers } from '@/lib/api';

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  date: string;
  campaign: string;
  message?: string;
}

export default function RecentDonations() {
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        setIsLoading(true);
        const donations = await donationsApi.getUserDonations();
        
        // Transform and get recent donations (last 5)
        const transformedDonations = donations
          .map(dataTransformers.donationToUI)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        
        setRecentDonations(transformedDonations);
      } catch (error) {
        console.error('Error fetching recent donations:', error);
        setRecentDonations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentDonations();
  }, []);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Donations
          </h3>
          <p className="text-sm text-gray-500">
            Latest contributions from our donors
          </p>
        </div>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : recentDonations.length > 0 ? (
          recentDonations.map((donation) => (
            <div
              key={donation.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-orange-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {donation.donorName === 'Anonymous Donor'
                        ? 'Anonymous'
                        : donation.donorName}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {donation.campaign}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${donation.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {donation.date}
                    </div>
                  </div>
                </div>

                {donation.message && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    &quot;{donation.message}&quot;
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No recent donations</p>
            <p className="text-sm">Donations will appear here once received</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total recent donations:</span>
          <span className="font-semibold text-gray-900">
            $
            {recentDonations
              .reduce((sum, d) => sum + d.amount, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
