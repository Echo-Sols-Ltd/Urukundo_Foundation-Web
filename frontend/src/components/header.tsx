'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Track hash changes for active state and check authentication
  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash);
    const checkAuth = () => setIsUserAuthenticated(isAuthenticated());
    
    updateHash(); // Set initial hash
    checkAuth(); // Check initial auth state
    
    window.addEventListener('hashchange', updateHash);
    window.addEventListener('storage', checkAuth); // Listen for auth changes
    
    return () => {
      window.removeEventListener('hashchange', updateHash);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }

    // Update hash first to ensure active state changes immediately
    window.history.replaceState(null, '', `#${sectionId}`);
    setCurrentHash(`#${sectionId}`);
    
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

  // Handle window resize and body scroll lock
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileOpen(false);
      }
    };

    // Lock body scroll when mobile menu is open
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  return (
    <header className="bg-black text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo section with improved responsiveness */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity duration-300">
          <Image
            src="/image/charity.svg"
            alt="Urukundo Foundation Logo"
            width={38}
            height={38}
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 filter invert brightness-0 saturate-100"
          />
          <span className="font-sans font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl whitespace-nowrap">
            URUKUNDO FOUNDATION
          </span>
        </Link>
        {/* Desktop Navigation - Hidden on mobile and small tablets */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
          {/* <Link */}
            {/* href="/" */}
            {/* className={`transition-colors duration-300 text-sm xl:text-base 2xl:text-lg py-1  font-medium rounded ${ */}
              {/* pathname === '/' && !currentHash */}
                {/* ? 'text-orange-500 border-b-orange-500'  */}
                {/* : 'text-white hover:text-orange-500 ' */}
            {/* }`} */}
          {/* > */}
            {/* Home */}
          {/* </Link> */}
          <button onClick={() => scrollToSection('hero')}
            className={`transition-colors duration-300 text-sm xl:text-base 2xl:text-lg py-1 font-medium  rounded ${
              pathname === '/' && !currentHash
                ? 'text-orange-500 '
                : 'text-white hover:text-orange-500'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`transition-colors duration-300 text-sm xl:text-base 2xl:text-lg py-1 font-medium  rounded ${
              pathname === '/' && currentHash === '#about'
                ? 'text-orange-500' 
                : 'text-white hover:text-orange-500'
            }`}
          >
            About us
          </button>
          <button
            onClick={() => scrollToSection('events')}
            className={`transition-colors duration-300 text-sm xl:text-base 2xl:text-lg py-1 font-medium  rounded ${
              pathname === '/events' || (pathname === '/' && currentHash === '#events')
                ? 'text-orange-500' 
                : 'text-white hover:text-orange-500'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => scrollToSection('videos')}
            className={`transition-colors duration-300 text-sm xl:text-base 2xl:text-lg py-1 font-medium whitespace-nowrap rounded ${
              pathname === '/' && currentHash === '#videos'
                ? 'text-orange-500' 
                : 'text-white hover:text-orange-500'
            }`}
          >
            Live videos
          </button>
          <Link
            href="/contacts"
            className={`transition-colors duration-300 text-sm xl:text-base 2xl:text-lg py-1 font-medium  rounded ${
              pathname === '/contacts' 
                ? 'text-orange-500' 
                : 'text-white hover:text-orange-500'
            }`}
          >
            Contacts
          </Link>
        </nav>

        {/* Right section with search, donate button and mobile menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button - Desktop only, only for authenticated users */}
          {isUserAuthenticated && (
            <Button
              onClick={() => router.push('/search')}
              variant="ghost"
              size="sm"
              className="hidden lg:flex items-center gap-2 text-white hover:text-orange-500 hover:bg-gray-800 transition-colors duration-300"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline">Search</span>
            </Button>
          )}
          
          {/* Desktop Donate Button - Hidden on mobile/tablet */}
          <Button
            onClick={handleDonateClick}
            className="bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white font-medium px-4 lg:px-6 xl:px-8 py-2 text-sm lg:text-base hidden lg:block rounded-md"
          >
            DONATE
          </Button>
          
          {/* Mobile Menu Button - Hidden on desktop */}
          <button
            className="lg:hidden p-2 hover:bg-gray-800 transition-colors duration-300 rounded-md"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="lg:hidden fixed inset-0 bg-opacity-50 z-40"
            onClick={closeMobile}
          />
          
          {/* Mobile menu */}
          <nav className="lg:hidden bg-black text-white border-t border-gray-700 shadow-xl z-50 relative">
            <div className="px-4 sm:px-6 py-4">
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="/"
                    onClick={closeMobile}
                    className={`block transition-colors duration-300 py-2 px-2 rounded-md font-medium ${
                      pathname === '/' && !currentHash
                        ? 'text-orange-500 bg-gray-800' 
                        : 'text-white hover:text-orange-500 hover:bg-gray-800'
                    }`}
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
                    className={`block w-full text-left transition-colors duration-300 py-2 px-2 rounded-md font-medium ${
                      pathname === '/' && currentHash === '#about'
                        ? 'text-orange-500 bg-gray-800' 
                        : 'text-white hover:text-orange-500 hover:bg-gray-800'
                    }`}
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
                    className={`block w-full text-left transition-colors duration-300 py-2 px-2 rounded-md font-medium ${
                      pathname === '/events' || (pathname === '/' && currentHash === '#events')
                        ? 'text-orange-500 bg-gray-800' 
                        : 'text-white hover:text-orange-500 hover:bg-gray-800'
                    }`}
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
                    className={`block w-full text-left transition-colors duration-300 py-2 px-2 rounded-md font-medium ${
                      pathname === '/' && currentHash === '#videos'
                        ? 'text-orange-500 bg-gray-800' 
                        : 'text-white hover:text-orange-500 hover:bg-gray-800'
                    }`}
                  >
                    Live videos
                  </button>
                </li>
                <li>
                  <Link
                    href="/contacts"
                    onClick={closeMobile}
                    className={`block transition-colors duration-300 py-2 px-2 rounded-md font-medium ${
                      pathname === '/contacts' 
                        ? 'text-orange-500 bg-gray-800' 
                        : 'text-white hover:text-orange-500 hover:bg-gray-800'
                    }`}
                  >
                    Contacts
                  </Link>
                </li>
                {/* Search - Only for authenticated users */}
                {isUserAuthenticated && (
                  <li>
                    <Link
                      href="/search"
                      onClick={closeMobile}
                      className={`flex items-center gap-2 transition-colors duration-300 py-2 px-2 rounded-md font-medium ${
                        pathname === '/search' 
                          ? 'text-orange-500 bg-gray-800' 
                          : 'text-white hover:text-orange-500 hover:bg-gray-800'
                      }`}
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </Link>
                  </li>
                )}
                <li className="pt-2 mt-2 border-t border-gray-700">
                  <Button
                    onClick={() => {
                      handleDonateClick();
                      closeMobile();
                    }}
                    className="bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white font-medium w-full py-3 rounded-md text-base"
                  >
                    DONATE NOW
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;
