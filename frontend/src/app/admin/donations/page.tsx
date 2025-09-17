'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/admin/dashboard/Header';
import Sidebar from '@/components/admin/dashboard/Sidebar';
import { withAdminAuth } from '@/components/auth/withAuth';
import MetricCard from '@/components/admin/dashboard/MetricCard';
import ViewDonationDialog from '@/components/admin/dashboard/ViewDonationDialog';
import EditDonationDialog from '@/components/admin/dashboard/EditDonationDialog';
import ConfirmationDialog from '@/components/admin/dashboard/ConfirmationDialog';
import {
  DollarSign,
  Users,
  TrendingUp,
  CreditCard,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { Donation } from '@/types/admin';

interface BackendDonation {
  id?: number;
  amount?: number;
  donationTime?: string;
  status?: string;
  methodOfPayment?: string;
  donationCause?: string;
  donationText?: string;
  donor?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

const mapBackendDonationToUi = (d: BackendDonation): Donation => {
  const statusMap: Record<string, Donation['status']> = {
    COMPLETED: 'completed',
    PENDING: 'pending',
    FAILED: 'failed',
  };

  const methodMap: Record<string, Donation['method']> = {
    ONLINE: 'card',
    CARD: 'card',
    BANK: 'bank',
    MOBILE: 'mobile',
    CASH: 'cash',
  };

  return {
    id: String(d.id ?? ''),
    donorName: d.donor
      ? `${d.donor.firstName ?? ''} ${d.donor.lastName ?? ''}`.trim() ||
        'Anonymous Donor'
      : 'Anonymous Donor',
    email: d.donor?.email ?? 'hidden@example.com',
    amount: Number(d.amount ?? 0),
    currency: 'RWF',
    date: d.donationTime ? String(d.donationTime).slice(0, 10) : '',
    status: statusMap[String(d.status)] ?? 'completed',
    method: methodMap[String(d.methodOfPayment)] ?? 'card',
    campaign: d.donationCause ?? 'General Fund',
    message: d.donationText ?? '',
    isAnonymous: !d.donor,
    receiptNumber: `RCP-${String(d.id ?? '000')
      .toString()
      .padStart(3, '0')}`,
  };
};

function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null,
  );
  const [pendingDelete, setPendingDelete] = useState<Donation | null>(null);

  const getHeaders = (): Record<string, string> => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    return token
      ? { Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/donation', { headers: getHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        const mapped: Donation[] = Array.isArray(data)
          ? data.map(mapBackendDonationToUi)
          : [];
        setDonations(mapped);
      } catch {}
    };
    load();
  }, []);

  const openView = (donation: Donation) => {
    setSelectedDonation(donation);
    setViewDialogOpen(true);
    setIsMobileMenuOpen(false); // Close mobile sidebar when dialog opens
  };
  const openEdit = (donation: Donation) => {
    setSelectedDonation(donation);
    setEditDialogOpen(true);
    setIsMobileMenuOpen(false); // Close mobile sidebar when dialog opens
  };
  const requestDelete = (donation: Donation) => {
    setPendingDelete(donation);
    setConfirmDialogOpen(true);
    setIsMobileMenuOpen(false); // Close mobile sidebar when dialog opens
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await fetch(`/api/donation/${pendingDelete.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok || res.status === 204) {
        setDonations((prev) => prev.filter((d) => d.id !== pendingDelete.id));
        if (selectedDonation?.id === pendingDelete.id)
          setSelectedDonation(null);
        setPendingDelete(null);
      }
    } catch {}
  };

  const handleSaveDonation = (updated: Donation) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d)),
    );
  };

  // Calculate real metrics from donations data
  const metrics = React.useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Total raised from all donations
    const totalRaised = donations.reduce(
      (sum, donation) => sum + donation.amount,
      0,
    );

    // Active donors (unique donors)
    const uniqueDonors = new Set(donations.map((d) => d.email)).size;

    // This month donations
    const thisMonthDonations = donations.filter((donation) => {
      const donationDate = new Date(donation.date);
      return (
        donationDate.getMonth() === currentMonth &&
        donationDate.getFullYear() === currentYear
      );
    });
    const thisMonthTotal = thisMonthDonations.reduce(
      (sum, donation) => sum + donation.amount,
      0,
    );

    // Last month donations for comparison
    const lastMonthDonations = donations.filter((donation) => {
      const donationDate = new Date(donation.date);
      return (
        donationDate.getMonth() === lastMonth &&
        donationDate.getFullYear() === lastMonthYear
      );
    });
    const lastMonthTotal = lastMonthDonations.reduce(
      (sum, donation) => sum + donation.amount,
      0,
    );

    // Calculate percentage change
    const monthlyChange =
      lastMonthTotal > 0
        ? (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(
            1,
          )
        : thisMonthTotal > 0
          ? '100'
          : '0';

    const changeText =
      parseFloat(monthlyChange) >= 0
        ? `+${monthlyChange}% from last month`
        : `${monthlyChange}% from last month`;

    return [
      {
        title: 'Total Raised',
        value: `${totalRaised.toLocaleString()} RWF`,
        change: changeText,
        icon: DollarSign,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Active Donors',
        value: uniqueDonors.toString(),
        change: `${donations.length} total donations`,
        icon: Users,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'This Month',
        value: `${thisMonthTotal.toLocaleString()} RWF`,
        change: changeText,
        icon: TrendingUp,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Transactions',
        value: donations.length.toString(),
        change: `${thisMonthDonations.length} this month`,
        icon: CreditCard,
        color: 'bg-orange-100 text-orange-600',
      },
    ];
  }, [donations]);

  const handleOptionsToggle = (donationId: string) => {
    setShowOptions(showOptions === donationId ? null : donationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Donations Management"
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {/* Content Container */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {metrics.map((metric, index) => (
                  <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    change={metric.change}
                    icon={metric.icon}
                    color={metric.color}
                  />
                ))}
              </div>

              {/* Donations Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        Donations Management
                      </h2>
                      <p className="text-sm text-gray-500">
                        Track and manage all donation transactions
                      </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium text-sm border border-gray-200 self-start sm:self-auto">
                      <Download className="w-4 h-4" />
                      <span>Export Data</span>
                    </button>
                  </div>

                  {/* Search and Filter Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Donations
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search donations..."
                          className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm placeholder:text-gray-400 bg-gray-50/50"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium text-sm bg-white">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Donations Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Donation ID
                        </th>
                        <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Donor
                        </th>
                        <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="hidden md:table-cell text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Cause
                        </th>
                        <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="hidden sm:table-cell text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="hidden lg:table-cell text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="text-left py-4 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {donations.map((donation) => (
                        <tr
                          key={donation.id}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                        >
                          <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {donation.id}
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {donation.isAnonymous
                                  ? 'Anonymous Donor'
                                  : donation.donorName}
                              </div>
                              <div className="text-xs text-gray-500 font-medium">
                                {donation.isAnonymous
                                  ? 'Hidden'
                                  : donation.email}
                              </div>
                              {/* Show additional info on mobile */}
                              <div className="sm:hidden mt-1 space-y-1">
                                <div className="text-xs text-gray-600 font-medium">
                                  {donation.date}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {donation.campaign || 'General Fund'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-900">
                              {donation.amount.toLocaleString()}{' '}
                              {donation.currency}
                            </span>
                          </td>
                          <td className="hidden md:table-cell py-4 px-6">
                            <span className="text-sm font-medium text-gray-900">
                              {donation.campaign || 'General Fund'}
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(donation.status)}`}
                            >
                              {donation.status.charAt(0).toUpperCase() +
                                donation.status.slice(1)}
                            </span>
                            {/* Show payment method on mobile */}
                            <div className="lg:hidden mt-1">
                              <div className="text-xs text-gray-500">
                                {donation.method === 'card'
                                  ? 'Credit Card'
                                  : donation.method === 'bank'
                                    ? 'Bank Transfer'
                                    : donation.method === 'mobile'
                                      ? 'Mobile Money'
                                      : 'Cash'}
                              </div>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell py-4 px-6 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {donation.date}
                            </span>
                          </td>
                          <td className="hidden lg:table-cell py-4 px-6 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {donation.method === 'card'
                                ? 'Credit Card'
                                : donation.method === 'bank'
                                  ? 'Bank Transfer'
                                  : donation.method === 'mobile'
                                    ? 'Mobile Money'
                                    : 'Cash'}
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                            <div className="relative">
                              <button
                                onClick={() => handleOptionsToggle(donation.id)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                title="More options"
                              >
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              </button>

                              {showOptions === donation.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => {
                                      openView(donation);
                                      setShowOptions(null);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-150"
                                  >
                                    <Eye className="w-4 h-4 mr-3" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      openEdit(donation);
                                      setShowOptions(null);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-150"
                                  >
                                    <Download className="w-4 h-4 mr-3" />
                                    Edit Donation
                                  </button>
                                  <button
                                    onClick={() => {
                                      requestDelete(donation);
                                      setShowOptions(null);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-150 border-t border-gray-100"
                                  >
                                    <Download className="w-4 h-4 mr-3" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Dialogs */}
      {viewDialogOpen && selectedDonation && (
        <ViewDonationDialog
          donation={selectedDonation}
          isOpen={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />
      )}

      {editDialogOpen && selectedDonation && (
        <EditDonationDialog
          donation={selectedDonation}
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSaveDonation}
        />
      )}

      {confirmDialogOpen && pendingDelete && (
        <ConfirmationDialog
          isOpen={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Donation"
          message={`Are you sure you want to delete donation #${pendingDelete.id}? This action cannot be undone.`}
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}

export default withAdminAuth(DonationsPage);
