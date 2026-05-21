'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import RoomCard from '@/components/rooms/RoomCard';
import type { Room, ApiResponse } from '@/types';
import { MOCK_FEATURED_ROOMS } from '@/constants';
import {
  staggerContainer,
  fadeInUp,
  viewportOnce,
} from '@/lib/animations';

function RoomCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md">
      <div className="h-52 skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 skeleton-shimmer w-3/4" />
        <div className="h-4 skeleton-shimmer w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 skeleton-shimmer w-14 rounded-full" />
          <div className="h-6 skeleton-shimmer w-14 rounded-full" />
        </div>
        <div className="h-10 skeleton-shimmer w-full mt-4" />
      </div>
    </div>
  );
}

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get<ApiResponse<Room[]>>(
          '/api/rooms?isFeatured=true&limit=6'
        );
        if (data.success && data.data && data.data.length > 0) {
          setRooms(data.data);
        } else {
          setRooms(MOCK_FEATURED_ROOMS as unknown as Room[]);
        }
      } catch {
        setRooms(MOCK_FEATURED_ROOMS as unknown as Room[]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <section className="bg-brand-cream py-20">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <h2 className="font-display text-4xl text-brand-dark">
            Featured Rooms
          </h2>
          <Link
            href="/search"
            className="text-brand-green font-semibold hover:text-brand-gold transition-default"
          >
            View All →
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))
            : rooms.map((room, index) => (
                <RoomCard key={room._id} room={room} index={index} />
              ))}
        </motion.div>
      </div>
    </section>
  );
}
