'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CONTACT_FAQ } from '@/constants';
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations';

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#F9F6EF] dark:bg-[#0D150D] py-16 px-6">
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="container mx-auto max-w-2xl"
      >
        <motion.h2
          variants={fadeInUp}
          className="font-display text-3xl text-center text-[#0F2E1E] dark:text-white mb-10"
        >
          Frequently Asked Questions
        </motion.h2>

        <div>
          {CONTACT_FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={item.question}
                variants={fadeInUp}
                className="bg-white dark:bg-[#111A11] rounded-2xl px-6 py-4 border border-gray-100 dark:border-[#1F2E1F] mb-3 cursor-pointer"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex justify-between items-center gap-4">
                  <p className="font-semibold text-[#0F2E1E] dark:text-white text-sm sm:text-base">
                    {item.question}
                  </p>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-gray-500"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-500 dark:text-gray-400 text-sm pt-3">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
