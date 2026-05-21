'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { City, ApiResponse } from '@/types';

interface UseCitiesReturn {
  cities: City[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCities(): UseCitiesReturn {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<ApiResponse<City[]>>('/api/cities');

      if (data.success && data.data) {
        setCities(data.data);
      } else {
        setError(data.error ?? 'Failed to fetch cities');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return { cities, loading, error, refetch: fetchCities };
}
