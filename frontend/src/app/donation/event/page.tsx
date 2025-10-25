'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, Target, Heart } from 'lucide-react';
import { withAuth } from '@/components/auth/withAuth';
import Image from 'next/image';
import { toast } from 'sonner';
import PaymentModal from '@/components/PaymentModal';

interface Event {
  id: number;
  eventName: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  tags?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  organizer?: string;
  organization?: string;
}

interface DonationFormData {
  amount: number;
  donationText: string;
  methodOfPayment: 'STRIPE' | 'PAYPAL' | 'MOBILE_MONEY';
  donationCause: 'EDUCATION' | 'WATER_SHORTAGE' | 'HEALTH_CARE';
}

function EventDonationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 0,
    donationText: '',
    methodOfPayment: 'STRIPE',
    donationCause: 'EDUCATION',
  });

  // Preset donation amounts (in Rwanda Francs)
  const presetAmounts = [2500, 5000, 10000, 25000, 50000, 100000];



  useEffect(() => {
    if (!eventId) {
      router.push('/events');
      return;
    }

    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        // Use NEXT_PUBLIC_API_URL in production, fallback to localhost in development
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.urukundo.echo-solution.com';
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const eventData = await response.json();
          setEvent(eventData);
          // User will select donation cause from the form options
        } else {
          toast.error('Failed to load event details');
          router.push('/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        router.push('/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount }));
  };

  const handleCustomAmount = (value: string) => {
    const amount = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, amount }));
  };

  const handleInputChange = (field: keyof DonationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    // mark as submitting to reflect UI state
    setIsSubmitting(true);

    try {
      // Show payment modal with donation data
      setShowPaymentModal(true);
    } finally {
      // reset submitting state (actual completion will be handled by payment flow)
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (donationId: number) => {
    // Redirect to success page after successful payment
    router.push(`/donation/success?donationId=${donationId}`);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push('/events')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-orange-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Make a Donation
            </h1>
            <p className="text-lg text-gray-600">
              Support this meaningful cause and help make a difference
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.imageUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.eventName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.eventName}
                  </h3>
                  <Badge variant={
                    event.status === 'UPCOMING' ? 'default' :
                    event.status === 'ONGOING' ? 'destructive' : 'secondary'
                  }>
                    {event.status}
                  </Badge>
                </div>

                <p className="text-gray-600">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {event.capacity}</span>
                  </div>
                </div>

                {event.organizer && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Organized by:</span> {event.organizer}
                    </p>
                    {event.organization && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Organization:</span> {event.organization}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-500" />
                Your Donation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Choose Donation Amount
                  </Label>
                  
                  {/* Preset Amounts */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {presetAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={formData.amount === amount ? "default" : "outline"}
                        onClick={() => handleAmountSelect(amount)}
                        className={`h-12 ${
                          formData.amount === amount 
                            ? 'bg-orange-500 hover:bg-orange-600' 
                            : 'hover:bg-orange-50'
                        }`}
                      >
                        {amount.toLocaleString()} Rwf
                      </Button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <Label htmlFor="customAmount" className="text-sm text-gray-600 mb-2 block">
                      Or enter custom amount
                    </Label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Rwf
                      </span>
                      <Input
                        id="customAmount"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="0"
                        value={formData.amount > 0 ? formData.amount.toString() : ''}
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        className="pr-12 h-12 text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Donation Cause */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Donation Cause
                  </Label>
                  <div className="space-y-2">
                    {[
                      { value: 'EDUCATION' as const, label: '📚 Education Support' },
                      { value: 'WATER_SHORTAGE' as const, label: '💧 Clean Water Access' },
                      { value: 'HEALTH_CARE' as const, label: '🏥 Healthcare Services' },
                    ].map((cause) => (
                      <label
                        key={cause.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.donationCause === cause.value
                            ? 'bg-orange-50 border-orange-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="donationCause"
                          value={cause.value}
                          checked={formData.donationCause === cause.value}
                          onChange={(e) =>
                            handleInputChange('donationCause', e.target.value as DonationFormData['donationCause'])
                          }
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{cause.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Payment Method
                  </Label>
                  <div className="space-y-2">
                    {[
                      { value: 'STRIPE', label: 'Credit/Debit Card (Stripe)' },
                      { value: 'PAYPAL', label: 'PayPal' },
                      { value: 'MOBILE_MONEY', label: 'Mobile Money' },
                    ].map((method) => (
                      <label key={method.value} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.methodOfPayment === method.value}
                          onChange={(e) => handleInputChange('methodOfPayment', e.target.value as 'STRIPE' | 'PAYPAL' | 'MOBILE_MONEY')}
                          className="form-radio h-4 w-4 text-orange-500"
                        />
                        <span className="text-sm">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-base font-medium mb-2 block">
                    Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Share why this cause matters to you..."
                    value={formData.donationText}
                    onChange={(e) => handleInputChange('donationText', e.target.value)}
                    className="h-20"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || formData.amount <= 0}
                  className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Donation...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5" />
                      Continue to Payment ({formData.amount.toLocaleString()} Rwf)
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By donating, you agree to our terms of service and privacy policy.
                  Your donation helps support this event and its beneficiaries.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Impact Matters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-orange-500" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Direct Impact</h4>
                  <p className="text-sm text-gray-600">Your donation goes directly to supporting this event</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-orange-500" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Community Support</h4>
                  <p className="text-sm text-gray-600">Help strengthen our community initiatives</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-orange-500" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Lasting Change</h4>
                  <p className="text-sm text-gray-600">Create meaningful and sustainable impact</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
            </div>

      {/* New Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        donationData={{
          amount: formData.amount,
          donationText: formData.donationText,
          donationCause: formData.donationCause,
          eventId: event?.id,
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default withAuth(EventDonationPage);