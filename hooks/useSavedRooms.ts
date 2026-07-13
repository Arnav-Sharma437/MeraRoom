'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { Room } from '@/types';

export function useSavedRooms() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated') {
      setSavedIds(new Set());
      setLoaded(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get<{ success: boolean; data?: Room[] }>(
          '/api/rooms/saved'
        );
        if (!cancelled && data.success && data.data) {
          setSavedIds(new Set(data.data.map((r) => r._id)));
        }
      } catch {
        if (!cancelled) setSavedIds(new Set());
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.id]);

  const isSaved = useCallback((roomId: string) => savedIds.has(roomId), [savedIds]);

  const toggleSave = useCallback(
    async (roomId: string) => {
      if (!session?.user) {
        toast.error('Please login to save rooms');
        router.push('/login');
        return false;
      }

      const wasSaved = savedIds.has(roomId);
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(roomId);
        else next.add(roomId);
        return next;
      });

      try {
        if (wasSaved) {
          await axios.delete('/api/rooms/saved', { data: { roomId } });
          toast.success('Removed from Wishlist');
        } else {
          await axios.post('/api/rooms/saved', { roomId });
          toast.success('Added to Wishlist! View in Saved Rooms.');
        }
        return !wasSaved;
      } catch {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(roomId);
          else next.delete(roomId);
          return next;
        });
        toast.error('Something went wrong');
        return wasSaved;
      }
    },
    [session, router, savedIds]
  );

  return { savedIds, isSaved, toggleSave, loaded };
}
