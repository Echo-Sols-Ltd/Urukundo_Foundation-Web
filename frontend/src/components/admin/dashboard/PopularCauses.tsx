import React from 'react';

interface PopularCausesProps {
  donations?: Array<{
    id: number;
    amount: number;
    donationCause?: string;
  }>;
}

export default function PopularCauses({ donations = [] }: PopularCausesProps) {
  // Process real donations data to calculate cause percentages
  const causesData = React.useMemo(() => {
    if (donations.length === 0) {
      // Fallback data if no donations
      return [
        { name: 'Education', percentage: 40, color: 'bg-green-500', amount: 0 },
        { name: 'Health Care', percentage: 35, color: 'bg-blue-500', amount: 0 },
        { name: 'Water Shortage', percentage: 25, color: 'bg-orange-500', amount: 0 },
      ];
    }

    // Group donations by cause and calculate totals
    const causeAmounts = donations.reduce((acc, donation) => {
      const cause = donation.donationCause || 'OTHER';
      const friendlyName = {
        'EDUCATION': 'Education',
        'HEALTH_CARE': 'Health Care', 
        'WATER_SHORTAGE': 'Water Shortage',
        'OTHER': 'Others'
      }[cause] || 'Others';
      
      if (!acc[friendlyName]) {
        acc[friendlyName] = 0;
      }
      acc[friendlyName] += Number(donation.amount) || 0;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(causeAmounts).reduce((sum, amount) => sum + amount, 0);
    
    if (total === 0) {
      return [
        { name: 'Education', percentage: 40, color: 'bg-green-500', amount: 0 },
        { name: 'Health Care', percentage: 35, color: 'bg-blue-500', amount: 0 },
        { name: 'Water Shortage', percentage: 25, color: 'bg-orange-500', amount: 0 },
      ];
    }

    const colors = {
      'Education': 'bg-green-500',
      'Health Care': 'bg-blue-500',
      'Water Shortage': 'bg-orange-500',
      'Others': 'bg-purple-500'
    };

    return Object.entries(causeAmounts)
      .map(([name, amount]) => ({
        name,
        percentage: Math.round((amount / total) * 100),
        color: colors[name as keyof typeof colors] || 'bg-gray-500',
        amount
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [donations]);

  const causes = causesData;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Popular causes
      </h3>

      {/* Donut Chart Visualization */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
            />
            {/* Dynamic segments based on real data */}
            {causes.map((cause, index) => {
              const strokeColors = {
                'bg-green-500': '#10b981',
                'bg-blue-500': '#3b82f6',
                'bg-orange-500': '#f97316',
                'bg-purple-500': '#8b5cf6',
                'bg-gray-500': '#6b7280'
              };
              
              const strokeColor = strokeColors[cause.color as keyof typeof strokeColors] || '#6b7280';
              const circumference = 2 * Math.PI * 50;
              const strokeDasharray = `${(cause.percentage / 100) * circumference} ${circumference}`;
              
              // Calculate offset for each segment
              const previousPercentages = causes.slice(0, index).reduce((sum, c) => sum + c.percentage, 0);
              const strokeDashoffset = -((previousPercentages / 100) * circumference);
              
              return (
                <circle
                  key={cause.name}
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000"
                />
              );
            })}
          </svg>
          
          {/* Center text showing total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {causes.reduce((sum, cause) => sum + cause.percentage, 0)}%
            </span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {causes.map((cause) => (
          <div key={cause.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${cause.color}`}></div>
              <span className="text-sm text-gray-700 font-medium">
                {cause.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {cause.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
