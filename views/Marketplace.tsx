
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, Map as MapIcon, List, Minus, Plus, Zap, Activity, MessageSquare, Shield, Scale, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { REFEREES, GOALKEEPERS } from '../constants';
import { Referee, Goalkeeper } from '../types';
import { MarketplaceCard } from '../components/Marketplace/MarketplaceCard';
import { MarketplaceMap } from '../components/Marketplace/MarketplaceMap';

interface MarketplaceProps {
  type: 'REF' | 'GK';
  onBack: () => void;
  onSelect?: (item: Goalkeeper | Referee) => void;
}

const SkillBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="space-y-1">
        <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{label}</span>
            <span className="text-[10px] font-black text-white">{value}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${color} rounded-full`}
            />
        </div>
    </div>
);

const Marketplace: React.FC<MarketplaceProps> = ({ type: initialType, onBack, onSelect }) => {
  const [activeTab, setActiveTab] = useState<'GK' | 'REF'>(initialType);
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [selectedProfile, setSelectedProfile] = useState<Goalkeeper | Referee | null>(null);
  const [isHiring, setIsHiring] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isBidding, setIsBidding] = useState(false);

  // If initialType is provided, we might want to lock the tab or just default to it.
  // The user said "yalnızca ... çıksın", so I'll hide the tabs if initialType is passed.
  const isLocked = !!initialType;

  const profiles = activeTab === 'GK' ? GOALKEEPERS : REFEREES;

  const handleSelect = (p: Goalkeeper | Referee) => {
      setSelectedProfile(p);
      setBidAmount(p.fee);
  };

  const confirmHire = (isQuick: boolean = false) => {
      setIsHiring(true);
      setTimeout(() => {
          setIsHiring(false);
          if (onSelect && selectedProfile) {
              onSelect(selectedProfile);
          } else {
              setSelectedProfile(null);
              setIsBidding(false);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
          }
          if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      }, 2000);
  };

  const handleBid = () => {
      if (bidAmount >= (selectedProfile?.fee || 0)) {
          confirmHire(true);
      } else {
          setIsHiring(true);
          setTimeout(() => {
              setIsHiring(false);
              if (onSelect && selectedProfile) {
                  onSelect(selectedProfile);
              } else {
                  setSelectedProfile(null);
                  setIsBidding(false);
                  alert("Teklifiniz iletildi! Karşı tarafın onayı bekleniyor.");
              }
          }, 1500);
      }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] relative flex flex-col font-sans overflow-hidden">
      
      {/* 1. Header */}
      <header className="px-6 pt-6 pb-4 flex justify-between items-center bg-[#0A0E14]/80 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
        <div className="flex flex-col items-start">
            <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase">
                {activeTab === 'GK' ? 'TRANSFER MARKET: KALECİ' : 'TRANSFER MARKET: HAKEM'}
            </h1>
            <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeTab === 'GK' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-[8px] font-bold text-gray-500 uppercase">Profesyonel Arama Aktif</span>
            </div>
        </div>
        <button 
            onClick={() => setViewMode(viewMode === 'LIST' ? 'MAP' : 'LIST')}
            className="w-10 h-10 flex items-center justify-center bg-[#161B22] rounded-full text-[#FFFF00] border border-[#FFFF00]/20"
        >
          {viewMode === 'LIST' ? <MapIcon size={20} /> : <List size={20} />}
        </button>
      </header>

      {/* 2. Tabs (Hidden if locked) */}
      {!isLocked && (
        <div className="px-6 py-4 bg-[#0A0E14]">
            <div className="bg-[#161B22] p-1 rounded-2xl flex border border-white/5 shadow-inner">
                <button 
                  onClick={() => setActiveTab('GK')}
                  className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'GK' ? 'bg-green-500 text-black shadow-lg shadow-green-900/20' : 'text-gray-500'}`}
                >
                   <Shield size={14} /> KALECİLER
                </button>
                <button 
                  onClick={() => setActiveTab('REF')}
                  className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'REF' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-900/20' : 'text-gray-500'}`}
                >
                   <Scale size={14} /> HAKEMLER
                </button>
            </div>
        </div>
      )}

      {/* 3. Main Content */}
      <div className="flex-1 relative overflow-hidden">
          {viewMode === 'LIST' ? (
              <div className="h-full px-6 pb-24 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 gap-6 pt-2">
                      {profiles.map(p => (
                          <MarketplaceCard 
                            key={p.id} 
                            item={p} 
                            type={activeTab}
                            onClick={() => handleSelect(p)} 
                          />
                      ))}
                  </div>
              </div>
          ) : (
              <MarketplaceMap 
                items={profiles} 
                type={activeTab}
                onSelect={handleSelect} 
              />
          )}
      </div>

      {/* Detailed View Modal */}
      <AnimatePresence>
          {selectedProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed inset-0 z-50 bg-[#0A0E14] flex flex-col overflow-y-auto"
              >
                  {/* Modal Header */}
                  <div className="p-6 flex justify-between items-center sticky top-0 z-10 bg-[#0A0E14]/80 backdrop-blur-md border-b border-white/5">
                      <button onClick={() => setSelectedProfile(null)} className="p-3 bg-[#161B22] rounded-full text-white border border-white/5">
                          <ChevronLeft size={24} />
                      </button>
                      <div className="text-center">
                          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">{selectedProfile.name}</h2>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === 'GK' ? 'text-green-400' : 'text-yellow-400'}`}>
                              {activeTab === 'GK' ? 'PROFESYONEL KALECİ' : 'PROFESYONEL HAKEM'}
                          </p>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${activeTab === 'GK' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                          {activeTab === 'GK' ? <Shield size={24} /> : <Scale size={24} />}
                      </div>
                  </div>

                  <div className="p-6 space-y-8 pb-40">
                      {/* Hero Section */}
                      <div className="flex gap-6 items-center">
                          <div className={`w-32 h-40 rounded-3xl overflow-hidden border-2 shadow-2xl relative ${selectedProfile.isElite ? 'border-[#FFFF00]' : 'border-white/10'}`}>
                              <img src={selectedProfile.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                              <div className={`absolute bottom-0 left-0 w-full text-black text-[10px] font-black text-center py-1 ${activeTab === 'GK' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                  {selectedProfile.rating} RATING
                              </div>
                          </div>
                          <div className="flex-1 space-y-3">
                              <div className="bg-[#161B22] p-3 rounded-2xl border border-white/5">
                                  <p className="text-[8px] text-gray-500 font-bold uppercase">Bölge</p>
                                  <p className="text-xs font-black text-white truncate">{selectedProfile.preferredZones[0]}</p>
                              </div>
                              <div className="bg-[#161B22] p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                                  <Navigation size={16} className={activeTab === 'GK' ? 'text-green-400' : 'text-yellow-400'} />
                                  <div>
                                      <p className="text-[8px] text-gray-500 font-bold uppercase">Uzaklık</p>
                                      <p className="text-xs font-black text-white">{selectedProfile.distance || '1.2'} km Yakınında</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* STATS GRID */}
                      <div className="bg-[#161B22] rounded-[32px] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                          <h3 className="text-sm font-black text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                              <Zap size={16} className={activeTab === 'GK' ? 'text-green-400' : 'text-yellow-400'} /> PERFORMANS ANALİZİ
                          </h3>
                          
                          <div className="grid grid-cols-1 gap-6">
                              {activeTab === 'GK' ? (
                                  <>
                                      <SkillBar label="Refleksler" value={(selectedProfile as Goalkeeper).stats.reflexes} color="bg-green-400" />
                                      <SkillBar label="Uçuş (Diving)" value={(selectedProfile as Goalkeeper).stats.diving} color="bg-emerald-400" />
                                      <SkillBar label="Pozisyon Alma" value={(selectedProfile as Goalkeeper).stats.positioning} color="bg-teal-400" />
                                      <SkillBar label="Oyun Kurma" value={(selectedProfile as Goalkeeper).stats.distribution} color="bg-green-500" />
                                      <SkillBar label="Bire Bir" value={(selectedProfile as Goalkeeper).stats.oneOnOne} color="bg-lime-400" />
                                      <SkillBar label="Hava Hakimiyeti" value={(selectedProfile as Goalkeeper).stats.aerialReach} color="bg-green-300" />
                                  </>
                              ) : (
                                  <>
                                      <SkillBar label="Otorite" value={(selectedProfile as Referee).stats.authority} color="bg-yellow-400" />
                                      <SkillBar label="Kondisyon" value={(selectedProfile as Referee).stats.fitness} color="bg-amber-400" />
                                      <SkillBar label="İletişim" value={(selectedProfile as Referee).stats.communication} color="bg-orange-400" />
                                      <SkillBar label="Kart Yönetimi" value={85} color="bg-yellow-500" />
                                      <SkillBar label="Pozisyon Takibi" value={90} color="bg-yellow-300" />
                                      <SkillBar label="VAR Uyumu" value={95} color="bg-yellow-600" />
                                  </>
                              )}
                          </div>
                      </div>

                      {/* BIDDING & ACTION AREA */}
                      <div className="fixed bottom-0 left-0 w-full p-6 bg-[#0A0E14]/90 backdrop-blur-xl border-t border-white/10 z-20">
                          <div className="max-w-md mx-auto space-y-4">
                              
                              {isBidding ? (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#161B22] p-6 rounded-[32px] border border-[#FFFF00]/20"
                                  >
                                      <div className="flex justify-between items-center mb-6">
                                          <p className="text-xs font-black text-white uppercase italic">TEKLİF VER</p>
                                          <button onClick={() => setIsBidding(false)} className="text-gray-500 hover:text-white">VAZGEÇ</button>
                                      </div>
                                      
                                      <div className="flex items-center justify-center gap-6 mb-8">
                                          <button 
                                            onClick={() => setBidAmount(Math.max(0, bidAmount - 10))}
                                            className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-white"
                                          >
                                              <Minus size={24} />
                                          </button>
                                          <div className="text-center">
                                              <span className="text-5xl font-black text-white tracking-tighter">{bidAmount}</span>
                                              <span className="text-xl font-bold text-[#FFFF00] ml-1">₺</span>
                                          </div>
                                          <button 
                                            onClick={() => setBidAmount(bidAmount + 10)}
                                            className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-white"
                                          >
                                              <Plus size={24} />
                                          </button>
                                      </div>

                                      <button 
                                        onClick={handleBid}
                                        disabled={isHiring}
                                        className={`w-full h-16 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all
                                            ${bidAmount >= selectedProfile.fee ? 'bg-[#FFFF00] text-black' : 'bg-white text-black'}`}
                                      >
                                          {isHiring ? <Activity className="animate-spin" /> : (bidAmount >= selectedProfile.fee ? 'HEMEN KİRALA' : 'TEKLİFİ GÖNDER')}
                                      </button>
                                  </motion.div>
                              ) : (
                                  <div className="flex gap-4">
                                      <button 
                                        onClick={() => setIsBidding(true)}
                                        className="flex-1 h-16 bg-[#161B22] text-white rounded-2xl font-black text-xs tracking-widest border border-white/10 flex items-center justify-center gap-2"
                                      >
                                          <MessageSquare size={18} /> TEKLİF VER
                                      </button>
                                      <button 
                                        onClick={() => confirmHire(true)}
                                        disabled={isHiring}
                                        className={`flex-[1.5] h-16 rounded-2xl font-black text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all
                                            ${activeTab === 'GK' ? 'bg-green-500 text-black shadow-green-900/20' : 'bg-yellow-500 text-black shadow-yellow-900/20'}`}
                                      >
                                          {isHiring ? <Activity className="animate-spin" /> : (
                                              <>
                                                  <Zap size={18} /> HIZLI KİRALA ({selectedProfile.fee}₺)
                                              </>
                                          )}
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
          {showToast && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]"
              >
                  <div className={`px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center ${activeTab === 'GK' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'}`}>
                      <Activity size={32} className="mb-2 animate-pulse" />
                      <h3 className="font-black text-xl italic uppercase">TRANSFER TAMAMLANDI</h3>
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Profesyonel kadroya dahil edildi!</p>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

    </div>
  );
};

export default Marketplace;
