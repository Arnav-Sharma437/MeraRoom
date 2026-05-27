'use client';

import { motion } from 'framer-motion';
import { Search, Home, MessageCircle, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/constants';
import { fadeInUp, viewportOnceTight } from '@/lib/animations';

const iconMap = { Search, Home, MessageCircle } as const;

export default function HowItWorks() {
  return (
    <section className="bg-white dark:bg-surface-dark py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnceTight}
          className="font-display text-3xl md:text-4xl text-brand-dark dark:text-[#F9FAFB] text-center mb-12 md:mb-16"
        >
          How MeraRoom Works
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 relative">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap];
            const animation =
              step.direction === 'left'
                ? { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } }
                : step.direction === 'right'
                  ? { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }
                  : { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

            return (
              <div key={step.step} className="relative flex flex-col items-center">
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <ArrowRight
                    className="hidden lg:block absolute -right-6 top-12 text-brand-gold/40 z-10"
                    size={28}
                  />
                )}
                <motion.div
                  variants={animation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnceTight}
                  transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                  className="relative card-surface rounded-2xl p-6 md:p-8 text-center max-w-sm w-full shadow-md dark:shadow-card-dark"
                >
                  <span className="absolute top-4 right-6 font-display text-6xl md:text-7xl text-brand-gold/20 select-none">
                    {step.step}
                  </span>
                  <div className="relative z-10 w-14 h-14 bg-brand-dark dark:bg-brand-dark-deep rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-brand-gold" size={28} />
                  </div>
                  <h3 className="font-semibold text-brand-dark dark:text-[#F9FAFB] text-lg mb-3">
                    {step.title}
                  </h3>
                  <p className="text-brand-gray dark:text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
