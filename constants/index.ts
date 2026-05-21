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
  { label: 'Search', href: '/search' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
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
    step: 1,
    title: 'Search',
    description: 'Browse rooms across top Indian cities with smart filters.',
  },
  {
    step: 2,
    title: 'Connect',
    description: 'Contact owners directly via WhatsApp — no middlemen.',
  },
  {
    step: 3,
    title: 'Move In',
    description: 'Finalize rent, deposit, and move into your perfect room.',
  },
] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;
