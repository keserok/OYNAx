
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Users, User, Scale, Shield, 
  Clock, Sparkles, Target, MousePointer2
} from 'lucide-react';
import { AppView, Goalkeeper, Referee } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  onBack: () => void;
  onRoleSelect?: (role: any) => void;
  selectedGk: Goalkeeper | null;
  selectedRef: Referee | null;
}

const DashboardSkeleton = () => (
  <div className="p-6 space-y-4 min-h-screen bg-[#0A0E14] animate-pulse">
      <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-40 bg-gray-800 rounded-xl"></div>
          <div className="h-10 w-10 bg-gray-800 rounded-full"></div>
      </div>
      <div className="h-48 w-full bg-gray-800 rounded-[32px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div className="h-40 bg-gray-800 rounded-[32px]"></div>
          <div className="h-40 bg-gray-800 rounded-[32px]"></div>
      </div>
      <div className="h-24 w-full bg-gray-800 rounded-[32px]"></div>
      <div className="flex justify-center items-center gap-2 mt-10">
          <div className="w-2 h-2 bg-[#FFFF00] rounded-full animate-bounce"></div>
          <p className="text-[#FFFF00] text-xs font-bold uppercase tracking-widest">Sistem Sahayı Hazırlıyor...</p>
      </div>
  </div>
);

const MatchCountdown: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set target to 2 hours and 30 minutes from now
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 2);
    targetDate.setMinutes(targetDate.getMinutes() + 30);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  const hasDays = timeLeft.days > 0;
  const themeColor = hasDays ? 'text-green-400' : 'text-red-500';
  const themeBg = hasDays ? 'bg-green-500' : 'bg-red-500';
  const themeBorder = hasDays ? 'border-green-500/30' : 'border-red-500/30';
  const themeGlow = hasDays ? 'bg-green-500/25' : 'bg-red-500/25';

  return (
    <motion.div 
      onClick={onClick} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        borderColor: !hasDays ? ['rgba(239,68,68,0.3)', 'rgba(239,68,68,0.8)', 'rgba(239,68,68,0.3)'] : 'rgba(34,197,94,0.3)'
      }}
      transition={{
        borderColor: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.02 }}
      className={`h-full bg-[#161B22]/60 backdrop-blur-xl border rounded-[32px] p-5 relative overflow-hidden group cursor-pointer transition-all duration-500 ${themeBorder}`}
    >
       {/* Ambient Glow */}
       <motion.div 
         animate={{ 
           opacity: [0.1, 0.6, 0.1],
           scale: [1, 1.4, 1],
         }}
         transition={{ 
           duration: 2.5, 
           repeat: Infinity, 
           ease: "easeOut" 
         }}
         className={`absolute -right-10 -top-10 w-48 h-48 blur-[60px] rounded-full pointer-events-none ${themeGlow}`}
       />
       
       <div className="flex justify-between items-start h-full flex-col relative z-10">
          <div className="flex items-center gap-2 mb-2">
             <motion.div 
               animate={{ 
                 boxShadow: hasDays 
                  ? ["0 0 0px rgba(34,197,94,0)", "0 0 30px rgba(34,197,94,0.7)", "0 0 0px rgba(34,197,94,0)"]
                  : ["0 0 0px rgba(239,68,68,0)", "0 0 30px rgba(239,68,68,0.7)", "0 0 0px rgba(239,68,68,0)"]
               }}
               transition={{ duration: 1, repeat: Infinity }}
               className={`${themeBg} w-8 h-8 rounded-full flex items-center justify-center`}
             >
                <Clock size={16} className="text-black" />
             </motion.div>
             <p className={`text-[10px] font-black uppercase tracking-widest ${themeColor}`}>
               {hasDays ? 'Sıradaki Maçlarım' : 'MAÇ BAŞLIYOR!'}
             </p>
          </div>
          
          <div>
            <p className="text-white font-black text-xl leading-tight">Arena Sport Center</p>
            <p className="text-gray-400 text-xs mt-1">Beşiktaş • Halı Saha 1</p>
          </div>

          {/* DYNAMIC COUNTDOWN UI */}
          <div className="w-full flex items-center gap-2 mt-3">
             {/* Day Block */}
             <div className={`flex-1 bg-[#0A0E14] border border-white/10 rounded-2xl p-2 flex flex-col items-center justify-center relative overflow-hidden group/time transition-all hover:border-white/20 ${!hasDays ? 'opacity-30' : ''}`}>
                 <span className={`text-2xl font-black tracking-tighter tabular-nums leading-none ${hasDays ? 'text-white' : 'text-gray-600'}`}>{format(timeLeft.days)}</span>
                 <span className="text-[9px] font-bold text-gray-500 uppercase mt-1">GÜN</span>
             </div>

             {/* Separator */}
             <div className="flex flex-col gap-1 justify-center pt-1">
                 <motion.div 
                   animate={{ opacity: [0.3, 1, 0.3] }}
                   transition={{ duration: 1, repeat: Infinity }}
                   className={`w-1 h-1 rounded-full ${themeBg}`}
                 />
                 <motion.div 
                   animate={{ opacity: [0.3, 1, 0.3] }}
                   transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                   className={`w-1 h-1 rounded-full ${themeBg}`}
                 />
             </div>

             {/* Hour Block */}
             <div className="flex-1 bg-[#0A0E14] border border-white/10 rounded-2xl p-2 flex flex-col items-center justify-center relative overflow-hidden group/time transition-all hover:border-white/20">
                 <motion.span 
                   animate={!hasDays ? { opacity: [1, 0.5, 1] } : {}}
                   transition={{ duration: 0.5, repeat: Infinity }}
                   className={`text-2xl font-black tracking-tighter tabular-nums leading-none ${!hasDays ? 'text-red-500' : 'text-white'}`}
                 >
                   {format(timeLeft.hours)}
                 </motion.span>
                 <span className="text-[9px] font-bold text-gray-500 uppercase mt-1">SAAT</span>
             </div>

             {/* Separator */}
             <div className="flex flex-col gap-1 justify-center pt-1">
                 <motion.div 
                   animate={{ opacity: [0.3, 1, 0.3] }}
                   transition={{ duration: 1, repeat: Infinity }}
                   className={`w-1 h-1 rounded-full ${themeBg}`}
                 />
                 <motion.div 
                   animate={{ opacity: [0.3, 1, 0.3] }}
                   transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                   className={`w-1 h-1 rounded-full ${themeBg}`}
                 />
             </div>

             {/* Minute Block */}
             <div className="flex-1 bg-[#0A0E14] border border-white/10 rounded-2xl p-2 flex flex-col items-center justify-center relative overflow-hidden group/time transition-all hover:border-white/20">
                 <motion.span 
                   animate={!hasDays ? { opacity: [1, 0.5, 1] } : {}}
                   transition={{ duration: 0.5, repeat: Infinity }}
                   className={`text-2xl font-black tracking-tighter tabular-nums leading-none ${!hasDays ? 'text-red-500' : 'text-white'}`}
                 >
                   {format(timeLeft.minutes)}
                 </motion.span>
                 <span className="text-[9px] font-bold text-gray-500 uppercase mt-1">DAK</span>
             </div>
          </div>
       </div>
    </motion.div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onBack, selectedGk, selectedRef }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      // Simulate Loading
      setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col pb-6 bg-[#0A0E14] text-white font-sans selection:bg-[#FFFF00] selection:text-black">
      
      {/* BENTO GRID LAYOUT */}
      <main className="grid grid-cols-2 gap-4 auto-rows-min">
        
        {/* Active Hires Section (Conditional) */}
        {(selectedGk || selectedRef) && (
          <div className="col-span-2 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 px-1">
              <Sparkles size={14} className="text-[#FFFF00]" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aktif Kiralamalar</h3>
            </div>
            <div className="flex gap-3">
              {selectedGk && (
                <div className="flex-1 bg-[#161B22] border border-green-500/30 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-green-500/50">
                    <img src={selectedGk.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase truncate max-w-[80px]">{selectedGk.name}</p>
                    <p className="text-[8px] text-green-500 font-bold uppercase">KALECİ • AKTİF</p>
                  </div>
                </div>
              )}
              {selectedRef && (
                <div className="flex-1 bg-[#161B22] border border-yellow-500/30 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-yellow-500/50">
                    <img src={selectedRef.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase truncate max-w-[80px]">{selectedRef.name}</p>
                    <p className="text-[8px] text-yellow-500 font-bold uppercase">HAKEM • AKTİF</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 1. Countdown Box (Large) */}
        <div className="col-span-2 h-48 animate-in slide-in-from-bottom-4 duration-500">
            <MatchCountdown onClick={() => onNavigate('MATCH_CALENDAR')} />
        </div>

        {/* 2. RAKİP BUL (NEW VERSUS TILE) - Prominent Red */}
        <div 
            onClick={() => onNavigate('OPPONENT_FINDER')}
            className="col-span-2 h-32 bg-gradient-to-r from-red-600 to-red-800 rounded-[32px] relative overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(220,38,38,0.2)] animate-in slide-in-from-bottom-5 duration-700"
        >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-60"></div>
            <div className="absolute inset-0 p-5 flex items-center justify-between">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={18} className="text-white" />
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Kaptan Modu</span>
                    </div>
                    <h2 className="text-3xl font-black text-white italic uppercase leading-none drop-shadow-md">Rakip<br/>Bul</h2>
                    <p className="text-[10px] text-red-200 mt-1 font-bold">Takımını al, meydan oku.</p>
                </div>
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/20 group-hover:scale-110 transition-transform relative overflow-hidden">
                    {/* VS Text Background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <span className="text-5xl font-black italic text-white -rotate-12">VS</span>
                    </div>
                    {/* Facing Users */}
                    <div className="flex items-center justify-center gap-1 relative z-10">
                        <User size={32} className="text-white drop-shadow-md" />
                        <User size={32} className="text-white drop-shadow-md" style={{ transform: 'scaleX(-1)' }} />
                    </div>
                </div>
            </div>
        </div>

        {/* 3. Pitch Booking (FULL WIDTH) */}
        <div 
            onClick={() => onNavigate('PITCH_DISCOVERY')}
            className="col-span-2 h-32 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-[32px] relative overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-in slide-in-from-bottom-6 duration-700"
        >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-60"></div>
            <div className="absolute inset-0 p-5 flex items-center justify-between">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={18} className="text-white" />
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Rezervasyon</span>
                    </div>
                    <h2 className="text-3xl font-black text-white italic uppercase leading-none drop-shadow-md">Saha<br/>Kirala</h2>
                    <p className="text-[10px] text-emerald-200 mt-1 font-bold">Uygun sahaları gör.</p>
                </div>
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/20 group-hover:scale-110 transition-transform">
                    <MapPin size={40} className="text-white" />
                </div>
            </div>
        </div>

        {/* 4. Marketplace Tiles (SIDE BY SIDE) */}
        <motion.div 
            onClick={() => onNavigate('MARKETPLACE_GK')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="h-40 bg-gradient-to-br from-[#161B22] to-[#0A0E14] border border-white/5 rounded-[32px] p-5 relative overflow-hidden group cursor-pointer shadow-lg"
        >
            {/* Animated Background Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full"
            />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                >
                    <Shield size={24} />
                </motion.div>
                <div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter leading-none mb-1">KALECİ<br/>KİRALA</h3>
                    <div className="flex items-center gap-1 mt-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">12 Aktif Panter</span>
                    </div>
                </div>
            </div>
            <Shield size={100} className="absolute right-[-15px] bottom-[-15px] text-white/5 -rotate-12 group-hover:text-green-500/10 transition-all duration-500" />
        </motion.div>

        <motion.div 
            onClick={() => onNavigate('MARKETPLACE_REF')}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="h-40 bg-gradient-to-br from-[#161B22] to-[#0A0E14] border border-white/5 rounded-[32px] p-5 relative overflow-hidden group cursor-pointer shadow-lg"
        >
            {/* Animated Background Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"
            />

            <div className="relative z-10 h-full flex flex-col justify-between">
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                >
                    <Scale size={24} />
                </motion.div>
                <div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter leading-none mb-1">HAKEM<br/>KİRALA</h3>
                    <div className="flex items-center gap-1 mt-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">FIFA Kokartlı</span>
                    </div>
                </div>
            </div>
            <Scale size={100} className="absolute right-[-15px] bottom-[-15px] text-white/5 -rotate-12 group-hover:text-blue-500/10 transition-all duration-500" />
        </motion.div>

        {/* 5. Individual Match Join (FULL WIDTH) */}
        <div 
            onClick={() => onNavigate('MATCH_DISCOVERY')}
            className="col-span-2 h-32 bg-gradient-to-r from-blue-700 to-slate-900 rounded-[32px] relative overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(29,78,216,0.2)] animate-in slide-in-from-bottom-7 duration-700"
        >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')] opacity-60"></div>
            <div className="absolute inset-0 p-5 flex items-center justify-between">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={18} className="text-white" />
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Bireysel</span>
                    </div>
                    <h2 className="text-3xl font-black text-white italic uppercase leading-none drop-shadow-md">Maça<br/>Katıl</h2>
                    <p className="text-[10px] text-blue-200 mt-1 font-bold">Destek ol.</p>
                </div>
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/20 group-hover:scale-110 transition-transform">
                    <User size={40} className="text-white" />
                </div>
            </div>
        </div>

        {/* 6. Studio Box (FULL WIDTH) */}
        <motion.div 
            onClick={() => onNavigate('STUDIO')}
            whileHover={{ scale: 1.02 }}
            className="col-span-2 h-44 bg-[#050812] rounded-[32px] relative overflow-hidden group cursor-pointer border border-[#39FF14]/30 shadow-[0_0_30px_rgba(57,255,20,0.05)] flex flex-col justify-between p-6"
        >
            {/* Soccer Pitch Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect x="0" y="0" width="100" height="100" fill="none" stroke="#39FF14" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#39FF14" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke="#39FF14" strokeWidth="0.5" />
                    <rect x="0" y="30" width="15" height="40" fill="none" stroke="#39FF14" strokeWidth="0.5" />
                    <rect x="85" y="30" width="15" height="40" fill="none" stroke="#39FF14" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="flex justify-between items-start relative z-10">
                <motion.div 
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="w-14 h-14 bg-[#39FF14]/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#39FF14] border border-[#39FF14]/20"
                >
                    <Target size={28} />
                </motion.div>
                <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050812] bg-[#161B22] flex items-center justify-center overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=player${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-[#050812] bg-[#39FF14] flex items-center justify-center text-[10px] font-black text-black">
                        +8
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} className="text-[#39FF14]" />
                        <p className="text-[10px] text-[#39FF14] font-black uppercase tracking-[0.2em]">Strateji & Analiz</p>
                    </div>
                    <h2 className="text-3xl font-black text-white italic leading-none">TAKTIK STUDIO</h2>
                </div>
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-[#39FF14] text-black p-3 rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                >
                    <MousePointer2 size={20} />
                </motion.div>
            </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
