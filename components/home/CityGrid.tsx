'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HOME_AREAS } from '@/constants';
import {
  staggerContainer,
  scaleIn,
  fadeInUp,
  viewportOnce,
} from '@/lib/animations';

export default function CityGrid() {
  const router = useRouter();

  return (
    <section className="bg-white dark:bg-surface-dark py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl text-brand-dark dark:text-[#F9FAFB] mb-3">
            Explore by Area in Dharamshala
          </h2>
          <p className="text-brand-gray dark:text-gray-400 text-base md:text-lg max-w-lg mx-auto">
            Browse rooms across {HOME_AREAS.length} localities — from McLeod Ganj
            to Dharamkot
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {HOME_AREAS.map((area, index) => (
            <motion.button
              key={area.slug}
              type="button"
              variants={scaleIn}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push(`/search?area=${area.slug}`)}
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-default hover:scale-[1.04] hover:ring-2 hover:ring-brand-gold group ${
                index % 2 === 0
                  ? 'bg-gradient-to-br from-brand-dark to-brand-green'
                  : 'bg-gradient-to-br from-brand-green to-teal-600'
              }`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-default" />
              <span className="absolute top-2 right-2 bg-brand-gold text-brand-dark text-[10px] md:text-xs font-semibold rounded-full px-2 py-0.5">
                {area.roomCount}+
              </span>
              <span className="absolute bottom-3 left-3 right-3 font-semibold text-white text-sm md:text-base text-left leading-tight">
                {area.name}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
