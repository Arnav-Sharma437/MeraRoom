'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClear?: () => void;
}

export default function EmptyState({
  title = 'No rooms found',
  description = 'Try changing your filters or search in another area of Dharamshala.',
  onClear,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <span className="text-6xl block mb-4">🏠</span>
      <h3 className="font-semibold text-lg text-[#0F2E1E] dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">{description}</p>
      {onClear && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onClear}
          className="bg-[#16A34A] text-white font-semibold rounded-xl px-6 py-3 min-h-[44px]"
        >
          Clear Filters
        </motion.button>
      )}
    </motion.div>
  );
}
