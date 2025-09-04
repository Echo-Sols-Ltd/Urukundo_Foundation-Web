'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { analyticsApi } from '@/lib/api';

interface ChartData {
  month: string;
  amount: number;
}

export default function DonationChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        setIsLoading(true);
        const stats = await analyticsApi.getDonationStats();

        // Transform monthly trends for chart
        const monthlyTrends = stats.monthlyTrends.slice(0, 6); // Last 6 months
        setChartData(monthlyTrends);
        setTotalAmount(stats.totalAmount);
      } catch (error) {
        console.error('Error fetching donation chart data:', error);
        setChartData([]);
        setTotalAmount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationData();
  }, []);

  const maxAmount =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.amount)) : 1;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Donation Trends
          </h3>
          <p className="text-sm text-gray-500">Monthly donation progress</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+12.5%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-3 animate-pulse"></div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : chartData.length > 0 ? (
          chartData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm text-gray-500">{data.month}</div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-20 text-right text-sm font-medium text-gray-900">
                ${data.amount.toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No donation data</p>
            <p className="text-sm">
              Donation trends will appear here once data is available
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">Total this period:</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            RWF {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
