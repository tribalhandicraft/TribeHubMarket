import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

// Simple Warli-inspired SVG pattern component
const WarliDivider = ({ className = "", color = "#ffffff" }: { className?: string; color?: string }) => {
  // SVG encoded for CSS background
  const encodedColor = encodeURIComponent(color);
  const svgBg = `data:image/svg+xml,%3Csvg width='60' height='40' viewBox='0 0 60 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodedColor}'%3E%3Ccircle cx='30' cy='10' r='3' /%3E%3Cpolygon points='30,14 22,24 38,24' /%3E%3Cpolygon points='30,24 22,34 38,34' /%3E%3C/g%3E%3C/svg%3E`;
  
  return (
    <div 
      className={`h-10 w-full ${className}`} 
      style={{ 
        backgroundImage: `url("${svgBg}")`,
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
        backgroundSize: '40px 40px'
      }}
    />
  );
};

const Home: React.FC = () => {
  const { t, language, products } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-tribal-50">
      {/* Hero Section */}
      <div className="relative bg-tribal-900 text-white overflow-hidden">
        {/* Background Image with Warli Theme Overlay */}
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1628151016003-3f11904a08b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-tribal-900 via-tribal-800/90 to-transparent"></div>
             {/* Warli Pattern Overlay */}
             <div className="absolute inset-0 opacity-10" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 30 L30 50 H70 Z M50 70 L30 50 H70 Z' fill='%23ffffff' /%3E%3C/svg%3E")`,
                    backgroundSize: '80px 80px'
                  }}>
             </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 border border-tribal-300 rounded-full text-tribal-100 text-sm font-medium mb-4 backdrop-blur-sm">
                Discover the Spirit of India
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-sans">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-tribal-100 mb-8 max-w-xl">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 bg-tribal-500 hover:bg-tribal-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:translate-x-1 shadow-lg shadow-tribal-900/50"
                >
                  {t('shop')} <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-semibold transition-all"
                >
                  Learn More
                </Link>
            </div>
          </div>
        </div>

        {/* Decorative Divider Bottom */}
        <div className="relative z-10 bg-tribal-800/50 backdrop-blur-sm border-t border-white/10">
            <WarliDivider className="opacity-30" color="#ffffff" />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-tribal-200 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2 relative z-10">
          <span className="w-2 h-8 bg-tribal-500 rounded-full block"></span>
          {language === 'en' ? 'Explore Categories' : (language === 'hi' ? 'श्रेणियाँ खोजें' : 'श्रेण्या एक्सप्लोर करा')}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {CATEGORIES.map((cat) => (
            <Link 
              to={`/shop?category=${cat.id}`} 
              key={cat.id}
              className="group relative overflow-hidden rounded-xl aspect-square bg-white shadow-sm border border-tribal-100 hover:shadow-md transition-all flex flex-col items-center justify-center p-4 text-center"
            >
              {/* Decorative Corner Triangles */}
              <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-l-[30px] border-t-tribal-100 border-l-transparent"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[30px] border-r-[30px] border-b-tribal-100 border-r-transparent"></div>

              <div className="absolute inset-0 bg-tribal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 p-3 bg-tribal-100 rounded-full text-tribal-600 mb-3 group-hover:bg-white group-hover:scale-110 transition-transform shadow-inner">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg font-serif">
                  {cat.label['en'].charAt(0)}
                </div>
              </div>
              <h3 className="relative z-10 font-semibold text-gray-800 group-hover:text-tribal-700">
                {cat.label[language]}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Warli Strip Divider */}
      <div className="bg-tribal-800 py-4 overflow-hidden relative">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]"></div>
         <WarliDivider className="opacity-40 scale-150" color="#fcfaf8" />
      </div>

      {/* Featured Products */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-8 bg-tribal-500 rounded-full block"></span>
              Featured Items
            </h2>
            <Link to="/shop" className="text-tribal-600 hover:text-tribal-700 font-medium text-sm flex items-center gap-1 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;