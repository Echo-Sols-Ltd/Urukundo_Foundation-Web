'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDonateClick = () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    if (!token) {
      router.push('/login?next=/donation/donate');
    } else {
      router.push('/donation/donate');
    }
  };

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <header className="bg-black text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-16 py-4 flex items-center justify-between md:px-2">
        {/* Enhanced padding */}
        <div className="flex items-center gap-3">
          {/* Increased from gap-2 */}
          <Image
            src="/image/charity.svg"
            alt="Urukundo Foundation Logo"
            width={38}
            height={38}
            className="w-8 h-8 filter invert brightness-0 saturate-100"
          />
          <span className="font-sans font-semibold md:text-lg-md sm:text-sm lg:text-2xl">
            URUKUNDO FOUNDATION
          </span>
        </div>
        <nav className="hidden md:flex sm:text-sm items-center gap-4 lg:gap-8">
          {/* Increased from gap-6 */}
          <Link
            href="/"
            className="hover:text-orange-500 transition-colors text-sm md:text-base lg:text-xl py-1 "
          >
            Home
          </Link>
          <button
            onClick={() => scrollToSection('about')}
            className="hover:text-orange-500 transition-colors text-sm md:text-base lg:text-xl py-1"
          >
            About us
          </button>
          <button
            onClick={() => scrollToSection('events')}
            className="hover:text-orange-500 transition-colors text-sm md:text-base lg:text-xl py-1"
          >
            Events
          </button>
          <button
            onClick={() => scrollToSection('videos')}
            className="hover:text-orange-500 transition-colors text-sm md:text-base lg:text-xl py-1"
          >
            Live videos
          </button>
          <Link
            href="/contacts"
            className="hover:text-orange-500 transition-colors text-sm md:text-base lg:text-xl py-1"
          >
            Contacts
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleDonateClick}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium lg:px-8 py-2 hidden md:block"
          >
            DONATE
          </Button>
          <button
            className="md:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {isMobileOpen && (
        <nav className="md:hidden bg-black text-white px-6 py-4 sm:px-16 lg:px-32 md:px-16 ">
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                href="/"
                onClick={closeMobile}
                className="hover:text-orange-500 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  scrollToSection('about');
                  closeMobile();
                }}
                className="hover:text-orange-500 transition-colors"
              >
                About us
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  scrollToSection('events');
                  closeMobile();
                }}
                className="hover:text-orange-500 transition-colors"
              >
                Events
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  scrollToSection('videos');
                  closeMobile();
                }}
                className="hover:text-orange-500 transition-colors"
              >
                Live videos
              </button>
            </li>
            <li>
              <Link
                href="/contacts"
                onClick={closeMobile}
                className="hover:text-orange-500 transition-colors"
              >
                Contacts
              </Link>
            </li>
            <li>
              <Button
                onClick={() => {
                  handleDonateClick();
                  closeMobile();
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium w-full mt-2"
              >
                DONATE
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
