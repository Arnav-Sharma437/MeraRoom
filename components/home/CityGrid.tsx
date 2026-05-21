'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HOME_CITIES } from '@/constants';
import {
  staggerContainer,
  scaleIn,
  fadeInUp,
  viewportOnce,
} from '@/lib/animations';

export default function CityGrid() {
  const router = useRouter();

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl text-brand-dark mb-3">
            Explore Rooms by City
          </h2>
          <p className="text-brand-gray text-lg max-w-lg mx-auto">
            Find rooms in your city — search by location, budget &amp; more
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {HOME_CITIES.map((city, index) => (
            <motion.button
              key={city.slug}
              type="button"
              variants={scaleIn}
              onClick={() => router.push(`/search?city=${city.slug}`)}
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-default hover:scale-[1.04] hover:ring-2 hover:ring-brand-gold group ${
                index % 2 === 0
                  ? 'bg-gradient-to-br from-brand-dark to-brand-green'
                  : 'bg-gradient-to-br from-brand-green to-teal-600'
              }`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-default" />
              <span className="absolute top-3 right-3 bg-brand-gold text-brand-dark text-xs font-semibold rounded-full px-2.5 py-1">
                {city.roomCount}+ rooms
              </span>
              <span className="absolute bottom-4 left-4 font-bold text-white text-lg">
                {city.name}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
