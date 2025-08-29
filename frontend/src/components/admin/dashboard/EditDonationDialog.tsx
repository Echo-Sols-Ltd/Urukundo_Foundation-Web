import React, { useEffect, useState } from 'react';
import {
  X,
  Save,
  DollarSign,
  User,
  Mail,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { EditDonationDialogProps, Donation } from '../../../types/admin';

const defaultForm: Partial<Donation> = {
  donorName: '',
  email: '',
  amount: 0,
  currency: 'RWF',
  date: '',
  status: 'pending',
  method: 'card',
  campaign: '',
  message: '',
  isAnonymous: false,
  receiptNumber: '',
};

export default function EditDonationDialog({
  isOpen,
  onClose,
  donation,
  onSave,
}: EditDonationDialogProps) {
  const [formData, setFormData] = useState<Partial<Donation>>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (donation) {
      setFormData(donation);
      setErrors({});
    } else if (isOpen) {
      setFormData(defaultForm);
      setErrors({});
    }
  }, [donation, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.donorName && !formData.isAnonymous)
      newErrors.donorName = 'Donor name is required';
    if (!formData.email && !formData.isAnonymous)
      newErrors.email = 'Email is required';
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = 'Amount must be greater than 0';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.receiptNumber)
      newErrors.receiptNumber = 'Receipt number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof Donation,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!donation) return;
    onSave({ ...donation, ...formData } as Donation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-brightness-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Donation
            </h2>
            <p className="text-sm text-gray-500">
              Update donation information and status
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
            aria-label="Close edit donation dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Privacy Setting */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous || false}
                  onChange={(e) =>
                    handleChange('isAnonymous', e.target.checked)
                  }
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Anonymous Donation
                </span>
              </label>
            </div>

            {/* Donor Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Donor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <User className="w-4 h-4" /> Donor Name{' '}
                    {!formData.isAnonymous && '*'}
                  </label>
                  <input
                    type="text"
                    value={formData.donorName || ''}
                    onChange={(e) => handleChange('donorName', e.target.value)}
                    disabled={formData.isAnonymous}
                    className={`w-full rounded-lg border ${errors.donorName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'} focus:border-transparent px-3 py-2 disabled:bg-gray-100`}
                    placeholder="Full name"
                  />
                  {errors.donorName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.donorName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Email{' '}
                    {!formData.isAnonymous && '*'}
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={formData.isAnonymous}
                    className={`w-full rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'} focus:border-transparent px-3 py-2 disabled:bg-gray-100`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Donation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> Amount *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.amount ?? 0}
                    onChange={(e) =>
                      handleChange('amount', Number(e.target.value))
                    }
                    className={`w-full rounded-lg border ${errors.amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'} focus:border-transparent px-3 py-2`}
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency || 'RWF'}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-transparent px-3 py-2"
                    title="Select currency"
                  >
                    <option value="RWF">RWF</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={`w-full rounded-lg border ${errors.date ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'} focus:border-transparent px-3 py-2`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    title="Select donation status"
                    value={formData.status || 'pending'}
                    onChange={(e) =>
                      handleChange(
                        'status',
                        e.target.value as Donation['status'],
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-transparent px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <CreditCard className="w-4 h-4" /> Payment Method
                  </label>
                  <select
                    title="Select payment method"
                    value={formData.method || 'card'}
                    onChange={(e) =>
                      handleChange(
                        'method',
                        e.target.value as Donation['method'],
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-transparent px-3 py-2"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="mobile">Mobile Money</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Number *
                  </label>
                  <input
                    type="text"
                    value={formData.receiptNumber || ''}
                    onChange={(e) =>
                      handleChange('receiptNumber', e.target.value)
                    }
                    className={`w-full rounded-lg border ${errors.receiptNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'} focus:border-transparent px-3 py-2`}
                    placeholder="RCP-12345"
                  />
                  {errors.receiptNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.receiptNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Campaign & Message */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign
                  </label>
                  <input
                    type="text"
                    value={formData.campaign || ''}
                    onChange={(e) => handleChange('campaign', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-transparent px-3 py-2"
                    placeholder="e.g. Education Fund"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message from Donor
                  </label>
                  <textarea
                    value={formData.message || ''}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-transparent px-3 py-2 h-20"
                    placeholder="Optional message from the donor"
                  />
                </div>
              </div>
            </div>

            {/* Read-only fields */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation ID
                  </label>
                  <input
                    type="text"
                    value={donation?.id || ''}
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
            >
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
