import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { t, language, products } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-tribal-50">
      {/* Hero Section */}
      <div className="relative bg-tribal-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-tribal-900 via-tribal-800/90 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-tribal-100 mb-8 max-w-xl">
              {t('heroSubtitle')}
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-tribal-500 hover:bg-tribal-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:translate-x-1 shadow-lg shadow-tribal-900/50"
            >
              {t('shop')} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <span className="w-2 h-8 bg-tribal-500 rounded-full block"></span>
          {language === 'en' ? 'Explore Categories' : (language === 'hi' ? 'श्रेणियाँ खोजें' : 'श्रेण्या एक्सप्लोर करा')}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link 
              to={`/shop?category=${cat.id}`} 
              key={cat.id}
              className="group relative overflow-hidden rounded-xl aspect-square bg-white shadow-sm border border-tribal-100 hover:shadow-md transition-all flex flex-col items-center justify-center p-4 text-center"
            >
              <div className="absolute inset-0 bg-tribal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 p-3 bg-tribal-100 rounded-full text-tribal-600 mb-3 group-hover:bg-white group-hover:scale-110 transition-transform">
                {/* Icons based on category logic could go here, simplifying for brevity */}
                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
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

      {/* Featured Products */}
      <div className="bg-white py-16 border-t border-tribal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-8 bg-tribal-500 rounded-full block"></span>
              Featured Items
            </h2>
            <Link to="/shop" className="text-tribal-600 hover:text-tribal-700 font-medium text-sm flex items-center gap-1">
              View All <ArrowRight size={16} />
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
