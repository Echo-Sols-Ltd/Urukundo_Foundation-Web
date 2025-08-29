'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/donation/Header';
import Sidebar from '../../../components/donation/Sidebar';
import { Search } from 'lucide-react';

interface BackendEvent {
  id: number;
  eventName: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  maxAttendees?: number;
  capacity?: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  isRegistered?: boolean;
  registrationCount?: number;
  maxAttendees?: number;
}

const mapBackendEventToUi = (be: BackendEvent): Event => {
  const start = be.startDate ? new Date(be.startDate) : new Date();
  return {
    id: String(be.id ?? Math.random()),
    title: be.eventName ?? 'Event',
    description: be.description ?? '',
    date: start.toDateString(),
    image: be.imageUrl ?? 'https://picsum.photos/400/300?random=9',
    maxAttendees: Number(be.capacity ?? 0),
  };
};

export default function EventsPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    const load = async () => {
      try {
        const res = await fetch('/api/events', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        const now = Date.now();
        const upcoming = (Array.isArray(data) ? data : [])
          .filter((e: BackendEvent) => new Date(e.startDate ?? Date.now()).getTime() > now)
          .map(mapBackendEventToUi);
        
        // Check registration status for each event
        const eventsWithRegistrationStatus = await Promise.all(
          upcoming.map(async (event) => {
            try {
              const statusRes = await fetch(`/api/event-registrations/check/${event.id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              if (statusRes.ok) {
                const statusData = await statusRes.json();
                return { ...event, isRegistered: statusData.isRegistered, registrationCount: statusData.registrationCount };
              }
            } catch {
              // ignore errors
            }
            return event;
          })
        );
        
        setEvents(eventsWithRegistrationStatus);
      } catch {
        setEvents([]);
      }
    };
    load();
  }, [router]);

  const handleRegister = async (eventId: string) => {
    setLoadingStates(prev => ({ ...prev, [eventId]: true }));
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const res = await fetch(`/api/event-registrations/register/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        // Update the event's registration status
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: true, registrationCount: (event.registrationCount || 0) + 1 }
            : event
        ));
        alert('Successfully registered for the event!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || 'Failed to register for event');
      }
    } catch {
      alert('Failed to register for event');
    } finally {
      setLoadingStates(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    setLoadingStates(prev => ({ ...prev, [eventId]: true }));
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const res = await fetch(`/api/event-registrations/cancel/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        // Update the event's registration status
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: false, registrationCount: Math.max(0, (event.registrationCount || 1) - 1) }
            : event
        ));
        alert('Registration cancelled successfully!');
      } else {
        alert('Failed to cancel registration');
      }
    } catch {
      alert('Failed to cancel registration');
    } finally {
      setLoadingStates(prev => ({ ...prev, [eventId]: false }));
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
          title="Events"
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Events
                </h1>
                <p className="text-gray-600">
                  Here are some events you can attend.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="SEARCH EVENTS"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-full w-full sm:w-80 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-6">
              {events
                .filter(
                  (event) =>
                    event.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    event.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-80 h-48 sm:h-auto">
                        <Image
                          src={event.image || '/placeholder.svg'}
                          alt={event.title}
                          width={320}
                          height={192}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {event.description}
                          </p>
                          <p className="text-gray-500 mb-6">{event.date}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          {event.isRegistered ? (
                            <button 
                              onClick={() => handleCancelRegistration(event.id)}
                              disabled={loadingStates[event.id]}
                              className="px-8 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {loadingStates[event.id] ? 'CANCELLING...' : 'CANCEL REGISTRATION'}
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRegister(event.id)}
                              disabled={loadingStates[event.id] || !!(event.maxAttendees && event.registrationCount && event.registrationCount >= event.maxAttendees)}
                              className={`px-8 py-3 font-medium rounded-lg transition-colors disabled:opacity-50 ${
                                event.maxAttendees && event.registrationCount && event.registrationCount >= event.maxAttendees
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : 'bg-orange-500 text-white hover:bg-orange-600'
                              }`}
                            >
                              {loadingStates[event.id] 
                                ? 'REGISTERING...' 
                                : (event.maxAttendees && event.registrationCount && event.registrationCount >= event.maxAttendees)
                                  ? 'EVENT FULL'
                                  : 'REGISTER'
                              }
                            </button>
                          )}
                          <button className="px-8 py-3 border border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 transition-colors">
                            LEARN MORE
                          </button>
                        </div>
                        {event.registrationCount !== undefined && (
                          <p className="text-sm text-gray-500 mt-2">
                            {event.registrationCount} people registered
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {events.filter(
              (event) =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            ).length === 0 &&
              searchQuery && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms to find more events.
                  </p>
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
