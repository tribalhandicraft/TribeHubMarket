import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Camera, Edit2, Save, X } from 'lucide-react';

const About: React.FC = () => {
  const { t, user } = useStore();
  const isAdmin = user?.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);

  // State for Founder Image and Details
  const [founderImage, setFounderImage] = useState("https://placehold.co/400x400/e2e8f0/475569?text=Sachin+Katkari");
  const [founder, setFounder] = useState({
    name: "Sachin Katkari",
    role: "Founder & CEO",
    phone: "+91 72767 19148",
    bio1: "TribalHeritage was born from a simple journey to the heart of Bastar, where I witnessed art that breathed history and culture.",
    bio2: "Our mission is not just to sell products, but to tell stories. Every artifact on this platform carries the soul of its creator."
  });

  // State for Contact Information
  const [contactInfo, setContactInfo] = useState({
    email: "hello@tribalheritage.com",
    phone: "+91 98765 43210",
    address: "123 Heritage Lane, Arts District,\nNew Delhi, India 110001"
  });

  // State for Team Members
  const [team, setTeam] = useState([
    {
      name: "Sarah Jenkins",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      email: "sarah.j@tribalheritage.com",
      phone: "+91 98765 00001",
      address: "Mumbai, Maharashtra",
      bio: "Expert in supply chain management with 10 years working with rural artisans."
    },
    {
      name: "Amit Patel",
      role: "Tech Lead",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      email: "amit.p@tribalheritage.com",
      phone: "+91 98765 00002",
      address: "Bangalore, Karnataka",
      bio: "Tech enthusiast passionate about bringing digital equity to remote areas."
    },
    {
      name: "Priya Singh",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      email: "priya.s@tribalheritage.com",
      phone: "+91 98765 00003",
      address: "New Delhi, Delhi",
      bio: "Social worker dedicated to tribal welfare and cultural preservation."
    },
    {
       name: "Rahul Verma",
       role: "Head of Marketing",
       image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
       email: "rahul.v@tribalheritage.com",
       phone: "+91 98765 00004",
       address: "Pune, Maharashtra",
       bio: "Digital marketing specialist focusing on ethical brands."
    }
  ]);

  // Logic to hide contact details for Producer and Customer roles
  const hideContactDetails = user?.role === 'producer' || user?.role === 'customer';

  const handleImageUpdate = (e: React.ChangeEvent<HTMLInputElement>, index: number | 'founder') => {
    if (e.target.files && e.target.files[0]) {
      const newUrl = URL.createObjectURL(e.target.files[0]);
      
      if (index === 'founder') {
        setFounderImage(newUrl);
      } else {
        const updatedTeam = [...team];
        updatedTeam[index as number].image = newUrl;
        setTeam(updatedTeam);
      }
    }
  };

  const handleTeamUpdate = (index: number, field: string, value: string) => {
      const updatedTeam = [...team];
      updatedTeam[index] = { ...updatedTeam[index], [field]: value };
      setTeam(updatedTeam);
  };

  return (
    <div className="min-h-screen bg-tribal-50 relative">
      
      {/* Admin Edit Toggle */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-xl font-bold transition-all transform hover:scale-105 ${
              isEditing ? 'bg-green-600 text-white' : 'bg-tribal-600 text-white'
            }`}
          >
            {isEditing ? (
              <><Save size={20} /> Save Changes</>
            ) : (
              <><Edit2 size={20} /> Edit Content</>
            )}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-tribal-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]"></div>
        <h1 className="text-4xl md:text-5xl font-bold relative z-10 font-serif mb-4">{t('aboutUs')}</h1>
        <p className="text-tribal-100 max-w-2xl mx-auto relative z-10 text-lg">
          {t('aboutHeaderSub')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Owner Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-2xl shadow-sm border border-tribal-100 p-8 md:p-12 relative overflow-hidden">
           {isEditing && <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">Editing Mode</div>}
           
           <div className="w-full md:w-1/3 flex flex-col items-center text-center">
              <div className="w-48 h-48 rounded-full border-4 border-tribal-200 overflow-hidden mb-6 relative shadow-lg group bg-gray-100">
                 <img 
                   src={founderImage} 
                   alt={founder.name} 
                   className="w-full h-full object-cover"
                 />
                 
                 {/* Admin Only: Change Photo Button */}
                 {isAdmin && (
                   <label className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity cursor-pointer ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className="text-white flex flex-col items-center gap-1">
                        <Camera size={24} />
                        <span className="text-xs font-semibold">Change Photo</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpdate(e, 'founder')}
                      />
                   </label>
                 )}
              </div>
              
              {isEditing ? (
                  <div className="w-full space-y-2">
                      <input 
                        type="text" 
                        value={founder.name}
                        onChange={(e) => setFounder({...founder, name: e.target.value})}
                        className="w-full text-center border border-gray-300 rounded p-1 font-bold text-gray-900"
                        placeholder="Founder Name"
                      />
                      <input 
                        type="text" 
                        value={founder.role}
                        onChange={(e) => setFounder({...founder, role: e.target.value})}
                        className="w-full text-center border border-gray-300 rounded p-1 text-tribal-600 font-medium"
                        placeholder="Role"
                      />
                  </div>
              ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900">{founder.name}</h2>
                    <p className="text-tribal-600 font-medium">{founder.role}</p>
                  </>
              )}
              
              <div className="mt-3 flex items-center justify-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm w-full">
                  <Phone size={16} className="text-tribal-500 shrink-0" />
                  {isEditing ? (
                      <input 
                        type="text" 
                        value={founder.phone}
                        onChange={(e) => setFounder({...founder, phone: e.target.value})}
                        className="bg-transparent border-b border-gray-300 text-center focus:outline-none w-full"
                      />
                  ) : (
                      <span className="font-semibold text-sm">{founder.phone}</span>
                  )}
              </div>
           </div>
           
           <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold text-tribal-800 mb-6 font-serif">{t('founderMessage')}</h3>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                {isEditing ? (
                    <>
                        <textarea 
                            value={founder.bio1}
                            onChange={(e) => setFounder({...founder, bio1: e.target.value})}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-tribal-500 outline-none"
                            rows={3}
                        />
                        <textarea 
                            value={founder.bio2}
                            onChange={(e) => setFounder({...founder, bio2: e.target.value})}
                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-tribal-500 outline-none"
                            rows={3}
                        />
                    </>
                ) : (
                    <>
                        <p>"{founder.bio1}"</p>
                        <p>"{founder.bio2}"</p>
                    </>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4">
                 <div className="text-tribal-500 font-script text-3xl opacity-80" style={{ fontFamily: 'cursive' }}>
                    {founder.name}
                 </div>
              </div>
           </div>
        </div>

        {/* Team Section */}
        <div>
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('ourTeam')}</h2>
             <div className="w-16 h-1 bg-tribal-500 mx-auto rounded-full"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-tribal-50 group flex flex-col relative">
                   {isEditing && <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 z-20">Edit</div>}
                   
                   <div className="h-64 overflow-hidden relative bg-gray-100">
                     <div className={`absolute inset-0 bg-tribal-900/0 transition-colors z-10 pointer-events-none ${!isEditing && 'group-hover:bg-tribal-900/20'}`}></div>
                     <img src={member.image} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                     
                     {/* Admin Only: Change Photo Button */}
                     {isAdmin && (
                       <label className={`absolute top-2 right-2 z-20 bg-white/90 p-2 rounded-full shadow-md cursor-pointer hover:bg-white text-tribal-600 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                          <Camera size={18} />
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageUpdate(e, index)}
                          />
                       </label>
                     )}
                   </div>
                   <div className="p-6 flex flex-col flex-1">
                     <div className="mb-4 text-center w-full">
                        {isEditing ? (
                            <div className="space-y-2 mb-2">
                                <input 
                                    type="text" 
                                    value={member.name}
                                    onChange={(e) => handleTeamUpdate(index, 'name', e.target.value)}
                                    className="w-full text-center border border-gray-300 rounded text-sm font-bold"
                                    placeholder="Name"
                                />
                                <input 
                                    type="text" 
                                    value={member.role}
                                    onChange={(e) => handleTeamUpdate(index, 'role', e.target.value)}
                                    className="w-full text-center border border-gray-300 rounded text-xs text-tribal-600"
                                    placeholder="Role"
                                />
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                <p className="text-tribal-600 font-medium text-sm">{member.role}</p>
                            </>
                        )}
                     </div>
                     
                     <div className="mb-6 flex-grow">
                        {isEditing ? (
                             <textarea 
                                value={member.bio}
                                onChange={(e) => handleTeamUpdate(index, 'bio', e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 text-xs h-24"
                                placeholder="Bio..."
                             />
                        ) : (
                             <p className="text-gray-600 text-sm italic text-center leading-relaxed line-clamp-4">"{member.bio}"</p>
                        )}
                     </div>

                     {/* Contact Details Section */}
                     {(!hideContactDetails || isEditing) && (
                        <div className="mt-auto space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-600 animate-fade-in">
                            <div className="flex items-center gap-2.5">
                              <Mail size={15} className="text-tribal-500 shrink-0"/> 
                              {isEditing ? (
                                  <input 
                                    type="text" 
                                    value={member.email}
                                    onChange={(e) => handleTeamUpdate(index, 'email', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-1 text-xs"
                                  />
                              ) : (
                                  <span className="truncate" title={member.email}>{member.email}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Phone size={15} className="text-tribal-500 shrink-0"/> 
                              {isEditing ? (
                                  <input 
                                    type="text" 
                                    value={member.phone}
                                    onChange={(e) => handleTeamUpdate(index, 'phone', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-1 text-xs"
                                  />
                              ) : (
                                  <span>{member.phone}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2.5">
                              <MapPin size={15} className="text-tribal-500 shrink-0"/> 
                              {isEditing ? (
                                  <input 
                                    type="text" 
                                    value={member.address}
                                    onChange={(e) => handleTeamUpdate(index, 'address', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-1 text-xs"
                                  />
                              ) : (
                                  <span className="truncate" title={member.address}>{member.address}</span>
                              )}
                            </div>
                        </div>
                     )}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Contact & Socials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-tribal-100 relative">
               {isEditing && <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">Editing Mode</div>}
               
               <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('contactUs')}</h3>
               <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                     <div className="bg-tribal-100 p-3 rounded-lg text-tribal-600">
                        <Mail size={24} />
                     </div>
                     <div className="flex-1">
                        <p className="font-semibold text-gray-800">{t('emailLabel')}</p>
                        {isEditing ? (
                            <input 
                                type="text"
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-gray-600 mt-1"
                            />
                        ) : (
                            <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-tribal-600">{contactInfo.email}</a>
                        )}
                     </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                     <div className="bg-tribal-100 p-3 rounded-lg text-tribal-600">
                        <Phone size={24} />
                     </div>
                     <div className="flex-1">
                        <p className="font-semibold text-gray-800">{t('callLabel')}</p>
                        {isEditing ? (
                            <input 
                                type="text"
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-gray-600 mt-1"
                            />
                        ) : (
                            <p className="text-gray-600">{contactInfo.phone}</p>
                        )}
                     </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                     <div className="bg-tribal-100 p-3 rounded-lg text-tribal-600">
                        <MapPin size={24} />
                     </div>
                     <div className="flex-1">
                        <p className="font-semibold text-gray-800">{t('visitLabel')}</p>
                        {isEditing ? (
                            <textarea 
                                value={contactInfo.address}
                                onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-gray-600 mt-1"
                                rows={3}
                            />
                        ) : (
                            <p className="text-gray-600 whitespace-pre-line">{contactInfo.address}</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Social Media */}
            <div className="bg-tribal-600 rounded-xl p-8 shadow-sm text-white flex flex-col justify-center text-center">
               <h3 className="text-2xl font-bold mb-6">{t('followUs')}</h3>
               <p className="text-tribal-100 mb-8">{t('socialText')}</p>
               
               <div className="flex justify-center gap-4">
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors backdrop-blur-sm">
                    <Facebook size={28} />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors backdrop-blur-sm">
                    <Instagram size={28} />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors backdrop-blur-sm">
                    <Twitter size={28} />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors backdrop-blur-sm">
                    <Linkedin size={28} />
                  </a>
               </div>
               
               <div className="mt-10 pt-8 border-t border-white/20">
                  <p className="text-sm text-tribal-200">{t('copyright')}</p>
               </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;