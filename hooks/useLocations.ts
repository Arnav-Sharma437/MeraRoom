import { useState, useEffect } from 'react';
import { DHARAMSHALA_AREAS } from '@/constants';

export interface LocationItem {
  name: string;
  slug: string;
  isActive: boolean;
  image?: string;
}

export function useLocations() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch('/api/locations');
        const json = await res.json();
        if (json.success && json.data) {
          setLocations(json.data);
        } else {
          // Fallback
          setLocations(DHARAMSHALA_AREAS.map(a => ({ ...a, isActive: true })));
        }
      } catch (err) {
        console.error('Failed to fetch dynamic locations:', err);
        setLocations(DHARAMSHALA_AREAS.map(a => ({ ...a, isActive: true })));
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, []);

  return { locations, loading };
}
