'use client';

import { useEffect, useState } from 'react';
import Header from '../../../components/donation/Header';
import Sidebar from '../../../components/donation/Sidebar';
import { notificationsApi, type NotificationItem } from '@/lib/api';

export default function NotificationsPage() {
  const [notificationsList, setNotificationsList] = useState<
    NotificationItem[]
  >([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const items = await notificationsApi.getAll();
      setNotificationsList(items);
    };
    load();
  }, []);

  const markAllAsRead = () => {
    setNotificationsList((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const newNotifications = notificationsList.filter((n) => !n.isRead);
  const readNotifications = notificationsList.filter((n) => n.isRead);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Notifications"
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">Here are some notifications.</p>
            </div>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              MARK ALL AS READ
            </button>
          </div>

          {/* New Notifications */}
          {newNotifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                New notifications
              </h2>
              <div className="space-y-3">
                {newNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Read notifications
              </h2>
              <div className="space-y-3">
                {readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-700">{notification.title}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {newNotifications.length === 0 && readNotifications.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                You&apos;ll see notifications here when they arrive
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
