'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChevronRight, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Book, Droplet, HeartPulse } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Donation, Event, eventsApi } from '@/lib/api';

interface UiEventCard {
  id: number;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  supporters: number;
  progress: number;
  date: string;
  location: string;
  organizer: string;
  status: string;
}

const causesData = [
  { icon: Book, title: 'Education', description: 'Empowering communities through quality education' },
  { icon: Droplet, title: 'Clean Water', description: 'Providing safe drinking water to those in need' },
  { icon: HeartPulse, title: 'Health Care', description: 'Delivering medical support and care' },
  { icon: Users, title: 'Local Communities', description: 'Building stronger, resilient communities' },
];

const transformEventToCard = (event: Event): UiEventCard => {
  const goal = Number(event.cost || 0);
  const donations = event.donations || [];
  const raised = donations.reduce((sum: number, d: Donation) => sum + Number(d.amount || 0), 0);
  const progress = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

  return {
    id: event.id,
    title: event.eventName || 'Untitled Event',
    description: event.description || 'No description available.',
    image: event.imageUrl || '/image/plant.jpg',
    goal,
    raised,
    supporters: donations.length,
    progress,
    date: event.startDate,
    location: event.location || 'Location not specified',
    organizer: event.organizer || 'Unknown',
    status: event.status || 'UPCOMING',
  };
};

function EventsPage() {
  const [upcoming, setUpcoming] = useState<UiEventCard[]>([]);
  const [past, setPast] = useState<UiEventCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const events = await eventsApi.getAll();
      const cards = events.map(transformEventToCard);

      const now = new Date();
      const upcomingEvents = cards.filter(e => new Date(e.date) >= now);
      const pastEvents = cards.filter(e => new Date(e.date) < now);

      setUpcoming(upcomingEvents);
      setPast(pastEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      setUpcoming([]);
      setPast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const EventCard = ({ event }: { event: UiEventCard }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border group">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-fit group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition">
          <p className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">{event.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.location}</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{event.organizer}</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Raised: ${event.raised.toLocaleString()}</span>
            <span className="text-gray-600">Goal: ${event.goal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${event.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{event.progress}% funded</span>
            <span>{event.supporters} supporters</span>
          </div>
        </div>

        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 text-lg">
          {new Date(event.date) >= new Date() ? 'Support Event' : 'View Results'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Home</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-black">Events</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Events
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Join upcoming events or explore the impact of past initiatives.
          </p>
        </div>
      </section>

      {/* Causes */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Our Causes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {causesData.map((cause, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6 group-hover:bg-orange-200 transition">
                <cause.icon className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{cause.title}</h3>
              <p className="text-gray-600">{cause.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events Sections */}
      <section className="container mx-auto px-6 py-20 bg-white">
        {/* Upcoming Events */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900">Upcoming Events</h2>
            <Button onClick={loadEvents} variant="outline" size="lg" className="border-2 border-black hover:bg-black hover:text-white">
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-300" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4" />
                    <div className="space-y-2"><div className="h-4 bg-gray-300 rounded" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No upcoming events</h3>
              <p className="text-gray-500">Stay tuned — new events coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-10">Past Events</h2>

          {past.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No past events yet</h3>
              <p className="text-gray-500">Events will appear here after they end</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {past.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default EventsPage;