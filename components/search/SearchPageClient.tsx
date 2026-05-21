'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, MapPin, Loader2 } from 'lucide-react';
import RoomCard from '@/components/rooms/RoomCard';
import type { Room, ApiResponse } from '@/types';
import {
  DHARAMSHALA_AREAS,
  SEARCH_FILTER_CHIPS,
  MOCK_FEATURED_ROOMS,
  CITY,
} from '@/constants';
import { cn } from '@/lib/utils';

function RoomSkeleton() {
  return (
    <div className="flex gap-3 card-surface rounded-2xl p-3 md:hidden">
      <div className="w-32 h-32 skeleton-shimmer rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-5 skeleton-shimmer w-3/4" />
        <div className="h-4 skeleton-shimmer w-1/2" />
      </div>
    </div>
  );
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeChip, setActiveChip] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [area, setArea] = useState(searchParams.get('area') ?? '');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const fetchRooms = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set('limit', '20');
      if (area) params.set('area', area);
      if (query) params.set('q', query);
      if (activeChip !== 'all') params.set('roomType', activeChip);

      const { data } = await axios.get<ApiResponse<Room[]>>(
        `/api/rooms?${params.toString()}`
      );

      if (data.success && data.data && data.data.length > 0) {
        setRooms(data.data);
      } else {
        let mock = [...(MOCK_FEATURED_ROOMS as unknown as Room[])];
        if (area) {
          const match = DHARAMSHALA_AREAS.find((a) => a.slug === area);
          if (match) mock = mock.filter((r) => r.area === match.name);
        }
        if (activeChip !== 'all' && !['furnished', 'ac', 'wifi'].includes(activeChip)) {
          mock = mock.filter((r) => r.roomType === activeChip);
        }
        setRooms(mock);
      }
    } catch {
      setRooms(MOCK_FEATURED_ROOMS as unknown as Room[]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [area, query, activeChip]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    setArea(searchParams.get('area') ?? '');
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const [pullY, setPullY] = useState(0);
  const handleTouchStart = (y: number) => {
    if (window.scrollY === 0) setPullY(y);
  };
  const handleTouchMove = (y: number) => {
    if (pullY && y > pullY + 80 && window.scrollY === 0) {
      fetchRooms(true);
      setPullY(0);
    }
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-surface-dark"
      onTouchStart={(e) => handleTouchStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleTouchMove(e.touches[0].clientY)}
    >
      <div className="sticky top-14 md:top-0 z-40 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-[#1F2E1F] px-4 py-3 md:py-6">
        <div className="container mx-auto">
          <h1 className="font-display text-2xl md:text-4xl text-brand-dark dark:text-[#F9FAFB] mb-1 hidden md:block">
            Search Rooms in {CITY.name}
          </h1>
          <p className="text-brand-gray dark:text-gray-400 text-sm mb-4 hidden md:block">
            {DHARAMSHALA_AREAS.length} localities across Himachal Pradesh
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchRooms();
            }}
            className="flex gap-2 mb-3"
          >
            <div className="flex-1 flex items-center card-surface rounded-xl border px-3 min-h-[44px]">
              <MapPin size={18} className="text-brand-green flex-shrink-0" />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="flex-1 bg-transparent text-sm px-2 focus:outline-none text-brand-black dark:text-[#F9FAFB]"
              >
                <option value="">All Areas</option>
                {DHARAMSHALA_AREAS.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center card-surface rounded-xl border px-3 min-h-[44px]">
              <Search size={18} className="text-brand-gray flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by area, landmark..."
                className="flex-1 bg-transparent text-sm px-2 focus:outline-none text-brand-black dark:text-[#F9FAFB]"
              />
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilterOpen(true)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center card-surface rounded-xl border"
            >
              <SlidersHorizontal size={20} />
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => fetchRooms()}
              className="bg-brand-green text-white rounded-xl px-4 text-sm font-semibold min-h-[44px]"
            >
              Go
            </motion.button>
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            {SEARCH_FILTER_CHIPS.map((chip) => (
              <motion.button
                key={chip.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveChip(chip.id)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[36px] transition-default',
                  activeChip === chip.id
                    ? 'bg-brand-green text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-[#1A2A1A] dark:text-gray-400'
                )}
              >
                {chip.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {refreshing && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-brand-green" size={28} />
        </div>
      )}

      <div className="container mx-auto px-4 py-4 pb-8">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <RoomSkeleton key={i} />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <p className="text-center text-brand-gray dark:text-gray-400 py-12">
            No rooms found in this area. Try another locality.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room, i) => (
              <RoomCard key={room._id} room={room} index={i} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden card-surface rounded-t-2xl p-6 pb-safe max-h-[70vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />
              <h3 className="font-semibold text-lg mb-4 text-brand-dark dark:text-[#F9FAFB]">
                Filters
              </h3>
              <p className="text-sm text-brand-gray dark:text-gray-400 mb-2">Area</p>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full card-surface border rounded-xl p-3 mb-4 text-brand-black dark:text-[#F9FAFB]"
              >
                <option value="">All Areas</option>
                {DHARAMSHALA_AREAS.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-brand-gray dark:text-gray-400 mb-2">Room type</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {SEARCH_FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setActiveChip(chip.id)}
                    className={cn(
                      'px-3 py-2 rounded-full text-sm min-h-[44px]',
                      activeChip === chip.id
                        ? 'bg-brand-green text-white'
                        : 'bg-gray-100 dark:bg-[#1A2A1A] text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setFilterOpen(false);
                  fetchRooms();
                }}
                className="w-full bg-brand-green text-white font-semibold rounded-xl py-3 min-h-[44px]"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
