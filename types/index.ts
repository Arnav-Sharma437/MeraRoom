import type {
  RoomType,
  Furnishing,
  GenderPreference,
  RoomStatus,
  IRoomAmenities,
  IRoomAllowedFor,
} from '@/models/Room';
import type { UserRole } from '@/models/User';

export type { RoomType, Furnishing, GenderPreference, RoomStatus, UserRole };
export type { IRoomAmenities, IRoomAllowedFor };

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  savedRooms: string[];
  createdAt: string;
}

export interface Room {
  _id: string;
  owner: string | User;
  title: string;
  description: string;
  rent: number;
  deposit: number;
  city: string | City;
  area: string;
  address: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  roomType: RoomType;
  furnishing: Furnishing;
  gender: GenderPreference;
  amenities: IRoomAmenities;
  allowedFor: IRoomAllowedFor;
  whatsappNumber: string;
  status: RoomStatus;
  isFeatured: boolean;
  isAvailable: boolean;
  views: number;
  createdAt: string;
}

export interface City {
  _id: string;
  name: string;
  slug: string;
  state: string;
  image: string;
  isActive: boolean;
  totalRooms: number;
}

export interface Inquiry {
  _id: string;
  room: string | Room;
  user: string | User;
  message: string;
  phone: string;
  createdAt: string;
}

export interface RoomFilters {
  city?: string;
  area?: string;
  minRent?: number;
  maxRent?: number;
  roomType?: RoomType | RoomType[];
  furnishing?: Furnishing | Furnishing[];
  gender?: GenderPreference;
  amenities?: Partial<IRoomAmenities>;
  allowedFor?: Partial<IRoomAllowedFor>;
  isAvailable?: boolean;
  search?: string;
}

export interface SearchParams {
  city?: string;
  area?: string;
  minRent?: string;
  maxRent?: string;
  roomType?: string;
  furnishing?: string;
  gender?: string;
  page?: string;
  limit?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

export interface RoomFormData {
  title: string;
  description: string;
  rent: number;
  deposit: number;
  city: string;
  area: string;
  address: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  roomType: RoomType;
  furnishing: Furnishing;
  gender: GenderPreference;
  amenities: IRoomAmenities;
  allowedFor: IRoomAllowedFor;
  whatsappNumber: string;
}

export interface UploadResponse {
  url: string;
  publicId: string;
}

export interface AmenityItem {
  key: keyof IRoomAmenities;
  label: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}
