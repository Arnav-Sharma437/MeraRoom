import HeroSection from '@/components/home/HeroSection';
import CityGrid from '@/components/home/CityGrid';
import FeaturedRooms from '@/components/home/FeaturedRooms';
import HowItWorks from '@/components/home/HowItWorks';
import StatsSection from '@/components/home/StatsSection';
import WhyMeraRoom from '@/components/home/WhyMeraRoom';
import CTABanner from '@/components/home/CTABanner';
import AdBanner from '@/components/ui/AdBanner';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export default async function HomePage() {
  await connectDB();
  const settingsDoc = await Settings.findOne({ key: 'custom_locations' }).lean();
  const customLocations = settingsDoc?.value || null;

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4">
        <AdBanner 
          slot={1} 
          className="my-6"
        />
      </div>
      <CityGrid customLocations={customLocations} />
      <FeaturedRooms />
      <HowItWorks />
      <StatsSection />
      <WhyMeraRoom />
      <CTABanner />
    </>
  );
}
