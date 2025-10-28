import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Footer() {
  return (
    <footer className="bg-black text-white section-padding-lg">
      {/* Enhanced padding */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Increased from gap-8 */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {/* Increased gaps and margin */}
              <Image
                src="/image/charity.svg"
                alt="Urukundo Foundation Logo"
                width={36}
                height={36}
                className="w-9 h-9 filter invert brightness-0 saturate-100"
              />
              <span className="font-sans font-semibold text-white">
                URUKUNDO
              </span>
            </div>
            <p className="font-serif text-sm leading-relaxed text-gray-300 max-w-xs mb-8">
              {/* Increased margin */}
              &quot;At Urukundo Foundation, we believe that technology and
              compassion together can bridge the gap between those who want to
              give and those in need — one donation, one life, one story at a
              time.&quot;
            </p>
            <div className="flex gap-4 mt-6">
              {/* Increased gap from gap-3 */}
              <a
                href="https://web.facebook.com/profile.php?id=61581406167239&sk=reviews&_rdc=1&_rdr#" // Replace with your Facebook URL
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500"
              >
                {/* Increased size */}
                <Facebook className="w-5 h-5 text-black" />
                {/* Increased icon size */}
              </a>
              <a
                href="https://x.com/shema_Leandre" // Replace with your Twitter URL
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500"
              >
                {/* Increased size */}
                <Twitter className="w-5 h-5 text-black" />
                {/* Increased icon size */}
              </a>
              <a
                href="https://www.instagram.com/echo_sols/" // Replace with your Instagram URL
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500"
              >
                {/* Increased size */}
                <Instagram className="w-5 h-5 text-black" />
                {/* Increased icon size */}
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-sans font-semibold mb-6 text-white">Links</h3>
            {/* Increased margin */}
            <ul className="space-y-3 font-serif text-sm">
              {/* Increased spacing */}
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/#events"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="#videos"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Videos
                </Link>
              </li>
              
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-semibold mb-6 text-white">
              {/* Increased margin */}
              Contacts
            </h3>
            <div className="space-y-3 font-serif text-sm">
              {/* Increased spacing */}
              <p className="text-gray-300">
                <span className="text-white font-medium">Phone:</span> +250 793
                373 953
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Portfolio:</span>{' '}
                https://www.echo-solution.com/
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-right">
          {/* Increased margins */}
          <p className="font-serif text-xs text-gray-400">
            © Copyright urukundo foundation 2025 Design by lex-tech
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
