'use client';

import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function DonationChart() {
  const chartData = [
    { month: 'Jan', amount: 4200 },
    { month: 'Feb', amount: 3800 },
    { month: 'Mar', amount: 5200 },
    { month: 'Apr', amount: 4800 },
    { month: 'May', amount: 6100 },
    { month: 'Jun', amount: 5800 },
  ];

  const maxAmount = Math.max(...chartData.map((d) => d.amount));

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
        {chartData.map((data, index) => (
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
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600">Total this period:</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            $
            {chartData
              .reduce((sum, data) => sum + data.amount, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
