import React from 'react';

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
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM15 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 13h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01-.707 1.707H13M13 13V9a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1h8zm-8-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
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
