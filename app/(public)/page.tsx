import HeroSection from '@/components/home/HeroSection';
import CityGrid from '@/components/home/CityGrid';
import FeaturedRooms from '@/components/home/FeaturedRooms';
import HowItWorks from '@/components/home/HowItWorks';
import StatsSection from '@/components/home/StatsSection';
import WhyMeraRoom from '@/components/home/WhyMeraRoom';
import CTABanner from '@/components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CityGrid />
      <FeaturedRooms />
      <HowItWorks />
      <StatsSection />
      <WhyMeraRoom />
      <CTABanner />
    </>
  );
}
