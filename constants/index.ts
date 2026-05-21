import type { AmenityItem } from '@/types';
import type { IRoomAmenities } from '@/models/Room';

export const APP_NAME = 'MeraRoom';
export const APP_TAGLINE = 'Find Your Perfect Room in Dharamshala';
export const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

export const CITY = {
  name: 'Dharamshala',
  slug: 'dharamshala',
  state: 'Himachal Pradesh',
} as const;

export const DHARAMSHALA_AREAS = [
  { name: 'McLeod Ganj', slug: 'mcleod-ganj' },
  { name: 'Shyam Nagar', slug: 'shyam-nagar' },
  { name: 'Dari', slug: 'dari' },
  { name: 'Sakoh', slug: 'sakoh' },
  { name: 'Kotwali Bazaar', slug: 'kotwali-bazaar' },
  { name: 'Sidhpur', slug: 'sidhpur' },
  { name: 'Ramnagar', slug: 'ramnagar' },
  { name: 'Khanyara', slug: 'khanyara' },
  { name: 'Forsyth Ganj', slug: 'forsyth-ganj' },
  { name: 'Jogiwara Road', slug: 'jogiwara-road' },
  { name: 'Bhagsu', slug: 'bhagsu' },
  { name: 'Naddi', slug: 'naddi' },
  { name: 'Upper Dharamshala', slug: 'upper-dharamshala' },
  { name: 'Lower Dharamshala', slug: 'lower-dharamshala' },
  { name: 'Chamunda', slug: 'chamunda' },
  { name: 'Dharamkot', slug: 'dharamkot' },
  { name: 'Palampur Road', slug: 'palampur-road' },
] as const;

export const CONTACTS = [
  {
    name: 'Arnav',
    phone: '+91 7876650437',
    whatsapp: '917876650437',
    href: 'https://wa.me/917876650437',
  },
  {
    name: 'Varun',
    phone: '+91 9418100803',
    whatsapp: '919418100803',
    href: 'https://wa.me/919418100803',
  },
] as const;

export const ROOM_TYPES = [
  { value: 'single', label: 'Single Room' },
  { value: 'shared', label: 'Shared Room' },
  { value: 'studio', label: 'Studio' },
  { value: 'pg', label: 'PG' },
  { value: '1bhk', label: '1 BHK' },
  { value: '2bhk', label: '2 BHK' },
] as const;

export const SEARCH_FILTER_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'single', label: 'Single' },
  { id: 'shared', label: 'Shared' },
  { id: 'pg', label: 'PG' },
  { id: 'furnished', label: 'Furnished' },
  { id: 'ac', label: 'AC' },
  { id: 'wifi', label: 'WiFi' },
] as const;

export const FURNISHING_TYPES = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male Only' },
  { value: 'female', label: 'Female Only' },
] as const;

export const ROOM_STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export const USER_ROLES = [
  { value: 'user', label: 'Tenant' },
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
] as const;

export const AMENITIES: AmenityItem[] = [
  { key: 'wifi', label: 'WiFi', icon: 'Wifi' },
  { key: 'ac', label: 'AC', icon: 'Wind' },
  { key: 'parking', label: 'Parking', icon: 'Car' },
  { key: 'attachedBath', label: 'Attached Bath', icon: 'Bath' },
  { key: 'kitchen', label: 'Kitchen', icon: 'ChefHat' },
  { key: 'laundry', label: 'Laundry', icon: 'Shirt' },
  { key: 'tv', label: 'TV', icon: 'Tv' },
  { key: 'powerBackup', label: 'Power Backup', icon: 'Zap' },
  { key: 'security', label: 'Security', icon: 'Shield' },
  { key: 'gym', label: 'Gym', icon: 'Dumbbell' },
];

export const DEFAULT_AMENITIES: IRoomAmenities = {
  wifi: false,
  ac: false,
  parking: false,
  attachedBath: false,
  kitchen: false,
  laundry: false,
  tv: false,
  powerBackup: false,
  security: false,
  gym: false,
};

export const ALLOWED_FOR_OPTIONS = [
  { key: 'students', label: 'Students' },
  { key: 'working', label: 'Working Professionals' },
  { key: 'family', label: 'Family' },
  { key: 'bachelors', label: 'Bachelors' },
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Search Rooms', href: '/search' },
  { label: 'List Your Room', href: '/dashboard/owner' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const HOME_AREAS = DHARAMSHALA_AREAS.map((area, i) => ({
  ...area,
  roomCount: [42, 28, 18, 15, 35, 22, 19, 12, 24, 31, 48, 20, 26, 38, 14, 45, 16][i] ?? 15,
}));

export const HERO_STATS = [
  '150+ Rooms',
  '17 Areas',
  '100% Verified',
  'Free to Search',
] as const;

export const HOME_STATS = [
  { value: 150, suffix: '+', label: 'Rooms Listed' },
  { value: 17, suffix: '', label: 'Areas in Dharamshala' },
  { value: 800, suffix: '+', label: 'Happy Users' },
  { value: 4.8, suffix: '★', label: 'Average Rating', isDecimal: true },
] as const;

export const WHY_MERAROOM = [
  {
    icon: '✓',
    title: 'Verified Listings',
    description:
      'Every room in Dharamshala is manually verified before it goes live on MeraRoom.',
  },
  {
    icon: '💬',
    title: 'Direct WhatsApp Contact',
    description: 'No forms. No waiting. Message owners in McLeod, Bhagsu & more instantly.',
  },
  {
    icon: '🆓',
    title: 'Completely Free',
    description: 'Searching and contacting owners across Dharamshala is always 100% free.',
  },
  {
    icon: '📍',
    title: 'Dharamshala Localities',
    description:
      'Find rooms near Dharamkot, Kotwali Bazaar, Naddi, or your college and workplace.',
  },
] as const;

export const FOOTER_AREAS = DHARAMSHALA_AREAS.slice(0, 6).map((a) => ({
  label: a.name,
  href: `/search?area=${a.slug}`,
}));

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  explore: [
    { label: 'Search Rooms', href: '/search' },
    { label: 'List Your Room', href: '/dashboard/owner' },
    { label: 'Popular Areas', href: '/search' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
} as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    icon: 'Search',
    title: 'Search Your Area',
    description:
      'Pick a locality in Dharamshala — McLeod Ganj, Bhagsu, Dharamkot — and see available rooms instantly.',
    direction: 'left' as const,
  },
  {
    step: '02',
    icon: 'Home',
    title: 'Choose Your Room',
    description:
      'Browse listings with photos, mountain-view details, amenities, and pricing in ₹3,000–₹12,000 range.',
    direction: 'bottom' as const,
  },
  {
    step: '03',
    icon: 'MessageCircle',
    title: 'Contact on WhatsApp',
    description:
      'Message the owner directly on WhatsApp — no brokers, no delays, perfect for students & travellers.',
    direction: 'right' as const,
  },
] as const;

export const MOCK_FEATURED_ROOMS = [
  {
    _id: 'mock-1',
    title: 'Cozy PG Room with Dhauladhar View',
    description: 'Warm furnished PG near Main Square with WiFi, geyser, and monthly housekeeping in McLeod Ganj.',
    rent: 5500,
    area: 'McLeod Ganj',
    city: { name: 'Dharamshala', slug: 'dharamshala' },
    roomType: 'pg' as const,
    furnishing: 'furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '917876650437',
    amenities: { wifi: true, ac: false, parking: false, attachedBath: true, kitchen: true, laundry: true, tv: false, powerBackup: true, security: true, gym: false },
  },
  {
    _id: 'mock-2',
    title: 'Single Room Near Bhagsu Waterfall',
    description: 'Quiet single room on Jogiwara Road — ideal for remote workers, 10 min walk to Bhagsu cafes.',
    rent: 7500,
    area: 'Bhagsu',
    city: { name: 'Dharamshala', slug: 'dharamshala' },
    roomType: 'single' as const,
    furnishing: 'furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '919418100803',
    amenities: { wifi: true, ac: true, parking: false, attachedBath: true, kitchen: false, laundry: true, tv: false, powerBackup: true, security: true, gym: false },
  },
  {
    _id: 'mock-3',
    title: 'Shared Room in Dharamkot',
    description: 'Budget-friendly shared accommodation for yoga students and trekkers. Common kitchen & hot water.',
    rent: 3500,
    area: 'Dharamkot',
    city: { name: 'Dharamshala', slug: 'dharamshala' },
    roomType: 'shared' as const,
    furnishing: 'semi-furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '917876650437',
    amenities: { wifi: true, ac: false, parking: false, attachedBath: false, kitchen: true, laundry: false, tv: false, powerBackup: false, security: true, gym: false },
  },
  {
    _id: 'mock-4',
    title: 'Studio Flat on Palampur Road',
    description: 'Self-contained studio with attached bath, parking, and mountain-facing balcony in Sidhpur area.',
    rent: 11000,
    area: 'Palampur Road',
    city: { name: 'Dharamshala', slug: 'dharamshala' },
    roomType: 'studio' as const,
    furnishing: 'furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '919418100803',
    amenities: { wifi: true, ac: true, parking: true, attachedBath: true, kitchen: true, laundry: false, tv: true, powerBackup: true, security: true, gym: false },
  },
  {
    _id: 'mock-5',
    title: 'Girls PG near Kotwali Bazaar',
    description: 'Safe girls PG with CCTV, home-style meals, and easy access to local buses and markets.',
    rent: 4800,
    area: 'Kotwali Bazaar',
    city: { name: 'Dharamshala', slug: 'dharamshala' },
    roomType: 'pg' as const,
    furnishing: 'furnished' as const,
    images: [],
    isFeatured: false,
    whatsappNumber: '917876650437',
    amenities: { wifi: true, ac: false, parking: false, attachedBath: true, kitchen: true, laundry: true, tv: true, powerBackup: true, security: true, gym: false },
  },
  {
    _id: 'mock-6',
    title: '1 BHK in Lower Dharamshala',
    description: 'Spacious 1 BHK for families or long-stay professionals — close to hospitals and schools.',
    rent: 9500,
    area: 'Lower Dharamshala',
    city: { name: 'Dharamshala', slug: 'dharamshala' },
    roomType: '1bhk' as const,
    furnishing: 'semi-furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '919418100803',
    amenities: { wifi: true, ac: true, parking: true, attachedBath: true, kitchen: true, laundry: false, tv: true, powerBackup: true, security: true, gym: false },
  },
] as const;

export const SEED_CITY = {
  name: 'Dharamshala',
  slug: 'dharamshala',
  state: 'Himachal Pradesh',
  image: '/images/cities/dharamshala.jpg',
  isActive: true,
  totalRooms: 150,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;
