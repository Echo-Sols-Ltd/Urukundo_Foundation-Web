'use client';

import { useState } from 'react';
import Header from '../../components/donation/Header';
import Sidebar from '../../components/donation/Sidebar';
import { Play, Eye } from 'lucide-react';
import { withAnyAuth } from '../../components/auth/withAuth';

function DonationDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Donation Dashboard"
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, Alex
                </h1>
                <p className="text-gray-600">
                  Thank you for making a difference in the world
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Donations</div>
                  <div className="text-lg font-semibold text-orange-600">
                    $5,000 Kwf
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
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src="https://picsum.photos/400/300?random=1"
                      alt="Earthquake relief efforts"
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Support Families Affected by the Nyamasheke Earthquake
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your donation will provide essential supplies and support
                      to families impacted by the earthquake.
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Raised: $45,000</span>
                        <span>Goal: $100,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        1250 donors
                      </div>
                    </div>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                      DONATE NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <img
                    src="https://picsum.photos/400/225?random=2"
                    alt="Community Outreach"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Community Outreach
                      </h3>
                      <span className="text-sm text-gray-500">
                        24 March 2025
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      An evening of elegance and giving to support our causes.
                    </p>
                    <button className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-colors">
                      LEARN MORE
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <img
                    src="https://picsum.photos/400/225?random=3"
                    alt="Fundraising Gala"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Fundraising Gala
                      </h3>
                      <span className="text-sm text-gray-500">
                        24 March 2025
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      An evening of elegance and giving to support our causes.
                    </p>
                    <button className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-colors">
                      LEARN MORE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <iframe
                      src="https://www.youtube.com/embed/PO93I_vBIr4?rel=0&modestbranding=1"
                      title="Impact Story: Meet Sarah"
                      className="w-full h-48"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                      Impact Story: Meet Sarah
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      An evening of elegance and giving to support our causes.
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        1024 views
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        Click the video above to play
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <iframe
                      src="https://www.youtube.com/embed/PO93I_vBIr4?rel=0&modestbranding=1"
                      title="Volunteer Spotlight"
                      className="w-full h-48"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                      Volunteer Spotlight
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      An evening of elegance and giving to support our causes.
                    </p>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        1024 views
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        Click the video above to play
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Donation History
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-08-01
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          50 000 rwf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Nyamasheke Earthquake
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-orange-500 hover:text-orange-600 font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-08-01
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          50 000 rwf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Nyamasheke Earthquake
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-orange-500 hover:text-orange-600 font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-08-01
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          50 000 rwf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Nyamasheke Earthquake
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-orange-500 hover:text-orange-600 font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          2025-08-01
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          50 000 rwf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Nyamasheke Earthquake
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-orange-500 hover:text-orange-600 font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAnyAuth(DonationDashboard);
