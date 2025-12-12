import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order, User, Language, UserRole } from '../types';
import { MOCK_PRODUCTS, TRANSLATIONS } from '../constants';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  products: Product[];
  addProduct: (product: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: () => void;
  t: (key: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Fix: Make children optional in props type to avoid "missing in type '{}'" error
export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  const login = (role: UserRole) => {
    const mockUser: User = {
      id: role === 'producer' ? 's1' : 'c1',
      name: role === 'producer' ? 'Ramesh Artisan' : 'Priya Sharma',
      role: role,
      shopName: role === 'producer' ? 'Ramesh Tribal Arts' : undefined,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setCart([]); // simple cleanup
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    if (!user || cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerId: user.id,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      date: new Date().toISOString(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  return (
    <StoreContext.Provider value={{
      language, setLanguage,
      user, login, logout,
      products, addProduct,
      cart, addToCart, removeFromCart, clearCart,
      orders, placeOrder,
      t
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};