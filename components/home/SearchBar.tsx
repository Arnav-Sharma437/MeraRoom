'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { DHARAMSHALA_AREAS } from '@/constants';
import { fadeInUp } from '@/lib/animations';

export default function SearchBar() {
  const router = useRouter();
  const [area, setArea] = useState('');
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (area) params.set('area', area);
    if (query.trim()) params.set('q', query.trim());
    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ''}`);
  };

  return (
    <motion.form
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.6 }}
      onSubmit={handleSearch}
      className="w-full max-w-3xl mx-auto card-surface shadow-2xl dark:shadow-card-dark rounded-2xl p-3"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
        <div className="flex items-center w-full md:w-auto md:border-r border-gray-200 dark:border-[#1F2E1F] md:pr-3 md:min-w-[200px]">
          <MapPin className="text-brand-green ml-2 md:ml-3 flex-shrink-0" size={20} />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-brand-black dark:text-[#F9FAFB] text-sm font-medium focus:outline-none cursor-pointer appearance-none"
            aria-label="Select area"
          >
            <option value="">Select Area / Locality</option>
            {DHARAMSHALA_AREAS.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by area, landmark..."
          className="w-full md:flex-1 px-4 py-3 text-brand-black dark:text-[#F9FAFB] placeholder:text-brand-gray dark:placeholder:text-gray-500 text-sm focus:outline-none border-y md:border-y-0 border-gray-200 dark:border-[#1F2E1F] md:border-none"
        />

        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-green text-white font-semibold rounded-xl px-6 py-3 min-h-[44px] transition-default hover:bg-brand-gold hover:text-brand-dark md:ml-2"
        >
          <Search size={18} />
          <span>Search Rooms</span>
        </motion.button>
      </div>
    </motion.form>
  );
}
