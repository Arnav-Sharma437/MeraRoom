'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { Room, RoomFilters, ApiResponse } from '@/types';

interface UseRoomsOptions {
  filters?: RoomFilters;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseRoomsReturn {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
}

export function useRooms({
  filters = {},
  page = 1,
  limit = 12,
  autoFetch = true,
}: UseRoomsOptions = {}): UseRoomsReturn {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
        ),
      });

      const { data } = await axios.get<ApiResponse<Room[]> & { total?: number }>(
        `/api/rooms?${params.toString()}`
      );

      if (data.success && data.data) {
        setRooms(data.data);
        setTotal(data.total ?? data.data.length);
      } else {
        setError(data.error ?? 'Failed to fetch rooms');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchRooms();
    }
  }, [autoFetch, fetchRooms]);

  return { rooms, loading, error, total, refetch: fetchRooms };
}
