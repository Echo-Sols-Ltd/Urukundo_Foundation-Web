'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { eventsApi, dataTransformers } from '@/lib/api';
import { Calendar, MapPin, User, X } from 'lucide-react';

interface EventUI {
  id: number;
  title: string;
  slug: string;
  description: string;
  goal: string;
  raised: string;
  supporters: string;
  progress: number;
  image: string;
  date: string;
  location: string;
  organizer: string;
  status: string;
  startDate: string;
  endDate: string;
}

export function EventsSection() {
  const [events, setEvents] = useState<EventUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsEvent, setDetailsEvent] = useState<EventUI | null>(null);
  const [eventFilter, setEventFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const backendEvents = await eventsApi.getAll();
        const now = new Date();

        // Separate upcoming and past events
        const upcomingEvents = backendEvents
          .filter((event) => {
            const startDate = new Date(event.startDate);
            return startDate >= now; // Upcoming events
          })
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          )
          .map(dataTransformers.eventToUI)
          .slice(0, 3);

        const pastEvents = backendEvents
          .filter((event) => {
            const startDate = new Date(event.startDate);
            return startDate < now; // Past events
          })
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime(), // Sort newest first
          )
          .map(dataTransformers.eventToUI)
          .slice(0, 3);

        // Show upcoming by default, or past if no upcoming events
        if (upcomingEvents.length > 0) {
          setEvents(upcomingEvents);
          setEventFilter('upcoming');
        } else if (pastEvents.length > 0) {
          setEvents(pastEvents);
          setEventFilter('past');
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleFilterChange = async (filter: 'upcoming' | 'past') => {
    setEventFilter(filter);
    setIsLoading(true);
    
    try {
      const backendEvents = await eventsApi.getAll();
      const now = new Date();

      const filteredEvents = backendEvents
        .filter((event) => {
          const startDate = new Date(event.startDate);
          return filter === 'upcoming' ? startDate >= now : startDate < now;
        })
        .sort(
          (a, b) => {
            const timeA = new Date(a.startDate).getTime();
            const timeB = new Date(b.startDate).getTime();
            return filter === 'upcoming' ? timeA - timeB : timeB - timeA;
          }
        )
        .map(dataTransformers.eventToUI)
        .slice(0, 3);

      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-sans text-3xl lg:text-4xl font-bold text-foreground">
            Latest Events
          </h2>
        </div>

        {/* Event Filter Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => handleFilterChange('upcoming')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              eventFilter === 'upcoming'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => handleFilterChange('past')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              eventFilter === 'past'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Past Events
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Increased gaps */}
          {isLoading ? (
            // Loading state
            [...Array(3)].map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow p-0"
              >
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow p-0"
              >
                <div className="relative w-full h-48 bg-gray-200">
                  <Image
                    src={event.image || '/placeholder.svg'}
                    alt={event.title}
                    fill
                    className="object-contain transition-transform duration-500 hover:scale-150 hover:mt-10"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <CardContent className="card-padding-lg">
                  {/* Enhanced padding */}
                  <h3 className="font-sans text-xl font-semibold text-card-foreground mb-4">
                    {/* Increased from mb-3 */}
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {event.organizer}
                    </div>
                  </div>

                  {/* Minimal progress preview */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Raised</span>
                      <span className="font-medium">RWF {event.raised}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 relative">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${event.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Goal</span>
                      <span className="font-medium">RWF {event.goal}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      className="w-full bg-black hover:bg-black/90 text-white"
                      onClick={() => setDetailsEvent(event)}
                    >
                      VIEW DETAILS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <h3 className="text-xl font-medium mb-2">No events available</h3>
              <p className="text-sm">
                Check back later for upcoming events and initiatives
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Link href="/events">
            <Button
              variant="outline"
              className="border-border hover:bg-muted bg-transparent"
            >
              MORE EVENTS
            </Button>
          </Link>
        </div>
      </div>
{detailsEvent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    {/* Click outside to close */}
    <div
      className="absolute inset-0"
      onClick={() => setDetailsEvent(null)}
      aria-hidden="true"
    />

    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto flex flex-col max-h-[90vh] overflow-hidden">
      
      {/* IMAGE — Bigger + object-contain */}
      <div className="relative h-64 sm:h-80 md:h-96 bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
        <Image
          src={detailsEvent.image || '/placeholder-event.jpg'}
          alt={detailsEvent.title || 'Event'}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-contain p-4 sm:p-6"  
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
          }}
        />
        
        {/* Close button */}
        <button
          onClick={() => setDetailsEvent(null)}
          className="absolute top-3 right-3 z-10 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* SCROLLABLE CONTENT — Clean & balanced */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
        
        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {detailsEvent.title || 'Untitled Event'}
        </h3>

        {/* Description */}
        {detailsEvent.description ? (
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {detailsEvent.description}
          </p>
        ) : (
          <p className="text-gray-500 italic">No description provided.</p>
        )}

        {/* Info Grid — Compact & clean */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
         <div className="flex items-start gap-3">
  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
  <div>
    <span className="font-medium text-gray-800">Date & Time</span>
    <p className="text-gray-600">
      {detailsEvent.startDate ? (
        <>
          {new Date(detailsEvent.startDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {' at '}
          {new Date(detailsEvent.startDate).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </>
      ) : (
        'Not scheduled'
      )}
    </p>
  </div>
</div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-800">Location</span>
              <p className="text-gray-600">{detailsEvent.location || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-800">Organizer</span>
              <p className="text-gray-600">{detailsEvent.organizer || 'Unknown'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider ${
              detailsEvent.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              detailsEvent.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
              detailsEvent.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {detailsEvent.status || 'unknown'}
            </span>
          </div>
        </div>

        {/* Raised Amount */}
        {detailsEvent.status === 'completed' && detailsEvent.raised != null && (
          <div className="p-5 bg, bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-sm font-medium text-green-700">Total Raised</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              ${Number(detailsEvent.raised).toLocaleString()}
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setDetailsEvent(null)}
            className="px-10"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
)}
    </section>
  );
}
