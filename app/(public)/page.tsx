import HeroSection from '@/components/home/HeroSection';
import CityGrid from '@/components/home/CityGrid';
import FeaturedRooms from '@/components/home/FeaturedRooms';
import HowItWorks from '@/components/home/HowItWorks';
import StatsSection from '@/components/home/StatsSection';
import WhyMeraRoom from '@/components/home/WhyMeraRoom';
import CTABanner from '@/components/home/CTABanner';
import AdBanner from '@/components/ui/AdBanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4">
        <AdBanner 
          slot={1} 
          className="my-6"
        />
      </div>
      <CityGrid />
      <FeaturedRooms />
      <HowItWorks />
      <StatsSection />
      <WhyMeraRoom />
      <CTABanner />
    </>
  );
}
