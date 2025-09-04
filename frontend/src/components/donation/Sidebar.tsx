'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Video,
  Bell,
  Heart,
  X,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: 'Home', href: '/donation' },
  { icon: Heart, label: 'Donate', href: '/donation/donate' },
  { icon: Calendar, label: 'Events', href: '/donation/events' },
  { icon: Video, label: 'Videos', href: '/donation/videos' },
  { icon: Bell, label: 'Notifications', href: '/donation/notifications' },
];

const bottomItems: SidebarItem[] = [
  { icon: Heart, label: 'My Donations', href: '/donation/my-donations' },
  { icon: Settings, label: 'Settings', href: '/donation/settings' },
  { icon: LogOut, label: 'Logout', href: '/donation/logout' },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-20 z-30"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 h-screen flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                <Image
                  src="/image/charity.svg"
                  alt="Urukundo Foundation Logo"
                  width={24}
                  height={24}
                />
              </span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">
                Urukundo Foundation
              </h1>
              <p className="text-xs text-gray-500">
                Compassion Heals, Change Lives
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">
                    {(() => {
                      const Icon = item.icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-3 border-t border-gray-200">
          <ul className="space-y-1">
            {bottomItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg">
                    {(() => {
                      const Icon = item.icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">🌍</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">
                  Urukundo Foundation
                </h1>
                <p className="text-xs text-gray-500">
                  Compassion Heals, Change Lives
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">
                    {(() => {
                      const Icon = item.icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-3 border-t border-gray-200">
          <ul className="space-y-1">
            {bottomItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg">
                    {(() => {
                      const Icon = item.icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
