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
    name: 'Arnav Sharma',
    phone: '+91 7876650437',
    whatsapp: '917876650437',
    href: 'https://wa.me/917876650437',
  },
  {
    name: 'Varun Choudhary',
    phone: '+91 9418100803',
    whatsapp: '919418100803',
    href: 'https://wa.me/919418100803',
  },
] as const;

export const POST_ROOM_TYPES = [
  { value: 'single', label: 'Single Room', icon: 'BedDouble' },
  { value: 'shared', label: 'Shared Room', icon: 'Users' },
  { value: 'pg', label: 'PG', icon: 'Home' },
  { value: 'studio', label: 'Studio', icon: 'Building2' },
  { value: '1bhk', label: '1 BHK', icon: 'LayoutGrid' },
  { value: '2bhk', label: '2 BHK', icon: 'Home' },
] as const;

export const POST_AMENITIES = [
  { key: 'wifi', label: 'WiFi', icon: 'Wifi' },
  { key: 'ac', label: 'AC', icon: 'Wind' },
  { key: 'attachedBath', label: 'Attached Bathroom', icon: 'Bath' },
  { key: 'parkingTwoWheeler', label: '2-Wheeler Parking', icon: 'Bike' },
  { key: 'parkingFourWheeler', label: '4-Wheeler Parking', icon: 'Car' },
  { key: 'kitchen', label: 'Kitchen', icon: 'ChefHat' },
  { key: 'tv', label: 'TV', icon: 'Tv' },
  { key: 'powerBackup', label: 'Power Backup', icon: 'Zap' },
  { key: 'security', label: 'Security Guard', icon: 'Shield' },
  { key: 'laundry', label: 'Laundry', icon: 'Shirt' },
  { key: 'gym', label: 'Gym', icon: 'Dumbbell' },
] as const;

export const POST_FURNISHING = [
  { value: 'furnished', label: 'Furnished', icon: 'Home' },
  { value: 'semi-furnished', label: 'Semi-Furnished', icon: 'LayoutGrid' },
  { value: 'unfurnished', label: 'Unfurnished', icon: 'Building2' },
] as const;

export const ALLOWED_FOR_CHIPS = [
  { key: 'students', label: 'Students' },
  { key: 'working', label: 'Working' },
  { key: 'family', label: 'Family' },
  { key: 'bachelors', label: 'Bachelors' },
] as const;

export const OWNER_NAV = [
  { href: '/dashboard/owner', label: 'Overview', icon: 'BarChart2' },
  { href: '/dashboard/owner/listings', label: 'My Listings', icon: 'Home' },
  { href: '/dashboard/owner/post', label: 'Post New Room', icon: 'Plus' },
  { href: '/dashboard/owner/inquiries', label: 'Inquiries', icon: 'Mail' },
  { href: '/dashboard/owner/profile', label: 'My Profile', icon: 'User' },
] as const;

/** Unsplash images for home area cards (slug → url) */
export const AREA_IMAGES: Record<string, string> = {
  'mcleod-ganj': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&q=80',
  dharamshala: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80',
  bhagsu: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  naddi: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
  dharamkot: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
  'shyam-nagar': 'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=400&q=80',
  dari: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80',
  sakoh: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&q=80',
  'kotwali-bazaar': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
  sidhpur: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
  ramnagar: 'https://images.unsplash.com/photo-1454496564094-0a8f71c469b8?w=400&q=80',
  khanyara: 'https://images.unsplash.com/photo-1494500764466-1c05d7b539c8?w=400&q=80',
  'forsyth-ganj': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80',
  'jogiwara-road': 'https://images.unsplash.com/photo-1480497491538-f5c40e3952f0?w=400&q=80',
  'upper-dharamshala': 'https://images.unsplash.com/photo-1465256410760-10640339c72c?w=400&q=80',
  'lower-dharamshala': 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=400&q=80',
  chamunda: 'https://images.unsplash.com/photo-1518002171953-a080ef816115?w=400&q=80',
  'palampur-road': 'https://images.unsplash.com/photo-1512413917822-2b6d08003a27?w=400&q=80',
};

export const DEFAULT_AREA_IMAGE =
  'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80';

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
  { id: 'under-5k', label: 'Under ₹5K' },
  { id: 'under-8k', label: 'Under ₹8K' },
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
  { key: 'parkingTwoWheeler', label: '2-Wheeler Parking', icon: 'Bike' },
  { key: 'parkingFourWheeler', label: '4-Wheeler Parking', icon: 'Car' },
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
  parkingTwoWheeler: false,
  parkingFourWheeler: false,
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
  { value: 4.8, suffix: '', label: 'Average Rating', isDecimal: true },
] as const;

export const WHY_MERAROOM = [
  {
    icon: 'CheckCircle',
    title: 'Verified Listings',
    description:
      'Every room in Dharamshala is manually verified before it goes live on MeraRoom.',
  },
  {
    icon: 'MessageCircle',
    title: 'Direct WhatsApp Contact',
    description: 'No forms. No waiting. Message owners in McLeod, Bhagsu & more instantly.',
  },
  {
    icon: 'Gift',
    title: 'Completely Free',
    description: 'Searching and contacting owners across Dharamshala is always 100% free.',
  },
  {
    icon: 'MapPin',
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

export function getMockSearchRooms() {
  const extras = [
    { _id: 'mock-7', title: 'Budget Room in Shyam Nagar', rent: 4200, area: 'Shyam Nagar', roomType: 'single' as const, furnishing: 'semi-furnished' as const, isFeatured: false },
    { _id: 'mock-8', title: 'PG near Dari Bridge', rent: 3800, area: 'Dari', roomType: 'pg' as const, furnishing: 'furnished' as const, isFeatured: false },
    { _id: 'mock-9', title: '2 BHK in Ramnagar', rent: 12000, area: 'Ramnagar', roomType: '2bhk' as const, furnishing: 'furnished' as const, isFeatured: true },
    { _id: 'mock-10', title: 'Room on Jogiwara Road', rent: 6200, area: 'Jogiwara Road', roomType: 'single' as const, furnishing: 'furnished' as const, isFeatured: false },
    { _id: 'mock-11', title: 'Naddi Valley View PG', rent: 5200, area: 'Naddi', roomType: 'pg' as const, furnishing: 'furnished' as const, isFeatured: true },
    { _id: 'mock-12', title: 'Upper Dharamshala Flat Share', rent: 4500, area: 'Upper Dharamshala', roomType: 'shared' as const, furnishing: 'semi-furnished' as const, isFeatured: false },
  ];
  return [...MOCK_FEATURED_ROOMS, ...extras.map((e, i) => ({
    ...MOCK_FEATURED_ROOMS[i % 6],
    ...e,
    description: `Comfortable stay in ${e.area}, Dharamshala with mountain air and local markets nearby.`,
    whatsappNumber: i % 2 === 0 ? '917876650437' : '919418100803',
    images: [] as string[],
    amenities: MOCK_FEATURED_ROOMS[i % 6].amenities,
    city: { name: 'Dharamshala', slug: 'dharamshala' },
  }))];
}

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

export const TEAM = [
  {
    name: 'Arnav Sharma',
    role: 'Founder',
    phone: '+91 7876650437',
    href: 'https://wa.me/917876650437',
  },
  {
    name: 'Varun Choudhary',
    role: 'Founder',
    phone: '+91 9418100803',
    href: 'https://wa.me/919418100803',
  },
  {
    name: 'Shubham Siyal',
    role: 'Marketing & Social Media',
  },
  {
    name: 'Komal Rana',
    role: 'Marketing & Social Media',
  },
  {
    name: 'Rakesh Kumar',
    role: 'Angel Investor',
  },
] as const;

export const ABOUT_STATS = [
  { value: '100+', label: 'Rooms Listed' },
  { value: '17', label: 'Areas Covered' },
  { value: '500+', label: 'Happy Users' },
  { value: 'Free', label: 'To Search & Contact' },
] as const;

export const ABOUT_VALUES = [
  {
    icon: 'Search',
    title: 'Transparency',
    description: 'Every listing is manually reviewed before going live.',
  },
  {
    icon: 'Zap',
    title: 'Speed',
    description: 'Find a room and contact the owner in under 2 minutes.',
  },
  {
    icon: 'Handshake',
    title: 'Trust',
    description: 'Verified badges and real photos — no fake listings.',
  },
  {
    icon: 'Gift',
    title: 'Free Forever',
    description: 'Searching and contacting owners is always free.',
  },
] as const;

export const CONTACT_SUBJECTS = [
  { value: 'list-room', label: 'I want to list my room' },
  { value: 'find-room', label: 'I need help finding a room' },
  { value: 'featured', label: 'Featured listing inquiry' },
  { value: 'report', label: 'Report a problem' },
  { value: 'other', label: 'Other' },
] as const;

export const CONTACT_FAQ = [
  {
    question: 'Is MeraRoom free to use?',
    answer:
      'Yes! Searching rooms and contacting owners is completely free. We offer paid featured listings for property owners who want more visibility.',
  },
  {
    question: 'How do I list my room?',
    answer:
      "Contact us on WhatsApp and we'll add your listing for free. We'll ask for photos, details and your contact number.",
  },
  {
    question: 'Are all listings verified?',
    answer:
      'We manually review every listing before it goes live. Verified badge properties have been physically inspected by our team.',
  },
  {
    question: 'Which areas does MeraRoom cover?',
    answer:
      'Currently we cover all major areas in Dharamshala including McLeod Ganj, Shyam Nagar, Dari, Sakoh, Bhagsu, Naddi and 11 more localities.',
  },
  {
    question: 'How do I contact a room owner?',
    answer:
      "Every listing has a WhatsApp button. Just tap it and you'll be directly connected with the owner — no middlemen.",
  },
] as const;
