import React from 'react';
import Image from 'next/image';

interface DonationChartProps {
  donations?: Array<{
    id: number;
    amount: number;
    donationTime: string;
  }>;
}

export default function DonationChart({ donations = [] }: DonationChartProps) {
  // Process real donations data to create monthly aggregations
  const processedData = React.useMemo(() => {
    // Get the last 6 months from current date
    const currentDate = new Date();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      last6Months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        monthKey: date.toLocaleDateString('en-US', { month: 'short' }),
        period: date.toLocaleDateString('en-US', { month: 'short' }),
        amount: 0
      });
    }

    if (donations.length === 0) {
      return last6Months;
    }

    // Group donations by month and year
    const monthlyData = donations.reduce(
      (acc, donation) => {
        const date = new Date(donation.donationTime);
        if (isNaN(date.getTime())) return acc; // Skip invalid dates
        
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${month}`;

        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += Number(donation.amount) || 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Update the last 6 months with actual data
    return last6Months.map(monthData => ({
      ...monthData,
      amount: monthlyData[`${monthData.year}-${monthData.month}`] || 0
    }));
  }, [donations]);

  const maxAmount = Math.max(...processedData.map((d) => d.amount), 1);
  const hasData = processedData.some(d => d.amount > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Donation trends
      </h3>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Image src="/svg/undraw_no-data_ig65.svg" alt="No data" width={80} height={80} />
          <p className="text-sm">No donation data available</p>
          <p className="text-xs text-gray-400 mt-1">Donation trends will appear here once donations are made</p>
        </div>
      ) : (
        <div className="space-y-4">
        <div className="flex items-center justify-end text-sm text-gray-600 mb-6">
          <span className="font-medium">Monthly Donation Amount (Rwf)</span>
        </div>

        {processedData.map((item) => (
          <div key={item.period} className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 w-10 text-right font-medium">
              {item.period}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(item.amount / maxAmount) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-16 text-right">
              {item.amount.toLocaleString()}
            </span>
          </div>
        ))}

        <div className="flex justify-between text-xs text-gray-400 mt-6 px-10">
          <span>0</span>
          <span>{Math.round(maxAmount * 0.25).toLocaleString()}</span>
          <span>{Math.round(maxAmount * 0.5).toLocaleString()}</span>
          <span>{Math.round(maxAmount * 0.75).toLocaleString()}</span>
          <span>{maxAmount.toLocaleString()}</span>
        </div>

        <div className="text-center text-xs text-gray-400 mt-2">
          Amount (Rwf)
        </div>
        </div>
      )}
    </div>
  );
}
