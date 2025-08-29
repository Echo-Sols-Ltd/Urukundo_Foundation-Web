// Video Types
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadDate: string;
  category: string;
  status: 'published' | 'draft';
  videoUrl?: string;
}

export interface VideoCardProps {
  video: Video;
  onViewDetails: (video: Video) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (video: Video) => void;
}

export interface ViewVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

export interface EditVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
  onSave: (updatedVideo: Video) => void;
}

// Donation Types
export interface Donation {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'card' | 'bank' | 'mobile' | 'cash';
  campaign?: string;
  message?: string;
  isAnonymous: boolean;
  receiptNumber: string;
}

export interface DonationCardProps {
  donation: Donation;
  onViewDetails: (donation: Donation) => void;
  onEditDonation: (donation: Donation) => void;
  onDeleteDonation: (donation: Donation) => void;
}

export interface ViewDonationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
}

export interface EditDonationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
  onSave: (updatedDonation: Donation) => void;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxAttendees: number;
  currentAttendees: number;
  image: string;
  organizer: string;
  cost: number;
  isPublic: boolean;
  tags: string[];
}

export interface EventCardProps {
  event: Event;
  onViewDetails?: (event: Event) => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

export interface ViewEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export interface EditEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSave: (updatedEvent: Event) => void;
}

// Live Stream Types
export interface LiveStream {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'live' | 'ended';
  viewers: number;
  maxViewers: number;
  streamUrl: string;
  thumbnailUrl: string;
  category: string;
}

// Common Types
export type TabType = 'library' | 'streams';
export type DonationStatus = 'completed' | 'pending' | 'failed';
export type PaymentMethod = 'card' | 'bank' | 'mobile' | 'cash';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type VideoStatus = 'published' | 'draft';
export type StreamStatus = 'scheduled' | 'live' | 'ended';

// Filter and Sort Types
export interface FilterOptions {
  status?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
