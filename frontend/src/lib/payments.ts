// Payment API functions for frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://urukundo-fromntend-urukundo-back-1.onrender.com';

// Payment Intent interfaces
export interface CreatePaymentIntentRequest {
  amount: number;
  currency: 'RWF' | 'USD';
  donationCause: string;
  donationText?: string;
  eventId?: number;
}

export interface PaymentIntent {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  expiresAt: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  paymentMethod: 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER' | 'CASH';
  success: boolean;
  transactionId?: string;
  gatewayResponse?: string;
}

export interface PaymentConfirmationResponse {
  paymentIntentId: string;
  paymentStatus: string;
  transactionId: string;
  transactionStatus: string;
  donationId?: number;
}

// Get authorization headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

/**
 * Step 1: Create a payment intent for a donation
 */
export async function createPaymentIntent(
  request: CreatePaymentIntentRequest
): Promise<PaymentIntent> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-donation-intent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Step 2: Confirm a payment (when user completes payment)
 */
export async function confirmPayment(
  request: ConfirmPaymentRequest
): Promise<PaymentConfirmationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/confirm-donation`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}

/**
 * Step 3: Cancel a payment intent
 */
export async function cancelPayment(paymentIntentId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/cancel/${paymentIntentId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel payment');
    }
  } catch (error) {
    console.error('Error canceling payment:', error);
    throw error;
  }
}

/**
 * Get payment intent details
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/intent/${paymentIntentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment intent:', error);
    throw error;
  }
}