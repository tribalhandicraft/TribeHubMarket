import React from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { UserCircle, Briefcase, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate(role === 'producer' ? '/producer' : '/');
  };

  return (
    <div className="min-h-screen bg-tribal-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-tribal-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Decorative Side */}
        <div className="md:w-2/5 bg-tribal-600 p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/woven.png')]"></div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">Welcome Back</h2>
          <p className="opacity-90 relative z-10">Sign in to access the tribal heritage marketplace.</p>
        </div>

        {/* Content Side */}
        <div className="md:w-3/5 p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Choose your role</h3>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('customer')}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <UserCircle size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Customer</h4>
                <p className="text-sm text-gray-500">I want to buy authentic products</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('producer')}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Briefcase size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Producer / Artisan</h4>
                <p className="text-sm text-gray-500">I want to sell my creations</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('admin')}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Administrator</h4>
                <p className="text-sm text-gray-500">Manage platform settings</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
