'use client';

import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';

export function HeroSection() {
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonors: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const donationStats = await analyticsApi.getDonationStats();
        setStats({
          totalAmount: donationStats.totalAmount,
          totalDonors: donationStats.totalDonors,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching hero stats:', error);
        setStats((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white overflow-hidden" id='hero'>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image/heart.jpg')`,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative container mx-auto responsive-padding-lg flex flex-col justify-center min-h-[600px]">
        <div className="max-w-2xl space-y-10">
          {/* Increased from space-y-8 */}
          <h1 className="font-sans text-5xl lg:text-7xl font-bold leading-tight">
            Share Love,
            <br />
            Save Lives
          </h1>

          <p className="font-serif text-lg sm:text-xl lg:text-2xl max-w-2xl leading-relaxed opacity-90">
            &quot;At Urukundo Foundation, we believe that technology and
            compassion together can bridge the gap between those who want to
            give and those in need — one donation, one life, one story at a
            time.&quot;
          </p>

          <div className="flex items-center gap-16">
            {/* Increased from gap-12 */}
            <div>
              <div className="text-orange-500 font-sans text-3xl lg:text-4xl font-bold">
                {stats.isLoading
                  ? '...'
                  : `RWF ${stats.totalAmount.toLocaleString()}`}
              </div>
              <div className="font-serif text-sm text-white/80">
                Total Donations
              </div>
            </div>
            <div>
              <div className="text-orange-500 font-sans text-3xl lg:text-4xl font-bold">
                {stats.isLoading ? '...' : stats.totalDonors.toLocaleString()}
              </div>
              <div className="font-serif text-sm text-white/80">
                People Helped
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
