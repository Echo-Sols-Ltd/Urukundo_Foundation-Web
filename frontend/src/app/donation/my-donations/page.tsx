'use client';

import { useEffect, useState } from 'react';
import { donationsApi, usersApi } from '@/lib/api';
import Header from '../../../components/donation/Header';
import Sidebar from '../../../components/donation/Sidebar';
import {
  Heart,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
} from 'lucide-react';

interface BackendDonation {
  id: number;
  amount: number;
  donationText: string;
  methodOfPayment: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  donationTime: string;
  donationCause: string;
  donor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Donation {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'card' | 'mobile' | 'bank' | 'ONLINE' | string;
  campaign: string;
  message?: string;
  receiptNumber: string;
}

const mapBackendDonationToUi = (d: BackendDonation): Donation => {
  // Backend Donation fields: id, amount (Double), donationText, methodOfPayment, status (enum), donationTime, donationCause, donor
  const statusMap: Record<string, Donation['status']> = {
    COMPLETED: 'completed',
    PENDING: 'pending',
    FAILED: 'failed',
  };
  return {
    id: String(d.id ?? ''),
    amount: Number(d.amount ?? 0),
    currency: 'RWF',
    date: d.donationTime ? String(d.donationTime).slice(0, 10) : '',
    status: statusMap[String(d.status)] ?? 'completed',
    method: d.methodOfPayment ?? 'ONLINE',
    campaign: d.donationCause ?? 'General Fund',
    message: d.donationText ?? undefined,
    receiptNumber: `RCP-${String(d.id ?? '000')
      .toString()
      .padStart(3, '0')}`,
  };
};

const getStatusIcon = (status: Donation['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-orange-500" />;
    case 'failed':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
  }
};

const getStatusColor = (status: Donation['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-orange-100 text-orange-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
  }
};

export default function MyDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState<
    'all' | 'completed' | 'pending' | 'failed'
  >('all');

  useEffect(() => {
    const load = async () => {
      try {
        const me = await usersApi.getMe();
        let data = [] as BackendDonation[];
        if (me?.id != null) {
          data = (await donationsApi.getByDonor(
            me.id,
          )) as unknown as BackendDonation[];
        } else {
          data =
            (await donationsApi.getUserDonations()) as unknown as BackendDonation[];
        }
        const mapped: Donation[] = Array.isArray(data)
          ? data.map(mapBackendDonationToUi)
          : [];
        setDonations(mapped);
      } catch {}
    };
    load();
  }, []);

  const filteredDonations = donations.filter((donation) => {
    if (filter === 'all') return true;
    return donation.status === filter;
  });

  const totalDonated = donations
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingAmount = donations
    .filter((d) => d.status === 'pending')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="My Donations"
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                My Donation History
              </h2>
              <p className="text-gray-600 mb-6">
                Track your contributions and their impact
              </p>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Total Donated
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        ${totalDonated.toLocaleString()}
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-orange-900">
                        ${pendingAmount.toLocaleString()}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Total Donations
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {donations.length}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({donations.length})
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'completed'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Completed (
                  {donations.filter((d) => d.status === 'completed').length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'pending'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pending (
                  {donations.filter((d) => d.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilter('failed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'failed'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Failed (
                  {donations.filter((d) => d.status === 'failed').length})
                </button>
              </div>
            </div>

            {/* Donations List */}
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(donation.status)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {donation.campaign}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}
                          >
                            {donation.status.charAt(0).toUpperCase() +
                              donation.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />$
                              {donation.amount.toLocaleString()}{' '}
                              {donation.currency}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {donation.date}
                            </div>
                            <div className="flex items-center">
                              <span className="capitalize">
                                {donation.method}
                              </span>
                            </div>
                          </div>

                          {donation.message && (
                            <p className="text-sm text-gray-600 italic">
                              &ldquo;{donation.message}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="text-sm text-gray-500">
                          Receipt: {donation.receiptNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {donation.status === 'completed' && (
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Download receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredDonations.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'completed'
                    ? 'No completed donations'
                    : filter === 'pending'
                      ? 'No pending donations'
                      : filter === 'failed'
                        ? 'No failed donations'
                        : 'No donations found'}
                </h3>
                <p className="text-gray-500">
                  {filter === 'all'
                    ? 'Start making a difference with your first donation!'
                    : 'Check back later or try a different filter'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
