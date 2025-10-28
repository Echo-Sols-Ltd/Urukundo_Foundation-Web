'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/dashboard/Header';
import Sidebar from '@/components/admin/dashboard/Sidebar';
import { withAdminAuth } from '@/components/auth/withAuth';
import MetricCard from '@/components/admin/dashboard/MetricCard';
import EventCard from '@/components/admin/dashboard/EventCard';
import CreateEventDialog from '@/components/admin/dashboard/CreateEventDialog';
import ViewEventDialog from '@/components/admin/dashboard/ViewEventDialog';
import AttendeesDialog from '@/components/admin/dashboard/AttendeesDialog';
import ConfirmDialog from '@/components/admin/dashboard/ConfirmDialog';

import {
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import { Event } from '@/types/admin';
import { donationsApi } from '@/lib/api';

interface BackendEvent {
  id?: number;
  eventId?: number;
  eventName?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  type?: string;
  category?: string;
  capacity?: number;
  currentAttendees?: number;
  organizer?: string;
  cost?: number;
  tags?: string;
  eventStatus?: string;
  actualAttendees?: number;
  totalMoneyCollected?: number;
}

interface CreateEventFormWithFile extends CreateEventForm {
  imageFile?: File;
}

type CreateEventForm = {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string; // changed from type to category
  maxAttendees?: number; // changed from capacity
  currentAttendees?: number; // manually set attendee count
  organizer?: string; // changed from organizerName
  cost?: number;
  isPublic?: boolean; // changed from isPrivate
  isCompleted?: boolean; // to mark past/completed events
  tags?: string[]; // changed from string to string[]
  actualAttendees?: number; // for completed events - actual attendance
  totalMoneyCollected?: number; // for completed events - total money raised
};

function EventsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [attendeesDialogOpen, setAttendeesDialogOpen] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState<
    Array<{
      id: number;
      userName?: string;
      userEmail?: string;
      registrationDate?: string;
    }>
  >([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [donationsDialogOpen, setDonationsDialogOpen] = useState(false);
  const [selectedEventDonations, setSelectedEventDonations] = useState<
    Array<{
      id: number;
      amount: number;
      donationTime?: string;
      donor?: { firstName?: string; lastName?: string; email?: string };
      donationCause?: string;
      methodOfPayment?: string;
      status?: string;
    }>
  >([]);

  // Map backend Event -> frontend Event shape
  const mapBackendEventToUi = (be: BackendEvent): Event => {
    const start = be.startDate ? new Date(be.startDate) : new Date();
    const now = Date.now();
    const isUpcoming = start.getTime() > now;
    const isCompleted = be.eventStatus === 'COMPLETED';
    
    return {
      id: String(be.id ?? be.eventId ?? Math.random()),
      title: be.eventName ?? be.title ?? 'Event',
      description: be.description ?? '',
      date: start.toISOString().slice(0, 10),
      time: start.toTimeString().slice(0, 5),
      location: be.location ?? 'TBD',
      category: be.type ?? be.category ?? 'General',
      status: isCompleted ? 'completed' : (isUpcoming ? 'upcoming' : 'completed'),
      maxAttendees: Number(be.capacity ?? 0),
      currentAttendees: Number(be.currentAttendees ?? 0),
      image: '',
      organizer: be.organizer ?? 'Staff',
      cost: Number(be.cost ?? 0),
      isPublic: true,
      tags: (be.tags
        ? String(be.tags)
            .split(',')
            .map((t: string) => t.trim())
        : []) as string[],
      actualAttendees: be.actualAttendees,
      totalMoneyCollected: be.totalMoneyCollected,
    };
  };

  // Load attendees for an event
  const loadEventAttendees = async (eventId: string) => {
    try {
      const res = await fetch(
        `/api/event-registrations/event/${eventId}/registrations`,
        {
          headers: getHeaders(),
        },
      );
      if (res.ok) {
        const data = await res.json();
        setSelectedEventAttendees(data);
        setAttendeesDialogOpen(true);
      }
    } catch {
      console.error('Failed to load attendees');
    }
  };

  // Load donations for an event (admin view)
  const loadEventDonations = async (eventId: string) => {
    try {
      const numericId = Number(eventId);
      // Check if the eventId is a valid number
      if (isNaN(numericId)) {
        console.warn('Cannot load donations for non-numeric event ID:', eventId);
        setSelectedEventDonations([]);
        return;
      }
      
      const list = await donationsApi.getByEvent(numericId);
      setSelectedEventDonations(
        list as unknown as Array<{
          id: number;
          amount: number;
          donationTime?: string;
          donor?: { firstName?: string; lastName?: string; email?: string };
        }>,
      );
    } catch {
      console.error('Failed to load event donations');
      setSelectedEventDonations([]);
    }
  };  // Get headers with auth
  const getHeaders = () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Load events from backend
  useEffect(() => {
    // Require login
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    if (!token) {
      router.push('/login');
      return;
    }
    const load = async () => {
      try {
        const res = await fetch('/api/events', { headers: getHeaders() });
        if (!res.ok) return; // silently keep mocked data if unauthorized
        const data = await res.json();
        const mapped: Event[] = Array.isArray(data)
          ? data.map(mapBackendEventToUi)
          : [];

        // Load attendee counts for each event
        const eventsWithAttendeeCounts = await Promise.all(
          mapped.map(async (event) => {
            try {
              const countRes = await fetch(
                `/api/event-registrations/check/${event.id}`,
                {
                  headers: getHeaders(),
                },
              );
              if (countRes.ok) {
                const countData = await countRes.json();
                return {
                  ...event,
                  currentAttendees: countData.registrationCount || 0,
                };
              }
            } catch {
              console.error(
                'Failed to load attendee count for event:',
                event.id,
              );
            }
            return event;
          }),
        );

        const upcoming = eventsWithAttendeeCounts.filter(
          (e) => e.status !== 'completed',
        );
        const past = eventsWithAttendeeCounts.filter(
          (e) => e.status === 'completed',
        );
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch {
        // Silently handle errors and keep existing data
      }
    };
    load();
  }, [router]);

  const openView = (ev: Event) => {
    setSelectedEvent(ev);
    setViewDialogOpen(true);
    setIsMobileMenuOpen(false); // Close mobile sidebar when dialog opens
  };

  const handleDeleteEvent = async (eventId: string) => {
    setPendingDeleteId(eventId);
    setConfirmOpen(true);
  };

  const executeDeleteEvent = async () => {
    if (!pendingDeleteId) {
      setConfirmOpen(false);
      return;
    }
    try {
      const res = await fetch(`/api/events/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok || res.status === 204) {
        setUpcomingEvents((prev) =>
          prev.filter((e) => e.id !== pendingDeleteId),
        );
        setPastEvents((prev) => prev.filter((e) => e.id !== pendingDeleteId));
      }
    } catch {}
    setViewDialogOpen(false);
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleCreateEvent = async (
    data: CreateEventForm | CreateEventFormWithFile,
  ) => {
    // POST to backend; fall back to local add on failure
    const payload = {
      eventName: data.title ?? 'New Event',
      description: data.description ?? '',
      location: data.location ?? 'TBD',
      type: data.category ?? 'General',
      organizer: data.organizer ?? 'Staff',
      capacity: Number(data.maxAttendees ?? 0),
      startDate:
        (data.date ?? new Date().toISOString().slice(0, 10)) +
        'T' +
        (data.time ?? '09:00') +
        ':00',
      endDate:
        (data.date ?? new Date().toISOString().slice(0, 10)) +
        'T' +
        (data.time ?? '09:00') +
        ':00',
      tags: (data.tags ?? []).join(','),
      // Fields for completed events
      actualAttendees: data.isCompleted ? Number(data.actualAttendees ?? 0) : null,
      totalMoneyCollected: data.isCompleted ? Number(data.totalMoneyCollected ?? 0) : null,
      eventStatus: data.isCompleted ? 'COMPLETED' : 'PENDING',
    };
    try {
      const accessToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;
      const dataWithFile = data as CreateEventFormWithFile;
      if (dataWithFile?.imageFile) {
        const fd = new FormData();
        fd.append(
          'event',
          new Blob([JSON.stringify(payload)], { type: 'application/json' }),
        );
        fd.append('image', dataWithFile.imageFile);
        const res = await fetch('/api/events/upload', {
          method: 'POST',
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: fd,
        });
        if (res.ok) {
          const created = await res.json();
          const ui = mapBackendEventToUi(created);
          // If marked as completed, add to past events, otherwise to upcoming
          if (data.isCompleted) {
            ui.status = 'completed';
            setPastEvents((prev) => [ui, ...prev]);
          } else {
            setUpcomingEvents((prev) => [ui, ...prev]);
          }
          setIsCreateDialogOpen(false);
          return;
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          const ui = mapBackendEventToUi(created);
          // If marked as completed, add to past events, otherwise to upcoming
          if (data.isCompleted) {
            ui.status = 'completed';
            setPastEvents((prev) => [ui, ...prev]);
          } else {
            setUpcomingEvents((prev) => [ui, ...prev]);
          }
          setIsCreateDialogOpen(false);
          return;
        }
      }
    } catch {
      // ignore and fallback to local
    }
    const fallback: Event = {
      id: `EVT-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      title: data.title || 'New Event',
      description: data.description || '',
      date: data.date || new Date().toISOString().slice(0, 10),
      time: data.time || '09:00',
      location: data.location || 'TBD',
      category: data.category || 'General',
      status: data.isCompleted ? 'completed' : 'upcoming',
      maxAttendees: Number(data.maxAttendees) || 0,
      currentAttendees: data.isCompleted ? Number(data.actualAttendees) || 0 : Number(data.currentAttendees) || 0,
      image: '',
      organizer: data.organizer || 'Staff',
      cost: data.cost || 0,
      isPublic: data.isPublic !== false,
      tags: data.tags || [],
    };
    // Add to the appropriate list based on completion status
    if (data.isCompleted) {
      setPastEvents((prev) => [fallback, ...prev]);
    } else {
      setUpcomingEvents((prev) => [fallback, ...prev]);
    }
    setIsCreateDialogOpen(false);
  };

  // Calculate real metrics from events data
  const metrics = React.useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Upcoming events in next 30 days
    const upcomingNext30 = upcomingEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= next30Days;
    });

    // Total attendees from all events
    const totalAttendees = [...upcomingEvents, ...pastEvents].reduce(
      (sum, event) => sum + event.currentAttendees,
      0,
    );

    // This month's events (both upcoming and past)
    const thisMonthEvents = [...upcomingEvents, ...pastEvents].filter(
      (event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === currentMonth &&
          eventDate.getFullYear() === currentYear
        );
      },
    );

    // Last month's events for comparison
    const lastMonthEvents = [...upcomingEvents, ...pastEvents].filter(
      (event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === lastMonth &&
          eventDate.getFullYear() === lastMonthYear
        );
      },
    );

    // Calculate percentage change
    const monthlyChange =
      lastMonthEvents.length > 0
        ? (
            ((thisMonthEvents.length - lastMonthEvents.length) /
              lastMonthEvents.length) *
            100
          ).toFixed(0)
        : thisMonthEvents.length > 0
          ? '100'
          : '0';

    const changeText =
      parseFloat(monthlyChange) >= 0
        ? `+${monthlyChange}% vs last month`
        : `${monthlyChange}% vs last month`;

    // Unique locations
    const uniqueLocations = new Set(
      [...upcomingEvents, ...pastEvents].map((e) => e.location),
    ).size;

    return [
      {
        title: 'Upcoming Events',
        value: upcomingNext30.length.toString(),
        change: 'Next 30 days',
        icon: Calendar,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Total Attendees',
        value: totalAttendees.toLocaleString(),
        change: 'All events',
        icon: Users,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Event Locations',
        value: uniqueLocations.toString(),
        change: 'Active venues',
        icon: MapPin,
        color: 'bg-orange-100 text-orange-600',
      },
      {
        title: 'Events This Month',
        value: thisMonthEvents.length.toString(),
        change: changeText,
        icon: TrendingUp,
        color: 'bg-orange-100 text-orange-600',
      },
    ];
  }, [upcomingEvents, pastEvents]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Events Management"
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

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

            {/* Tabs and Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === 'upcoming'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === 'past'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Past Events
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium text-sm bg-white">
                  <Download className="w-4 h-4" />
                  <span>Export Events</span>
                </button>
                <button
                  onClick={() => {
                    setIsCreateDialogOpen(true);
                    setIsMobileMenuOpen(false); // Close mobile sidebar when dialog opens
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium text-sm shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>
            </div>

            {/* Events Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeTab === 'upcoming'
                      ? 'Upcoming Events'
                      : 'Past Events'}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search events..."
                        className="pl-10 pr-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white w-full sm:w-64"
                      />
                    </div>
                    <button className="flex items-center justify-center text-gray-700 space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Table for Upcoming Events */}
              {activeTab === 'upcoming' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Attendees
                        </th>
                        <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Organizer
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {upcomingEvents.map((event, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                        >
                          <td className="px-4 sm:px-6 py-4">
                            <div>
                              <div
                                className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors duration-150"
                                onClick={() => openView(event)}
                              >
                                {event.title}
                              </div>
                              <div className="text-xs text-gray-500 font-medium">
                                {event.id}
                              </div>
                              {/* Show date and location on mobile */}
                              <div className="sm:hidden mt-1 space-y-1">
                                <div className="text-xs text-gray-600 font-medium">
                                  {event.date} at {event.time}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {event.location}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {event.date}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {event.time} AM
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {event.location}
                            </div>
                            <div className="text-xs text-gray-500">
                              Community Center
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {event.currentAttendees}
                            </div>
                            <div className="text-xs text-gray-500">
                              of {event.maxAttendees} max
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                            <span
                              className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                              title={event.category}
                            >
                              {event.category}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                              {event.status}
                            </span>
                            {/* Show additional info on mobile */}
                            <div className="md:hidden mt-1 space-y-1">
                              <div className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                                {event.category}
                              </div>
                              <div className="text-xs text-gray-500 block">
                                By {event.organizer}
                              </div>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {event.organizer}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative">
                              <button
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-150"
                                title="More actions"
                                onClick={() => openView(event)}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              <button
                                className="ml-2 text-orange-600 hover:text-white hover:bg-orange-500 border border-orange-500 px-3 py-1 rounded-lg transition-all duration-150"
                                title="View Donations"
                                onClick={() => loadEventDonations(event.id)}
                              >
                                Donations
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Cards for Past Events */}
              {activeTab === 'past' && (
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {pastEvents.map((event, index) => (
                      <EventCard
                        key={index}
                        event={event}
                        onViewDetails={openView}
                      />
                    ))}
                  </div>

                  {/* Empty State */}
                  {pastEvents.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No past events
                      </h3>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto px-4">
                        Past events will appear here once they are completed.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Event Dialog */}
      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateEvent}
      />
      <ViewEventDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        event={selectedEvent}
        onViewAttendees={loadEventAttendees}
        onDelete={handleDeleteEvent}
      />
      <AttendeesDialog
        isOpen={attendeesDialogOpen}
        onClose={() => setAttendeesDialogOpen(false)}
        attendees={selectedEventAttendees.map((attendee) => ({
          id: attendee.id,
          user: {
            id: attendee.id,
            firstName: attendee.userName?.split(' ')[0] || 'Unknown',
            lastName: attendee.userName?.split(' ')[1] || '',
            email: attendee.userEmail || 'No email',
          },
          status: 'registered',
          registrationDate:
            attendee.registrationDate || new Date().toISOString(),
        }))}
        eventTitle={selectedEvent?.title}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete this event?"
        description="This action will permanently remove the event."
        confirmText="Delete Event"
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={executeDeleteEvent}
      />

      {/* Event Donations Dialog */}
      {donationsDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-3xl mx-auto rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Event Donations
              </h3>
              <button
                onClick={() => setDonationsDialogOpen(false)}
                className="px-3 py-1 border rounded-lg"
              >
                Close
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Donor
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Method
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {selectedEventDonations.map((d, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {d.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {d.donor
                          ? `${d.donor.firstName ?? ''} ${d.donor.lastName ?? ''}`.trim() ||
                            'Anonymous'
                          : 'Anonymous'}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {Number(d.amount || 0).toLocaleString()} RWF
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {d.status || 'PENDING'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {d.methodOfPayment || 'ONLINE'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {d.donationTime
                          ? String(d.donationTime).slice(0, 10)
                          : ''}
                      </td>
                    </tr>
                  ))}
                  {selectedEventDonations.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-gray-500 text-sm"
                      >
                        No donations yet for this event.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(EventsPage);
