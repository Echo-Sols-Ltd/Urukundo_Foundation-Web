import { CheckCircle } from 'lucide-react';
import { EventCardProps } from '@/types/admin';

export default function EventCard({ event, onViewDetails }: EventCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          icon: <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
        };
      case 'upcoming':
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          icon: null,
        };
      case 'ongoing':
        return {
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200',
          icon: null,
        };
      case 'cancelled':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          icon: null,
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig(event.status);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImpactText = (category: string) => {
    switch (category) {
      case 'Charity':
        return '500 Clothing items distributed';
      case 'Education':
        return '60 seniors trained';
      case 'Technology':
        return '60 seniors trained';
      case 'Healthcare':
        return 'Community health improved';
      case 'Environment':
        return 'Environmental impact achieved';
      default:
        return 'Community impact achieved';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 relative group hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-4 leading-tight">
          {event.title}
        </h3>
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border font-medium text-xs whitespace-nowrap ml-2`}
        >
          {statusConfig.icon}
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>

      {/* Event Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 font-medium">Date:</span>
          <span className="font-semibold text-gray-900">{event.date}</span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 font-medium">Attendees:</span>
          <span className="font-semibold text-gray-900">
            {event.currentAttendees}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-gray-500 font-medium">Funds Raised:</span>
          <span className="font-bold text-orange-600 text-base">
            {formatCurrency(event.cost || 30000)} Rwf
          </span>
        </div>
      </div>

      {/* Impact Section */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="mb-3">
          <span className="text-gray-500 font-medium text-sm">Impact:</span>
        </div>
        <p className="text-sm text-gray-700 font-medium leading-relaxed">
          {getImpactText(event.category)}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails?.(event)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          title="View Full Report"
        >
          View Full Report
        </button>
      </div>
    </div>
  );
}
