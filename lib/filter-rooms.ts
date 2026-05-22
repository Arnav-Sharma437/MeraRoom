import type { Room } from '@/types';
import type { IRoomAmenities, IRoomAllowedFor } from '@/models/Room';
import { DHARAMSHALA_AREAS } from '@/constants';

export interface SearchFilterState {
  search: string;
  areas: string[];
  minRent: number;
  maxRent: number;
  roomType: string;
  furnishing: string;
  gender: string;
  amenities: (keyof IRoomAmenities)[];
  allowedFor: (keyof IRoomAllowedFor)[];
  chip: string;
  sort: 'newest' | 'price-low' | 'price-high' | 'popular';
}

export const DEFAULT_FILTERS: SearchFilterState = {
  search: '',
  areas: [],
  minRent: 1000,
  maxRent: 20000,
  roomType: '',
  furnishing: '',
  gender: '',
  amenities: [],
  allowedFor: [],
  chip: 'all',
  sort: 'newest',
};

export function buildRoomsQueryParams(
  filters: SearchFilterState,
  page: number,
  limit: number,
  exclude?: string
): URLSearchParams {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  params.set('sort', filters.sort);

  if (filters.search) params.set('q', filters.search);
  if (filters.areas.length === 1) params.set('area', filters.areas[0]);
  if (filters.minRent > 1000) params.set('minRent', String(filters.minRent));
  if (filters.maxRent < 20000) params.set('maxRent', String(filters.maxRent));
  if (filters.roomType) params.set('roomType', filters.roomType);
  if (filters.furnishing) params.set('furnishing', filters.furnishing);
  if (filters.gender) params.set('gender', filters.gender);
  if (filters.amenities.length) params.set('amenities', filters.amenities.join(','));
  if (filters.allowedFor.length) params.set('allowedFor', filters.allowedFor.join(','));
  if (exclude) params.set('exclude', exclude);

  const chip = filters.chip;
  if (chip && chip !== 'all') {
    if (chip === 'under-5k') params.set('maxRent', '5000');
    else if (chip === 'under-8k') params.set('maxRent', '8000');
    else if (['furnished', 'ac', 'wifi'].includes(chip)) params.set('roomType', chip);
    else params.set('roomType', chip);
  }

  return params;
}

export function filterMockRooms(rooms: Room[], filters: SearchFilterState, exclude?: string): Room[] {
  let result = [...rooms];
  if (exclude) result = result.filter((r) => r._id !== exclude);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        (r.address?.toLowerCase().includes(q) ?? false)
    );
  }

  if (filters.areas.length) {
    const names: string[] = filters.areas
      .map((slug) => DHARAMSHALA_AREAS.find((a) => a.slug === slug)?.name ?? '')
      .filter(Boolean);
    result = result.filter((r) => names.includes(r.area));
  }

  result = result.filter((r) => r.rent >= filters.minRent && r.rent <= filters.maxRent);

  if (filters.roomType) result = result.filter((r) => r.roomType === filters.roomType);
  if (filters.furnishing) result = result.filter((r) => r.furnishing === filters.furnishing);
  if (filters.gender) result = result.filter((r) => r.gender === filters.gender);

  filters.amenities.forEach((key) => {
    result = result.filter((r) => r.amenities[key]);
  });

  filters.allowedFor.forEach((key) => {
    result = result.filter((r) => r.allowedFor?.[key]);
  });

  const chip = filters.chip;
  if (chip === 'under-5k') result = result.filter((r) => r.rent <= 5000);
  else if (chip === 'under-8k') result = result.filter((r) => r.rent <= 8000);
  else if (chip === 'furnished') result = result.filter((r) => r.furnishing === 'furnished');
  else if (chip === 'ac') result = result.filter((r) => r.amenities.ac);
  else if (chip === 'wifi') result = result.filter((r) => r.amenities.wifi);
  else if (chip && chip !== 'all' && !chip.startsWith('under'))
    result = result.filter((r) => r.roomType === chip);

  switch (filters.sort) {
    case 'price-low':
      result.sort((a, b) => a.rent - b.rent);
      break;
    case 'price-high':
      result.sort((a, b) => b.rent - a.rent);
      break;
    case 'popular':
      result.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
      break;
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}

export function enrichMockRoom(room: Record<string, unknown>, index: number): Room {
  const base = room as unknown as Room;
  return {
    ...base,
    deposit: base.deposit ?? base.rent,
    address: base.address ?? `${base.area}, Dharamshala, Himachal Pradesh 176219`,
    gender: base.gender ?? 'any',
    allowedFor: base.allowedFor ?? {
      students: true,
      working: true,
      family: false,
      bachelors: true,
    },
    status: 'approved',
    isAvailable: true,
    views: base.views ?? 50 + index * 12,
    createdAt: base.createdAt ?? new Date(Date.now() - index * 86400000).toISOString(),
    owner:
      typeof base.owner === 'object'
        ? base.owner
        : { _id: 'owner-1', name: 'Property Owner', email: '', role: 'owner', isVerified: true, savedRooms: [], createdAt: '' },
  };
}
