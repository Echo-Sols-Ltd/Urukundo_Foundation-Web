'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image'; // Import Image component for optimized SVG handling

export function Header() {
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

  return (
    <header className="bg-black text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-16 py-4  flex items-center justify-between">{/* Enhanced padding */}
        <div className="flex items-center gap-3">{/* Increased from gap-2 */}
          <Image
            src="/image/charity.svg" // Adjust the path to where your logo.svg is stored
            alt="Urukundo Foundation Logo"
            width={34}
            height={34}
            className="w-8 h-8 filter invert brightness-0 saturate-100"
          />
          <span className="font-sans font-semibold text-lg">
            URUKUNDO FOUNDATION
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">{/* Increased from gap-6 */}
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
          <button
            onClick={() => scrollToSection('transforming-section')}
            className="hover:text-orange-500 transition-colors"
          >
            About us
          </button>
          <Link
            href="/events"
            className="hover:text-orange-500 transition-colors"
          >
            Events
          </Link>
          <button
            onClick={() => scrollToSection('videos-section')}
            className="hover:text-orange-500 transition-colors"
          >
            Live videos
          </button>
          <Link
            href="/contacts"
            className="hover:text-orange-500 transition-colors"
          >
            Contacts
          </Link>
        </nav>
        <Button
          onClick={handleDonateClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3">{/* Enhanced padding */}
          DONATE
        </Button>
      </div>
    </header>
  );
}

export default Header;
