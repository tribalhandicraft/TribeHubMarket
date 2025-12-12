import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../constants';
import { Category, Product } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Sparkles, Upload, Package, DollarSign, Type } from 'lucide-react';

const ProducerDashboard: React.FC = () => {
  const { user, addProduct, products, t, language } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'handicrafts' as Category,
    description: '',
    image: '',
    stock: ''
  });

  if (user?.role !== 'producer') {
    return <div className="p-8 text-center text-red-500">Access Denied. Producer only area.</div>;
  }

  const myProducts = products.filter(p => p.sellerId === user.id);

  const handleAIHelp = async () => {
    if (!formData.title) {
      alert("Please enter a product title first.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.title, formData.category, language);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, image: url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.image) {
      alert("Please fill in required fields");
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      sellerId: user.id,
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      image: formData.image,
      stock: Number(formData.stock) || 1,
    };

    addProduct(newProduct);
    // Reset form
    setFormData({
      title: '',
      price: '',
      category: 'handicrafts',
      description: '',
      image: '',
      stock: ''
    });
    alert("Product added successfully!");
  };

  return (
    <div className="min-h-screen bg-tribal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('dashboard')}</h1>
        <p className="text-gray-600 mb-8">Welcome back, {user.name} ({user.shopName})</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-tribal-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-tribal-800 mb-6 flex items-center gap-2">
                <Package className="text-tribal-500" />
                {t('addProduct')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                      placeholder="e.g. Warli Vase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input 
                      type="number" 
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                      placeholder="Qty"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label[language]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">{t('description')}</label>
                    <button 
                      type="button" 
                      onClick={handleAIHelp}
                      disabled={isGenerating}
                      className="text-xs flex items-center gap-1 text-purple-600 font-medium hover:text-purple-700 bg-purple-50 px-2 py-1 rounded-md transition-colors"
                    >
                      <Sparkles size={12} />
                      {isGenerating ? t('generating') : t('aiHelp')}
                    </button>
                  </div>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none resize-none"
                    placeholder="Describe your authentic product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
                    <div className="space-y-1 text-center">
                      {formData.image ? (
                        <div className="relative">
                          <img src={formData.image} alt="Preview" className="h-32 mx-auto object-cover rounded" />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, image: ''})}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-tribal-600 hover:text-tribal-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700 transition-colors shadow-lg shadow-tribal-500/30"
                >
                  Publish Product
                </button>
              </form>
            </div>
          </div>

          {/* My Products List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">My Listings ({myProducts.length})</h2>
            {myProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {myProducts.map(p => (
                   <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
                     <img src={p.image} alt={p.title} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                     <div className="flex-1">
                       <h3 className="font-semibold text-gray-800">{p.title}</h3>
                       <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                       <div className="mt-2 flex items-center justify-between">
                         <span className="font-bold text-tribal-700">₹{p.price}</span>
                         <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Stock: {p.stock}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                You haven't listed any products yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
