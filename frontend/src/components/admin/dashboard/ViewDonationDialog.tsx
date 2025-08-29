'use client';

import {
  X,
  DollarSign,
  User,
  Calendar,
  CreditCard,
  MapPin,
  Mail,
} from 'lucide-react';
import { ViewDonationDialogProps } from '../../../types/admin';

export default function ViewDonationDialog({
  isOpen,
  onClose,
  donation,
}: ViewDonationDialogProps) {
  if (!isOpen || !donation) return null;

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  };

  const methodLabels = {
    card: 'Credit/Debit Card',
    bank: 'Bank Transfer',
    mobile: 'Mobile Money',
    cash: 'Cash',
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Donation Details
            </h2>
            <p className="text-sm text-gray-500">ID: {donation.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount and Status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(donation.amount, donation.currency)}
                </h3>
                <p className="text-sm text-gray-500">Donation Amount</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[donation.status]}`}
            >
              {donation.status.charAt(0).toUpperCase() +
                donation.status.slice(1)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donor Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">
                Donor Information
              </h4>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {donation.isAnonymous
                      ? 'Anonymous Donor'
                      : donation.donorName}
                  </p>
                  <p className="text-sm text-gray-500">Full Name</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {donation.isAnonymous ? 'Hidden' : donation.email}
                  </p>
                  <p className="text-sm text-gray-500">Email Address</p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">
                Transaction Details
              </h4>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDate(donation.date)}
                  </p>
                  <p className="text-sm text-gray-500">Date</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {methodLabels[donation.method]}
                  </p>
                  <p className="text-sm text-gray-500">Payment Method</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {donation.campaign || 'General Fund'}
                  </p>
                  <p className="text-sm text-gray-500">Campaign</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {donation.receiptNumber}
                  </p>
                  <p className="text-sm text-gray-500">Receipt Number</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Section */}
          {donation.message && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Message from Donor
              </h4>
              <p className="text-sm text-blue-800 italic">
                &ldquo;{donation.message}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Privacy:{' '}
            {donation.isAnonymous ? 'Anonymous donation' : 'Public donation'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                // Handle download receipt action
                console.log('Download receipt for donation:', donation.id);
              }}
            >
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
