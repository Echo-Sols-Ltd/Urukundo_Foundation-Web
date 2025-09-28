'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '../../components/donation/Header';
import Sidebar from '../../components/donation/Sidebar';
import { withAnyAuth } from '../../components/auth/withAuth';
import { getCurrentUser } from '@/lib/auth';
import { donationsApi, eventsApi, videosApi, usersApi } from '@/lib/api';
import type { Donation, Event, Video, UserProfile } from '@/lib/api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function DonationDashboard() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userInitial, setUserInitial] = useState<string>('D');
  const [userTotal, setUserTotal] = useState<number>(0);
  const [featured, setFeatured] = useState<Event | null>(null);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [topVideos, setTopVideos] = useState<Video[]>([]);
  const [history, setHistory] = useState<Donation[]>([]);

  useEffect(() => {
    // Fetch user profile and set greeting
    const loadUserProfile = async () => {
      try {
        const profile = await usersApi.getMe();
        if (profile) {
          const displayName = profile.firstName || profile.email || 'User';
          setUserName(displayName);
          
          // Set user initial from firstName or email
          const initial = profile.firstName 
            ? profile.firstName.charAt(0).toUpperCase()
            : profile.email.charAt(0).toUpperCase();
          setUserInitial(initial);
        } else {
          // Fallback to token-based user info
          const user = getCurrentUser();
          if (user) {
            setUserName(user.firstName || user.email || 'User');
            const initial = user.firstName 
              ? user.firstName.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase();
            setUserInitial(initial);
          }
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // Fallback to token-based user info
        const user = getCurrentUser();
        if (user) {
          setUserName(user.firstName || user.email || 'User');
          const initial = user.firstName 
            ? user.firstName.charAt(0).toUpperCase()
            : user.email.charAt(0).toUpperCase();
          setUserInitial(initial);
        }
      }
    };

    loadUserProfile();

    // Donations (user total + history)
    const loadDonations = async () => {
      const all = await donationsApi.getUserDonations();
      setHistory(all);
      const sum = all.reduce((s, d) => s + Number(d.amount || 0), 0);
      setUserTotal(sum);
    };

    // Events (featured one + next two upcoming)
    const loadEvents = async () => {
      const all = await eventsApi.getAll();
      const sorted = [...all].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
      setFeatured(sorted.length ? sorted[0] : null);
      setUpcoming(
        sorted.filter((e) => new Date(e.startDate) > new Date()).slice(0, 2),
      );
    };

    // Videos (top two)
    const loadVideos = async () => {
      const vids = await videosApi.getAll();
      setTopVideos(vids.slice(0, 2));
    };

    loadDonations();
    loadEvents();
    loadVideos();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Donation Dashboard"
          userInitial={userInitial}
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userName ? `Welcome, ${userName}` : 'Welcome'}
                </h1>
                <p className="text-gray-600">
                  Thank you for making a difference in the world
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Donations</div>
                  <div className="text-lg font-semibold text-orange-600">
                    RWF {userTotal.toLocaleString()}
                  </div>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Featured Causes
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {!featured ? (
                  <div className="p-6 text-center text-gray-500">
                    No featured event yet. Please check back later.
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <Image
                        src={featured.imageUrl || '/image/plant.jpg'}
                        alt={featured.eventName}
                        width={400}
                        height={300}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {featured.eventName}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {featured.description || 'No description'}
                      </p>
                      <button
                        onClick={() => router.push('/donation/events')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      >
                        DONATE NOW
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No upcoming events yet. Please check back later.
                  </div>
                )}
                {upcoming.map((e, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <Image
                      src={e.imageUrl || '/image/plant.jpg'}
                      alt={e.eventName}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {e.eventName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(e.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {e.description || 'No description'}
                      </p>
                      <button
                        onClick={() => router.push('/donation/events')}
                        className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        LEARN MORE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topVideos.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No videos yet. Please check back later.
                  </div>
                )}
                {topVideos.map((v, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="relative">
                      <iframe
                        src={v.videoUrl}
                        title={v.title}
                        className="w-full h-48"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                        {v.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {v.description || 'No description'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Donation History
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {history.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No donation history yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cause
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {history.map((d, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(d.donationTime).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {Number(d.amount || 0).toLocaleString()} RWF
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {d.donationCause || 'General'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {d.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-orange-500 hover:text-orange-600 font-medium">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAnyAuth(DonationDashboard);
