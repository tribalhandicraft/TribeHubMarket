export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'guest' | 'customer' | 'producer' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  shopName?: string; // For producers
  location?: string;
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

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export interface Translation {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  }
}