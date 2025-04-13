import type { Metadata } from 'next';
import { Bebas_Neue, Barlow, Permanent_Marker } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { fetchTournamentStartDate } from '@/lib/contentful';
import { TournamentDateProvider } from '@/context/TournamentDateContext';
import LayoutWrapper from '@/components/layout-wrapper'; 
import { TransitionProvider } from '@/context/TransitionContext';

const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marker',
});

const barlow = Barlow({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'Coal Country Open',
  description: 'Annual golf tournament in Gillette, Wyoming.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tournamentDate = await fetchTournamentStartDate(); 

  return (
    <html lang="en">
      <head> 
        <link rel="preconnect" href="https://images.ctfassets.net" crossOrigin="anonymous" />
      </head>
      <body
        className={`${bebasNeue.variable} ${barlow.variable} ${permanentMarker.variable} antialiased `}
      >
        <TransitionProvider>
          <TournamentDateProvider date={tournamentDate}>
            <LayoutWrapper>
              <Navbar />
              {children}
              <Footer />
            </LayoutWrapper>
          </TournamentDateProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}
