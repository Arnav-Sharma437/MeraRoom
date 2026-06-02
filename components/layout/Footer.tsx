'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle, Phone, Clock } from 'lucide-react';
import { FOOTER_AREAS, NAV_LINKS, CONTACTS, CITY } from '@/constants';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';

const footerLinks = [
  ...NAV_LINKS.filter((l) => l.label !== 'List Your Room'),
  { label: 'List Your Room', href: '/dashboard/owner' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark dark:bg-brand-dark-deep text-white mt-auto">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left"
        >
          <motion.div variants={fadeInUp}>
            <div className="flex justify-center md:justify-start">
              <Link href="/">
                <Image
                  src="/meraroom-logo-dark.svg"
                  alt="MeraRoom"
                  width={160}
                  height={46}
                  className="h-10 w-auto mb-4"
                />
              </Link>
            </div>
            <p className="font-display text-brand-gold text-lg mb-2">Find Your Space</p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Verified rooms across {CITY.name}, {CITY.state}. McLeod Ganj, Bhagsu,
              Dharamkot &amp; 17 localities.
            </p>
            <hr className="border-white/10 mt-8 md:hidden" />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold mb-4 text-[#D4AF37] md:text-white">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-brand-gold transition-default"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <hr className="border-white/10 mt-8 md:hidden" />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold mb-4 text-[#D4AF37] md:text-white">Areas in Dharamshala</h4>
            <ul className="space-y-2">
              {FOOTER_AREAS.map((area) => (
                <li key={area.href}>
                  <Link
                    href={area.href}
                    className="text-white/60 text-sm hover:text-brand-gold transition-default"
                  >
                    {area.label}
                  </Link>
                </li>
              ))}
            </ul>
            <hr className="border-white/10 mt-8 md:hidden" />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold mb-4 text-[#D4AF37] md:text-white">Contact</h4>
            <div className="space-y-4 text-left flex flex-col items-start">
              {/* Arnav Phone */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                  <Phone size={14} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Arnav</p>
                  <a href="tel:+917876650437" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">
                    +91 7876650437
                  </a>
                </div>
              </div>

              {/* Varun Phone */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                  <Phone size={14} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Varun</p>
                  <a href="tel:+919418100803" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">
                    +91 9418100803
                  </a>
                </div>
              </div>

              {/* WhatsApp Arnav */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                  <MessageCircle size={14} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">WhatsApp</p>
                  <a href="https://wa.me/917876650437" target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm hover:text-[#D4AF37] transition-colors">
                    +91 7876650437
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                  <MapPin size={14} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Location</p>
                  <p className="text-white/70 text-sm">
                    {CITY.name}, {CITY.state}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                  <Clock size={14} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Hours</p>
                  <p className="text-white/70 text-sm">
                    Mon - Sat: 9AM to 7PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-sm text-white/50">
          <p>© {year} MeraRoom. All rights reserved.</p>
          <p>Made in Dharamshala, Himachal Pradesh</p>
        </div>
      </div>
    </footer>
  );
}
