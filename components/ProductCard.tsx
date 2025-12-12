import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, t } = useStore();

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-tribal-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-tribal-800 uppercase tracking-wide">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-xl font-bold text-tribal-700">₹{product.price}</span>
          <button 
            onClick={() => addToCart(product)}
            className="flex items-center gap-1 bg-tribal-100 text-tribal-800 px-3 py-1.5 rounded-lg hover:bg-tribal-600 hover:text-white transition-all text-sm font-medium"
          >
            <Plus size={16} />
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
