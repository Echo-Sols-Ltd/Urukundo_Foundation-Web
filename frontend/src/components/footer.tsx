import Image from 'next/image';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/image/charity.svg"
                alt="Urukundo Foundation Logo"
                width={32}
                height={32}
                className="w-8 h-8 filter invert brightness-0 saturate-100"
              />
              <span className="font-sans font-semibold text-white">
                URUKUNDO
              </span>
            </div>
            <p className="font-serif text-sm leading-relaxed text-gray-300 max-w-xs">
              &quot;At Urukundo Foundation, we believe that technology and
              compassion together can bridge the gap between those who want to
              give and those in need — one donation, one life, one story at a
              time.&quot;
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com/urukundofoundation" // Replace with your Facebook URL
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
              >
                <Facebook className="w-4 h-4 text-black" />
              </a>
              <a
                href="https://twitter.com/urukundofoundation" // Replace with your Twitter URL
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
              >
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/echo_sols/" // Replace with your Instagram URL
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
              >
                <Instagram className="w-4 h-4 text-black" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-sans font-semibold mb-4 text-white">Links</h3>
            <ul className="space-y-2 font-serif text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Videos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Donate
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-semibold mb-4 text-white">
              Contacts
            </h3>
            <div className="space-y-2 font-serif text-sm">
              <p className="text-gray-300">
                <span className="text-white font-medium">Phone:</span> +250 793 373 953
              </p>
              <p className="text-gray-300">
                <span className="text-white font-medium">Portfolio:</span>{' '}
                https://charity-portfolio.vercel.app/
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-right">
          <p className="font-serif text-xs text-gray-400">
            © Copyright urukundo foundation 2025 Design by lex-tech
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
