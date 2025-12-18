import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { UserCircle, Briefcase, UserPlus, Smartphone, KeyRound, ArrowLeft, ArrowRight, Users, Lock, User, ShieldCheck, ShoppingBag, ShieldAlert, Mail, CheckCircle, MapPin } from 'lucide-react';

const Login: React.FC = () => {
  const { login, loginWithPassword, registerTeamMember, requestPasswordReset, t, artisans } = useStore();
  const navigate = useNavigate();

  // State for Flow
  const [step, setStep] = useState<'selection' | 'mobile' | 'otp' | 'password' | 'register_team' | 'forgot_password' | 'reset_success'>('selection');
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  
  // Producer OTP Flow State
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Admin/Team Password Flow State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Password Reset State
  const [resetEmail, setResetEmail] = useState('');

  // Team Registration State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '', // Added address
    username: '',
    password: ''
  });

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'producer') {
      setStep('mobile');
    } else if (role === 'team_member' || role === 'admin') {
        setStep('password');
    } else {
      login(role); // Guest/Customer simple login
      navigate('/');
    }
  };

  // --- Producer OTP Flow ---
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert(t('invalidMobile'));
      return;
    }
    const isRegistered = artisans.some(artisan => artisan.contact === mobile);
    if (!isRegistered) {
      alert("Mobile number not registered. Please register first or use a demo number (e.g. 9876543210).");
      return;
    }
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockOtp);
    setStep('otp');
    alert(`${t('otpSentMsg')} ${mobile}: ${mockOtp}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      const existingArtisan = artisans.find(a => a.contact === mobile);
      if (existingArtisan) {
        login('producer', existingArtisan);
        navigate('/producer');
      } else {
        alert("User record not found.");
      }
    } else {
      alert(t('invalidOtp'));
    }
  };

  // --- Password Flow ---
  const handlePasswordLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const result = loginWithPassword(username, password);
      
      if (result.success) {
         if (activeRole === 'admin' || activeRole === 'team_member') {
            navigate('/admin');
         } else {
            navigate('/producer');
         }
      } else {
          alert(t(result.message || 'invalidCredentials'));
      }
  };

  // --- Reset Password Flow ---
  const handleResetRequest = (e: React.FormEvent) => {
      e.preventDefault();
      const result = requestPasswordReset(resetEmail);
      if (result.success) {
          setStep('reset_success');
      } else {
          alert(t(result.message));
      }
  };

  // --- Team Registration Flow ---
  const handleTeamRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if(regData.username && regData.password && regData.name) {
          registerTeamMember({
              ...regData,
              location: regData.address // Map address to location field
          });
          alert(t('registrationSent'));
          setStep('password');
          setRegData({ name: '', email: '', contact: '', address: '', username: '', password: '' });
      }
  };

  const backToSelection = () => {
      setStep('selection');
      setActiveRole(null);
  };

  const backToPasswordLogin = () => {
      setStep('password');
  };

  return (
    <div className="min-h-screen bg-tribal-50 flex items-stretch overflow-hidden">
      
      {/* LEFT PART: CUSTOMERS & ARTISANS (COMMUNITY) */}
      <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-all duration-500 ${step !== 'selection' && activeRole && ['customer', 'producer'].includes(activeRole) ? 'w-full' : (step !== 'selection' ? 'hidden md:flex opacity-20' : 'w-1/2')}`}>
         <div className="max-w-md w-full">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-tribal-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg mb-4">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Artisans & Shoppers</h2>
                <p className="text-gray-500">Discover authentic crafts or manage your artisan studio.</p>
            </div>

            {step === 'selection' ? (
                <div className="space-y-4">
                    <button 
                        onClick={() => handleRoleSelect('customer')}
                        className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:shadow-md hover:border-tribal-400 transition-all group text-left"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <UserCircle size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">{t('customerRole')}</h4>
                            <p className="text-xs text-gray-500">{t('customerDesc')}</p>
                        </div>
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => handleRoleSelect('producer')}
                            className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:shadow-md hover:border-orange-400 transition-all group text-left"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">{t('producerRole')}</h4>
                                <p className="text-xs text-gray-500">{t('producerDesc')}</p>
                            </div>
                        </button>
                        <Link to="/register-producer" className="absolute -bottom-6 right-2 text-[10px] font-bold uppercase tracking-wider text-tribal-600 hover:text-tribal-800 flex items-center gap-1">
                            {t('registerLink')} <UserPlus size={12}/>
                        </Link>
                    </div>
                </div>
            ) : (activeRole === 'producer' && (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-tribal-100 animate-fade-in">
                    <button onClick={backToSelection} className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-tribal-600 mb-6 uppercase tracking-widest">
                        <ArrowLeft size={14} /> Back
                    </button>

                    {step === 'mobile' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900">{t('producerRole')}</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('mobileNum')}</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                    <input 
                                        type="tel" 
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tribal-500 outline-none text-lg"
                                        placeholder="9876543210"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-tribal-600 text-white py-4 rounded-xl font-bold hover:bg-tribal-700 transition-all shadow-lg shadow-tribal-500/30 flex items-center justify-center gap-2">
                                {t('sendOtp')} <ArrowRight size={20} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900">{t('enterOtp')}</h3>
                            <div>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                    <input 
                                        type="text" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tribal-500 outline-none text-xl tracking-[1em] text-center"
                                        placeholder="••••"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                                {t('verifyLogin')} <ArrowRight size={20} />
                            </button>
                        </form>
                    )}
                </div>
            ))}
         </div>
      </div>

      {/* CENTER DIVIDER */}
      <div className="hidden md:flex items-center justify-center relative w-0">
         <div className="absolute inset-y-0 w-px bg-gray-200"></div>
         <div className="z-10 bg-white p-3 rounded-full border border-gray-200 shadow-sm text-[10px] font-black uppercase text-gray-400">OR</div>
      </div>

      {/* RIGHT PART: ADMIN & TEAM (MANAGEMENT) */}
      <div className={`flex-1 flex flex-col items-center justify-center p-8 bg-tribal-900 text-white transition-all duration-500 ${step !== 'selection' && activeRole && ['admin', 'team_member'].includes(activeRole) ? 'w-full' : (step !== 'selection' ? 'hidden md:flex opacity-20' : 'w-1/2')}`}>
         <div className="max-w-md w-full relative z-10">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg mb-4 backdrop-blur-sm border border-white/20">
                    <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-2">Management & Team</h2>
                <p className="text-tribal-200">Platform operations and administrative controls.</p>
            </div>

            {step === 'selection' ? (
                <div className="space-y-4">
                    <button 
                        onClick={() => handleRoleSelect('team_member')}
                        className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-white/5 bg-white/5 hover:bg-white/10 hover:border-green-500 transition-all group text-left backdrop-blur-sm"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                            <Users size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold">{t('teamMemberRole')}</h4>
                            <p className="text-xs text-tribal-300">{t('teamMemberDesc')}</p>
                        </div>
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => handleRoleSelect('admin')}
                            className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500 transition-all group text-left backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold">System Host</h4>
                                <p className="text-xs text-red-300/80 uppercase tracking-widest font-black">Restricted Access</p>
                            </div>
                        </button>
                    </div>
                </div>
            ) : ((activeRole === 'team_member' || activeRole === 'admin') && (
                <div className="bg-white/5 p-8 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-md animate-fade-in">
                    
                    {/* Header Back Buttons */}
                    {['password', 'register_team', 'forgot_password'].includes(step) ? (
                        <button onClick={backToSelection} className="flex items-center gap-1 text-xs font-bold text-tribal-300 hover:text-white mb-6 uppercase tracking-widest">
                            <ArrowLeft size={14} /> Back
                        </button>
                    ) : step === 'reset_success' ? null : (
                        <button onClick={backToPasswordLogin} className="flex items-center gap-1 text-xs font-bold text-tribal-300 hover:text-white mb-6 uppercase tracking-widest">
                            <ArrowLeft size={14} /> Back to Login
                        </button>
                    )}

                    {step === 'password' ? (
                        <form onSubmit={handlePasswordLogin} className="space-y-6">
                            <h3 className="text-2xl font-bold">
                                {activeRole === 'admin' ? 'Host Authorization' : 'Staff Login'}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-tribal-300 uppercase tracking-widest mb-2">{t('username')}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                                        <input 
                                            type="text" 
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-tribal-400 outline-none"
                                            placeholder="username"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold text-tribal-300 uppercase tracking-widest">{t('password')}</label>
                                        <button 
                                            type="button" 
                                            onClick={() => setStep('forgot_password')}
                                            className="text-[10px] text-tribal-400 hover:text-white uppercase tracking-widest font-bold"
                                        >
                                            {t('forgotPassword')}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-tribal-400 outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className={`w-full py-4 rounded-xl font-bold transition-all shadow-xl ${activeRole === 'admin' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-white text-tribal-900 hover:bg-gray-100'}`}>
                                {activeRole === 'admin' ? 'Authorize Access' : t('login')}
                            </button>
                            
                            {activeRole === 'team_member' && (
                                <button type="button" onClick={() => setStep('register_team')} className="w-full text-xs font-bold text-tribal-300 hover:text-white uppercase tracking-widest mt-2">
                                    {t('registerTeam')}
                                </button>
                            )}
                        </form>
                    ) : step === 'forgot_password' ? (
                        <form onSubmit={handleResetRequest} className="space-y-6 animate-fade-in">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="text-tribal-400" size={24} />
                                </div>
                                <h3 className="text-xl font-bold">{t('forgotPassword')}</h3>
                                <p className="text-xs text-tribal-400 mt-2">No worries! It happens. Enter your registered email to receive a reset link.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-tribal-300 uppercase tracking-widest mb-2">{t('email')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                                    <input 
                                        type="email" 
                                        required
                                        value={resetEmail}
                                        onChange={e => setResetEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-tribal-400 outline-none"
                                        placeholder="your@email.com"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-white text-tribal-900 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center gap-2">
                                {t('sendResetLink')} <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : step === 'reset_success' ? (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{t('resetEmailSent')}</h3>
                            <p className="text-sm text-tribal-300 mb-8 leading-relaxed">Please check your inbox at <span className="text-white font-mono">{resetEmail}</span> for instructions to reset your password.</p>
                            <button onClick={backToPasswordLogin} className="w-full py-4 bg-white/10 border border-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all">
                                {t('backToLogin')}
                            </button>
                        </div>
                    ) : (
                        /* Registration Form - ONLY for Team Member */
                        <form onSubmit={handleTeamRegister} className="space-y-4 animate-fade-in max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            <h3 className="text-xl font-bold mb-4">{t('registerTeam')}</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-tribal-300 uppercase tracking-widest mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                        <input 
                                            type="text" 
                                            placeholder="Jane Doe"
                                            required
                                            value={regData.name}
                                            onChange={e => setRegData({...regData, name: e.target.value})}
                                            className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg outline-none text-sm focus:ring-1 focus:ring-tribal-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-tribal-300 uppercase tracking-widest mb-1">Email ID</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                            <input 
                                                type="email" 
                                                placeholder="jane@work.com"
                                                required
                                                value={regData.email}
                                                onChange={e => setRegData({...regData, email: e.target.value})}
                                                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg outline-none text-sm focus:ring-1 focus:ring-tribal-400"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-tribal-300 uppercase tracking-widest mb-1">Contact</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                                            <input 
                                                type="text" 
                                                placeholder="9876543210"
                                                required
                                                value={regData.contact}
                                                onChange={e => setRegData({...regData, contact: e.target.value})}
                                                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg outline-none text-sm focus:ring-1 focus:ring-tribal-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-tribal-300 uppercase tracking-widest mb-1">Home Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-white/30" size={14} />
                                        <textarea 
                                            placeholder="Full permanent address"
                                            required
                                            value={regData.address}
                                            onChange={e => setRegData({...regData, address: e.target.value})}
                                            rows={2}
                                            className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg outline-none text-sm focus:ring-1 focus:ring-tribal-400 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-tribal-300 uppercase tracking-widest mb-1">Username</label>
                                        <input 
                                            type="text" 
                                            placeholder="jane_staff"
                                            required
                                            value={regData.username}
                                            onChange={e => setRegData({...regData, username: e.target.value})}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg outline-none text-sm focus:ring-1 focus:ring-tribal-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-tribal-300 uppercase tracking-widest mb-1">Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            required
                                            value={regData.password}
                                            onChange={e => setRegData({...regData, password: e.target.value})}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg outline-none text-sm focus:ring-1 focus:ring-tribal-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-900/40 mt-4">
                                {t('createAccount')}
                            </button>
                            <p className="text-[10px] text-center text-tribal-400 mt-2 italic">Submission requires Host approval before access is granted.</p>
                        </form>
                    )}
                </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default Login;