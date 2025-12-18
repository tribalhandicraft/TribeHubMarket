import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Truck, CheckCircle, Clock, MapPin, Search, Building, Save, AlertCircle, CreditCard, Users, Phone, Palette, XCircle, UserCheck, LayoutDashboard, ShoppingBag, BarChart3, TrendingUp, Trash2, ShieldCheck, Lock, User as UserIcon, Calendar, UserMinus, UserPlus } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, orders, updateOrderStatus, t, artisans, teamMembers, verifyTeamMember, approveArtisan, deleteArtisan, products, deleteProduct } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'bank' | 'producers' | 'team'>('overview');

  const isAdmin = user?.role === 'admin';
  const isTeam = user?.role === 'team_member';

  // Bank Form State
  const [bankData, setBankData] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    upi: ''
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  if (!isAdmin && !isTeam) {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied: Authorized Personnel Only</div>;
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1500);
  };

  const handleDeleteProduct = (id: string) => {
    if(!isAdmin) {
        alert("Only the Host can delete products.");
        return;
    }
    if(window.confirm(t('confirmDelete'))) {
        deleteProduct(id);
    }
  };

  const pendingArtisans = artisans.filter(a => !a.isVerified);
  const verifiedArtisans = artisans.filter(a => a.isVerified);
  const pendingTeamMembers = teamMembers.filter(m => !m.isVerified);
  
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
               {isAdmin ? <ShieldCheck size={32} className="text-tribal-600" /> : <Users size={32} className="text-tribal-600" />}
               {isAdmin ? t('adminDashboard') : 'Management Console'}
            </h1>
            <p className="text-gray-500 mt-1">{isAdmin ? t('adminSub') : 'Handle all customer orders and inventory operations.'}</p>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start md:self-auto overflow-x-auto">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'bg-tribal-100 text-tribal-800 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <LayoutDashboard size={16} /> {t('overview')}
            </button>
            <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'orders' ? 'bg-tribal-100 text-tribal-800 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Package size={16} /> {t('orders')}
            </button>
            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'inventory' ? 'bg-tribal-100 text-tribal-800 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <ShoppingBag size={16} /> {t('inventory')}
            </button>
            <button onClick={() => setActiveTab('producers')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'producers' ? 'bg-tribal-100 text-tribal-800 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Users size={16} /> {t('producers')}
            </button>
            
            {isAdmin && (
              <>
                <button onClick={() => setActiveTab('team')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'team' ? 'bg-tribal-100 text-tribal-800 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <UserCheck size={16} /> {t('teamManagement')}
                </button>
                <button onClick={() => setActiveTab('bank')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'bank' ? 'bg-tribal-100 text-tribal-800 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Building size={16} /> {t('bankDetails')}
                </button>
              </>
            )}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{t('totalRevenue')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{t('totalOrders')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{t('activeProducts')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{activeProducts}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{t('avgOrderValue')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹{avgOrderValue.toFixed(0)}</h3>
                        </div>
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                   <h3 className="font-bold text-gray-900">{t('recentActivity')}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                   {orders.slice(0, 5).map(order => (
                       <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                           <div className="flex items-center gap-4">
                               <div className="p-2 bg-gray-100 rounded-lg">
                                   <Package size={20} className="text-gray-500"/>
                               </div>
                               <div>
                                   <p className="font-semibold text-gray-800">Order #{order.id.slice(-6)}</p>
                                   <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className="font-bold text-gray-900">₹{order.total}</p>
                               <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>{order.status}</span>
                           </div>
                       </div>
                   ))}
                   {orders.length === 0 && <div className="p-8 text-center text-gray-500">No recent activity.</div>}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in">
             <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                 <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 min-w-[200px]">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Clock size={24}/></div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</div>
                        <div className="text-xs text-gray-500 font-medium uppercase">{t('pendingOrders')}</div>
                    </div>
                 </div>
                 <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 min-w-[200px]">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle size={24}/></div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'delivered').length}</div>
                        <div className="text-xs text-gray-500 font-medium uppercase">{t('completedOrders')}</div>
                    </div>
                 </div>
             </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Package className="text-tribal-600" size={20} />
                  {t('orderManagement')}
                </h2>
                <div className="relative hidden sm:block">
                  <input type="text" placeholder={t('search')} className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  {t('noOrders')}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-3 space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Package size={16} className="text-tribal-500" />
                                <span className="font-mono font-bold text-gray-900 text-base">{order.id}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${getStatusColor(order.status)} uppercase tracking-widest`}>
                                {order.status}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} /> {new Date(order.date).toLocaleDateString()}
                                </span>
                            </div>
                          </div>
                          <div className="pt-2">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Items Summary</p>
                             <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="text-xs text-gray-600 flex justify-between">
                                        <span className="truncate max-w-[150px]">{item.quantity}x {item.title}</span>
                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                             </div>
                             <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-900">{t('total')}</span>
                                <span className="text-sm font-black text-tribal-700">₹{order.total.toFixed(2)}</span>
                             </div>
                          </div>
                        </div>

                        <div className="lg:col-span-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <MapPin size={12} className="text-tribal-600" /> Shipping & Contact Details
                            </h4>
                            {order.shippingDetails ? (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <UserIcon size={14} className="text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{order.shippingDetails.fullName}</p>
                                            <p className="text-[10px] text-gray-400">Customer ID: {order.customerId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin size={14} className="text-gray-400 mt-0.5" />
                                        <div className="text-xs text-gray-600 leading-relaxed">
                                            <p>{order.shippingDetails.address}</p>
                                            <p>{order.shippingDetails.city}, {order.shippingDetails.pincode}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone size={14} className="text-gray-400 mt-0.5" />
                                        <p className="text-xs font-semibold text-gray-700">{order.shippingDetails.phone}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No shipping details provided.</p>
                            )}
                            <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard size={12} className="text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{order.paymentMethod || 'COD'}</span>
                                </div>
                                <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Standard Delivery</span>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col justify-center gap-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center lg:text-left">Operational Actions</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                            {order.status === 'pending' && (
                                <>
                                <button onClick={() => updateOrderStatus(order.id, 'processing')} className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-3 py-2.5 rounded-lg hover:bg-blue-700 text-xs font-bold transition-all shadow-sm">
                                    <Package size={14} /> Mark as Processing
                                </button>
                                <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-600 px-3 py-2.5 rounded-lg hover:bg-red-50 text-xs font-bold transition-all">
                                    <XCircle size={14} /> {isAdmin ? 'Cancel Order' : 'Report Issue'}
                                </button>
                                </>
                            )}
                            {order.status === 'processing' && (
                                <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white px-3 py-2.5 rounded-lg hover:bg-purple-700 text-xs font-bold transition-all shadow-sm">
                                <Truck size={14} /> Ready to Ship
                                </button>
                            )}
                            {order.status === 'shipped' && (
                                <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-3 py-2.5 rounded-lg hover:bg-green-700 text-xs font-bold transition-all shadow-sm">
                                <CheckCircle size={14} /> Confirm Delivery
                                </button>
                            )}
                            <button className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-xs font-bold transition-all">
                                <Search size={14} /> Full Audit Log
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingBag className="text-tribal-600" size={20} />
                        {t('activeProducts')}
                    </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {t('noProducts')}
                        </div>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <img src={product.images[0]} alt={product.title} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{product.title}</h3>
                                        <p className="text-sm text-gray-500">Seller: {artisans.find(a => a.id === product.sellerId)?.name || 'Unknown'}</p>
                                        <p className="text-xs text-tribal-600 font-semibold uppercase">{product.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">₹{product.price}</p>
                                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                    </div>
                                    {isAdmin ? (
                                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t('delete')}>
                                            <Trash2 size={18} />
                                        </button>
                                    ) : (
                                        <div className="p-2 text-gray-300" title="Host Only Action">
                                            <Lock size={18} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
        )}

        {activeTab === 'producers' && (
          <div className="space-y-8 animate-fade-in">
            {/* Pending Applications Section */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
              <div className="p-6 border-b border-orange-100 flex justify-between items-center bg-orange-50/30">
                <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2">
                  <UserPlus className="text-orange-600" size={20} />
                  Pending Applications ({pendingArtisans.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {pendingArtisans.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 bg-gray-50/30">
                    No pending artisan applications.
                  </div>
                ) : (
                  pendingArtisans.map(artisan => (
                    <div key={artisan.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <img src={artisan.avatar || 'https://via.placeholder.com/150'} alt={artisan.name} className="w-20 h-20 rounded-full object-cover border-2 border-orange-100 shadow-sm" />
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                           <h3 className="font-bold text-gray-900 text-lg">{artisan.name}</h3>
                           <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">New Applicant</span>
                        </div>
                        <p className="text-tribal-600 font-semibold">{artisan.shopName}</p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded"><Palette size={14} className="text-gray-400" /> <span className="font-medium">{artisan.artType}</span></div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded"><MapPin size={14} className="text-gray-400" /> {artisan.location}</div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded"><Phone size={14} className="text-gray-400" /> {artisan.contact}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <button onClick={() => approveArtisan(artisan.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-700 transition-all shadow-sm flex items-center justify-center gap-1.5">
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button onClick={() => deleteArtisan(artisan.id)} className="border border-red-200 text-red-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-1.5">
                          <XCircle size={14} /> Deny
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Verified Artisans Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <UserCheck className="text-green-600" size={20} />
                  Verified Artisans ({verifiedArtisans.length})
                </h2>
                <div className="relative hidden sm:block">
                  <input type="text" placeholder={t('search')} className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {verifiedArtisans.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    No verified producers yet.
                  </div>
                ) : (
                  verifiedArtisans.map(artisan => (
                    <div key={artisan.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <img src={artisan.avatar || 'https://via.placeholder.com/150'} alt={artisan.name} className="w-20 h-20 rounded-full object-cover border-2 border-green-100 shadow-sm" />
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                           <h3 className="font-bold text-gray-900 text-lg">{artisan.name}</h3>
                           <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Verified Partner</span>
                        </div>
                        <p className="text-tribal-600 font-semibold">{artisan.shopName}</p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded"><Palette size={14} className="text-gray-400" /> <span className="font-medium">{artisan.artType}</span></div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded"><MapPin size={14} className="text-gray-400" /> {artisan.location}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                         <button onClick={() => { if(window.confirm('Remove this artisan? Their products will also be deleted.')) deleteArtisan(artisan.id); }} className="text-xs text-red-500 border border-red-100 px-3 py-2 rounded-lg hover:bg-red-50 font-bold flex items-center justify-center gap-1.5 transition-colors">
                            <UserMinus size={14} /> Remove Artisan
                         </button>
                         <button className="text-xs border border-gray-300 rounded-lg py-2 px-3 hover:bg-gray-50 text-gray-600 font-bold transition-colors">
                           {t('viewDetails')}
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {isAdmin && activeTab === 'team' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <UserCheck className="text-tribal-600" size={20} />
                        {t('pendingApprovals')}
                    </h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {pendingTeamMembers.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {t('noPendingTeam')}
                        </div>
                    ) : (
                        pendingTeamMembers.map(member => (
                            <div key={member.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                                    <div className="text-sm text-gray-500 space-y-1 mt-1">
                                        <div className="flex items-center gap-2"><Users size={14}/> {member.username}</div>
                                        <div className="flex items-center gap-2"><Phone size={14}/> {member.contact}</div>
                                        <div className="flex items-center gap-2">@{member.email}</div>
                                    </div>
                                </div>
                                <button onClick={() => verifyTeamMember(member.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 shadow-sm">
                                    <CheckCircle size={18} /> {t('approve')}
                                </button>
                            </div>
                        ))
                    )}
                    {teamMembers.filter(m => m.isVerified).length > 0 && (
                        <div className="p-4 bg-gray-50 text-xs font-semibold text-gray-500 border-t border-gray-200 uppercase tracking-wide">
                            {t('approved')} Members
                        </div>
                    )}
                     {teamMembers.filter(m => m.isVerified).map(member => (
                        <div key={member.id} className="p-4 px-6 flex items-center justify-between opacity-75">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">{member.name.charAt(0)}</div>
                                <div>
                                    <div className="font-medium text-gray-900">{member.name}</div>
                                    <div className="text-xs text-gray-500">{member.username}</div>
                                </div>
                             </div>
                             <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">Active</span>
                        </div>
                     ))}
                </div>
             </div>
        )}

        {isAdmin && activeTab === 'bank' && (
          <div className="max-w-2xl mx-auto">
             <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-tribal-600 px-6 py-4 border-b border-tribal-700">
                   <h2 className="text-xl font-bold text-white flex items-center gap-2">
                     <Building className="text-tribal-100" /> {t('bankTitle')}
                   </h2>
                   <p className="text-tribal-100 text-sm mt-1">{t('bankSub')}</p>
                </div>
                <form onSubmit={handleBankSubmit} className="p-8 space-y-6">
                   {saveStatus === 'success' && (
                     <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
                       <CheckCircle size={20} /> Bank details updated successfully.
                     </div>
                   )}
                   <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('accHolder')}</label>
                        <input type="text" required value={bankData.accountName} onChange={e => setBankData({...bankData, accountName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none transition-all" placeholder="e.g. Tribal Heritage Association" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('bankName')}</label>
                          <input type="text" required value={bankData.bankName} onChange={e => setBankData({...bankData, bankName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none" placeholder="e.g. State Bank of India" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('ifsc')}</label>
                          <input type="text" required value={bankData.ifsc} onChange={e => setBankData({...bankData, ifsc: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none uppercase" placeholder="SBIN0001234" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('accNumber')}</label>
                        <input type="text" required value={bankData.accountNumber} onChange={e => setBankData({...bankData, accountNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300"></div></div>
                        <div className="relative flex justify-center"><span className="px-2 bg-white text-sm text-gray-500">{t('optional')}</span></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('bankUpi')}</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="text" value={bankData.upi} onChange={e => setBankData({...bankData, upi: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none" placeholder="username@upi" />
                        </div>
                      </div>
                   </div>
                   <div className="pt-4 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg max-w-xs"><AlertCircle size={16} className="shrink-0" /> Details will be encrypted securely.</div>
                     <button type="submit" disabled={saveStatus === 'saving'} className="bg-tribal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-tribal-700 transition-colors shadow-lg shadow-tribal-600/20 flex items-center gap-2 disabled:opacity-70">
                        <Save size={18} /> {saveStatus === 'saving' ? t('saving') : t('saveDetails')}
                     </button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;