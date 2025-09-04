// API functions for donations
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://urukundo-fromntend-urukundo-back-1.onrender.com';
// ...existing code...

export interface Donation {
  id: number;
  donor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  donationText: string;
  donationTime: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface DonationStats {
  totalAmount: number;
  totalDonations: number;
  recentDonations: Donation[];
}

// Payload for creating a donation (backend request shape)
export interface DonationCreateRequest {
  amount: number;
  donationText: string;
  methodOfPayment: string;
  donationCause: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

// Get authorization header
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Fetch all donations for a user
export async function getUserDonations(): Promise<Donation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donation`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
}

// Get donation statistics for the current user
export async function getUserDonationStats(): Promise<DonationStats> {
  try {
    const donations = await getUserDonations();

    // Filter donations for the current user if needed
    // Since the backend should already filter by authenticated user

    const totalAmount = donations.reduce(
      (sum, donation) => sum + donation.amount,
      0,
    );
    const totalDonations = donations.length;
    const recentDonations = donations
      .sort(
        (a, b) =>
          new Date(b.donationTime).getTime() -
          new Date(a.donationTime).getTime(),
      )
      .slice(0, 5);

    return {
      totalAmount,
      totalDonations,
      recentDonations,
    };
  } catch (error) {
    console.error('Error calculating donation stats:', error);
    return {
      totalAmount: 0,
      totalDonations: 0,
      recentDonations: [],
    };
  }
}

// Create a new donation
export async function createDonation(
  donationData: DonationCreateRequest,
): Promise<Donation> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donation`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(donationData),
    });

    if (!response.ok) {
      throw new Error('Failed to create donation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
}
