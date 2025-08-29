'use client';

import { useState, use } from 'react'; // Import use from React
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Define the event data type
interface EventData {
  title: string;
  image: string;
  goal: number;
  raised: number;
  donations: number;
  description: string;
  category: string;
}

// Mock data for events with explicit keys
const eventsData: Record<
  'clean-water-for-all' | 'improve-education' | 'end-hunger',
  EventData
> = {
  'clean-water-for-all': {
    title: 'Clean Water for All',
    image: '/image/water.jpg',
    goal: 12000,
    raised: 8000,
    donations: 14,
    description:
      'Providing clean, safe water to communities in need across rural areas.',
    category: 'Clean Water',
  },
  'improve-education': {
    title: 'Improve Education',
    image: '/image/student.jpg',
    goal: 15000,
    raised: 3000,
    donations: 25,
    description:
      'Building schools and providing educational resources for children.',
    category: 'Education',
  },
  'end-hunger': {
    title: 'End Hunger',
    image: '/image/rice.jpg',
    goal: 200000,
    raised: 50000,
    donations: 6,
    description:
      'Providing nutritious meals and food security to families in need.',
    category: 'Ending Hunger',
  },
};

const categories = [
  { name: 'Clean Water', count: 3 },
  { name: 'Education', count: 6 },
  { name: 'Ecology', count: 4 },
  { name: 'Ending Hunger', count: 8 },
  { name: 'Health Care', count: 8 },
  { name: 'Local communities', count: 3 },
];

const urgentCauses = [
  {
    title: 'End Hunger',
    description:
      'Ut ut velit tempor sit amet rutrum. Ut ut velit tempor sit amet rutrum. Ut ut velit tempor sit amet rutrum.',
    image: '/image/rice.jpg',
  },
  {
    title: 'Improve Education',
    description:
      'Ut ut velit tempor sit amet rutrum. Ut ut velit tempor sit amet rutrum. Ut ut velit tempor sit amet rutrum.',
    image: '/image/student.jpg',
  },
  {
    title: 'Clean Water Initiative',
    description:
      'Ut ut velit tempor sit amet rutrum. Ut ut velit tempor sit amet rutrum. Ut ut velit tempor sit amet rutrum.',
    image: '/image/water.jpg',
  },
];

// Type params as a promise resolving to the slug union
export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: 'clean-water-for-all' | 'improve-education' | 'end-hunger' }>;
}) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const [donationAmount, setDonationAmount] = useState(600);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [email, setEmail] = useState('');

  const event = eventsData[resolvedParams.slug];
  if (!event) {
    return <div>Event not found</div>;
  }

  const progressPercentage = (event.raised / event.goal) * 100;
  const presetAmounts = [10, 25, 50, 100, 500];

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setDonationAmount(Number.parseInt(value) || 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>Causes</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {event.title}
            </h1>

            {/* Hero Image and Progress */}
            <div className="relative mb-8">
              <Image
                src={event.image || '/placeholder.svg'}
                alt={event.title}
                width={1200}
                height={320}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-b-lg">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">
                      Goal: ${event.goal.toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Raised: ${event.raised.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {event.donations}
                    </p>
                    <p className="text-gray-600">donations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Donation Amount</h2>
              <div className="flex flex-wrap gap-3">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={
                      donationAmount === amount && !customAmount
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() => handleAmountSelect(amount)}
                    className="px-6 py-2"
                  >
                    ${amount}
                  </Button>
                ))}
                <Button
                  variant={customAmount ? 'default' : 'outline'}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                >
                  CUSTOM AMOUNT
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">$</span>
                <Input
                  type="number"
                  value={customAmount || donationAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="text-xl font-semibold w-32"
                  placeholder="600"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Select Payment Method</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <span>Credit Card</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <span>Pay Pal</span>
                  </label>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <Input placeholder="First Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Input placeholder="Last Name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Donation Summary */}
              <div className="flex items-center justify-between py-4 border-t">
                <span className="text-lg">
                  Donation Total:{' '}
                  <span className="text-orange-500 font-semibold">
                    ${donationAmount}
                  </span>
                </span>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                  DONATE NOW
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search..." className="pl-10" />
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-gray-500">({category.count})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Subscribe to our newsletter
                </h3>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    SUBSCRIBE
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Urgent Causes</h3>
                <div className="space-y-4">
                  {urgentCauses.map((cause, index) => (
                    <div key={index} className="flex gap-3">
                      <Image
                        src={cause.image || '/placeholder.svg'}
                        alt={cause.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {cause.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-3">
                          {cause.description}
                        </p>
                        <Button
                          variant="link"
                          className="text-orange-500 p-0 h-auto text-xs mt-1"
                        >
                          VIEW DETAILS
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}