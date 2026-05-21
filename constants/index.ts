import type { AmenityItem } from '@/types';
import type { IRoomAmenities } from '@/models/Room';

export const APP_NAME = 'MeraRoom';
export const APP_TAGLINE = 'Find Your Perfect Room in India';
export const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

export const ROOM_TYPES = [
  { value: 'single', label: 'Single Room' },
  { value: 'shared', label: 'Shared Room' },
  { value: 'studio', label: 'Studio' },
  { value: 'pg', label: 'PG' },
  { value: '1bhk', label: '1 BHK' },
  { value: '2bhk', label: '2 BHK' },
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

export const POPULAR_CITIES = [
  {
    name: 'Mumbai',
    slug: 'mumbai',
    state: 'Maharashtra',
    image: '/images/cities/mumbai.jpg',
  },
  {
    name: 'Delhi',
    slug: 'delhi',
    state: 'Delhi',
    image: '/images/cities/delhi.jpg',
  },
  {
    name: 'Bangalore',
    slug: 'bangalore',
    state: 'Karnataka',
    image: '/images/cities/bangalore.jpg',
  },
  {
    name: 'Hyderabad',
    slug: 'hyderabad',
    state: 'Telangana',
    image: '/images/cities/hyderabad.jpg',
  },
  {
    name: 'Pune',
    slug: 'pune',
    state: 'Maharashtra',
    image: '/images/cities/pune.jpg',
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    state: 'Tamil Nadu',
    image: '/images/cities/chennai.jpg',
  },
  {
    name: 'Kolkata',
    slug: 'kolkata',
    state: 'West Bengal',
    image: '/images/cities/kolkata.jpg',
  },
  {
    name: 'Ahmedabad',
    slug: 'ahmedabad',
    state: 'Gujarat',
    image: '/images/cities/ahmedabad.jpg',
  },
  {
    name: 'Jaipur',
    slug: 'jaipur',
    state: 'Rajasthan',
    image: '/images/cities/jaipur.jpg',
  },
  {
    name: 'Lucknow',
    slug: 'lucknow',
    state: 'Uttar Pradesh',
    image: '/images/cities/lucknow.jpg',
  },
  {
    name: 'Indore',
    slug: 'indore',
    state: 'Madhya Pradesh',
    image: '/images/cities/indore.jpg',
  },
  {
    name: 'Chandigarh',
    slug: 'chandigarh',
    state: 'Chandigarh',
    image: '/images/cities/chandigarh.jpg',
  },
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Search Rooms', href: '/search' },
  { label: 'List Your Room', href: '/dashboard/owner' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const HOME_CITIES = [
  { name: 'Delhi', slug: 'delhi', roomCount: 420 },
  { name: 'Mumbai', slug: 'mumbai', roomCount: 580 },
  { name: 'Bangalore', slug: 'bangalore', roomCount: 510 },
  { name: 'Pune', slug: 'pune', roomCount: 340 },
  { name: 'Hyderabad', slug: 'hyderabad', roomCount: 290 },
  { name: 'Chennai', slug: 'chennai', roomCount: 265 },
  { name: 'Jaipur', slug: 'jaipur', roomCount: 180 },
  { name: 'Chandigarh', slug: 'chandigarh', roomCount: 145 },
  { name: 'Noida', slug: 'noida', roomCount: 220 },
  { name: 'Dharamshala', slug: 'dharamshala', roomCount: 85 },
] as const;

export const HERO_STATS = [
  '2,500+ Rooms',
  '50+ Cities',
  '100% Verified',
  'Free to Search',
] as const;

export const HOME_STATS = [
  { value: 2500, suffix: '+', label: 'Rooms Listed' },
  { value: 50, suffix: '+', label: 'Cities Covered' },
  { value: 10000, suffix: '+', label: 'Happy Users' },
  { value: 4.8, suffix: '★', label: 'Average Rating', isDecimal: true },
] as const;

export const WHY_MERAROOM = [
  {
    icon: '✓',
    title: 'Verified Listings',
    description:
      'Every room is manually verified before listing goes live.',
  },
  {
    icon: '💬',
    title: 'Direct WhatsApp Contact',
    description: 'No forms. No waiting. Message owners instantly.',
  },
  {
    icon: '🆓',
    title: 'Completely Free',
    description: 'Searching and contacting owners is always 100% free.',
  },
  {
    icon: '📍',
    title: 'Location Based',
    description:
      'Find rooms near your office, college or preferred area.',
  },
] as const;

export const FOOTER_CITIES = [
  { label: 'Delhi', href: '/search?city=delhi' },
  { label: 'Mumbai', href: '/search?city=mumbai' },
  { label: 'Bangalore', href: '/search?city=bangalore' },
  { label: 'Pune', href: '/search?city=pune' },
  { label: 'Hyderabad', href: '/search?city=hyderabad' },
  { label: 'Jaipur', href: '/search?city=jaipur' },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '#' },
  ],
  explore: [
    { label: 'Search Rooms', href: '/search' },
    { label: 'List Your Room', href: '/dashboard/owner' },
    { label: 'Popular Cities', href: '/search' },
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
    title: 'Search Your City',
    description:
      'Select your city and area to instantly see all available rooms near you.',
    direction: 'left' as const,
  },
  {
    step: '02',
    icon: 'Home',
    title: 'Choose Your Room',
    description:
      'Browse listings with photos, amenities, pricing and location on Google Maps.',
    direction: 'bottom' as const,
  },
  {
    step: '03',
    icon: 'MessageCircle',
    title: 'Contact on WhatsApp',
    description:
      'Directly message the owner on WhatsApp — no middlemen, no delays.',
    direction: 'right' as const,
  },
] as const;

export const MOCK_FEATURED_ROOMS = [
  {
    _id: 'mock-1',
    title: 'Spacious PG Room near Metro',
    rent: 8500,
    area: 'Koramangala',
    city: { name: 'Bangalore', slug: 'bangalore' },
    roomType: 'pg' as const,
    furnishing: 'furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '919876543210',
    amenities: { wifi: true, ac: true, parking: false, attachedBath: true, kitchen: true, laundry: true, tv: false, powerBackup: true, security: true, gym: false },
  },
  {
    _id: 'mock-2',
    title: '1 BHK Fully Furnished Flat',
    rent: 18000,
    area: 'Andheri West',
    city: { name: 'Mumbai', slug: 'mumbai' },
    roomType: '1bhk' as const,
    furnishing: 'furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '919876543211',
    amenities: { wifi: true, ac: true, parking: true, attachedBath: true, kitchen: true, laundry: false, tv: true, powerBackup: true, security: true, gym: false },
  },
  {
    _id: 'mock-3',
    title: 'Single Room for Working Professionals',
    rent: 12000,
    area: 'Hauz Khas',
    city: { name: 'Delhi', slug: 'delhi' },
    roomType: 'single' as const,
    furnishing: 'semi-furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '919876543212',
    amenities: { wifi: true, ac: true, parking: false, attachedBath: true, kitchen: false, laundry: true, tv: false, powerBackup: true, security: true, gym: false },
  },
  {
    _id: 'mock-4',
    title: 'Girls PG with Food Included',
    rent: 9500,
    area: 'Kothrud',
    city: { name: 'Pune', slug: 'pune' },
    roomType: 'pg' as const,
    furnishing: 'furnished' as const,
    images: [],
    isFeatured: false,
    whatsappNumber: '919876543213',
    amenities: { wifi: true, ac: false, parking: false, attachedBath: true, kitchen: true, laundry: true, tv: true, powerBackup: false, security: true, gym: false },
  },
  {
    _id: 'mock-5',
    title: 'Studio Apartment Near IT Park',
    rent: 14000,
    area: 'Gachibowli',
    city: { name: 'Hyderabad', slug: 'hyderabad' },
    roomType: 'studio' as const,
    furnishing: 'furnished' as const,
    images: [],
    isFeatured: true,
    whatsappNumber: '919876543214',
    amenities: { wifi: true, ac: true, parking: true, attachedBath: true, kitchen: true, laundry: false, tv: true, powerBackup: true, security: true, gym: true },
  },
  {
    _id: 'mock-6',
    title: 'Shared Room Near Anna University',
    rent: 6500,
    area: 'Adyar',
    city: { name: 'Chennai', slug: 'chennai' },
    roomType: 'shared' as const,
    furnishing: 'semi-furnished' as const,
    images: [],
    isFeatured: false,
    whatsappNumber: '919876543215',
    amenities: { wifi: true, ac: false, parking: false, attachedBath: false, kitchen: true, laundry: true, tv: false, powerBackup: true, security: true, gym: false },
  },
] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;
