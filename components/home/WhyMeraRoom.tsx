'use client';

import { motion } from 'framer-motion';
import { WHY_MERAROOM } from '@/constants';
import { LucideByName } from '@/components/ui/LucideByName';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';

export default function WhyMeraRoom() {
  return (
    <section className="section-cream py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="font-display text-3xl md:text-4xl text-brand-dark dark:text-[#F9FAFB] text-center mb-12"
        >
          Why MeraRoom?
        </motion.h2>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          {WHY_MERAROOM.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileTap={{ scale: 0.98 }}
              className="card-surface rounded-2xl p-6 border-l-4 border-brand-gold transition-default hover:shadow-lg dark:hover:shadow-card-dark hover:border-brand-green"
            >
              <div className="w-12 h-12 bg-brand-dark dark:bg-brand-dark-deep rounded-xl flex items-center justify-center text-brand-gold mb-4">
                <LucideByName name={feature.icon} size={24} />
              </div>
              <h3 className="font-semibold text-brand-dark dark:text-[#F9FAFB] text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-brand-gray dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
