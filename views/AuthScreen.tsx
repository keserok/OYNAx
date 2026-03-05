
import React, { useState } from 'react';
import { ArrowRight, Apple, Smartphone, ChevronLeft, Loader2, ArrowLeft, Mail } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState<'SOCIAL' | 'PHONE' | 'OTP'>('SOCIAL');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState<'APPLE' | 'GOOGLE' | null>(null);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 9) {
      setStep('OTP');
    }
  };

  const handleSocialLogin = (provider: 'APPLE' | 'GOOGLE') => {
      setIsLoading(provider);
      // Simulate API Call / Auth Delay
      setTimeout(() => {
          setIsLoading(null);
          onSuccess();
      }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
    
    if (index === 3 && value !== '') {
        setTimeout(onSuccess, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFFF00] blur-[200px] opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 blur-[150px] opacity-10 pointer-events-none"></div>

      {/* Navigation Controls */}
      {step === 'SOCIAL' ? (
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 p-3 bg-[#161B22] border border-white/5 rounded-full text-white hover:bg-white/10 transition-colors z-20"
        >
            <ArrowLeft size={20} />
        </button>
      ) : (
        <button 
          onClick={() => setStep(step === 'OTP' ? 'PHONE' : 'SOCIAL')} 
          className="absolute top-6 left-6 p-3 bg-[#161B22] border border-white/5 rounded-full text-white hover:bg-white/10 transition-colors z-20"
        >
            <ChevronLeft size={20} />
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full z-10">
        
        {/* Branding Area */}
        <div className={`mb-12 text-center transition-all duration-700 ${step === 'SOCIAL' ? 'scale-100' : 'scale-90 opacity-80'}`}>
           <div className="inline-block mb-4 relative">
               <div className="w-16 h-16 bg-[#FFFF00] rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,0,0.3)]">
                   <div className="-rotate-45 font-black text-black text-2xl">O</div>
               </div>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter">HESAP SEÇİMİ</h1>
           <p className="text-gray-400 text-sm mt-2 font-bold tracking-wide uppercase">Oyun Başlıyor</p>
        </div>

        {/* --- SOCIAL LOGIN VIEW --- */}
        {step === 'SOCIAL' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                
                {/* Apple Button */}
                <button 
                    onClick={() => handleSocialLogin('APPLE')}
                    disabled={!!isLoading}
                    className="w-full bg-white text-black h-16 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-98 transition-all relative overflow-hidden"
                >
                    {isLoading === 'APPLE' ? (
                        <Loader2 className="animate-spin text-black" size={20} />
                    ) : (
                        <>
                            <Apple size={24} fill="black" />
                            <span>APPLE İLE GİRİŞ</span>
                        </>
                    )}
                </button>

                {/* Google Button */}
                <button 
                    onClick={() => handleSocialLogin('GOOGLE')}
                    disabled={!!isLoading}
                    className="w-full bg-[#161B22] text-white border border-white/10 h-16 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-3 hover:bg-white/5 active:scale-98 transition-all relative overflow-hidden"
                >
                    {isLoading === 'GOOGLE' ? (
                        <Loader2 className="animate-spin text-white" size={20} />
                    ) : (
                        <>
                            <Mail size={24} />
                            <span>GOOGLE İLE GİRİŞ</span>
                        </>
                    )}
                </button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                        <span className="bg-[#0A0E14] px-3 text-gray-600">veya</span>
                    </div>
                </div>

                <button 
                    onClick={() => setStep('PHONE')}
                    className="w-full bg-transparent text-white border border-white/10 h-16 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/5 transition-colors group"
                >
                    <Smartphone size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                    <span>TELEFON NUMARASI</span>
                </button>
            </div>
        )}

        {/* --- PHONE LOGIN VIEW --- */}
        {step === 'PHONE' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Telefon Numarası</label>
                <div className="flex items-center bg-[#161B22] border border-gray-800 rounded-2xl p-4 focus-within:border-[#FFFF00] transition-colors h-16">
                    <span className="text-gray-400 font-bold mr-3 text-lg">🇹🇷 +90</span>
                    <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        className="bg-transparent w-full text-white font-bold text-xl outline-none placeholder:text-gray-700"
                        placeholder="5XX XXX XX XX"
                        autoFocus
                    />
                </div>
            </div>
            
            <button 
                type="submit"
                disabled={phone.length < 10}
                className="w-full bg-[#FFFF00] disabled:bg-gray-800 disabled:text-gray-500 text-black h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,0,0.2)]"
            >
                KOD GÖNDER <ArrowRight size={20} />
            </button>
          </form>
        )}

        {/* --- OTP VIEW --- */}
        {step === 'OTP' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
             <div className="text-center">
                 <p className="text-white font-bold text-lg mb-1">Doğrulama Kodu</p>
                 <p className="text-gray-500 text-sm">+90 {phone} numarasına gönderildi.</p>
             </div>

             <div className="flex justify-between gap-3">
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-16 h-20 bg-[#161B22] border border-gray-800 rounded-2xl text-center text-3xl font-black text-white focus:border-[#FFFF00] outline-none transition-all focus:scale-110 focus:bg-[#0A0E14]"
                    />
                ))}
             </div>
             
             <p className="text-center text-xs text-gray-500">
                Kod gelmedi mi? <button className="text-[#FFFF00] font-bold hover:underline ml-1">Tekrar Gönder</button>
             </p>
          </div>
        )}
      </div>

      <div className="text-center py-6 text-[10px] text-gray-600 font-medium">
         Devam ederek <span className="text-gray-400 hover:text-white cursor-pointer">Kullanım Koşulları</span> ve <span className="text-gray-400 hover:text-white cursor-pointer">Gizlilik Politikası</span>'nı kabul etmiş olursun.
      </div>
    </div>
  );
};

export default AuthScreen;
