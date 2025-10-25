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

  const handleDownloadReceipt = () => {
    if (!donation) return;

    // Create receipt HTML content
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Donation Receipt - ${donation.receiptNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 32px;
            }
            .header p {
              color: #666;
              margin: 5px 0;
            }
            .receipt-info {
              background: #f3f4f6;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .receipt-info h2 {
              margin-top: 0;
              color: #1f2937;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #d1d5db;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: 600;
              color: #4b5563;
            }
            .info-value {
              color: #1f2937;
            }
            .amount-section {
              background: #dbeafe;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 30px 0;
            }
            .amount-section h3 {
              margin: 0 0 10px 0;
              color: #1e40af;
            }
            .amount-value {
              font-size: 36px;
              font-weight: bold;
              color: #1e40af;
            }
            .message-section {
              background: #f0f9ff;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .tax-note {
              background: #fef3c7;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #f59e0b;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Urukundo Foundation</h1>
            <p>Tax-Exempt Charitable Organization</p>
            <p>Email: info@urukundo.org | Website: urukundo.echo-solution.com</p>
          </div>

          <div class="receipt-info">
            <h2>Donation Receipt</h2>
            <div class="info-row">
              <span class="info-label">Receipt Number:</span>
              <span class="info-value">${donation.receiptNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${formatDate(donation.date)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Donor Name:</span>
              <span class="info-value">${donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}</span>
            </div>
            ${!donation.isAnonymous ? `
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${donation.email}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${methodLabels[donation.method]}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Campaign:</span>
              <span class="info-value">${donation.campaign || 'General Fund'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}</span>
            </div>
          </div>

          <div class="amount-section">
            <h3>Total Donation Amount</h3>
            <div class="amount-value">${formatCurrency(donation.amount, donation.currency)}</div>
          </div>

          ${donation.message ? `
          <div class="message-section">
            <h3 style="margin-top: 0;">Message from Donor</h3>
            <p style="font-style: italic; margin: 0;">"${donation.message}"</p>
          </div>
          ` : ''}

          <div class="tax-note">
            <strong>Tax Deduction Notice:</strong> This receipt serves as official documentation for tax purposes. 
            Urukundo Foundation is a registered charitable organization. Please retain this receipt for your tax records.
          </div>

          <div class="footer">
            <p><strong>Thank you for your generous donation!</strong></p>
            <p>Your contribution helps us make a difference in the lives of those we serve.</p>
            <p style="margin-top: 20px; font-size: 12px;">
              This is an official receipt generated on ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </body>
      </html>
    `;

    // Create a Blob and download
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${donation.receiptNumber}_${donation.donorName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Open print dialog for the receipt
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
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
              onClick={handleDownloadReceipt}
            >
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
