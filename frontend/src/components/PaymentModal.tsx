// Updated payment confirmation component example
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Heart } from 'lucide-react';
import { createPaymentIntent, confirmPayment, cancelPayment } from '@/lib/payments';
import type { PaymentIntent, CreatePaymentIntentRequest, ConfirmPaymentRequest } from '@/lib/payments';

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
  const [currentPaymentIntent, setCurrentPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER'>('MOBILE_MONEY');

  const handleCreatePaymentIntent = useCallback(async () => {
    setIsCreatingIntent(true);
    try {
      const paymentIntentRequest: CreatePaymentIntentRequest = {
        amount: donationData.amount,
        currency: 'RWF',
        donationCause: donationData.donationCause,
        donationText: donationData.donationText,
        eventId: donationData.eventId,
      };

      const paymentIntent = await createPaymentIntent(paymentIntentRequest);
      setCurrentPaymentIntent(paymentIntent);
      toast.success('Payment intent created! Please complete your payment.');
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to create payment intent. Please try again.');
      onClose();
    } finally {
      setIsCreatingIntent(false);
    }
  }, [donationData, onClose]);

  // Step 1: Create Payment Intent when modal opens
  useEffect(() => {
    if (isOpen && !currentPaymentIntent) {
      handleCreatePaymentIntent();
    }
  }, [isOpen, currentPaymentIntent, handleCreatePaymentIntent]);

  // Step 2: Confirm Payment (when user clicks "Confirm Payment")
  const handleConfirmPayment = async () => {
    if (!currentPaymentIntent) return;
    
    setIsProcessingPayment(true);
    try {
      // In a real implementation, you would integrate with actual payment gateway here
      // For demo purposes, we'll simulate successful payment
      
      const confirmationRequest: ConfirmPaymentRequest = {
        paymentIntentId: currentPaymentIntent.paymentIntentId,
        paymentMethod: selectedPaymentMethod,
        success: true, // This would come from actual payment gateway
        transactionId: `TXN_${Date.now()}`, // This would come from payment gateway
        gatewayResponse: 'Payment completed successfully', // This would come from payment gateway
      };

      const confirmationResult = await confirmPayment(confirmationRequest);
      
      if (confirmationResult.donationId) {
        toast.success('Payment successful! Thank you for your generous donation!');
        onSuccess(confirmationResult.donationId);
        onClose();
      } else {
        toast.error('Payment confirmation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Step 3: Cancel Payment
  const handleCancelPayment = async () => {
    if (!currentPaymentIntent) {
      onClose();
      return;
    }

    try {
      await cancelPayment(currentPaymentIntent.paymentIntentId);
      toast.info('Payment cancelled.');
      onClose();
    } catch (error) {
      console.error('Error cancelling payment:', error);
      // Still close the modal even if cancellation API fails
      onClose();
    }
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

        {/* Loading state for creating payment intent */}
        {isCreatingIntent && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Creating payment intent...</p>
          </div>
        )}

        {/* Payment confirmation UI */}
        {currentPaymentIntent && !isCreatingIntent && (
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-orange-500" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Confirm Your Payment
            </h3>
            
            <p className="text-gray-600 mb-6">
              Payment Intent: {currentPaymentIntent.paymentIntentId}
            </p>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">RWF {currentPaymentIntent.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Currency:</span>
                <span className="font-medium">{currentPaymentIntent.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-orange-600">{currentPaymentIntent.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium">{new Date(currentPaymentIntent.expiresAt).toLocaleString()}</span>
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
        )}
      </div>
    </div>
  );
}