const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://urukundo-fromntend-urukundo-back-1.onrender.com';
// ...existing code...

// Types for API responses
export interface Event {
  id: number;
  eventName: string;
  description: string;
  location: string;
  type: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  organizer: string;
  capacity: number;
  cost?: number;
  startDate: string;
  endDate: string;
  organization: string;
  organizerEmail: string;
  organizerPhone: string;
  tags: string;
  imageUrl: string;
  donations?: Donation[];
  videos?: Video[];
}

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
  donationCause?: string;
}

// Payload for creating donations (includes fields backend accepts)
export interface DonationCreate {
  amount?: number;
  donationText?: string;
  methodOfPayment?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  donationCause?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadTime: string;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  message?: string;
  isRead?: boolean;
  timestamp: string;
}

export interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  totalDonors: number;
  recentDonations: Donation[];
  monthlyTrends: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  causeDistribution: Array<{
    cause: string;
    amount: number;
    percentage: number;
  }>;
}

// Get authorization headers
function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Events API
export const eventsApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  // Get event by ID
  getById: async (id: number): Promise<Event | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch event');
      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  },

  // Create event
  create: async (event: Partial<Event>): Promise<Event | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },
};

// Donations API
export const donationsApi = {
  // Get all donations for the current user
  getUserDonations: async (): Promise<Donation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donation`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch donations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  },

  // Get all donations (admin only)
  getAll: async (): Promise<Donation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donation`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch donations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  },

  // Create donation
  create: async (donation: DonationCreate): Promise<Donation | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donation`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(donation),
      });
      if (!response.ok) throw new Error('Failed to create donation');
      return await response.json();
    } catch (error) {
      console.error('Error creating donation:', error);
      return null;
    }
  },

  // Create donation for a specific event
  createForEvent: async (
    eventId: number,
    donation: DonationCreate,
  ): Promise<Donation | null> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/donation/event/${eventId}`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(donation),
        },
      );
      if (!response.ok) throw new Error('Failed to create event donation');
      return await response.json();
    } catch (error) {
      console.error('Error creating event donation:', error);
      return null;
    }
  },

  // List donations for a specific event (admin or public depending on backend rules)
  getByEvent: async (eventId: number): Promise<Donation[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/donation/event/${eventId}`,
        {
          headers: getAuthHeaders(),
        },
      );
      if (!response.ok) throw new Error('Failed to fetch event donations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching event donations:', error);
      return [];
    }
  },
};

// Videos API (assuming similar structure)
export const videosApi = {
  getAll: async (): Promise<Video[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/videos`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch videos');
      return await response.json();
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  },
};

// Notifications API (optional backend support)
export const notificationsApi = {
  getAll: async (): Promise<NotificationItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
};

// Analytics API
export const analyticsApi = {
  // Get donation statistics
  getDonationStats: async (): Promise<DonationStats> => {
    try {
      const donations = await donationsApi.getAll();

      // Calculate stats from donations data
      const totalAmount = donations.reduce(
        (sum, donation) => sum + (Number(donation.amount) || 0),
        0,
      );
      const totalDonations = donations.length;
      const uniqueDonors = new Set(
        donations.map((d) => d.donor?.id).filter(Boolean),
      ).size;

      // Get recent donations (last 10)
      const recentDonations = donations
        .sort(
          (a, b) =>
            new Date(b.donationTime).getTime() -
            new Date(a.donationTime).getTime(),
        )
        .slice(0, 10);

      // Calculate monthly trends
      const monthlyData = donations.reduce(
        (acc, donation) => {
          const date = new Date(donation.donationTime);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short' });

          if (!acc[monthKey]) {
            acc[monthKey] = { amount: 0, count: 0 };
          }
          acc[monthKey].amount += Number(donation.amount) || 0;
          acc[monthKey].count += 1;
          return acc;
        },
        {} as Record<string, { amount: number; count: number }>,
      );

      const monthlyTrends = Object.entries(monthlyData).map(
        ([month, data]) => ({
          month,
          amount: data.amount,
          count: data.count,
        }),
      );

      // Calculate cause distribution
      const causeData = donations.reduce(
        (acc, donation) => {
          const cause = donation.donationCause || 'General';
          if (!acc[cause]) {
            acc[cause] = 0;
          }
          acc[cause] += Number(donation.amount) || 0;
          return acc;
        },
        {} as Record<string, number>,
      );

      const causeDistribution = Object.entries(causeData).map(
        ([cause, amount]) => ({
          cause,
          amount,
          percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        }),
      );

      return {
        totalDonations,
        totalAmount,
        totalDonors: uniqueDonors,
        recentDonations,
        monthlyTrends,
        causeDistribution,
      };
    } catch (error) {
      console.error('Error calculating donation stats:', error);
      return {
        totalDonations: 0,
        totalAmount: 0,
        totalDonors: 0,
        recentDonations: [],
        monthlyTrends: [],
        causeDistribution: [],
      };
    }
  },

  // Get general stats for dashboard
  getGeneralStats: async () => {
    try {
      const [donations, events] = await Promise.all([
        donationsApi.getAll(),
        eventsApi.getAll(),
      ]);

      const totalDonationAmount = donations.reduce(
        (sum, donation) => sum + (Number(donation.amount) || 0),
        0,
      );
      const totalDonors = new Set(
        donations.map((d) => d.donor?.id).filter(Boolean),
      ).size;

      return {
        totalDonations: donations.length,
        totalDonationAmount,
        totalDonors,
        totalEvents: events.length,
        donations,
        events,
      };
    } catch (error) {
      console.error('Error fetching general stats:', error);
      return {
        totalDonations: 0,
        totalDonationAmount: 0,
        totalDonors: 0,
        totalEvents: 0,
        donations: [],
        events: [],
      };
    }
  },
};

// Utility functions for data transformation
export const dataTransformers = {
  // Transform backend event to UI format
  eventToUI: (event: Event) => ({
    id: event.id,
    title: event.eventName,
    slug: `event-${event.id}`,
    description: event.description,
    goal: Number(event.cost || 0).toLocaleString(),
    raised: event.donations
      ? event.donations
          .reduce((sum, d) => sum + Number(d.amount), 0)
          .toLocaleString()
      : '0',
    supporters: event.donations ? event.donations.length.toString() : '0',
    progress: (() => {
      const goal = Number(event.cost || 0);
      const raised = event.donations
        ? event.donations.reduce((s, d) => s + Number(d.amount), 0)
        : 0;
      return goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
    })(),
    image: event.imageUrl || '/image/plant.jpg',
    date: new Date(event.startDate).toLocaleDateString(),
    location: event.location,
    organizer: event.organizer,
    status: event.status,
    startDate: event.startDate,
    endDate: event.endDate,
  }),

  // Transform backend donation to UI format
  donationToUI: (donation: Donation) => ({
    id: donation.id.toString(),
    donorName:
      `${donation.donor?.firstName || ''} ${donation.donor?.lastName || ''}`.trim() ||
      'Anonymous',
    amount: Number(donation.amount),
    currency: 'RWF',
    date: new Date(donation.donationTime).toLocaleDateString(),
    campaign: donation.donationCause || 'General Fund',
    message: donation.donationText,
    status: donation.status,
  }),

  // Transform backend video to UI format
  videoToUI: (video: Video) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    views: video.views || '0 views',
    thumbnail: video.thumbnail || '/image/video-thumbnail.jpg',
    videoUrl: video.videoUrl,
    duration: video.duration || '0:00',
  }),
};
