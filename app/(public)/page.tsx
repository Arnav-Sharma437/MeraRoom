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
import { DHARAMSHALA_AREAS } from '@/constants';

export default async function HomePage() {
  await connectDB();
  const customLocationsSetting = await Settings.findOne({ key: 'custom_locations' }).lean();
  let locations = [];

  if (customLocationsSetting && customLocationsSetting.value) {
    locations = customLocationsSetting.value;
  } else {
    locations = DHARAMSHALA_AREAS.map((a) => ({ ...a, isActive: true }));
  }

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4">
        <AdBanner 
          slot={1} 
          className="my-6"
        />
      </div>
      <CityGrid locations={locations} />
      <FeaturedRooms />
      <HowItWorks />
      <StatsSection />
      <WhyMeraRoom />
      <CTABanner />
    </>
  );
}
