
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Filter, MapPin, Star, Layers, Zap, 
  ChevronRight, X, Map as MapIcon, LayoutGrid, 
  Thermometer, Wind, Users, Heart, Droplets
} from 'lucide-react';
import { Pitch } from '../types';

interface PitchDiscoveryProps {
  onBack: () => void;
  onBook: () => void;
}

// --- HELPERS ---

const getGrade = (score: number): string => {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 50) return 'C';
  return 'D';
};

const getGradeColor = (grade: string): string => {
  if (grade.startsWith('A')) return 'text-emerald-400';
  if (grade.startsWith('B')) return 'text-yellow-400';
  if (grade.startsWith('C')) return 'text-orange-400';
  return 'text-red-400';
};

// --- COMPONENTS ---

const GradeBadge: React.FC<{ label: string; score: number; icon: any }> = ({ label, score, icon: Icon }) => {
  const grade = getGrade(score);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 mb-1">
        <Icon size={18} />
      </div>
      <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">{label}</span>
      <span className={`text-sm font-black ${getGradeColor(grade)}`}>{grade}</span>
    </div>
  );
};

const PitchCard: React.FC<{ pitch: Pitch; onClick: (pitch: Pitch) => void }> = ({ pitch, onClick }) => {
  const [timeLeft, setTimeLeft] = useState(Math.floor(Math.random() * 3600) + 1800); // Random 30-90 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(pitch)}
      className="relative w-full h-[420px] rounded-[40px] overflow-hidden mb-6 cursor-pointer group shadow-2xl"
    >
      {/* Background Image */}
      <img 
        src={pitch.image} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        alt={pitch.name}
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E14] via-black/20 to-transparent"></div>
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>

      {/* Top Badges */}
      <div className="absolute top-6 left-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-1.5">
            <Star size={12} className="text-yellow-400" fill="currentColor" />
            <span className="text-[10px] font-black text-white">{pitch.rating}</span>
          </div>
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{pitch.district}</span>
          </div>
        </div>
        
        {/* Dynamic Countdown for Last Minute Deals */}
        {pitch.occupancy > 80 && (
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-3 py-1.5 bg-red-600/90 backdrop-blur-md border border-red-400/30 rounded-full flex items-center gap-2 self-start"
          >
            <Zap size={12} className="text-white fill-current" />
            <span className="text-[9px] font-black text-white uppercase tracking-wider">SON FIRSAT: {formatTime(timeLeft)}</span>
          </motion.div>
        )}
      </div>

      {/* Quality Grades - Floating Glassmorphism Panel */}
      <div className="absolute top-6 right-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-4 shadow-2xl">
        <GradeBadge label="ZEMİN" score={pitch.grassQuality} icon={Layers} />
        <GradeBadge label="IŞIK" score={pitch.lighting} icon={Zap} />
        <GradeBadge label="SOYUNMA" score={pitch.lockerRoomQuality} icon={Droplets} />
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 w-full p-8">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 drop-shadow-lg">
              {pitch.name}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-gray-300">
                <MapPin size={14} className="text-[#FFFF00]" />
                <span className="text-xs font-bold">{pitch.distance}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <Users size={14} className="text-[#FFFF00]" />
                <span className="text-xs font-bold">7v7 • 8v8</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TOPLAM FİYAT</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[#FFFF00]">{pitch.totalPrice}</span>
              <span className="text-sm font-bold text-[#FFFF00]">₺</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PitchDiscovery: React.FC<PitchDiscoveryProps> = ({ onBack, onBook }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(0); // 0 = Today
  
  // Real Data State
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data on Mount
  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await fetch('/api/pitches');
      const data = await response.json();
      // Parse JSON fields and map to Pitch type
      const parsedData = data.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        district: p.location, // Mapping location to district
        rating: p.rating || 0,
        totalPrice: parseInt(p.price.replace(/[^0-9]/g, '')) || 0, // Extract number from price string
        image: p.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000',
        grassQuality: p.grassQuality || 0,
        lighting: p.lighting || 0,
        lockerRoomQuality: p.lockerRoomQuality || 0,
        amenities: p.amenities ? JSON.parse(p.amenities) : [],
        courts: p.courts ? JSON.parse(p.courts) : [],
        distance: '2.5 km', // Mock distance for now
        occupancy: 45 // Mock occupancy
      }));
      setPitches(parsedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pitches:', error);
      setLoading(false);
    }
  };
  
  // Filters
  const [filters, setFilters] = useState({
    district: 'Tümü',
    minRating: 0,
    maxPrice: 4000,
    hasAmenities: [] as string[]
  });

  const handleOpenDetail = (pitch: Pitch) => {
    setSelectedPitch(pitch);
    setIsDetailOpen(true);
    setSelectedCourtId(pitch.courts?.[0]?.id || null);
    setSelectedSlot(null);
  };

  const selectedCourt = useMemo(() => {
    if (!selectedPitch || !selectedCourtId) return null;
    return selectedPitch.courts?.find(c => c.id === selectedCourtId) || null;
  }, [selectedPitch, selectedCourtId]);

  const calculateTotal = () => {
    if (!selectedCourt) return selectedPitch?.totalPrice || 0;
    return selectedCourt.price;
  };

  const DAYS = ['Bugün', 'Yarın', 'Cuma', 'Cmt', 'Paz', 'Pzt', 'Sal'];

  const districts = useMemo(() => ['Tümü', ...Array.from(new Set(pitches.map(p => p.district)))], [pitches]);

  const filteredPitches = useMemo(() => {
    return pitches.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = filters.district === 'Tümü' || p.district === filters.district;
      const matchesRating = p.rating >= filters.minRating;
      const matchesPrice = p.totalPrice <= filters.maxPrice;
      
      return matchesSearch && matchesDistrict && matchesRating && matchesPrice;
    });
  }, [searchQuery, filters, pitches]);

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Header Section */}
      <header className="px-6 pt-8 pb-4 space-y-6 bg-gradient-to-b from-[#0A0E14] to-transparent sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center bg-[#161B22] border border-white/5 rounded-full text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#161B22] p-1 rounded-2xl border border-white/5 shadow-inner">
            <button 
              onClick={() => setViewMode('LIST')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${viewMode === 'LIST' ? 'bg-[#FFFF00] text-black shadow-lg shadow-yellow-900/20' : 'text-gray-500'}`}
            >
              <LayoutGrid size={14} /> LİSTE
            </button>
            <button 
              onClick={() => setViewMode('MAP')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${viewMode === 'MAP' ? 'bg-[#FFFF00] text-black shadow-lg shadow-yellow-900/20' : 'text-gray-500'}`}
            >
              <MapIcon size={14} /> HARİTA
            </button>
          </div>

          <button 
            onClick={() => setShowFilters(true)}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${showFilters ? 'bg-[#FFFF00] text-black' : 'bg-[#161B22] border border-white/5 text-white'}`}
          >
            <Filter size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FFFF00] transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="Saha veya bölge ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 bg-[#161B22] border border-white/5 rounded-[24px] pl-14 pr-6 text-sm font-bold outline-none focus:border-[#FFFF00]/50 focus:bg-[#1C232B] transition-all shadow-inner"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 custom-scrollbar">
        {viewMode === 'LIST' ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                {filteredPitches.length} TESİS BULUNDU
              </h2>
              {filters.district !== 'Tümü' && (
                <span className="text-[10px] font-black text-[#FFFF00] bg-[#FFFF00]/10 px-2 py-1 rounded-lg">
                  {filters.district}
                </span>
              )}
            </div>
            
            <AnimatePresence mode="popLayout">
              {filteredPitches.map((pitch) => (
                <PitchCard key={pitch.id} pitch={pitch} onClick={() => handleOpenDetail(pitch)} />
              ))}
            </AnimatePresence>

            {filteredPitches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-[#161B22] rounded-full flex items-center justify-center mb-4 border border-white/5">
                  <Search size={32} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-black italic text-white">SONUÇ BULUNAMADI</h3>
                <p className="text-gray-500 text-xs mt-2">Filtreleri temizleyip tekrar dene.</p>
                <button 
                  onClick={() => {
                    setFilters({ district: 'Tümü', minRating: 0, maxPrice: 4000, hasAmenities: [] });
                    setSearchQuery('');
                  }}
                  className="mt-6 text-[#FFFF00] text-[10px] font-black uppercase tracking-widest underline"
                >
                  FİLTRELERİ SIFIRLA
                </button>
              </div>
            )}
          </div>
        ) : (
          /* MAP VIEW PLACEHOLDER */
          <div className="h-full w-full bg-[#161B22] rounded-[40px] border border-white/5 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" />
             </div>
             <div className="relative z-10">
                <div className="w-24 h-24 bg-[#FFFF00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FFFF00]/20">
                  <MapIcon size={48} className="text-[#FFFF00]" />
                </div>
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">İnteraktif Harita</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-[240px]">Yakınındaki sahaları radar üzerinde keşfetmek için yakında aktif olacak.</p>
                <button 
                  onClick={() => setViewMode('LIST')}
                  className="mt-8 px-8 py-4 bg-[#FFFF00] text-black rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-yellow-900/20"
                >
                  LİSTEYE DÖN
                </button>
             </div>
          </div>
        )}
      </main>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#161B22] border-t border-white/10 rounded-t-[40px] p-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-8"></div>
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">FİLTRELE</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 bg-[#0A0E14] rounded-full flex items-center justify-center text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                {/* District Filter */}
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">BÖLGE SEÇİMİ</p>
                  <div className="flex flex-wrap gap-2">
                    {districts.map(d => (
                      <button 
                        key={d}
                        onClick={() => setFilters({...filters, district: d})}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black transition-all border ${filters.district === d ? 'bg-[#FFFF00] text-black border-[#FFFF00]' : 'bg-[#0A0E14] text-gray-400 border-white/5'}`}
                      >
                        {d.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">MAKSİMUM FİYAT</p>
                    <span className="text-sm font-black text-[#FFFF00]">{filters.maxPrice}₺</span>
                  </div>
                  <input 
                    type="range"
                    min="2800"
                    max="4000"
                    step="100"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                    className="w-full h-2 bg-[#0A0E14] rounded-lg appearance-none cursor-pointer accent-[#FFFF00]"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">MİNİMUM PUAN</p>
                  <div className="flex gap-2">
                    {[0, 3.5, 4.0, 4.5].map(r => (
                      <button 
                        key={r}
                        onClick={() => setFilters({...filters, minRating: r})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all border flex items-center justify-center gap-1 ${filters.minRating === r ? 'bg-[#FFFF00] text-black border-[#FFFF00]' : 'bg-[#0A0E14] text-gray-400 border-white/5'}`}
                      >
                        {r === 0 ? 'HEPSİ' : <><Star size={10} fill="currentColor" /> {r}+</>}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full h-16 bg-[#FFFF00] text-black rounded-2xl font-black text-sm tracking-widest uppercase shadow-[0_10px_30px_rgba(255,255,0,0.2)]"
                >
                  UYGULA
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Overlay */}
      <AnimatePresence>
        {isDetailOpen && selectedPitch && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-[#0A0E14] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
              >
                <ChevronRight className="rotate-90" size={24} />
              </button>
              <div className="flex gap-3">
                <button className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-40">
              {/* Hero Image */}
              <div className="relative h-[40vh] w-full">
                <img src={selectedPitch.image} className="w-full h-full object-cover" alt={selectedPitch.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E14] via-transparent to-transparent"></div>
              </div>

              <div className="px-6 -mt-10 relative z-10">
                <div className="bg-[#161B22] border border-white/5 rounded-[40px] p-8 shadow-2xl">
                  <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">{selectedPitch.name}</h1>
                  <p className="text-gray-400 text-sm flex items-center gap-2 mb-8">
                    <MapPin size={14} className="text-[#FFFF00]" /> {selectedPitch.location}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {selectedPitch.amenities.map(a => (
                      <span key={a} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {a}
                      </span>
                    ))}
                  </div>

                  {/* Date Selection */}
                  <div className="mb-10">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">TARİH SEÇİMİ</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                      {DAYS.map((day, i) => (
                        <button 
                          key={i}
                          onClick={() => setSelectedDate(i)}
                          className={`shrink-0 w-20 h-24 rounded-3xl flex flex-col items-center justify-center gap-1 border transition-all ${selectedDate === i ? 'bg-[#FFFF00] text-black border-[#FFFF00] shadow-lg shadow-yellow-900/20' : 'bg-[#0A0E14] border-white/5 text-gray-500'}`}
                        >
                          <span className="text-[10px] font-black uppercase">{day}</span>
                          <span className="text-xl font-black">{28 + i}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Court Selection (NEW) */}
                  {selectedPitch.courts && selectedPitch.courts.length > 0 && (
                    <div className="mb-10">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">SAHA SEÇİMİ</p>
                      <div className="space-y-3">
                        {selectedPitch.courts.map(court => (
                          <button 
                            key={court.id}
                            onClick={() => {
                              setSelectedCourtId(court.id);
                              setSelectedSlot(null);
                            }}
                            className={`w-full p-5 rounded-3xl border transition-all flex items-center justify-between group ${selectedCourtId === court.id ? 'bg-[#FFFF00] border-[#FFFF00] text-black shadow-lg shadow-yellow-900/20' : 'bg-[#0A0E14] border-white/5 text-white hover:border-white/20'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedCourtId === court.id ? 'bg-black/10' : 'bg-white/5'}`}>
                                {court.type === 'CLOSED' ? <Thermometer size={20} /> : <Wind size={20} />}
                              </div>
                              <div className="text-left">
                                <p className="font-black text-sm uppercase italic tracking-tight">{court.name}</p>
                                <p className={`text-[10px] font-bold ${selectedCourtId === court.id ? 'text-black/60' : 'text-gray-500'}`}>
                                  {court.type === 'CLOSED' ? 'KAPALI SAHA • ISITMALI' : 'AÇIK SAHA • DOĞAL HAVA'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black">{court.price}₺</p>
                              <p className={`text-[9px] font-bold uppercase ${selectedCourtId === court.id ? 'text-black/60' : 'text-gray-500'}`}>TOPLAM</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Slots */}
                  {selectedCourt && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">MÜSAİT SAATLER</p>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedCourt.slots.map((slot, i) => {
                          const isSelected = selectedSlot === slot.time;
                          const isBooked = slot.status === 'booked';
                          return (
                            <button 
                              key={i}
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot.time)}
                              className={`h-16 rounded-2xl border font-black text-sm transition-all flex flex-col items-center justify-center relative overflow-hidden ${
                                isBooked 
                                ? 'bg-gray-900 border-transparent text-gray-700 cursor-not-allowed' 
                                : isSelected 
                                  ? 'bg-[#FFFF00] border-[#FFFF00] text-black shadow-lg shadow-yellow-900/20' 
                                  : 'bg-[#0A0E14] border-white/5 text-white hover:border-white/20'
                              }`}
                            >
                              {slot.time}
                              {isBooked && <span className="text-[8px] mt-1 opacity-50">DOLU</span>}
                              {!isBooked && !isSelected && <span className="text-[8px] mt-1 text-[#FFFF00] opacity-50">{selectedCourt.price}₺</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#0A0E14] via-[#0A0E14] to-transparent pt-20">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">ÖDENECEK TUTAR</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{calculateTotal()}</span>
                    <span className="text-lg font-bold text-[#FFFF00]">₺</span>
                  </div>
                </div>
                <button 
                  disabled={!selectedSlot}
                  onClick={onBook}
                  className={`flex-[1.5] h-20 rounded-[24px] font-black text-lg uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-all shadow-2xl ${
                    selectedSlot 
                    ? 'bg-[#FFFF00] text-black shadow-yellow-900/40 active:scale-95' 
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {selectedSlot ? 'REZERVASYONU TAMAMLA' : 'SAAT SEÇİNİZ'}
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PitchDiscovery;
