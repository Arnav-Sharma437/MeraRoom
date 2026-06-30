'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CITY, AREA_IMAGES, DEFAULT_AREA_IMAGE } from '@/constants';
import { staggerContainer, scaleIn, fadeInUp, viewportOnce } from '@/lib/animations';

interface AreaLocation {
  name: string;
  slug: string;
  image?: string;
  isActive?: boolean;
}

export default function CityGrid({ locations = [] }: { locations?: AreaLocation[] }) {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadCounts() {
      try {
        const res = await fetch('/api/rooms/count-by-area');
        const json = await res.json();
        if (json.success && json.data) {
          setCounts(json.data);
        }
      } catch (err) {
        console.error('Failed to load area room counts', err);
      }
    }
    loadCounts();
  }, []);

  const activeLocations = locations.filter((loc) => loc.isActive !== false);

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
            Browse rooms across {activeLocations.length} localities — from McLeod Ganj to Dharamkot
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {activeLocations.map((area) => {
            const imageUrl = area.image || AREA_IMAGES[area.slug] || DEFAULT_AREA_IMAGE;
            const count = counts[area.name.toLowerCase().trim()] ?? 0;

            return (
              <motion.button
                key={area.slug}
                type="button"
                variants={scaleIn}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/search?area=${area.slug}`)}
                className="relative w-full h-36 md:h-44 lg:h-48 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <Image
                  src={imageUrl}
                  alt={`${area.name}, Dharamshala`}
                  fill
                  className="object-cover transition-transform duration-400 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-[#0F2E1E]/80 transition-colors duration-300" />
                <span className="absolute top-2 right-2 bg-[#D4AF37] text-[#0F2E1E] text-[10px] md:text-xs font-bold rounded-full px-2.5 py-0.5">
                  {count} rooms
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <p className="font-semibold text-white text-base group-hover:text-[#D4AF37] transition-colors">
                    {area.name}
                  </p>
                  <p className="text-white/60 text-xs">{CITY.name}</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
