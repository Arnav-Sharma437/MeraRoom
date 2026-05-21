'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { FOOTER_CITIES, NAV_LINKS } from '@/constants';
import { staggerContainer, fadeInUp, viewportOnce } from '@/lib/animations';

const footerLinks = [
  ...NAV_LINKS.filter((l) => l.label !== 'List Your Room'),
  { label: 'List Your Room', href: '/dashboard/owner' },
  { label: 'About Us', href: '/about' },
].filter(
  (link, index, self) =>
    self.findIndex((l) => l.href === link.href) === index
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          <motion.div variants={fadeInUp}>
            <Link href="/">
              <Image
                src="/meraroom-logo-dark.svg"
                alt="MeraRoom"
                width={160}
                height={46}
                className="h-10 w-auto mb-4"
              />
            </Link>
            <p className="font-display text-brand-gold text-lg mb-2">
              Find Your Space
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              India&apos;s trusted platform to find verified PGs, rooms, and
              hostels. Connect directly with owners on WhatsApp.
            </p>
            <div className="flex gap-3">
              {['f', 'in', '𝕏'].map((icon) => (
                <span
                  key={icon}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/60 hover:bg-brand-gold/20 hover:text-brand-gold transition-default cursor-pointer"
                >
                  {icon}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
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
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold text-white mb-4">Cities</h4>
            <ul className="space-y-2">
              {FOOTER_CITIES.map((city) => (
                <li key={city.href}>
                  <Link
                    href={city.href}
                    className="text-white/60 text-sm hover:text-brand-gold transition-default"
                  >
                    {city.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-gold flex-shrink-0" />
                <a
                  href="mailto:support@meraroom.in"
                  className="hover:text-brand-gold transition-default"
                >
                  support@meraroom.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle
                  size={16}
                  className="text-brand-gold flex-shrink-0"
                />
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-default"
                >
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-gold flex-shrink-0" />
                <span>India</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/50">
          <p>© {year} MeraRoom. All rights reserved.</p>
          <p>Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
