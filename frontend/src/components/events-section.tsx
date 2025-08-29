import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image

export function EventsSection() {
  const events = [
    {
      title: 'Clean Water for All',
      slug: 'clean-water-for-all', // Added slug for routing
      description:
        'Dolor donec eget mollit nisl. Eu ut et enim ornare nisl vel auctor odio a. Curabitur porttitor vel...',
      goal: '$12000',
      raised: 'Raised: $ 8000',
      supporters: '14 supporters',
      progress: 67,
      image: '/image/water.jpg',
    },
    {
      title: 'Improve Education',
      slug: 'improve-education', // Added slug for routing
      description:
        'Dolor donec eget mollit nisl. Eu ut et enim ornare nisl vel auctor odio a. Curabitur porttitor vel...',
      goal: '$15000',
      raised: 'Raised: $ 3000',
      supporters: '25 supporters',
      progress: 20,
      image: '/image/student.jpg',
    },
    {
      title: 'End Hunger',
      slug: 'end-hunger', // Added slug for routing
      description:
        'Dolor donec eget mollit nisl. Eu ut et enim ornare nisl vel auctor odio a. Curabitur porttitor vel...',
      goal: '$200000',
      raised: 'Raised: $ 40000',
      supporters: '6 supporters',
      progress: 20,
      image: '/image/rice.jpg',
    },
    {
      title: 'Reduce Homelessness',
      slug: 'reduce-homelessness', // Added slug for routing
      description:
        'Dolor donec eget mollit nisl. Eu ut et enim ornare nisl vel auctor odio a. Curabitur porttitor vel...',
      goal: '$60000',
      raised: 'Raised: $ 10000',
      supporters: '12 supporters',
      progress: 17,
      image: '/image/street.jpg',
    },
    {
      title: 'Immigration and Refugees',
      slug: 'immigration-and-refugees', // Added slug for routing
      description:
        'Dolor donec eget mollit nisl. Eu ut et enim ornare nisl vel auctor odio a. Curabitur porttitor vel...',
      goal: '$220000',
      raised: 'Raised: $ 40000',
      supporters: '24 supporters',
      progress: 18,
      image: '/image/help.jpg',
    },
    {
      title: 'Climate Change Mitigation',
      slug: 'climate-change-mitigation', // Added slug for routing
      description:
        'Dolor donec eget mollit nisl. Eu ut et enim ornare nisl vel auctor odio a. Curabitur porttitor vel...',
      goal: '$120000',
      raised: 'Raised: $ 10000',
      supporters: '8 supporters',
      progress: 8,
      image: '/image/fire.jpg',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-sans text-3xl lg:text-4xl font-bold text-foreground">
            Latest Events
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {events.map((event, index) => (
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
          ))}
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