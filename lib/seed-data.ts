import { MOCK_FEATURED_ROOMS, SEED_CITY } from '@/constants';

export const seedCityDocument = SEED_CITY;

export const seedRoomsData = MOCK_FEATURED_ROOMS.map((room) => ({
  title: room.title,
  description: room.description,
  rent: room.rent,
  deposit: room.rent,
  area: room.area,
  address: `${room.area}, Dharamshala, Himachal Pradesh`,
  images: room.images,
  roomType: room.roomType,
  furnishing: room.furnishing,
  gender: 'any' as const,
  amenities: room.amenities,
  allowedFor: {
    students: true,
    working: true,
    family: false,
    bachelors: true,
  },
  whatsappNumber: room.whatsappNumber,
  status: 'approved' as const,
  isFeatured: room.isFeatured,
  isAvailable: true,
  views: Math.floor(Math.random() * 200),
}));
