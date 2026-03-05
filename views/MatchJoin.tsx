
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Clock, Info, Hand, Scale, Zap, Radio, Star, ChevronRight, X, Loader2 } from 'lucide-react';
import { MatchListing, PositionSlot } from '../types';

interface MatchJoinProps {
  match: MatchListing | null;
  onBack: () => void;
  onJoin: () => void;
}

const MatchJoin: React.FC<MatchJoinProps> = ({ match, onBack, onJoin }) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Talent Hire State
  const [hireModalType, setHireModalType] = useState<'GK' | 'REF' | null>(null);
  const [hiringState, setHiringState] = useState<{gk: 'IDLE' | 'BROADCASTING' | 'FILLED', ref: 'IDLE' | 'BROADCASTING' | 'FILLED'}>({ gk: 'IDLE', ref: 'IDLE' });
  const [budget, setBudget] = useState(100);

  if (!match) return null;

  const handleSlotClick = (slot: PositionSlot) => {
      if (slot.status === 'OPEN') {
          setSelectedSlotId(slot.id === selectedSlotId ? null : slot.id);
      }
  };

  const handlePayment = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          onJoin();
      }, 1500);
  };

  // --- Talent Logic ---
  const openHireModal = (type: 'GK' | 'REF') => {
      setHireModalType(type);
      setBudget(type === 'GK' ? 120 : 250); // Initial budgets
  };

  const handleBudgetChange = (val: number) => {
      setBudget(val);
  };

  const submitHireRequest = () => {
      setHireModalType(null);
      
      // Simulate Broadcast
      if (hireModalType === 'GK') {
          setHiringState(prev => ({ ...prev, gk: 'BROADCASTING' }));
      } else {
          setHiringState(prev => ({ ...prev, ref: 'BROADCASTING' }));
      }
  };

  // --- Components ---

  const HireModal = () => {
      if (!hireModalType) return null;
      const isRef = hireModalType === 'REF';
      const commission = Math.floor(budget * 0.1);
      const total = budget + commission;

      return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
              <div className="bg-[#161B22] w-full max-w-md rounded-t-[32px] border-t border-white/10 p-6 relative animate-in slide-in-from-bottom duration-300 shadow-2xl">
                  
                  <button onClick={() => { setHireModalType(null); }} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                      <X size={24} />
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-2xl ${isRef ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                          {isRef ? <Scale size={24} /> : <Hand size={24} />}
                      </div>
                      <div>
                          <h3 className="text-xl font-black text-white">{isRef ? 'Resmi Hakem Talebi' : 'Profesyonel Kaleci Davet'}</h3>
                          <p className="text-xs text-gray-400">Kriterleri belirle, teklifi yayına al.</p>
                      </div>
                  </div>

                  {/* Budget Slider */}
                  <div className="bg-[#0A0E14] p-5 rounded-2xl border border-white/5 mb-6">
                      <div className="flex justify-between items-end mb-4">
                          <label className="text-xs font-bold text-gray-500 uppercase">Teklif Bütçesi</label>
                          <span className="text-2xl font-black text-[#FFFF00]">{budget}₺</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="500" 
                        step="10"
                        value={budget}
                        onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFFF00]"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-bold">
                          <span>50₺</span>
                          <span>500₺</span>
                      </div>
                  </div>

                  {/* Filters */}
                  <div className="space-y-4 mb-8">
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Rating Filtresi</label>
                          <div className="flex gap-2">
                              {['3.0+', '4.0+', '4.5+'].map((r, i) => (
                                  <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${i === 1 ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10'}`}>
                                      ⭐ {r}
                                  </button>
                              ))}
                          </div>
                      </div>
                      {!isRef && (
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Oyun Tarzı</label>
                              <div className="flex gap-2">
                                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#FFFF00] text-[#FFFF00] bg-[#FFFF00]/10">Refleks Ustası</button>
                                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 text-gray-400">Ayaklarına Hakim</button>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Financial Summary */}
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-6 px-2">
                      <span>Komisyon (%10)</span>
                      <span>+{commission}₺</span>
                  </div>

                  <button 
                    onClick={submitHireRequest}
                    className="w-full py-4 bg-[#FFFF00] text-black font-black text-lg rounded-2xl hover:bg-yellow-300 transition-colors shadow-[0_0_20px_rgba(255,255,0,0.3)] flex items-center justify-center gap-2"
                  >
                      {total}₺ • TEKLİFİ YAYINLA
                  </button>
                  <p className="text-[10px] text-center text-gray-600 mt-3">Tutar, Emanet Havuzu (Escrow) güvencesindedir.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col relative">
       
       <HireModal />

       <header className="p-6 flex items-center gap-4 sticky top-0 bg-[#0A0E14]/90 backdrop-blur-xl z-20 border-b border-white/5">
           <button onClick={onBack} className="p-3 bg-[#161B22] rounded-full text-white hover:bg-gray-800 transition-colors">
               <ArrowLeft size={20} />
           </button>
           <div>
               <h1 className="text-lg font-black text-white leading-none">Kadroya Gir</h1>
               <p className="text-[10px] text-gray-400 mt-1">{match.title}</p>
           </div>
       </header>

       <main className="flex-1 p-6 overflow-y-auto custom-scrollbar pb-40">
           
           {/* Interactive Pitch */}
           <div className="mb-8">
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 text-center">POZİSYONUNU SEÇ</h3>
               <div className="relative w-full aspect-[3/4] max-h-[50vh] bg-[#1B4332] rounded-[32px] border-4 border-[#161B22] shadow-2xl overflow-hidden mx-auto max-w-sm">
                    {/* Markings */}
                    <div className="absolute inset-4 border-2 border-white/20 rounded-sm pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b-2 border-l-2 border-r-2 border-white/20 rounded-b-lg pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-l-2 border-r-2 border-white/20 rounded-t-lg pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/10 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/10 rounded-full pointer-events-none"></div>

                    {/* Slots */}
                    {match.slots.map(slot => {
                        const isSelected = selectedSlotId === slot.id;
                        const isOpen = slot.status === 'OPEN';

                        return (
                            <button
                                key={slot.id}
                                onClick={() => handleSlotClick(slot)}
                                disabled={!isOpen}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center font-black text-[10px] transition-all duration-300 shadow-lg ${
                                    isSelected 
                                    ? 'bg-[#FFFF00] text-black scale-125 z-20 ring-4 ring-black/50' 
                                    : isOpen 
                                        ? 'bg-green-500 text-white animate-pulse hover:bg-green-400 hover:scale-110 z-10' 
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10'
                                }`}
                                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                            >
                                {isOpen ? (isSelected ? <CheckCircle2 size={20} /> : slot.role) : 'X'}
                            </button>
                        );
                    })}
               </div>
           </div>

           {/* TALENT HIRE SECTION */}
           <div className="mb-8 space-y-3">
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">PROFESYONEL DESTEK</h3>
               
               {/* Hire GK Button */}
               <button 
                 onClick={() => {
                   setHiringState(prev => ({...prev, gk: 'IDLE'}));
                   openHireModal('GK');
                 }}
                 disabled={hiringState.gk === 'BROADCASTING'}
                 className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all group relative overflow-hidden ${
                     hiringState.gk === 'BROADCASTING' 
                     ? 'bg-green-900/20 border border-green-500/50' 
                     : 'bg-[#1B4332] hover:bg-[#2d6a4f] shadow-lg shadow-green-900/30'
                 }`}
                 onClickCapture={() => hiringState.gk !== 'BROADCASTING' && openHireModal('GK')}
               >
                   {hiringState.gk === 'BROADCASTING' && <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>}
                   
                   <div className="flex items-center gap-3 relative z-10">
                       <div className={`p-2 rounded-xl ${hiringState.gk === 'BROADCASTING' ? 'bg-green-500 text-white animate-spin-slow' : 'bg-[#FFFF00] text-black'}`}>
                           {hiringState.gk === 'BROADCASTING' ? <Loader2 size={20} /> : <Hand size={20} />}
                       </div>
                       <div className="text-left">
                           <h4 className={`font-black text-sm ${hiringState.gk === 'BROADCASTING' ? 'text-green-400' : 'text-[#FFFF00]'}`}>
                               {hiringState.gk === 'BROADCASTING' ? 'Teklif Yayında... ⏳' : 'Profesyonel Kaleci Davet Et'}
                           </h4>
                           <p className="text-[10px] text-green-200/70">
                               {hiringState.gk === 'BROADCASTING' ? '3 Kaleci teklifini inceliyor' : 'Eksik kaleci maç keyfini kaçırmasın.'}
                           </p>
                       </div>
                   </div>
                   {hiringState.gk === 'IDLE' && (
                       <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg text-[10px] text-white font-bold">
                           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 12 Aktif
                       </div>
                   )}
               </button>

               {/* Hire Ref Button */}
               <button 
                 onClick={() => hiringState.ref !== 'BROADCASTING' && openHireModal('REF')}
                 className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${
                     hiringState.ref === 'BROADCASTING'
                     ? 'bg-yellow-900/10 border-yellow-500/50'
                     : 'bg-[#0A0E14] border-[#FFFF00]/50 hover:border-[#FFFF00] shadow-lg'
                 }`}
               >
                   {hiringState.ref === 'BROADCASTING' && <div className="absolute inset-0 bg-yellow-500/5 animate-pulse"></div>}

                   <div className="flex items-center gap-3 relative z-10">
                       <div className={`p-2 rounded-xl ${hiringState.ref === 'BROADCASTING' ? 'bg-yellow-500 text-black animate-spin-slow' : 'bg-gray-800 text-gray-400'}`}>
                           {hiringState.ref === 'BROADCASTING' ? <Loader2 size={20} /> : <Scale size={20} />}
                       </div>
                       <div className="text-left">
                           <h4 className={`font-black text-sm ${hiringState.ref === 'BROADCASTING' ? 'text-yellow-400' : 'text-white'}`}>
                               {hiringState.ref === 'BROADCASTING' ? 'Hakem Aranıyor... ⏳' : 'Resmi Hakem Talebi Oluştur'}
                           </h4>
                           <p className="text-[10px] text-gray-500">
                               {hiringState.ref === 'BROADCASTING' ? 'Bölgesel hakemlere iletildi' : 'Adil yönetim, keyifli maç.'}
                           </p>
                       </div>
                   </div>
                   {hiringState.ref === 'IDLE' && (
                        <div className="bg-yellow-500/10 text-yellow-500 text-[9px] font-black px-2 py-1 rounded border border-yellow-500/20">
                            LİSANSLI
                        </div>
                   )}
               </button>
           </div>

           {/* Match Info */}
           <div className="bg-[#161B22] rounded-[24px] p-5 border border-white/5 space-y-4">
               <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                   <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                       <MapPin size={24} />
                   </div>
                   <div>
                       <h4 className="font-bold text-white text-sm">{match.location}</h4>
                       <p className="text-xs text-gray-400">Yapay Çim • Kapalı Saha</p>
                   </div>
               </div>
               <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400">
                       <Clock size={24} />
                   </div>
                   <div>
                       <h4 className="font-bold text-white text-sm">{match.time}</h4>
                       <p className="text-xs text-gray-400">{match.date} • 60 Dk</p>
                   </div>
               </div>
           </div>

           {/* Safety Warning */}
           <div className="flex gap-3 p-4 bg-blue-900/20 border border-blue-500/30 rounded-2xl mt-4">
               <ShieldCheck className="text-blue-400 shrink-0" size={20} />
               <p className="text-xs text-blue-200 leading-relaxed">
                   Maça katıldığında <span className="font-bold text-white">Oyuncu Kuralları</span>'nı kabul etmiş sayılırsın. Maç saatinden 2 saat öncesine kadar iptal edebilirsin.
               </p>
           </div>

       </main>

       {/* Footer Actions */}
       <div className="absolute bottom-0 left-0 w-full bg-[#0A0E14] border-t border-white/10 p-6 pb-8">
           <div className="flex justify-between items-center mb-4">
               <div>
                   <p className="text-gray-400 text-xs font-bold uppercase">Toplam Tutar</p>
                   <p className="text-xs text-gray-600">Hizmet bedeli dahil</p>
               </div>
               <span className="text-3xl font-black text-white">{match.price}₺</span>
           </div>
           
           <button 
            disabled={!selectedSlotId || isProcessing}
            onClick={handlePayment}
            className={`w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedSlotId 
                ? 'bg-[#FFFF00] text-black hover:bg-yellow-300 shadow-yellow-900/20 active:scale-95' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
           >
               {isProcessing ? 'ÖDEME ALINIYOR...' : (selectedSlotId ? 'ÖDE VE KADROYA GİR' : 'POZİSYON SEÇ')}
           </button>
       </div>
    </div>
  );
};

export default MatchJoin;
