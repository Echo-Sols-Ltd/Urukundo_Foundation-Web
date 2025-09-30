// Simplified payment confirmation component with simulation
import React, { useState } from 'react';
import { toast } from 'sonner';
import { X, Heart } from 'lucide-react';
import { simulateSuccessfulPayment } from '@/lib/payments';
import type { CreatePaymentIntentRequest } from '@/lib/payments';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationData: {
    amount: number;
    donationText?: string;
    donationCause: string;
    eventId?: number;
  };
  onSuccess: (donationId: number) => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  donationData, 
  onSuccess 
}: PaymentModalProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER'>('MOBILE_MONEY');

  // Simulate successful payment
  const handleConfirmPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const paymentRequest: CreatePaymentIntentRequest = {
        amount: donationData.amount,
        currency: 'RWF',
        donationCause: donationData.donationCause,
        donationText: donationData.donationText,
        eventId: donationData.eventId,
      };

      const result = await simulateSuccessfulPayment(paymentRequest);
      
      if (result.donationId) {
        toast.success('Payment successful! Thank you for your generous donation!');
        onSuccess(result.donationId);
        onClose();
      } else {
        toast.error('Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCancelPayment = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative border border-gray-100">
        {/* Close button */}
        <button
          onClick={handleCancelPayment}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Payment confirmation UI */}
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-orange-500" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Confirm Your Payment
          </h3>
          
          <p className="text-gray-600 mb-6">
            Complete your donation securely
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">RWF {donationData.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Currency:</span>
              <span className="font-medium">RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cause:</span>
              <span className="font-medium">{donationData.donationCause}</span>
            </div>
            {donationData.donationText && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Message:</span>
                <span className="font-medium max-w-48 truncate">{donationData.donationText}</span>
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              aria-label="Select payment method"
            >
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancelPayment}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isProcessingPayment}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessingPayment}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4 inline-block" />
                  Confirm Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}