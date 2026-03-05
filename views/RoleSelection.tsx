import React, { useState, useRef } from 'react';
import { UserRole, AppView } from '../types';
import { Trophy, Shield, Scale, Building2, User, Mail, Smartphone, ArrowLeft, ArrowRight, Calendar, Ruler, Weight, Target, Check, Sparkles, Activity, Fingerprint, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoleSelectionProps {
  onSelect: (role: UserRole, data?: any) => void;
  onBack: () => void;
  onPartnerInvite?: () => void;
  onNavigate?: (view: AppView) => void;
}

// --- HERO CARD COMPONENT ---
const RoleHeroCard: React.FC<{ 
  role: UserRole;
  title: string; 
  subtitle: string;
  icon: React.ReactNode; 
  themeColor: string; 
  bgGradient: string; 
  borderColor: string; 
  onComplete: () => void;
  delay: string;
  isProminent?: boolean;
}> = ({ role, title, subtitle, icon, themeColor, bgGradient, borderColor, onComplete, delay, isProminent }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    setProgress(0);
    
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds to enter

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current!);
        onComplete();
      }
    }, 10);
  };

  const endHold = () => {
    setIsHolding(false);
    setProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isHolding ? 0.98 : 1,
        boxShadow: isProminent ? [
          "0 0 0px rgba(255,255,0,0)",
          "0 0 40px rgba(255,255,0,0.4)",
          "0 0 0px rgba(255,255,0,0)"
        ] : "none"
      }}
      transition={{ 
        opacity: { duration: 0.5, delay: parseInt(delay.split('-')[1]) / 1000 },
        y: { duration: 0.5, delay: parseInt(delay.split('-')[1]) / 1000 },
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        scale: { type: "spring", stiffness: 300, damping: 20 }
      }}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      className={`group relative w-full ${isProminent ? 'h-72' : 'h-36'} rounded-[48px] overflow-hidden transition-all duration-500 border-2 ${isProminent ? 'border-[#FFFF00]/50 shadow-[0_0_50px_rgba(255,255,0,0.3)]' : 'border-white/5'} ${borderColor} mb-6 cursor-pointer select-none`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${bgGradient} via-[#161B22]/80 to-[#161B22] opacity-80 group-hover:opacity-100 transition-all duration-500`}></div>
      
      {/* Progress Overlay */}
      <motion.div 
        className="absolute inset-0 bg-[#FFFF00]/10 origin-left z-0"
        style={{ scaleX: progress / 100 }}
      />

      {/* Animated Glow for Prominent */}
      {isProminent && (
        <motion.div 
          animate={{ 
            opacity: isHolding ? 0.6 : [0.2, 0.5, 0.2],
            scale: isHolding ? 1.1 : [1, 1.2, 1]
          }}
          transition={{ duration: isHolding ? 0.2 : 3, repeat: isHolding ? 0 : Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,0,0.2)_0%,_transparent_70%)]"
        />
      )}

      {/* Huge Background Icon (Watermark) */}
      <div className={`absolute -right-8 -bottom-8 ${themeColor} opacity-10 group-hover:opacity-30 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: isProminent ? 320 : 160 })}
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-10 flex flex-col justify-center items-center text-center z-10">
          <div className="flex flex-col items-center gap-3 mb-4">
              <div className={`p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 ${themeColor}`}>
                  {React.cloneElement(icon as React.ReactElement<any>, { size: isProminent ? 32 : 20 })}
              </div>
              <span className={`text-[12px] font-black uppercase tracking-[0.5em] ${themeColor}`}>
                  {role} ID
              </span>
          </div>
          <h2 className={`${isProminent ? 'text-7xl' : 'text-4xl'} font-black text-white italic tracking-tighter leading-none transition-transform duration-300`}>
              {title}
          </h2>
          <p className={`${isProminent ? 'text-base' : 'text-xs'} text-gray-400 font-medium mt-4 max-w-[280px] leading-tight group-hover:text-white transition-colors`}>
              {subtitle}
          </p>
          
          {isProminent && (
            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FFFF00] animate-pulse"></div>
              <span className="text-[10px] font-black text-[#FFFF00] uppercase tracking-widest">GİRİŞ İÇİN BASILI TUT</span>
            </div>
          )}
      </div>

      {/* Action Arrow */}
      <div className={`absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-[#FFFF00]/30 flex items-center justify-center ${themeColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-10 transition-all duration-300 bg-black/60 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,0,0.3)]`}>
          <ArrowRight size={32} />
      </div>

      {/* Excitement Sparkles for Prominent */}
      {isProminent && (
        <div className="absolute top-6 right-16">
           <motion.div
             animate={{ rotate: 360, scale: [1, 1.2, 1] }}
             transition={{ duration: 4, repeat: Infinity }}
           >
             <Sparkles className="text-[#FFFF00] opacity-40" size={32} />
           </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect, onBack, onPartnerInvite, onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Role, 2: Contact, 3: Physical
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Data States
  const [formData, setFormData] = useState({
      fullName: '',
      phone: '',
      email: '',
      tcNumber: '', // Added for Ref/Owner
      age: '',
      height: '',
      weight: '',
      position: ''
  });

  const handleCardClick = (role: UserRole) => {
    onSelect(role, formData);
  };

  const handleBack = () => {
    if (step === 3) {
        setStep(2);
    } else if (step === 2) {
        setStep(1);
        setSelectedRole(null);
    } else {
        onBack();
    }
  };

  // Determine if this is a "Professional" role (Ref/Owner) that skips physical attributes
  const isProfessionalRole = false;

  const handleNextAction = () => {
      if (isProfessionalRole) {
          // For Pros: Step 2 is the final step. Validate TC & Phone then complete.
          if (formData.tcNumber && formData.phone) {
              handleComplete();
          }
      } else {
          // For Players: Go to Step 3 (Physical Attributes)
          if (formData.fullName && formData.phone) {
              setStep(3);
          }
      }
  };

  const handleComplete = () => {
    if (selectedRole) {
       setIsVerifying(true);
       setTimeout(() => {
           onSelect(selectedRole, formData);
       }, 1500);
    }
  };

  const getRoleTheme = () => {
      return { color: 'text-[#FFFF00]', border: 'border-[#FFFF00]', bg: 'bg-[#FFFF00]' };
  };

  const positions = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci', 'Libero'];
  const theme = getRoleTheme();

  // --- STEP 2 & 3 CONTAINER ---
  if (step > 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0E14] relative overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         {/* Dynamic Glow */}
         <div className={`absolute top-[-20%] right-[-20%] w-[500px] h-[500px] blur-[150px] rounded-full opacity-20 pointer-events-none ${theme.bg}`}></div>

         <div className="w-full max-w-md bg-[#161B22]/90 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 relative animate-in zoom-in duration-300 shadow-2xl z-10">
            
            {/* Header / Back */}
            <div className="flex justify-between items-center mb-8">
                <button onClick={handleBack} className="p-3 bg-[#0A0E14] rounded-full text-white border border-white/5 hover:border-white/20 transition-colors">
                   <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    {/* Progress Dots: If Professional role, only show 1 active dot style or handle differently. */}
                    <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 2 ? theme.bg : 'bg-gray-800'}`}></div>
                    {!isProfessionalRole && (
                        <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 3 ? theme.bg : 'bg-gray-800'}`}></div>
                    )}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-[#0A0E14] border ${theme.border} ${theme.color}`}>
                    {selectedRole}
                </div>
            </div>
            
            <div className="mb-8">
                <h2 className="text-3xl font-black text-white italic tracking-tight">
                    {step === 2 ? (isProfessionalRole ? 'HIZLI DOĞRULAMA' : 'KİMLİK BİLGİLERİ') : 'FİZİKSEL KÜNYE'}
                </h2>
                <p className="text-gray-400 text-xs mt-2 font-medium">
                    {step === 2 
                        ? (isProfessionalRole ? 'Ödeme ve güvenlik işlemleri için gereklidir.' : 'Seni tanımamız ve iletişime geçebilmemiz için gerekli.') 
                        : 'Saha profilini ve oyuncu kartını oluşturuyoruz.'}
                </p>
            </div>

            {/* --- STEP 2: CONTACT / IDENTITY INFO --- */}
            {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right duration-500">
                    
                    {isProfessionalRole ? (
                        /* --- SIMPLIFIED FORM FOR REFEREE / OWNER --- */
                        <>
                            <div className="group">
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block ml-1 group-focus-within:text-white transition-colors">TC Kimlik Numarası</label>
                                <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-2xl flex items-center gap-3 focus-within:border-white/40 transition-colors">
                                    <Fingerprint size={20} className="text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input 
                                        type="tel" 
                                        maxLength={11}
                                        value={formData.tcNumber}
                                        onChange={(e) => setFormData({...formData, tcNumber: e.target.value.replace(/[^0-9]/g, '')})}
                                        className="bg-transparent w-full outline-none text-white font-bold placeholder:text-gray-700 tracking-widest font-mono"
                                        placeholder="12345678901"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block ml-1 group-focus-within:text-white transition-colors">Telefon Numarası</label>
                                <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-2xl flex items-center gap-3 focus-within:border-white/40 transition-colors">
                                    <Smartphone size={20} className="text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="bg-transparent w-full outline-none text-white font-bold placeholder:text-gray-700"
                                        placeholder="5XX XXX XX XX"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* --- STANDARD FORM FOR PLAYERS --- */
                        <>
                            <div className="group">
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block ml-1 group-focus-within:text-white transition-colors">Ad Soyad</label>
                                <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-2xl flex items-center gap-3 focus-within:border-white/40 transition-colors">
                                    <User size={20} className="text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input 
                                        type="text" 
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="bg-transparent w-full outline-none text-white font-bold placeholder:text-gray-700"
                                        placeholder="Örn: Burak Yılmaz"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block ml-1 group-focus-within:text-white transition-colors">E-Posta Adresi</label>
                                <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-2xl flex items-center gap-3 focus-within:border-white/40 transition-colors">
                                    <Mail size={20} className="text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="bg-transparent w-full outline-none text-white font-bold placeholder:text-gray-700"
                                        placeholder="ornek@oyna.app"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block ml-1 group-focus-within:text-white transition-colors">Telefon Numarası</label>
                                <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-2xl flex items-center gap-3 focus-within:border-white/40 transition-colors">
                                    <Smartphone size={20} className="text-gray-500 group-focus-within:text-white transition-colors" />
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="bg-transparent w-full outline-none text-white font-bold placeholder:text-gray-700"
                                        placeholder="5XX XXX XX XX"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button 
                       onClick={handleNextAction}
                       disabled={isProfessionalRole ? (!formData.tcNumber || !formData.phone || isVerifying) : (!formData.fullName || !formData.phone)}
                       className={`w-full h-16 mt-6 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden
                       ${(isProfessionalRole ? (!formData.tcNumber || !formData.phone || isVerifying) : (!formData.fullName || !formData.phone))
                           ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                           : `${theme.bg} text-white hover:scale-[1.02] active:scale-95`
                       }`}
                    >
                        {isVerifying ? (
                           <>
                               <Activity size={20} className="animate-spin" /> DOĞRULANIYOR...
                           </>
                       ) : (
                           <>
                               {isProfessionalRole ? 'KAYDI TAMAMLA' : 'DEVAM ET'} <ArrowRight size={20} />
                           </>
                       )}
                    </button>
                </div>
            )}

            {/* --- STEP 3: PHYSICAL & POSITION (ONLY FOR PLAYERS) --- */}
            {!isProfessionalRole && step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                    
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-[24px] flex flex-col items-center justify-center gap-2 focus-within:border-white/40 transition-colors relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-1 ${theme.bg} opacity-0 group-focus-within:opacity-100 transition-opacity`}></div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">YAŞ</span>
                            <input 
                                type="number" 
                                placeholder="25"
                                value={formData.age}
                                onChange={(e) => setFormData({...formData, age: e.target.value})} 
                                className="bg-transparent w-full outline-none text-white text-center font-black text-3xl placeholder:text-gray-800"
                            />
                        </div>
                        <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-[24px] flex flex-col items-center justify-center gap-2 focus-within:border-white/40 transition-colors relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-1 ${theme.bg} opacity-0 group-focus-within:opacity-100 transition-opacity`}></div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">BOY</span>
                            <div className="flex items-baseline gap-0.5">
                                <input 
                                    type="number" 
                                    placeholder="178"
                                    value={formData.height}
                                    onChange={(e) => setFormData({...formData, height: e.target.value})} 
                                    className="bg-transparent w-16 outline-none text-white text-center font-black text-3xl placeholder:text-gray-800"
                                />
                                <span className="text-[10px] text-gray-500 font-bold">cm</span>
                            </div>
                        </div>
                        <div className="bg-[#0A0E14] border border-gray-800 p-4 rounded-[24px] flex flex-col items-center justify-center gap-2 focus-within:border-white/40 transition-colors relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-1 ${theme.bg} opacity-0 group-focus-within:opacity-100 transition-opacity`}></div>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">KİLO</span>
                            <div className="flex items-baseline gap-0.5">
                                <input 
                                    type="number" 
                                    placeholder="75"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({...formData, weight: e.target.value})} 
                                    className="bg-transparent w-14 outline-none text-white text-center font-black text-3xl placeholder:text-gray-800"
                                />
                                <span className="text-[10px] text-gray-500 font-bold">kg</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-3 ml-1">
                            <Target size={14} className={theme.color} /> Pozisyon Tercihi
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {positions.map(pos => (
                                <button
                                    key={pos}
                                    onClick={() => setFormData({...formData, position: pos})}
                                    className={`py-4 px-5 rounded-2xl text-xs font-black transition-all border flex items-center justify-between group ${
                                        formData.position === pos 
                                        ? `bg-white text-black border-white shadow-lg scale-[1.02]` 
                                        : 'bg-[#0A0E14] text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300'
                                    }`}
                                >
                                    {pos}
                                    {formData.position === pos && <Check size={16} className="text-black" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                       onClick={handleComplete}
                       disabled={isVerifying}
                       className={`w-full h-16 mt-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden
                       ${isVerifying 
                           ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                           : theme.color === 'text-[#FFFF00]' ? 'bg-[#FFFF00] text-black shadow-yellow-900/30 hover:scale-[1.02] active:scale-95' : `${theme.bg} text-white hover:scale-[1.02] active:scale-95`
                       }`}
                    >
                       {isVerifying ? (
                           <>
                               <Activity size={20} className="animate-spin" /> OLUŞTURULUYOR...
                           </>
                       ) : (
                           <>
                               KAYDI TAMAMLA <Check size={20} />
                           </>
                       )}
                    </button>
                </div>
            )}

         </div>
      </div>
    );
  }

  // --- STEP 1: HERO SELECTION ---
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E14] relative overflow-y-auto custom-scrollbar">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full"></div>
          
          {/* Floating Elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.1
              }}
              animate={{ 
                x: [null, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 20 + Math.random() * 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute text-[#FFFF00]/20"
            >
              <Trophy size={40 + Math.random() * 60} />
            </motion.div>
          ))}
      </div>

      <div className="p-6 pt-10 z-10 flex flex-col min-h-screen items-center justify-between">
          
          {/* Brand Header */}
          <div className="text-center mt-4">
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: 1 
                }}
                transition={{ 
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 1, ease: "easeOut" }
                }}
                className="text-7xl font-black text-[#FFFF00] tracking-tighter italic leading-none"
              >
                  OYNA
              </motion.h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-1 bg-gradient-to-r from-transparent via-[#FFFF00] to-transparent mt-4 opacity-50"
              />
          </div>

          {/* Vertical Hero Grid */}
          <div className="w-full max-w-sm pb-20">
              
              <RoleHeroCard 
                  role={UserRole.PLAYER}
                  title="OYUNCU"
                  subtitle="Maç yap, takıma katıl veya eksik tamamla."
                  icon={<Trophy />}
                  themeColor="text-yellow-400"
                  bgGradient="from-yellow-900/40"
                  borderColor="hover:border-yellow-400/50"
                  onComplete={() => handleCardClick(UserRole.PLAYER)}
                  delay="delay-100"
                  isProminent={true}
              />

          </div>
      </div>

      {/* Admin Panel Button */}
      {onNavigate && (
        <button 
          onClick={() => onNavigate('ADMIN_PANEL')}
          className="fixed bottom-6 right-6 w-12 h-12 bg-[#161B22] border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all z-50 shadow-lg"
          title="Yönetici Paneli"
        >
          <Settings size={20} />
        </button>
      )}

    </div>
  );
};

export default RoleSelection;