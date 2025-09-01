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
}

export function EventsSection() {
  const [events, setEvents] = useState<EventUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const backendEvents = await eventsApi.getAll();
        
        // Transform and get latest 3 events
        const transformedEvents = backendEvents
          .filter(event => event.status === 'UPCOMING' || event.status === 'ONGOING')
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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-sans text-3xl lg:text-4xl font-bold text-foreground">
            Latest Events
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {isLoading ? (
            // Loading state
            [...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow p-0">
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
                <CardContent className="p-6">
                  <h3 className="font-sans text-xl font-semibold text-card-foreground mb-3">
                    {event.title}
                  </h3>
                  <p className="font-serif text-muted-foreground mb-4 text-sm leading-relaxed">
                    {event.description}
                  </p>

                  <div className="relative mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Goal: {event.goal}</span>
                      <span className="text-muted-foreground">
                        {event.supporters}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {event.raised}
                    </div>
                    <div className="w-full bg-border rounded-full h-2 relative">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${event.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link href={`/events/${event.slug}`}>
                    <Button className="w-full bg-black hover:bg-black/90 text-white">
                      VIEW DETAILS
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <h3 className="text-xl font-medium mb-2">No events available</h3>
              <p className="text-sm">Check back later for upcoming events and initiatives</p>
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
    </section>
  );
}