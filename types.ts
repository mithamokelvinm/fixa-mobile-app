
export type UserRole = 'client' | 'provider';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface ServiceProvider extends User {
  category: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  bio: string;
  skills: string[];
  isVerified: boolean;
  distance: number;
  availability: 'online' | 'offline';
}

export interface Booking {
  id: string;
  clientId: string;
  providerId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  time: string;
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid';
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  method: 'M-PESA';
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  receiptNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
