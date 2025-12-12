import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, CheckCircle, Truck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, placeOrder, t, orders } = useStore();
  const [step, setStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = total * 0.05; // 5% GST
  const finalTotal = total + gst;

  // Simulate payment processing
  const handleCheckout = () => {
    setStep('shipping');
  };

  const handlePayment = () => {
    // Simulate API call
    setTimeout(() => {
        placeOrder();
        setStep('success');
    }, 1500);
  };

  if (step === 'success') {
      const lastOrder = orders[0];
      return (
          <div className="min-h-screen bg-tribal-50 flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                      <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">{t('orderSuccess')}</h2>
                  <p className="text-gray-500">
                      Thank you for supporting tribal artisans. Your order ID is <span className="font-mono font-bold text-black">{lastOrder?.id}</span>.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg text-left text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span className="font-semibold">7 Days</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Courier:</span>
                        <span className="font-semibold">TribalExpress</span>
                    </div>
                  </div>
                  <Link to="/shop" className="block w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700">
                      Continue Shopping
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-tribal-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <ShoppingBag className="text-tribal-600" />
            {step === 'cart' ? t('cart') : 'Secure Checkout'}
        </h1>

        {cart.length === 0 && step === 'cart' ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm">
            <p className="text-xl text-gray-500 mb-6">{t('emptyCart')}</p>
            <Link to="/shop" className="inline-block bg-tribal-600 text-white px-6 py-2 rounded-lg hover:bg-tribal-700">
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cart Items or Address Form */}
            <div className="lg:col-span-2 space-y-6">
                {step === 'cart' ? (
                    <div className="bg-white rounded-xl shadow-sm border border-tribal-100 overflow-hidden">
                        {cart.map(item => (
                            <div key={item.id} className="p-4 flex gap-4 border-b border-gray-100 last:border-0">
                                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-tribal-700">₹{item.price * item.quantity}</span>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-tribal-100 p-6 space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin size={20} className="text-tribal-600" /> Shipping Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" className="col-span-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" />
                            <input type="text" placeholder="Address Line 1" className="col-span-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" />
                            <input type="text" placeholder="City" className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" />
                            <input type="text" placeholder="Pincode" className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" />
                            <input type="text" placeholder="Phone" className="col-span-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" />
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-tribal-100 p-6 sticky top-24">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Order Summary</h3>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>GST (5%)</span>
                            <span>₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-xl text-tribal-800">
                            <span>{t('total')}</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {step === 'cart' ? (
                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700 transition-colors shadow-lg shadow-tribal-500/20"
                        >
                            {t('checkout')}
                        </button>
                    ) : (
                        <button 
                            onClick={handlePayment}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                        >
                           <Truck size={20} /> Pay & {t('placeOrder')}
                        </button>
                    )}
                    
                    <div className="mt-4 text-xs text-center text-gray-400">
                        Secure SSL Encryption. All cards accepted.
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
