'use client';

import React from 'react';
import { Heart, Clock } from 'lucide-react';

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  date: string;
  campaign: string;
  message?: string;
}

const recentDonations: Donation[] = [
  {
    id: 'DON-001',
    donorName: 'Sarah Johnson',
    amount: 500,
    currency: 'USD',
    date: '2 hours ago',
    campaign: 'Education Fund',
    message: 'Happy to support education in our community!',
  },
  {
    id: 'DON-002',
    donorName: 'Michael Chen',
    amount: 1000,
    currency: 'USD',
    date: '5 hours ago',
    campaign: 'Healthcare Initiative',
  },
  {
    id: 'DON-003',
    donorName: 'Anonymous Donor',
    amount: 250,
    currency: 'USD',
    date: '1 day ago',
    campaign: 'General Fund',
    message: 'Keep up the great work!',
  },
  {
    id: 'DON-004',
    donorName: 'Emma Wilson',
    amount: 750,
    currency: 'USD',
    date: '2 days ago',
    campaign: 'Food Security',
  },
];

export default function RecentDonations() {
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
        {recentDonations.map((donation) => (
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
        ))}
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
