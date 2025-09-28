'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Heart, ArrowLeft, Download, Share2 } from 'lucide-react';
import { withAuth } from '@/components/auth/withAuth';
import { toast } from 'sonner';
import Header from '@/components/donation/Header';
import Sidebar from '@/components/donation/Sidebar';

interface DonationDetails {
  id: number;
  amount: number;
  donationText?: string;
  donationTime: string;
  donationCause: string;
  status: string;
  event?: {
    id: number;
    eventName: string;
  };
}

function DonationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const donationId = searchParams.get('donationId');
  
  const [donation, setDonation] = useState<DonationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!donationId) {
      router.push('/dashboard');
      return;
    }

    const fetchDonationDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://urukundo-fromntend-urukundo-back-1.onrender.com';
        
        const response = await fetch(`${API_BASE_URL}/api/donation/${donationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const donationData = await response.json();
          setDonation(donationData);
        } else {
          toast.error('Failed to load donation details');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching donation:', error);
        toast.error('Failed to load donation details');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationDetails();
  }, [donationId, router]);

  const handleDownloadReceipt = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://urukundo-fromntend-urukundo-back-1.onrender.com';
      
      const response = await fetch(`${API_BASE_URL}/api/donation/${donationId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `donation-receipt-${donationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Receipt downloaded successfully');
      } else {
        toast.error('Failed to download receipt');
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const handleShare = async () => {
    if (navigator.share && donation) {
      try {
        await navigator.share({
          title: 'I just made a donation!',
          text: `I just donated ${donation.amount.toLocaleString()} Rwf to ${donation.donationCause}. Join me in making a difference!`,
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copying to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (donation) {
      const text = `I just donated ${donation.amount.toLocaleString()} Rwf to ${donation.donationCause}. Join me in making a difference! ${window.location.origin}`;
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Message copied to clipboard');
      }).catch(() => {
        toast.error('Failed to copy message');
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Donation Not Found</h1>
          <p className="text-gray-600 mb-6">The donation details couldn&apos;t be found.</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Donation Success"
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Thank You for Your Donation!
              </h1>
              <p className="text-lg text-gray-600">
                Your generous contribution makes a real difference
              </p>
            </div>

        {/* Donation Details Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center pb-6 border-b border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-orange-500 mr-2" />
                <span className="text-3xl font-bold text-orange-500">
                  {donation.amount.toLocaleString()} Rwf
                </span>
              </div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {donation.donationCause}
              </p>
              <p className="text-gray-600">
                Donation ID: #{donation.id}
              </p>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(donation.donationTime).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time</span>
                <span className="font-medium text-gray-900">
                  {new Date(donation.donationTime).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {donation.status}
                </span>
              </div>

              {donation.donationText && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-600 block mb-2">Your Message</span>
                  <p className="text-gray-900 italic">
                    &quot;{donation.donationText}&quot;
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="flex items-center justify-center h-12"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center justify-center h-12"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Your Impact
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="h-12"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Button
            onClick={() => router.push('/events')}
            className="h-12 bg-orange-500 hover:bg-orange-600"
          >
            <Heart className="mr-2 h-4 w-4" />
            Explore More Events
          </Button>
        </div>

        {/* Impact Message */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Impact in Action
              </h3>
              <p className="text-gray-600 mb-4">
                Your donation will be used to support our mission and create lasting positive change in the community. 
                We&apos;ll keep you updated on how your contribution is making a difference.
              </p>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-orange-800 font-medium">
                  🙏 Thank you for believing in our cause and helping us build a better future together.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(DonationSuccessPage);