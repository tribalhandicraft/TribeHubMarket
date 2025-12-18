import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../constants';
import { Category, Product } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Sparkles, Upload, Package, DollarSign, Type, X, AlertTriangle, ShieldAlert } from 'lucide-react';

const ProducerDashboard: React.FC = () => {
  const { user, addProduct, products, t, language, artisans } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Refresh current user's verified status from global artisans list if needed
  const currentUserData = artisans.find(a => a.id === user?.id) || user;
  const isVerified = currentUserData?.isVerified;

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'handicrafts' as Category,
    description: '',
    images: [] as string[],
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
    if (e.target.files) {
      const newImages: string[] = [];
      Array.from(e.target.files).forEach((file: File) => {
          newImages.push(URL.createObjectURL(file));
      });
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
      setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Verification Pending: You can only publish products after the Host approves your account.");
      return;
    }
    if (!formData.title || !formData.price || formData.images.length === 0) {
      alert("Please fill in required fields and upload at least one image.");
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      sellerId: user.id,
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      images: formData.images,
      stock: Number(formData.stock) || 1,
      reviews: []
    };

    addProduct(newProduct);
    setFormData({
      title: '',
      price: '',
      category: 'handicrafts',
      description: '',
      images: [],
      stock: ''
    });
    alert("Product added successfully!");
  };

  return (
    <div className="min-h-screen bg-tribal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('dashboard')}</h1>
        <p className="text-gray-600 mb-8">{t('welcomeBackUser')}, {user.name} ({user.shopName})</p>

        {/* Verification Status Banner */}
        {!isVerified && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl shadow-sm mb-8 flex flex-col md:flex-row items-center gap-6">
             <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                <ShieldAlert size={32} />
             </div>
             <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-orange-800 mb-1">Verification Pending</h3>
                <p className="text-orange-700 text-sm">The platform Host is currently reviewing your application. You can fill out product details now, but publishing is restricted until your account is approved.</p>
             </div>
             <div className="text-xs font-black uppercase tracking-widest text-orange-400 bg-white px-3 py-1 rounded-full border border-orange-200">
               Status: Under Review
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className={`bg-white rounded-xl shadow-md border border-tribal-100 p-6 sticky top-24 ${!isVerified && 'opacity-70 grayscale-[0.5]'}`}>
              <h2 className="text-xl font-bold text-tribal-800 mb-6 flex items-center gap-2">
                <Package className="text-tribal-500" />
                {t('addProduct')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('prodTitle')}</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('price')}</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('stock')}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('prodImage')}</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-tribal-600 hover:text-tribal-500 focus-within:outline-none">
                                <span>{t('uploadFile')}</span>
                                <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>
                    </div>
                  </div>
                  
                  {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                          {formData.images.map((img, idx) => (
                              <div key={idx} className="relative aspect-square">
                                  <img src={img} alt="Preview" className="w-full h-full object-cover rounded-md" />
                                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                                      <X size={12} />
                                  </button>
                              </div>
                          ))}
                      </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={`w-full py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${isVerified ? 'bg-tribal-600 text-white hover:bg-tribal-700 shadow-tribal-500/30' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  {!isVerified && <Lock size={18} />}
                  {t('publishProd')}
                </button>
              </form>
            </div>
          </div>

          {/* My Products List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">{t('myListings')} ({myProducts.length})</h2>
            {myProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {myProducts.map(p => (
                   <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
                     <img src={p.images[0]} alt={p.title} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                     <div className="flex-1">
                       <h3 className="font-semibold text-gray-800">{p.title}</h3>
                       <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                       <div className="mt-2 flex items-center justify-between">
                         <span className="font-bold text-tribal-700">₹{p.price}</span>
                         <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{t('stock')}: {p.stock}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                {t('noListings')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;