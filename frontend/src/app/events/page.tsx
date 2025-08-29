"use client";

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Book, Droplet, HeartPulse, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { generateStableId } from '../../hooks/useStableId';

interface UiEventCard {
  id: string | number;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  supporters: number;
};

const mapBackendEventToCard = (be: {
  id?: string | number;
  eventName?: string;
  title?: string;
  description?: string;
}): UiEventCard => ({
  id: generateStableId(be, 'event'),
  title: be.eventName ?? be.title ?? 'Event',
  description: be.description ?? '',
    image: '/image/plant.jpg',
  goal: 10000,
  raised: 0,
  supporters: 0,
});

const causesData = [
  {
    icon: Book,
    title: 'Education',
    description: 'Fermentum nisl accumsan nisl sapien in vitae',
  },
  {
    icon: Droplet,
    title: 'Clean Water',
    description: 'Ultricies lacus turpis proin tempor faucibus',
  },
  {
    icon: HeartPulse,
    title: 'Health Care',
    description: 'Adipiscing in vitae neposuae eget fringilla a morbi',
  },
  {
    icon: Users,
    title: 'Local communities',
    description: 'Nunc tristique quis leo duis gravida volutpat vitae',
  },
];

export default function EventsPage() {
  const [cards, setCards] = useState<UiEventCard[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) return;
        const data = await res.json();
        const mapped = Array.isArray(data) ? data.map(mapBackendEventToCard) : [];
        setCards(mapped);
      } catch {
        setCards([]);
      }
    };
    load();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Home</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-black font-medium">Events</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
          Donate Today: Save a Life
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Libero dictum ut purus ut vel sit egestas. Ut ac mattis senectus ac
          suspendisse vitae vel nulla eleifend. Est eros facilisi aenean nisl a.
          Vitae et fusce purus consectetur.
        </p>
      </section>

      {/* Causes Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {causesData.map((cause, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="text-3xl text-orange-500 flex-shrink-0">
                <cause.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">
                  {cause.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {cause.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Events Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-black">Latest Events</h2>
          <Button
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white bg-transparent"
          >
            ALL EVENTS
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((event) => {
            const progressPercentage = (event.raised / event.goal) * 100;

            return (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border"
              >
                <div className="relative">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-black font-medium">
                        Goal: ${event.goal.toLocaleString()}
                      </span>
                      <span className="text-gray-600">
                        {event.supporters} supporters
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">
                        Raised: ${event.raised.toLocaleString()}
                      </span>
                    </div>

                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(progressPercentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-black text-white hover:bg-gray-800">
                    VIEW DETAILS
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
