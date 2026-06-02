'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ABOUT_STATS, ABOUT_VALUES } from '@/constants';
import { LucideByName } from '@/components/ui/LucideByName';
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations';

const diagonalPattern = {
  backgroundImage: `repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(212, 175, 55, 0.03) 10px,
    rgba(212, 175, 55, 0.03) 20px
  )`,
};

const fallbackCoreTeam = [
  {
    _id: '1',
    name: 'Arnav',
    role: 'Co-Founder & Developer',
    category: 'core',
    image: null,
  },
  {
    _id: '2', 
    name: 'Varun',
    role: 'Co-Founder & Operations',
    category: 'core',
    image: null,
  },
  {
    _id: '3',
    name: 'Shubham',
    role: 'Marketing & Growth',
    category: 'core',
    image: null,
  }
];

const fallbackInvestor = {
  _id: '4',
  name: 'Rakesh Kumar',
  role: 'Angel Investor',
  category: 'investor',
  image: null,
};

export default function AboutPage() {
  const [team, setTeam] = useState<any[]>(() => [...fallbackCoreTeam, fallbackInvestor]);

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setTeam(data.data);
        }
      })
      .catch(() => {
        // silently fail, show hardcoded
      });
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative bg-[#0F2E1E] py-20 px-6 text-center"
        style={diagonalPattern}
      >
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full px-4 py-1.5 text-sm mb-6"
          >
            Based in Dharamshala, HP
          </motion.span>
          <motion.h1 variants={fadeInUp} className="font-display text-4xl sm:text-5xl text-white leading-tight">
            We&apos;re Making Room
            <br />
            <span className="text-[#D4AF37]">Finding Simple</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-white/60 max-w-xl mx-auto text-center text-lg mt-6"
          >
            MeraRoom was built for the people of Dharamshala — students, workers, and
            travelers who needed a faster, simpler way to find a place to stay.
          </motion.p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="bg-white dark:bg-[#0A0F0A] py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <p className="text-[#16A34A] uppercase tracking-widest text-sm font-semibold mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#0F2E1E] dark:text-white mb-6">
                Born in Dharamshala
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Finding a room in Dharamshala was always a hassle — WhatsApp groups,
                  word of mouth, random brokers. We wanted to change that.
                </p>
                <p>
                  MeraRoom is a simple, fast platform where anyone can find verified
                  rooms, PGs and stays across Dharamshala and nearby areas — and connect
                  directly with owners on WhatsApp.
                </p>
                <p>
                  No middlemen. No complicated forms. Just find your room, tap WhatsApp,
                  and move in.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-[#0F2E1E] rounded-3xl p-8"
            >
              <div className="grid grid-cols-2 gap-8">
                {ABOUT_STATS.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <p className="font-display text-4xl text-[#D4AF37]">{stat.value}</p>
                    <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#F9F6EF] dark:bg-[#0D150D] py-20 px-6">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="container mx-auto max-w-4xl"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl text-center text-[#0F2E1E] dark:text-white mb-12"
          >
            The Team Behind MeraRoom
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.filter((member) => member.category === 'core' || !member.category).map((member) => {
              const initial = member.name.charAt(0).toUpperCase();
              return (
                <motion.div
                  key={member._id || member.name}
                  variants={fadeInUp}
                  className="bg-white dark:bg-[#111A11] rounded-2xl p-8 text-center border border-gray-100 dark:border-[#1F2E1F] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Avatar */}
                  <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 rounded-full bg-[#0F2E1E] flex items-center justify-center text-[#D4AF37] text-4xl md:text-5xl font-bold font-serif relative overflow-hidden shrink-0">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="rounded-full object-cover w-28 h-28 md:w-32 md:h-32"
                        unoptimized
                      />
                    ) : (
                      initial
                    )}
                  </div>
                  
                  {/* Name */}
                  <h3 className="font-semibold text-lg text-[#0F2E1E] dark:text-white mb-1">
                    {member.name}
                  </h3>
                  
                  {/* Role */}
                  <p className="text-[#16A34A] text-sm font-medium">
                    {member.role}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Investors Category Section */}
          {team.some((member) => member.category === 'investor') && (
            <div className="mt-20">
              <motion.h2
                variants={fadeInUp}
                className="font-display text-3xl sm:text-4xl text-center text-[#0F2E1E] dark:text-white mb-4"
              >
                Supported By
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-500 dark:text-gray-400 text-center text-sm mb-12 max-w-md mx-auto"
              >
                Proudly backed by forward-thinking individuals who believe in our mission.
              </motion.p>

              <div className="flex flex-wrap justify-center gap-6 max-w-xl mx-auto">
                {team.filter((member) => member.category === 'investor').map((member) => {
                  const initial = member.name.charAt(0).toUpperCase();
                  return (
                    <motion.div
                      key={member._id || member.name}
                      variants={fadeInUp}
                      className="bg-white dark:bg-[#111A11] rounded-3xl p-8 text-center border-2 border-[#D4AF37] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group min-w-[260px] flex-1 sm:flex-initial"
                    >
                      {/* Premium Accent line */}
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F5E6C4]" />
                      
                      {/* Avatar with Gold border */}
                      <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-[#0F2E1E] border-4 border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-4xl font-bold font-serif relative overflow-hidden shrink-0">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={96}
                            height={96}
                            className="rounded-full object-cover w-24 h-24"
                            unoptimized
                          />
                        ) : (
                          initial
                        )}
                      </div>
                      
                      {/* Name */}
                      <h3 className="font-semibold text-xl text-[#0F2E1E] dark:text-white mb-1">
                        {member.name}
                      </h3>
                      
                      {/* Role/Badge */}
                      <span className="inline-block bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-1.5">
                        {member.role}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-white dark:bg-[#0A0F0A] py-20 px-6">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="container mx-auto max-w-6xl"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl sm:text-4xl text-center text-[#0F2E1E] dark:text-white mb-12"
          >
            What We Stand For
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ABOUT_VALUES.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                whileHover={{ borderColor: '#16A34A' }}
                className="bg-[#F9F6EF] dark:bg-[#111A11] rounded-2xl p-6 border-b-4 border-[#D4AF37] hover:shadow-lg transition-all duration-300"
              >
                <LucideByName name={value.icon} size={28} className="text-[#16A34A]" />
                <h3 className="font-semibold text-[#0F2E1E] dark:text-white mt-3 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F2E1E] py-16 px-6 text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
            Ready to Find Your Room?
          </h2>
          <p className="text-white/60 mb-8">
            Search verified rooms in Dharamshala right now.
          </p>
          <motion.div whileTap={{ scale: 0.96 }}>
            <Link
              href="/search"
              className="inline-block bg-[#D4AF37] text-[#0F2E1E] font-semibold rounded-xl px-8 py-3.5 hover:brightness-110 transition-default"
            >
              Search Rooms →
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
