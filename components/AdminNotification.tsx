import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Bell, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminNotification: React.FC = () => {
  const { user, orders, t } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [lastViewedCount, setLastViewedCount] = useState(0);

  const canHandleOrders = user?.role === 'admin' || user?.role === 'team_member';

  // Filter for pending orders
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const latestOrder = pendingOrders[0]; // Assuming newest first

  useEffect(() => {
    if (canHandleOrders) {
      // Show notification if we have pending orders and the count has increased (new order arrived)
      // or if we have pending orders and haven't dismissed the initial check
      if (pendingOrders.length > 0 && pendingOrders.length > lastViewedCount) {
        setIsVisible(true);
        setLastViewedCount(pendingOrders.length);
      }
    } else {
      setIsVisible(false);
    }
  }, [orders, user, lastViewedCount, pendingOrders.length, canHandleOrders]);

  if (!isVisible || !user || !canHandleOrders || pendingOrders.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 animate-bounce-in max-w-md w-full md:w-auto">
      <div className="bg-white rounded-lg shadow-2xl border-l-4 border-tribal-600 p-4 flex items-start gap-4">
        <div className="bg-tribal-100 p-2 rounded-full text-tribal-700 shrink-0">
          <Bell className="w-6 h-6 animate-pulse" />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <h4 className="font-bold text-gray-900 flex items-center justify-between">
            {t('newOrder')}
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              {pendingOrders.length} {t('pending')}
            </span>
          </h4>
          
          <div className="mt-1 text-sm text-gray-600">
            <p className="font-medium">Order #{latestOrder.id.slice(-6)}</p>
            <p>₹{latestOrder.total.toFixed(2)} • {latestOrder.items.length} items</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(latestOrder.date).toLocaleTimeString()}</p>
          </div>

          <div className="mt-3 flex gap-3">
            <Link 
              to="/admin" 
              onClick={() => setIsVisible(false)}
              className="flex-1 bg-tribal-600 text-white text-xs font-semibold py-2 px-3 rounded hover:bg-tribal-700 transition-colors text-center flex items-center justify-center gap-1"
            >
              {t('viewOrders')} <ArrowRight size={14} />
            </Link>
            <button 
              onClick={() => setIsVisible(false)}
              className="px-3 py-2 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              {t('dismiss')}
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => setIsVisible(false)} 
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminNotification;