import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  color,
}: MetricCardProps) {
  const Icon = icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2 leading-none">
            {value}
          </p>
          <p className="text-sm text-orange-600 font-medium">{change}</p>
        </div>
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center ml-4`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
