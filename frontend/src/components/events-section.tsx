'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { eventsApi, dataTransformers } from '@/lib/api';

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const backendEvents = await eventsApi.getAll();

        // Transform and get latest 3 upcoming events
        const transformedEvents = backendEvents
          .filter((event) => {
            const startDate = new Date(event.startDate);
            const now = new Date();
            return startDate >= now; // Only show upcoming events
          })
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          ) // Sort by start date
          .map(dataTransformers.eventToUI)
          .slice(0, 3);

        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="section-padding-lg bg-background">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-16">
          {/* Increased from mb-12 */}
          <h2 className="font-sans text-3xl lg:text-4xl font-bold text-foreground">
            Latest Events
          </h2>
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
                <Image
                  src={event.image || '/placeholder.svg'}
                  alt={event.title}
                  width={300} // Adjusted width for each card (approx. 1/3 of 900px container)
                  height={192} // Adjusted height to match h-48 (48 * 4 = 192)
                  className="w-full h-48 object-cover"
                />
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
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl mx-auto rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="relative w-full h-56">
              <Image
                src={detailsEvent.image || '/placeholder.svg'}
                alt={detailsEvent.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {detailsEvent.title}
              </h3>
              <p className="text-gray-700">{detailsEvent.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(detailsEvent.startDate).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Location:</span>{' '}
                  {detailsEvent.location}
                </div>
                <div>
                  <span className="font-medium">Organizer:</span>{' '}
                  {detailsEvent.organizer}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{' '}
                  {detailsEvent.status}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDetailsEvent(null)}>
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
