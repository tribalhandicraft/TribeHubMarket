import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Language } from '../types';

const Navbar: React.FC = () => {
  const { language, setLanguage, user, logout, cart, t } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? 'text-tribal-600 font-bold' : 'text-gray-600 hover:text-tribal-600';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-tribal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tribal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
            <span className="text-xl font-bold text-tribal-800 tracking-tight hidden sm:block">
              {t('appName')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>{t('home')}</Link>
            <Link to="/shop" className={isActive('/shop')}>{t('shop')}</Link>
            {user?.role === 'producer' && (
               <Link to="/producer" className={isActive('/producer')}>{t('dashboard')}</Link>
            )}
            {user?.role === 'admin' && (
               <Link to="/admin" className={isActive('/admin')}>Admin</Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-tribal-50 border border-tribal-200 text-tribal-800 text-sm rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-tribal-400"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-tribal-600 transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 hidden lg:block">{user.name}</span>
                <button 
                  onClick={logout} 
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title={t('logout')}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-tribal-600 text-white px-4 py-1.5 rounded-full hover:bg-tribal-700 transition-colors text-sm font-medium shadow-md">
                <UserIcon size={16} />
                <span>{t('login')}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600">{t('home')}</Link>
          <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600">{t('shop')}</Link>
          {user?.role === 'producer' && (
             <Link to="/producer" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600">{t('dashboard')}</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
