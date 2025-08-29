import React from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  DollarSign,
  Calendar,
  CreditCard,
  User,
} from 'lucide-react';
import { DonationCardProps } from '../../../types/admin';

export default function DonationCard({
  donation,
  onViewDetails,
  onEditDonation,
  onDeleteDonation,
}: DonationCardProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  };

  const methodLabels = {
    card: 'Card',
    bank: 'Bank',
    mobile: 'Mobile',
    cash: 'Cash',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 relative group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {donation.amount} {donation.currency}
            </h3>
            <p className="text-sm text-gray-500">{donation.id}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[donation.status]}`}
        >
          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
        </span>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 flex items-center gap-1">
            <User className="w-3 h-3" /> Donor:
          </span>
          <span
            className="font-medium text-gray-900 max-w-[140px] truncate"
            title={donation.donorName}
          >
            {donation.isAnonymous ? 'Anonymous' : donation.donorName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Date:
          </span>
          <span className="font-medium text-gray-900">{donation.date}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> Method:
          </span>
          <span className="font-medium text-gray-900">
            {methodLabels[donation.method]}
          </span>
        </div>

        {donation.campaign && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Campaign:</span>
            <span
              className="font-medium text-gray-900 max-w-[120px] truncate"
              title={donation.campaign}
            >
              {donation.campaign}
            </span>
          </div>
        )}
      </div>

      {/* Message Preview */}
      {donation.message && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 line-clamp-2 italic">
            &ldquo;{donation.message}&rdquo;
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onViewDetails(donation)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          title="View Details"
        >
          <Eye className="w-3 h-3" /> View
        </button>
        <button
          onClick={() => onEditDonation(donation)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
          title="Edit Donation"
        >
          <Edit2 className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={() => onDeleteDonation(donation)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
          title="Delete Donation"
        >
          <Trash2 className="w-3 h-3" /> Del
        </button>
      </div>
    </div>
  );
}
