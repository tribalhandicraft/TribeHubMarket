import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { UserCircle, Briefcase, UserPlus, Smartphone, KeyRound, ArrowLeft, ArrowRight, Users, Lock, User, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const { login, loginWithPassword, registerTeamMember, t, artisans } = useStore();
  const navigate = useNavigate();

  // State for Flow
  const [step, setStep] = useState<'role' | 'mobile' | 'otp' | 'password' | 'register_team'>('role');
  
  // Producer OTP Flow State
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Admin/Team Password Flow State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleContext, setRoleContext] = useState<UserRole>('team_member');

  // Team Registration State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    contact: '',
    username: '',
    password: ''
  });

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'producer') {
      setStep('mobile');
    } else if (role === 'team_member') {
        setRoleContext('team_member');
        setStep('password');
    } else if (role === 'admin') {
        // Direct login for Admin (Bypassing password)
        login('admin', { name: 'Super Admin', id: 'admin1', username: 'admin' });
        navigate('/admin');
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

  // --- Team Password Flow ---
  const handlePasswordLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const result = loginWithPassword(username, password);
      
      if (result.success) {
         navigate('/producer'); // Redirect team members to producer/dashboard view
      } else {
          alert(t(result.message || 'invalidCredentials'));
      }
  };

  // --- Team Registration Flow ---
  const handleTeamRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if(regData.username && regData.password && regData.name) {
          registerTeamMember(regData);
          alert(t('registrationSent'));
          setStep('password'); // Back to login
          setRegData({ name: '', email: '', contact: '', username: '', password: '' });
      }
  };

  return (
    <div className="min-h-screen bg-tribal-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-tribal-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Decorative Side */}
        <div className="md:w-2/5 bg-tribal-600 p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/woven.png')]"></div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">{t('welcomeBack')}</h2>
          <p className="opacity-90 relative z-10">{t('signInSub')}</p>
        </div>

        {/* Content Side */}
        <div className="md:w-3/5 p-8 md:p-12">
          
          {step === 'role' && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-8">{t('chooseRole')}</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleRoleSelect('customer')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <UserCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('customerRole')}</h4>
                    <p className="text-sm text-gray-500">{t('customerDesc')}</p>
                  </div>
                </button>

                <div className="relative">
                    <button 
                    onClick={() => handleRoleSelect('producer')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
                    >
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">{t('producerRole')}</h4>
                        <p className="text-sm text-gray-500">{t('producerDesc')}</p>
                    </div>
                    </button>
                    <Link to="/register-producer" className="absolute -bottom-6 right-2 text-xs font-semibold text-tribal-600 hover:text-tribal-800 flex items-center gap-1">
                        {t('registerLink')} <UserPlus size={12}/>
                    </Link>
                </div>
                
                <div className="pt-4"></div>

                {/* Team Member Role */}
                <button 
                  onClick={() => handleRoleSelect('team_member')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('teamMemberRole')}</h4>
                    <p className="text-sm text-gray-500">{t('teamMemberDesc')}</p>
                  </div>
                </button>

                {/* Admin Role */}
                <button 
                  onClick={() => handleRoleSelect('admin')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-tribal-500 hover:bg-tribal-50 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('adminRole')}</h4>
                    <p className="text-sm text-gray-500">{t('adminDesc')}</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {step === 'mobile' && (
            <div className="animate-fade-in">
               <button 
                 onClick={() => setStep('role')} 
                 className="flex items-center gap-1 text-sm text-gray-500 hover:text-tribal-600 mb-6"
               >
                 <ArrowLeft size={16} /> {t('backToRoles')}
               </button>
               
               <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('producerRole')}</h3>
               <p className="text-gray-500 mb-6">Enter your registered mobile number.</p>

               <form onSubmit={handleSendOtp} className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('mobileNum')}</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="tel" 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none text-lg tracking-wide"
                        placeholder="e.g. 9876543210"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Try demo numbers: 9876543210, 9876543211</p>
                 </div>
                 <button 
                   type="submit"
                   className="w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700 transition-colors shadow-lg shadow-tribal-500/30 flex items-center justify-center gap-2"
                 >
                   {t('sendOtp')} <ArrowRight size={20} />
                 </button>
               </form>
            </div>
          )}

          {step === 'otp' && (
             <div className="animate-fade-in">
               <button 
                 onClick={() => setStep('mobile')} 
                 className="flex items-center gap-1 text-sm text-gray-500 hover:text-tribal-600 mb-6"
               >
                 <ArrowLeft size={16} /> Change Mobile Number
               </button>
               
               <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('enterOtp')}</h3>
               <p className="text-gray-500 mb-6">{t('otpSentMsg')} <span className="font-bold text-gray-800">+91 {mobile}</span></p>

               <form onSubmit={handleVerifyOtp} className="space-y-6">
                 <div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none text-lg tracking-widest"
                        placeholder="XXXX"
                        autoFocus
                      />
                    </div>
                 </div>
                 <button 
                   type="submit"
                   className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                 >
                   {t('verifyLogin')} <ArrowRight size={20} />
                 </button>
                 
                 <div className="text-center">
                   <button 
                     type="button" 
                     onClick={handleSendOtp}
                     className="text-sm text-tribal-600 font-medium hover:underline"
                   >
                     Resend OTP
                   </button>
                 </div>
               </form>
            </div>
          )}

          {step === 'password' && (
              <div className="animate-fade-in">
                  <button 
                    onClick={() => setStep('role')} 
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-tribal-600 mb-6"
                  >
                    <ArrowLeft size={16} /> {t('backToRoles')}
                  </button>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {t('teamMemberRole')}
                  </h3>
                  <p className="text-gray-500 mb-6">Enter your username and password.</p>

                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('username')}</label>
                          <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                              <input 
                                  type="text" 
                                  value={username}
                                  onChange={e => setUsername(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                                  placeholder="username"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                          <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                              <input 
                                  type="password" 
                                  value={password}
                                  onChange={e => setPassword(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                                  placeholder="••••••••"
                              />
                          </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700 transition-colors shadow-lg shadow-tribal-500/30"
                      >
                        {t('login')}
                      </button>

                      {roleContext === 'team_member' && (
                          <div className="text-center pt-2">
                              <button type="button" onClick={() => setStep('register_team')} className="text-sm text-tribal-600 font-medium hover:underline">
                                  {t('registerTeam')}
                              </button>
                          </div>
                      )}
                  </form>
              </div>
          )}

          {step === 'register_team' && (
              <div className="animate-fade-in">
                  <button 
                    onClick={() => setStep('password')} 
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-tribal-600 mb-6"
                  >
                    <ArrowLeft size={16} /> {t('backToLogin')}
                  </button>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('registerTeam')}</h3>
                  <p className="text-gray-500 mb-6">Create a new account. Admin approval required.</p>

                  <form onSubmit={handleTeamRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <input 
                             type="text" 
                             placeholder={t('fullName')}
                             required
                             value={regData.name}
                             onChange={e => setRegData({...regData, name: e.target.value})}
                             className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                          />
                          <input 
                             type="text" 
                             placeholder={t('mobileNum')}
                             required
                             value={regData.contact}
                             onChange={e => setRegData({...regData, contact: e.target.value})}
                             className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                          />
                      </div>
                      <input 
                             type="email" 
                             placeholder={t('email')}
                             required
                             value={regData.email}
                             onChange={e => setRegData({...regData, email: e.target.value})}
                             className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                      />
                      <input 
                             type="text" 
                             placeholder={t('username')}
                             required
                             value={regData.username}
                             onChange={e => setRegData({...regData, username: e.target.value})}
                             className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                      />
                      <input 
                             type="password" 
                             placeholder={t('password')}
                             required
                             value={regData.password}
                             onChange={e => setRegData({...regData, password: e.target.value})}
                             className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none"
                      />

                      <button 
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30"
                      >
                        {t('createAccount')}
                      </button>
                  </form>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;