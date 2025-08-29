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
    if (donations.length === 0) {
      // Fallback data if no donations
      return [
        { period: 'Jan', amount: 0 },
        { period: 'Feb', amount: 0 },
        { period: 'Mar', amount: 0 },
        { period: 'Apr', amount: 0 },
        { period: 'May', amount: 0 },
        { period: 'Jun', amount: 0 },
      ];
    }

    // Group donations by month
    const monthlyData = donations.reduce((acc, donation) => {
      const date = new Date(donation.donationTime);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += Number(donation.amount) || 0;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      period: month,
      amount: monthlyData[month] || 0,
    })).slice(0, 6); // Show last 6 months
  }, [donations]);

  const maxAmount = Math.max(...processedData.map((d) => d.amount), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Donation trends
      </h3>

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

        <div className="text-center text-xs text-gray-400 mt-2">Amount (Rwf)</div>
      </div>
    </div>
  );
}
