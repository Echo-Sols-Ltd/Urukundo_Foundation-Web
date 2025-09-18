import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { TransformingSection } from '@/components/transforming-section';
import { ImpactStats } from '@/components/impact-stats';
import { TestimonialSection } from '@/components/testmonial-section';
import { VideoNewsSection } from '@/components/video-news';
import { CausesSection } from '@/components/causes-section';
import { EventsSection } from '@/components/events-section';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen ">
      <Header />
      <HeroSection />
      <div id="transforming-section">
        <TransformingSection />
      </div>
      <div id="events">
        <EventsSection />
      </div>
      <ImpactStats />
      <TestimonialSection />
      <div id="videos-section">
        <VideoNewsSection />
      </div>
      <CausesSection />
      <Footer />
    </main>
  );
}
