import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://urukundo-chariy-foundation.up.railway.app';
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER ?? '@urukundo';
import { ToastProvider } from '../components/ui/toast';

export const metadata: Metadata = {
  title: 'Urukundo Foundation - Share Love, Save Lives',
  description:
    'At Urukundo Foundation, we believe that technology and compassion together can bridge the gap between those who want to give and those in need. Join us in making a lasting impact through donations and community support.',
  keywords: [
    'charity',
    'donation',
    'helping others',
    'nonprofit',
    'community',
    'urukundo',
    'foundation',
    'compassion',
    'save lives',
    'volunteering',
  ],
  authors: [
    {
      name: 'Echo Sols',
    },
  ],
  icons: {
    icon: '/image/charity.svg',
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Urukundo Foundation - Share Love, Save Lives',
    description:
      'Join Urukundo Foundation to support community initiatives and make a lasting impact through donations and volunteering. Technology and compassion working together.',
    url: SITE_URL,
    siteName: 'Urukundo Foundation',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/image/charity.svg`,
        width: 1200,
        height: 630,
        alt: 'Urukundo Foundation - Share Love, Save Lives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urukundo Foundation - Share Love, Save Lives',
    description:
      'Support community initiatives and make an impact with Urukundo Foundation. Technology and compassion working together.',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [`${SITE_URL}/image/charity.svg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Urukundo Foundation',
    url: SITE_URL,
    logo: `${SITE_URL}/image/charity.svg`,
    description:
      'Technology and compassion working together to bridge the gap between those who want to give and those in need.',
    foundingDate: '2024',
    sameAs: [
      'https://www.facebook.com/urukundo',
      'https://twitter.com/urukundo',
      'https://www.instagram.com/urukundo',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+250-000-000-000',
        contactType: 'Customer service',
        availableLanguage: ['English', 'Kinyarwanda'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Rwanda',
    },
    nonprofitStatus: 'Nonprofit501c3',
  };

  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="canonical" href={SITE_URL} />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>

        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </body>
    </html>
  );
}
