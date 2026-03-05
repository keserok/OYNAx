
import React, { useState, useRef } from 'react';
import { ArrowLeft, Share2, MapPin, Calendar, Clock, CloudRain, Navigation, Shield, User, CheckCircle2, AlertCircle, XCircle, Edit3, Save, Hand, Scale, ExternalLink, MessageSquare, X, Star, Brain, ShoppingBag, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, AppView, PlayerStyle } from '../types';
import { MY_TEAM, PITCHES } from '../constants';

interface MatchLobbyProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

// Mock Data specific for this view
const MATCH_DATA = {
    pitchName: 'Arena Sport Center',
    pitchId: '1',
    date: '26 Mart',
    day: 'Çarşamba',
    time: '20:00 - 21:00',
    weather: '12°C, Parçalı Bulutlu',
    location: 'Fulya, Beşiktaş',
    totalPrice: 2800,
    pricePerPerson: 200,
    hiredReferee: { name: 'Cüneyt Ç.', avatar: 'https://i.pravatar.cc/150?u=ref1', status: 'CONFIRMED' },
    hiredGk: { name: 'Volkan D.', avatar: 'https://i.pravatar.cc/150?u=gk1', status: 'CONFIRMED' }
};

// Enriching the roster with payment status
const INITIAL_ROSTER: Player[] = MY_TEAM.roster.map((p, i) => ({
    ...p,
    paymentStatus: i < 4 ? 'PAID' : i === 4 ? 'PENDING' : 'UNPAID'
}));

const MatchLobby: React.FC<MatchLobbyProps> = ({ onBack, onNavigate }) => {
  const [roster, setRoster] = useState<Player[]>(INITIAL_ROSTER);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [isPitchDetailOpen, setIsPitchDetailOpen] = useState(false);
  const [selectedBoot, setSelectedBoot] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [rentedBoots, setRentedBoots] = useState<string[]>([]);
  const pitchRef = useRef<HTMLDivElement>(null);

  const selectedPitch = PITCHES.find(p => p.id === MATCH_DATA.pitchId);

  const BOOTS = [
      { id: 'b1', name: 'Nike Mercurial Vapor 15', price: 150, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', brand: 'Nike' },
      { id: 'b2', name: 'Adidas Predator Accuracy', price: 140, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80', brand: 'Adidas' },
      { id: 'b3', name: 'Puma Future Ultimate', price: 130, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80', brand: 'Puma' },
  ];

  const handleRentBoot = (boot: any) => {
      setSelectedBoot(boot);
  };

  const confirmPayment = () => {
      setIsPaying(true);
      setTimeout(() => {
          setRentedBoots([...rentedBoots, selectedBoot.id]);
          setIsPaying(false);
          setSelectedBoot(null);
          if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      }, 2000);
  };

  // Formation Editing Logic (Simplified Drag)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedPlayer && pitchRef.current && isEditing) {
      const rect = pitchRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setRoster(prev => prev.map(p => 
        p.id === draggedPlayer ? { ...p, x: clampedX, y: clampedY } : p
      ));
    }
  };

  const handleDirectionsClick = () => {
      const query = encodeURIComponent(`${MATCH_DATA.pitchName} ${MATCH_DATA.location}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col font-sans pb-24 relative">
      
      {/* 1. Header & Context */}
      <header className="sticky top-0 z-30 bg-[#0A0E14]/90 backdrop-blur-xl border-b border-white/5">
          <div className="p-4 flex items-center justify-between">
              <button onClick={onBack} className="p-2 bg-[#161B22] rounded-full text-white border border-white/5 hover:bg-white/10 transition-colors">
                  <ArrowLeft size={20} />
              </button>
              <h1 className="text-sm font-bold text-white tracking-widest uppercase">MAÇ LOBİSİ</h1>
              <button className="p-2 bg-[#161B22] rounded-full text-white border border-white/5 hover:bg-white/10 transition-colors">
                  <Share2 size={20} />
              </button>
          </div>
          
          {/* Match Info Strip */}
          <div className="px-6 pb-4">
              <div className="flex justify-between items-start">
                  <div>
                      <h2 className="text-2xl font-black text-white leading-none">{MATCH_DATA.pitchName}</h2>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {MATCH_DATA.date}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {MATCH_DATA.time}</span>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold border border-blue-500/20 flex items-center gap-1">
                          <CloudRain size={12} /> {MATCH_DATA.weather}
                      </div>
                  </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => setIsPitchDetailOpen(true)}
                    className="flex-1 bg-[#161B22] border border-white/10 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                  >
                      <ExternalLink size={14} /> Tesis Detayı
                  </button>
                  <button 
                    onClick={handleDirectionsClick}
                    className="flex-1 bg-[#161B22] border border-white/10 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                  >
                      <Navigation size={14} /> Yol Tarifi
                  </button>
              </div>
          </div>
      </header>

      <main className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* 2. Visual Formation (Editable) */}
          <section>
              <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="font-black text-white text-sm flex items-center gap-2">
                      <Shield size={16} className="text-[#FFFF00]" /> TAKIM DİZİLİŞİ
                  </h3>
                  <div className="flex gap-2">
                      <button 
                        onClick={() => onNavigate('STUDIO')}
                        className="bg-[#161B22] text-[#39FF14] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#39FF14]/30 hover:bg-[#39FF14]/10 transition-all"
                      >
                          <Brain size={14} /> STUDIO
                      </button>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 transition-all ${isEditing ? 'bg-[#FFFF00] text-black' : 'bg-[#161B22] text-white border border-white/10'}`}
                      >
                          {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                          {isEditing ? 'KAYDET' : 'HIZLI DÜZENLE'}
                      </button>
                  </div>
              </div>

              <div 
                  ref={pitchRef}
                  className={`relative w-full aspect-[16/10] bg-[#1B4332] rounded-[24px] border-4 ${isEditing ? 'border-[#FFFF00] shadow-[0_0_20px_rgba(255,255,0,0.2)]' : 'border-[#161B22]'} shadow-2xl overflow-hidden touch-none transition-all duration-300`}
                  onPointerMove={handlePointerMove}
                  onPointerUp={() => setDraggedPlayer(null)}
                  onPointerLeave={() => setDraggedPlayer(null)}
              >
                  {/* Pitch Markings */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                  <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white/20 pointer-events-none"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b-2 border-x-2 border-white/20 rounded-b-xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-x-2 border-white/20 rounded-t-xl pointer-events-none"></div>

                  {/* Players */}
                  {roster.map((player) => (
                      <div
                          key={player.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform ${isEditing ? 'cursor-grab active:cursor-grabbing z-50' : 'z-10'}`}
                          style={{ left: `${player.x}%`, top: `${player.y}%` }}
                          onPointerDown={(e) => {
                              if (isEditing) {
                                  e.currentTarget.releasePointerCapture(e.pointerId);
                                  setDraggedPlayer(player.id);
                              }
                          }}
                      >
                          <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 overflow-hidden shadow-lg transition-all ${draggedPlayer === player.id ? 'scale-125 border-[#FFFF00]' : 'border-white'}`}>
                              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                          </div>
                          <div className={`mt-1 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold whitespace-nowrap backdrop-blur-md ${player.paymentStatus === 'PAID' ? 'bg-green-500/80 text-white' : 'bg-black/60 text-white'}`}>
                              {player.name}
                          </div>
                      </div>
                  ))}
              </div>
              {isEditing && <p className="text-center text-[10px] text-[#FFFF00] mt-2 animate-pulse">Oyuncuları sürükleyerek yerlerini değiştirin.</p>}
          </section>

          {/* 3. Squad & Payment List */}
          <section>
              <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="font-black text-white text-sm">KADRO & ÖDEMELER</h3>
                  <span className="text-xs text-gray-400">{MATCH_DATA.pricePerPerson}₺ / Kişi</span>
              </div>
              
              <div className="bg-[#161B22] rounded-[24px] border border-white/5 overflow-hidden">
                  {roster.map((player, idx) => (
                      <div key={player.id} className="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                              <span className="text-gray-600 text-xs font-mono w-4">{idx + 1}</span>
                              <img src={player.avatar} className="w-8 h-8 rounded-full bg-gray-700 object-cover" alt={player.name} />
                              <div>
                                  <p className="text-sm font-bold text-white">{player.name}</p>
                                  <p className="text-[10px] text-gray-500">{player.style}</p>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                              {player.paymentStatus === 'PAID' && (
                                  <span className="text-green-400 text-xs font-bold flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg">
                                      <CheckCircle2 size={12} /> ÖDENDİ
                                  </span>
                              )}
                              {player.paymentStatus === 'PENDING' && (
                                  <span className="text-yellow-500 text-xs font-bold flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                                      <Clock size={12} /> BEKLİYOR
                                  </span>
                              )}
                              {player.paymentStatus === 'UNPAID' && (
                                  <button className="text-red-400 text-xs font-bold flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">
                                      <AlertCircle size={12} /> HATIRLAT
                                  </button>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </section>

          {/* 4. Hired Talent */}
          <section>
              <h3 className="font-black text-white text-sm mb-3 px-1">KADRO DESTEKLERİ</h3>
              <div className="grid grid-cols-2 gap-4">
                  {/* Referee Card */}
                  <div className="bg-[#161B22] p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-full -mr-2 -mt-2"></div>
                      <div className="flex items-center gap-3 mb-2 relative z-10">
                          <img src={MATCH_DATA.hiredReferee.avatar} className="w-10 h-10 rounded-full border-2 border-yellow-500/50" />
                          <div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Hakem</p>
                              <p className="text-sm font-bold text-white">{MATCH_DATA.hiredReferee.name}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold mt-1">
                          <CheckCircle2 size={10} /> {MATCH_DATA.hiredReferee.status}
                      </div>
                  </div>

                  {/* GK Card */}
                  <div className="bg-[#161B22] p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full -mr-2 -mt-2"></div>
                      <div className="flex items-center gap-3 mb-2 relative z-10">
                          <img src={MATCH_DATA.hiredGk.avatar} className="w-10 h-10 rounded-full border-2 border-green-500/50" />
                          <div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Kaleci</p>
                              <p className="text-sm font-bold text-white">{MATCH_DATA.hiredGk.name}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold mt-1">
                          <CheckCircle2 size={10} /> {MATCH_DATA.hiredGk.status}
                      </div>
                  </div>
              </div>
          </section>

      </main>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => onNavigate('CHAT')}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/40 hover:scale-110 transition-transform"
          >
              <MessageSquare size={24} />
          </button>
      </div>

      {/* Pitch Detail Modal */}
      <AnimatePresence>
          {isPitchDetailOpen && selectedPitch && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#0A0E14]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
              >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#161B22] border border-white/10 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl my-8"
                  >
                      <div className="relative h-48">
                          <img src={selectedPitch.image} className="w-full h-full object-cover" alt={selectedPitch.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent"></div>
                          <button 
                              onClick={() => setIsPitchDetailOpen(false)}
                              className="absolute top-4 left-4 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-bold flex items-center gap-2 hover:bg-black/60 transition-colors z-10"
                          >
                              <ArrowLeft size={16} /> Geri
                          </button>
                          <button 
                              onClick={() => setIsPitchDetailOpen(false)}
                              className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-10"
                          >
                              <X size={20} />
                          </button>
                      </div>
                      <div className="p-6 pt-2">
                          <h2 className="text-2xl font-black text-white mb-1">{selectedPitch.name}</h2>
                          <p className="text-sm text-gray-400 flex items-center gap-1 mb-4">
                              <MapPin size={14} /> {selectedPitch.location}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-2 mb-6">
                              <div className="bg-[#0A0E14] p-3 rounded-xl border border-white/5 flex flex-col items-center">
                                  <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Zemin</p>
                                  <p className="text-lg font-black text-[#39FF14]">A</p>
                              </div>
                              <div className="bg-[#0A0E14] p-3 rounded-xl border border-white/5 flex flex-col items-center">
                                  <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Işıklandırma</p>
                                  <p className="text-lg font-black text-blue-400">B+</p>
                              </div>
                              <div className="bg-[#0A0E14] p-3 rounded-xl border border-white/5 flex flex-col items-center">
                                  <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Soyunma Odası</p>
                                  <p className="text-lg font-black text-orange-400">C-</p>
                              </div>
                          </div>

                          {/* Boot Rental Section */}
                          <div className="mb-6">
                              <div className="flex items-center justify-between mb-3">
                                  <p className="text-[10px] text-gray-500 font-bold uppercase">Krampon Kiralama</p>
                                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">Tesis İçi</span>
                              </div>
                              <div className="space-y-3">
                                  {BOOTS.map(boot => (
                                      <div key={boot.id} className="flex items-center justify-between bg-[#0A0E14] p-3 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                          <div className="flex items-center gap-3">
                                              <img src={boot.image} className="w-12 h-12 rounded-xl object-cover" />
                                              <div>
                                                  <p className="text-xs font-bold text-white">{boot.name}</p>
                                                  <p className="text-[10px] text-gray-500">{boot.brand} • {boot.price}₺</p>
                                              </div>
                                          </div>
                                          {rentedBoots.includes(boot.id) ? (
                                              <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20">REZERVE EDİLDİ</span>
                                          ) : (
                                              <button 
                                                onClick={() => handleRentBoot(boot)}
                                                className="bg-[#161B22] text-white text-[10px] font-black px-4 py-2 rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all"
                                              >
                                                  KİRALA
                                              </button>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>

                          <div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">İmkanlar</p>
                              <div className="flex flex-wrap gap-2">
                                  {selectedPitch.amenities.map(a => (
                                      <span key={a} className="text-xs font-bold bg-[#0A0E14] text-gray-300 px-3 py-1.5 rounded-lg border border-white/5">
                                          {a}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Payment Modal for Boots */}
      <AnimatePresence>
          {selectedBoot && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
              >
                  <motion.div 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="bg-[#161B22] border border-white/10 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md p-6 shadow-2xl"
                  >
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-black text-white uppercase tracking-widest">ÖDEME & REZERVASYON</h3>
                          <button onClick={() => setSelectedBoot(null)} className="p-2 text-gray-400 hover:text-white"><X size={20} /></button>
                      </div>

                      <div className="bg-[#0A0E14] p-4 rounded-2xl border border-white/5 mb-6 flex items-center gap-4">
                          <img src={selectedBoot.image} className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                              <p className="text-sm font-bold text-white">{selectedBoot.name}</p>
                              <p className="text-xs text-gray-500">{selectedBoot.brand}</p>
                              <p className="text-lg font-black text-[#FFFF00] mt-1">{selectedBoot.price}₺</p>
                          </div>
                      </div>

                      <div className="space-y-4 mb-8">
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Kiralama Bedeli</span>
                              <span className="text-white font-bold">{selectedBoot.price}₺</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Hizmet Bedeli</span>
                              <span className="text-white font-bold">0₺</span>
                          </div>
                          <div className="h-px bg-white/5"></div>
                          <div className="flex justify-between text-lg">
                              <span className="text-white font-black">TOPLAM</span>
                              <span className="text-[#FFFF00] font-black">{selectedBoot.price}₺</span>
                          </div>
                      </div>

                      <button 
                        onClick={confirmPayment}
                        disabled={isPaying}
                        className="w-full h-16 bg-[#FFFF00] text-black rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                          {isPaying ? (
                              <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
                          ) : (
                              <>
                                  <CreditCard size={20} />
                                  ÖDEMEYİ TAMAMLA
                              </>
                          )}
                      </button>
                      <p className="text-center text-[10px] text-gray-500 mt-4 uppercase font-bold tracking-tighter">Ödeme yapıldıktan sonra kramponunuz tesis girişinde teslim edilecektir.</p>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

    </div>
  );
};

export default MatchLobby;
