'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, X, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import RoomCard from '@/components/rooms/RoomCard';
import RoomFilters from '@/components/rooms/RoomFilters';
import EmptyState from '@/components/ui/EmptyState';
import { RoomCardSkeleton } from '@/components/ui/Skeleton';
import AdBanner from '@/components/ui/AdBanner';
import type { Room, ApiResponse } from '@/types';
import { DHARAMSHALA_AREAS, SEARCH_FILTER_CHIPS, CITY, getMockSearchRooms } from '@/constants';
import {
  DEFAULT_FILTERS,
  buildRoomsQueryParams,
  filterMockRooms,
  enrichMockRoom,
  type SearchFilterState,
} from '@/lib/filter-rooms';
import { cn } from '@/lib/utils';

const LIMIT = 9;

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilterState>(() => ({
    ...DEFAULT_FILTERS,
    search: searchParams.get('q') ?? '',
    areas: searchParams.get('area') ? [searchParams.get('area')!] : [],
  }));
  const [draftFilters, setDraftFilters] = useState(filters);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState(filters.search);
  const mockRooms = useMemo(
    () => getMockSearchRooms().map((r, i) => enrichMockRoom(r as Record<string, unknown>, i)),
    []
  );

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildRoomsQueryParams(filters, page, LIMIT);
      const { data } = await axios.get<ApiResponse<Room[]> & { total?: number }>(
        `/api/rooms?${params.toString()}`
      );
      if (data.success && data.data && data.data.length > 0) {
        setRooms(data.data);
        setTotal(data.total ?? data.data.length);
      } else {
        const filtered = filterMockRooms(mockRooms, filters);
        const start = (page - 1) * LIMIT;
        setRooms(filtered.slice(start, start + LIMIT));
        setTotal(filtered.length);
      }
    } catch {
      const filtered = filterMockRooms(mockRooms, filters);
      const start = (page - 1) * LIMIT;
      setRooms(filtered.slice(start, start + LIMIT));
      setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [filters, page, mockRooms]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const applyChip = (chipId: string) => {
    setFilters((f) => ({ ...f, chip: chipId }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDraftFilters(DEFAULT_FILTERS);
    setSearchInput('');
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F0A]">
      {/* Mobile header */}
      <div className="md:hidden sticky top-14 z-40 bg-white dark:bg-[#0A0F0A] border-b border-gray-100 dark:border-[#1F2E1F] px-4 py-3">
        <div className="relative flex items-center bg-gray-100 dark:bg-[#111A11] rounded-xl px-4 py-3">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search area, landmark..."
            className="flex-1 bg-transparent pl-3 text-sm text-[#1A1A1A] dark:text-white focus:outline-none"
          />
          {searchInput && (
            <button type="button" onClick={() => setSearchInput('')} className="min-w-[44px] min-h-[44px] flex items-center justify-center">
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>
        <div className="flex gap-2 py-2 overflow-x-auto hide-scrollbar -mx-1 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {SEARCH_FILTER_CHIPS.map((chip) => (
            <motion.button
              key={chip.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => applyChip(chip.id)}
              className={cn(
                'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium min-h-[36px]',
                filters.chip === chip.id
                  ? 'bg-[#16A34A] text-white font-semibold'
                  : 'bg-gray-100 dark:bg-[#1A2A1A] text-gray-600 dark:text-gray-400'
              )}
            >
              {chip.label}
            </motion.button>
          ))}
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilterOpen(true)}
            className="flex-shrink-0 flex items-center gap-1 rounded-full px-4 py-1.5 text-sm border border-[#16A34A] text-[#16A34A] font-medium"
          >
            <SlidersHorizontal size={14} /> Filters
          </motion.button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block bg-[#0F2E1E] py-10 px-6">
        <div className="container mx-auto">
          <h1 className="font-display text-3xl text-white mb-6">Rooms in {CITY.name}</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFilters((f) => ({ ...f, search: searchInput }));
              setPage(1);
            }}
            className="bg-white dark:bg-[#111A11] rounded-2xl p-2 flex items-center gap-2 shadow-xl max-w-3xl"
          >
            <div className="flex items-center border-r border-gray-200 dark:border-[#1F2E1F] min-w-[160px]">
              <MapPin size={18} className="text-[#16A34A] ml-3 flex-shrink-0" />
              <select
                value={filters.areas[0] ?? ''}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    areas: e.target.value ? [e.target.value] : [],
                  }))
                }
                className="bg-transparent px-3 py-3 text-sm focus:outline-none text-[#1A1A1A] dark:text-white flex-1"
              >
                <option value="">All Areas</option>
                {DHARAMSHALA_AREAS.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </div>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Landmark, street..."
              className="flex-1 px-4 py-3 text-sm bg-transparent focus:outline-none text-[#1A1A1A] dark:text-white"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="bg-[#16A34A] text-white rounded-xl px-6 py-3 font-semibold flex items-center gap-2 hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-colors duration-200"
            >
              <Search size={18} /> Search
            </motion.button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
            <RoomFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              onApply={() => {
                setFilters(draftFilters);
                setPage(1);
              }}
              onClear={clearFilters}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-[#0F2E1E] dark:text-white">{total}</span> Rooms found in {CITY.name}
              </p>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={filters.sort}
                  onChange={(e) => {
                    setFilters((f) => ({ ...f, sort: e.target.value as SearchFilterState['sort'] }));
                    setPage(1);
                  }}
                  className="text-sm border border-gray-200 dark:border-[#1F2E1F] rounded-lg px-3 py-2 bg-white dark:bg-[#111A11] text-[#1A1A1A] dark:text-white w-full md:w-auto"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
                <div className="hidden md:flex border border-gray-200 dark:border-[#1F2E1F] rounded-lg overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2 min-w-[44px] min-h-[44px] flex items-center justify-center', viewMode === 'grid' ? 'bg-[#16A34A] text-white' : 'text-gray-400')}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={cn('p-2 min-w-[44px] min-h-[44px] flex items-center justify-center', viewMode === 'list' ? 'bg-[#16A34A] text-white' : 'text-gray-400')}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            <AdBanner 
              slot={2}
              className="mb-4 h-20 md:h-28"
            />

            {loading ? (
              <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4')}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <RoomCardSkeleton key={i} list={viewMode === 'list'} />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-4'
                )}
              >
                {rooms.map((room, i) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    index={i}
                    view={viewMode}
                  />
                ))}
              </motion.div>
            )}

            {!loading && rooms.length > 0 && (
              <div className="mt-10 flex justify-center">
                <div className="hidden md:flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2 rounded-lg border disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={cn(
                        'min-w-[44px] min-h-[44px] rounded-lg text-sm font-medium',
                        page === p ? 'bg-[#16A34A] text-white' : 'border text-gray-600 dark:text-gray-300'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 rounded-lg border disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="md:hidden w-full bg-[#16A34A] text-white font-semibold rounded-xl py-3 disabled:opacity-50 min-h-[44px]"
                >
                  {page >= totalPages ? 'No More Rooms' : 'Load More'}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-[#111A11] rounded-t-3xl max-h-[85vh] overflow-y-auto px-4 pt-2"
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2" />
              <RoomFilters
                variant="sheet"
                filters={draftFilters}
                onChange={setDraftFilters}
                onApply={() => {
                  setFilters(draftFilters);
                  setPage(1);
                }}
                onClear={clearFilters}
                onClose={() => setFilterOpen(false)}
                resultCount={total}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
