'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HOME_STATS } from '@/constants';
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/animations';

function CountUp({
  value,
  suffix,
  isDecimal,
  inView,
}: {
  value: number;
  suffix: string;
  isDecimal?: boolean;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.min(value, increment * step));
      if (step >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  const display = isDecimal
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString('en-IN');

  return (
    <span className="font-display text-4xl md:text-5xl text-brand-gold">
      {display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="bg-brand-dark dark:bg-brand-dark-deep py-14 md:py-16"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center"
        >
          {HOME_STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                isDecimal={'isDecimal' in stat && stat.isDecimal}
                inView={inView}
              />
              <p className="text-white/60 mt-2 font-medium text-sm md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
