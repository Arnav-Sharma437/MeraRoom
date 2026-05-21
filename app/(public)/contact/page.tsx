'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { CITY, CONTACTS } from '@/constants';
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations';

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-surface-dark min-h-[60vh]">
      <section className="bg-brand-dark dark:bg-brand-dark-deep py-14 md:py-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 text-center"
        >
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3">
            Contact Us
          </h1>
          <p className="text-white/60 max-w-lg mx-auto">
            Reach the MeraRoom team in {CITY.name} on WhatsApp — we typically
            reply within a few hours.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 max-w-2xl">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {CONTACTS.map((contact) => (
            <motion.div
              key={contact.name}
              variants={fadeInUp}
              whileTap={{ scale: 0.98 }}
              className="card-surface rounded-2xl p-6 shadow-md dark:shadow-card-dark text-center"
            >
              <div className="w-16 h-16 bg-brand-dark dark:bg-brand-dark-deep rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-brand-gold" size={32} />
              </div>
              <h2 className="font-semibold text-xl text-brand-dark dark:text-[#F9FAFB] mb-1">
                {contact.name}
              </h2>
              <p className="text-brand-gray dark:text-gray-400 mb-6">{contact.phone}</p>
              <motion.a
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold rounded-xl py-3 min-h-[44px] transition-default hover:brightness-110"
              >
                Chat on WhatsApp →
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center text-brand-gray dark:text-gray-400 text-sm mt-10"
        >
          Based in {CITY.name}, {CITY.state} · Serving all 17 localities
        </motion.p>
      </section>
    </div>
  );
}
