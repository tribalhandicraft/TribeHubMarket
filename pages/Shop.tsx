import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants';
import { Search, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Shop: React.FC = () => {
  const { products, t, language } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentCategory = searchParams.get('category') || 'all';

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, currentCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-tribal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-tribal-100">
          <h1 className="text-2xl font-bold text-gray-800">{t('shop')}</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             {/* Search */}
             <div className="relative flex-grow sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder={t('search')} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500 focus:bg-white transition-all"
                />
             </div>

             {/* Filter Dropdown */}
             <div className="relative sm:w-48">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <select 
                 value={currentCategory}
                 onChange={(e) => setSearchParams(e.target.value === 'all' ? {} : { category: e.target.value })}
                 className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500 appearance-none cursor-pointer"
               >
                 <option value="all">All Categories</option>
                 {CATEGORIES.map(cat => (
                   <option key={cat.id} value={cat.id}>{cat.label[language]}</option>
                 ))}
               </select>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
             <div className="text-gray-400 mb-4">
               <Search size={48} className="mx-auto opacity-50" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">No products found</h3>
             <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
