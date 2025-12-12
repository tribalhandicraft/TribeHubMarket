export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'guest' | 'customer' | 'producer' | 'admin' | 'team_member';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  shopName?: string; // For producers
  location?: string; // Address
  contact?: string; // Contact Number
  artType?: string; // Type of Art
  // Auth fields for Admin/Team
  username?: string;
  password?: string;
  email?: string;
  isVerified?: boolean; // For team members requiring admin approval
}

export type Category = 
  | 'paintings' 
  | 'handicrafts' 
  | 'statues' 
  | 'minerals' 
  | 'fruits' 
  | 'clothing' 
  | 'instruments' 
  | 'cultural';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: string[]; // Changed from single image string to array
  stock: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  shippingDetails?: ShippingDetails;
  paymentMethod?: PaymentMethod;
}

export interface Translation {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  }
}