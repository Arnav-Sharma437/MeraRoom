'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { SearchFilterState } from '@/lib/filter-rooms';
import { DEFAULT_FILTERS } from '@/lib/filter-rooms';
import { DHARAMSHALA_AREAS, ROOM_TYPES, FURNISHING_TYPES, GENDER_OPTIONS } from '@/constants';
import { cn } from '@/lib/utils';
import { LucideByName } from '@/components/ui/LucideByName';

const AMENITY_OPTIONS = [
  { key: 'wifi' as const, label: 'WiFi', icon: 'Wifi' },
  { key: 'ac' as const, label: 'AC', icon: 'Wind' },
  { key: 'attachedBath' as const, label: 'Attached Bath', icon: 'Bath' },
  { key: 'parkingTwoWheeler' as const, label: '2-Wheeler Parking', icon: 'Bike' },
  { key: 'parkingFourWheeler' as const, label: '4-Wheeler Parking', icon: 'Car' },
  { key: 'kitchen' as const, label: 'Kitchen', icon: 'ChefHat' },
  { key: 'powerBackup' as const, label: 'Power Backup', icon: 'Zap' },
];

const ALLOWED_OPTIONS = [
  { key: 'students' as const, label: 'Students' },
  { key: 'working' as const, label: 'Working Professionals' },
  { key: 'family' as const, label: 'Family' },
  { key: 'bachelors' as const, label: 'Bachelors' },
];

interface RoomFiltersProps {
  filters: SearchFilterState;
  onChange: (filters: SearchFilterState) => void;
  onApply: () => void;
  onClear: () => void;
  resultCount?: number;
  variant?: 'sidebar' | 'sheet';
  onClose?: () => void;
}

export default function RoomFilters({
  filters,
  onChange,
  onApply,
  onClear,
  resultCount = 0,
  variant = 'sidebar',
  onClose,
}: RoomFiltersProps) {
  const [showAllAreas, setShowAllAreas] = useState(false);
  const visibleAreas = showAllAreas ? DHARAMSHALA_AREAS : DHARAMSHALA_AREAS.slice(0, 6);

  const update = (partial: Partial<SearchFilterState>) =>
    onChange({ ...filters, ...partial });

  const toggleArea = (slug: string) => {
    const areas = filters.areas.includes(slug)
      ? filters.areas.filter((a) => a !== slug)
      : [...filters.areas, slug];
    update({ areas });
  };

  const toggleAmenity = (key: (typeof AMENITY_OPTIONS)[number]['key']) => {
    const amenities = filters.amenities.includes(key)
      ? filters.amenities.filter((a) => a !== key)
      : [...filters.amenities, key];
    update({ amenities });
  };

  const toggleAllowed = (key: (typeof ALLOWED_OPTIONS)[number]['key']) => {
    const allowedFor = filters.allowedFor.includes(key)
      ? filters.allowedFor.filter((a) => a !== key)
      : [...filters.allowedFor, key];
    update({ allowedFor });
  };

  const content = (
    <div className={cn('space-y-6', variant === 'sheet' && 'pb-24')}>
      {variant === 'sheet' && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-[#0F2E1E] dark:text-white">Filters</h3>
          {onClose && (
            <button type="button" onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center">
              <X size={22} className="text-gray-500" />
            </button>
          )}
        </div>
      )}

      <section>
        <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white mb-3">Area</h4>
        <div className="space-y-2">
          {visibleAreas.map((area) => (
            <label key={area.slug} className="flex items-center gap-2 cursor-pointer min-h-[36px]">
              <input
                type="checkbox"
                checked={filters.areas.includes(area.slug)}
                onChange={() => toggleArea(area.slug)}
                className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{area.name}</span>
            </label>
          ))}
        </div>
        {DHARAMSHALA_AREAS.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAllAreas(!showAllAreas)}
            className="text-sm text-[#16A34A] mt-2 font-medium"
          >
            {showAllAreas ? 'Show less' : 'Show more'}
          </button>
        )}
      </section>

      <section>
        <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white mb-2">Budget Range</h4>
        <p className="text-sm text-[#16A34A] font-medium mb-3">
          ₹{filters.minRent.toLocaleString('en-IN')} — ₹{filters.maxRent.toLocaleString('en-IN')}
        </p>
        <input
          type="range"
          min={1000}
          max={20000}
          step={500}
          value={filters.maxRent}
          onChange={(e) => update({ maxRent: Number(e.target.value) })}
          className="w-full accent-[#16A34A]"
        />
        <input
          type="range"
          min={1000}
          max={20000}
          step={500}
          value={filters.minRent}
          onChange={(e) => update({ minRent: Math.min(Number(e.target.value), filters.maxRent) })}
          className="w-full accent-[#16A34A] mt-2"
        />
      </section>

      <section>
        <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white mb-3">Room Type</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="roomType" checked={!filters.roomType} onChange={() => update({ roomType: '' })} className="text-[#16A34A]" />
            <span className="text-sm text-gray-600 dark:text-gray-300">All Types</span>
          </label>
          {ROOM_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="roomType"
                checked={filters.roomType === t.value}
                onChange={() => update({ roomType: t.value })}
                className="text-[#16A34A]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{t.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white mb-3">Furnishing</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="furnishing" checked={!filters.furnishing} onChange={() => update({ furnishing: '' })} className="text-[#16A34A]" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Any</span>
          </label>
          {FURNISHING_TYPES.map((f) => (
            <label key={f.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="furnishing"
                checked={filters.furnishing === f.value}
                onChange={() => update({ furnishing: f.value })}
                className="text-[#16A34A]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{f.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white mb-3">Amenities</h4>
        <div className="space-y-2">
          {AMENITY_OPTIONS.map((a) => (
            <label key={a.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities.includes(a.key)}
                onChange={() => toggleAmenity(a.key)}
                className="rounded text-[#16A34A]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <LucideByName name={a.icon} size={14} className="inline mr-1" />
                {a.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white mb-3">Available For</h4>
        <div className="space-y-2">
          {ALLOWED_OPTIONS.map((a) => (
            <label key={a.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.allowedFor.includes(a.key)}
                onChange={() => toggleAllowed(a.key)}
                className="rounded text-[#16A34A]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{a.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h4 className="font-semibold text-sm text-[#0F2E1E] dark:text-white mb-3">Gender Preference</h4>
        <div className="space-y-2">
          {GENDER_OPTIONS.map((g) => (
            <label key={g.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g.value || (!filters.gender && g.value === 'any')}
                onChange={() => update({ gender: g.value === 'any' ? '' : g.value })}
                className="text-[#16A34A]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{g.label}</span>
            </label>
          ))}
        </div>
      </section>

      {variant === 'sidebar' && (
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-[#1F2E1F]">
          <button type="button" onClick={onClear} className="text-[#16A34A] text-sm font-medium py-2">
            Clear All
          </button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onApply}
            className="bg-[#16A34A] text-white rounded-xl py-2.5 w-full font-semibold"
          >
            Apply Filters
          </motion.button>
        </div>
      )}
    </div>
  );

  if (variant === 'sheet') {
    return (
      <>
        {content}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111A11] border-t border-gray-200 dark:border-[#1F2E1F] px-4 pt-3 pb-6 pb-safe flex gap-3 z-10">
          <button type="button" onClick={() => { onChange(DEFAULT_FILTERS); onClear(); }} className="flex-1 text-[#16A34A] font-medium py-3">
            Clear
          </button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => { onApply(); onClose?.(); }}
            className="flex-[2] bg-[#16A34A] text-white font-semibold rounded-xl py-3"
          >
            Show {resultCount} Rooms
          </motion.button>
        </div>
      </>
    );
  }

  return (
    <aside className="bg-white dark:bg-[#111A11] rounded-2xl p-5 border border-gray-100 dark:border-[#1F2E1F] sticky top-24 h-fit">
      {content}
    </aside>
  );
}
