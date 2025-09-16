import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../components/ui/toast';

export const metadata: Metadata = {
  title: 'Urukundo Foundation - Share Love, Save Lives',
  description:
    'At Urukundo Foundation, we believe that technology and compassion together can bridge the gap between those who want to give and those in need.',
  keywords: ['charity', 'donation', 'helping others'],
  authors: [
    {
      name: 'Echo Sols',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
