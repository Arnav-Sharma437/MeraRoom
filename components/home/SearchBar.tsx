'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { HOME_CITIES } from '@/constants';
import { fadeInUp } from '@/lib/animations';

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (query.trim()) params.set('area', query.trim());
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
      className="w-full max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-3"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
        <div className="flex items-center md:border-r border-brand-border md:pr-3 md:min-w-[180px]">
          <MapPin className="text-brand-green ml-2 md:ml-3 flex-shrink-0" size={20} />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-brand-black text-sm font-medium focus:outline-none cursor-pointer appearance-none"
            aria-label="Select city"
          >
            <option value="">Select City</option>
            {HOME_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Area, locality, landmark..."
          className="flex-1 px-4 py-3 text-brand-black placeholder:text-brand-gray text-sm focus:outline-none border-t md:border-t-0 border-brand-border md:border-none"
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-brand-green text-white font-semibold rounded-xl px-6 py-3 transition-default hover:bg-brand-gold hover:text-brand-dark md:ml-2 active:scale-[0.97]"
        >
          <Search size={18} />
          <span>Search Rooms</span>
        </button>
      </div>
    </motion.form>
  );
}
