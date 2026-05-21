'use client';

import { motion } from 'framer-motion';
import { CITY, CONTACTS } from '@/constants';
import { fadeInUp, viewportOnce } from '@/lib/animations';

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-surface-dark min-h-[60vh]">
      <section className="bg-brand-dark dark:bg-brand-dark-deep py-16 md:py-20">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 text-center"
        >
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
            About MeraRoom
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Your trusted room finder in {CITY.name}, {CITY.state}
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-brand-black dark:text-[#F9FAFB]"
        >
          <p className="text-brand-gray dark:text-gray-400 leading-relaxed">
            MeraRoom is built exclusively for {CITY.name} — helping students,
            travellers, yoga practitioners, and locals find verified PGs, single
            rooms, and shared accommodations across 17 neighbourhoods including
            McLeod Ganj, Bhagsu, Dharamkot, and Kotwali Bazaar.
          </p>
          <p className="text-brand-gray dark:text-gray-400 leading-relaxed">
            We manually verify every listing before it goes live. No brokers, no
            hidden fees — search for free and contact owners directly on WhatsApp.
            Typical rents range from ₹3,000 to ₹12,000 per month, reflecting real
            Himachal Pradesh market rates.
          </p>
          <p className="text-brand-gray dark:text-gray-400 leading-relaxed">
            Whether you need a mountain-view PG near Main Square or a quiet room on
            Jogiwara Road, MeraRoom makes finding your space in the Dhauladhar
            foothills simple and trustworthy.
          </p>

          <div className="card-surface rounded-2xl p-6 border-l-4 border-brand-gold mt-8">
            <h2 className="font-display text-2xl text-brand-dark dark:text-[#F9FAFB] mb-4">
              Get in Touch
            </h2>
            <ul className="space-y-2 text-brand-gray dark:text-gray-400">
              {CONTACTS.map((c) => (
                <li key={c.name}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green hover:text-brand-gold font-medium transition-default"
                  >
                    {c.name}: {c.phone} (WhatsApp)
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
