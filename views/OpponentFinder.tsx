import React, { useState, useRef, useEffect } from 'react';
import { 
    ArrowLeft, MapPin, Clock, Filter, MessageSquare, 
    Swords, X, ChevronDown, User, Target, 
    Trophy, Heart, Users, Calendar, LayoutGrid, Map as MapIcon,
    ChevronRight, Shield, Zap, Star, Award, Cloud, Sun, CloudRain,
    Navigation, CreditCard, CheckCircle2, Loader2, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView, Team, PlayerCard, MatchScore } from '../types';

interface OpponentFinderProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

  // Mock Data for Teams with Formations and History
const MOCK_TEAMS: Team[] = [
  { 
    id: '1', 
    name: 'Boğaziçi United', 
    pitch: 'Sarıyer Belediye Halı Sahası', 
    time: '21:00 - 22:00', 
    date: '15 Mart 2024, Cuma',
    weather: { temp: 14, condition: 'CLOUDY' },
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=bogazici', 
    level: 'MEDIUM', 
    distance: '2.1 km',
    winRate: '65',
    avgAge: '24',
    matches: 42,
    colors: ['#EF4444', '#000000'],
    wins: 27,
    losses: 15,
    playStyle: 'Teknik',
    roster: [],
    coordinates: { x: 30, y: 40 },
    matchHistory: [
      { id: 'h1', opponent: 'Levent City', score: '3-1', result: 'WIN', date: '08.03.2024' },
      { id: 'h2', opponent: 'Karakartallar', score: '2-2', result: 'DRAW', date: '01.03.2024' },
      { id: 'h3', opponent: 'Dikilitaş SK', score: '1-2', result: 'LOSS', date: '22.02.2024' },
    ],
    formation: {
      name: '2-3-1',
      players: [
        { id: 'p1', name: 'Kerem', position: 'GK', rating: 82, isSpecial: false, avatar: 'https://i.pravatar.cc/150?u=p1', x: 50, y: 90 },
        { id: 'p2', name: 'Mert', position: 'DEF', rating: 88, isSpecial: true, avatar: 'https://i.pravatar.cc/150?u=p2', x: 30, y: 70 },
        { id: 'p3', name: 'Can', position: 'DEF', rating: 81, isSpecial: false, avatar: 'https://i.pravatar.cc/150?u=p3', x: 70, y: 70 },
        { id: 'p4', name: 'Arda', position: 'MID', rating: 85, isSpecial: false, avatar: 'https://i.pravatar.cc/150?u=p4', x: 20, y: 40 },
        { id: 'p5', name: 'Selim', position: 'MID', rating: 92, isSpecial: true, avatar: 'https://i.pravatar.cc/150?u=p5', x: 50, y: 40 },
        { id: 'p6', name: 'Burak', position: 'MID', rating: 84, isSpecial: false, avatar: 'https://i.pravatar.cc/150?u=p6', x: 80, y: 40 },
        { id: 'p7', name: 'Ege', position: 'FWD', rating: 89, isSpecial: true, avatar: 'https://i.pravatar.cc/150?u=p7', x: 50, y: 15 },
      ]
    }
  },
  { 
    id: '2', 
    name: 'Karakartallar FC', 
    pitch: 'Beşiktaş Çilekli Tesisleri', 
    time: '19:00 - 20:00', 
    date: '16 Mart 2024, Cumartesi',
    weather: { temp: 12, condition: 'RAINY' },
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=kartal', 
    level: 'HARD', 
    distance: '1.5 km',
    winRate: '82',
    avgAge: '28',
    matches: 156,
    colors: ['#000000', '#EF4444'],
    wins: 128,
    losses: 28,
    playStyle: 'Sert',
    roster: [],
    coordinates: { x: 60, y: 35 },
    matchHistory: [
      { id: 'k1', opponent: 'Boğaziçi Utd', score: '2-2', result: 'DRAW', date: '01.03.2024' },
      { id: 'k2', opponent: 'Yıldıztepe', score: '5-0', result: 'WIN', date: '25.02.2024' },
    ],
    formation: {
      name: '3-2-1',
      players: [
        { id: 'k1', name: 'Hakan', position: 'GK', rating: 85, isSpecial: false, avatar: 'https://i.pravatar.cc/150?u=k1', x: 50, y: 90 },
        { id: 'k2', name: 'Bülent', position: 'DEF', rating: 90, isSpecial: true, avatar: 'https://i.pravatar.cc/150?u=k2', x: 20, y: 70 },
        { id: 'k3', name: 'Vedat', position: 'DEF', rating: 84, isSpecial: false, avatar: 'https://i.pravatar.cc/150?u=k3', x: 50, y: 70 },
        { id: 'k4', name: 'Serdar', position: 'DEF', rating: 86, isSpecial: false, avatar: 'https://i.pravatar.cc/150?u=k4', x: 80, y: 70 },
        { id: 'k5', name: 'Tümer', position: 'MID', rating: 94, isSpecial: true, avatar: 'https://i.pravatar.cc/150?u=k5', x: 35, y: 40 },
        { id: 'k6', name: 'İlhan', position: 'MID', rating: 91, isSpecial: true, avatar: 'https://i.pravatar.cc/150?u=k6', x: 65, y: 40 },
        { id: 'k7', name: 'Pascal', position: 'FWD', rating: 95, isSpecial: true, avatar: 'https://i.pravatar.cc/150?u=k7', x: 50, y: 15 },
      ]
    }
  },
  { id: '3', name: 'Levent City', pitch: 'Levent Spor Tesisleri', time: '22:00 - 23:00', date: '17 Mart 2024', weather: { temp: 15, condition: 'SUNNY' }, logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=levent', level: 'EASY', distance: '3.2 km', winRate: '45', avgAge: '22', matches: 12, colors: ['#0000FF', '#FFFFFF'], wins: 5, losses: 7, playStyle: 'Hızlı', roster: [], coordinates: { x: 45, y: 55 } },
  { id: '4', name: 'Yıldıztepe SK', pitch: 'Bağcılar Arena', time: '20:00 - 21:00', date: '18 Mart 2024', weather: { temp: 13, condition: 'CLOUDY' }, logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=yildiz', level: 'MEDIUM', distance: '5.5 km', winRate: '55', avgAge: '25', matches: 30, colors: ['#FFFF00', '#000000'], wins: 16, losses: 14, playStyle: 'Dengeli', roster: [], coordinates: { x: 25, y: 65 } },
  { id: '5', name: 'Kadıköy Bulls', pitch: 'Fenerbahçe Dereağzı', time: '19:00 - 20:00', date: '19 Mart 2024', weather: { temp: 16, condition: 'SUNNY' }, logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=bulls', level: 'HARD', distance: '8.1 km', winRate: '78', avgAge: '27', matches: 88, colors: ['#FF0000', '#FFFFFF'], wins: 68, losses: 20, playStyle: 'Agresif', roster: [], coordinates: { x: 75, y: 25 } },
  { id: '6', name: 'Moda Sahil', pitch: 'Moda Spor Kompleksi', time: '23:00 - 00:00', date: '15 Mart 2024', weather: { temp: 14, condition: 'SUNNY' }, logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=moda', level: 'EASY', distance: '9.0 km', winRate: '40', avgAge: '21', matches: 8, colors: ['#00FF00', '#000000'], wins: 3, losses: 5, playStyle: 'Eğlence', roster: [], coordinates: { x: 85, y: 85 } },
  { id: '7', name: 'Maslak United', pitch: 'İTÜ Stadyumu', time: '18:00 - 19:00', date: '20 Mart 2024', weather: { temp: 15, condition: 'CLOUDY' }, logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=maslak', level: 'MEDIUM', distance: '4.0 km', winRate: '60', avgAge: '23', matches: 50, colors: ['#800080', '#FFFFFF'], wins: 30, losses: 20, playStyle: 'Taktik', roster: [], coordinates: { x: 40, y: 20 } },
  { id: '8', name: 'Etiler Elit', pitch: 'Etiler Lisesi Sahası', time: '21:00 - 22:00', date: '21 Mart 2024', weather: { temp: 13, condition: 'RAINY' }, logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=etiler', level: 'HARD', distance: '2.5 km', winRate: '70', avgAge: '29', matches: 110, colors: ['#FFA500', '#000000'], wins: 77, losses: 33, playStyle: 'Paslı', roster: [], coordinates: { x: 55, y: 50 } },
  { id: '9', name: 'Beykoz 1908', pitch: 'Beykoz Korusu', time: '10:00 - 11:00', date: '23 Mart 2024', weather: { temp: 18, condition: 'SUNNY' }, logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=beykoz', level: 'MEDIUM', distance: '12.0 km', winRate: '50', avgAge: '30', matches: 200, colors: ['#000000', '#FFFF00'], wins: 100, losses: 100, playStyle: 'Dengeli', roster: [], coordinates: { x: 90, y: 10 } },
  { id: '10', name: 'Üsküdar SK', pitch: 'Burhan Felek', time: '20:00 - 21:00', date: '22 Mart 2024', weather: { temp: 15, condition: 'SUNNY' }, logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=uskudar', level: 'HARD', distance: '6.5 km', winRate: '75', avgAge: '26', matches: 95, colors: ['#008000', '#FFFFFF'], wins: 71, losses: 24, playStyle: 'Hızlı', roster: [], coordinates: { x: 10, y: 60 } },
];

const OpponentFinder: React.FC<OpponentFinderProps> = ({ onBack, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'MAP' | 'LIST'>('MAP');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [lobbyState, setLobbyState] = useState<'NONE' | 'WAITING' | 'READY'>('NONE');
  const [activeStatTab, setActiveStatTab] = useState<'WINRATE' | 'MATCHES'>('WINRATE');
  const [zoomLevel, setZoomLevel] = useState(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Filters
  const [distanceFilter, setDistanceFilter] = useState('5km');
  const [levelFilter, setLevelFilter] = useState('Tümü');
  const [showFilters, setShowFilters] = useState(false);

  // Center the map on load
  useEffect(() => {
    if (mapContainerRef.current && viewMode === 'MAP') {
      const container = mapContainerRef.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    }
  }, [viewMode]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));

  const handleChallenge = () => {
    setLobbyState('WAITING');
    // Simulate waiting for opponent
    setTimeout(() => {
      setLobbyState('READY');
    }, 3000);
  };

  const FormationView = ({ formation }: { formation: any }) => (
    <div className="relative w-full aspect-[3/4] bg-[#1a0505] rounded-3xl border-2 border-red-900/30 overflow-hidden shadow-inner">
      {/* Field Lines */}
      <div className="absolute inset-0 border-4 border-red-500/10 m-4 rounded-xl pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 border-b-2 border-red-500/10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-20 border-t-2 border-red-500/10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-red-500/10 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/10 pointer-events-none"></div>

      {/* Players */}
      {formation.players.map((player: PlayerCard) => (
        <motion.div 
          key={player.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10"
          style={{ left: `${player.x}%`, top: `${player.y}%` }}
        >
          <div className={`relative w-12 h-12 rounded-full border-2 p-0.5 transition-all ${player.isSpecial ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] scale-110' : 'border-white/10'}`}>
            <img src={player.avatar} className="w-full h-full rounded-full object-cover grayscale-[50%]" alt={player.name} />
            {player.isSpecial && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-black flex items-center justify-center text-[8px] font-black bg-red-500 text-white shadow-lg">
                {player.rating}
              </div>
            )}
          </div>
          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${player.isSpecial ? 'bg-red-500 text-white' : 'bg-black/80 text-gray-400'}`}>
            {player.name}
          </span>
        </motion.div>
      ))}
    </div>
  );

  const WeatherIcon = ({ condition }: { condition: string }) => {
    switch (condition) {
      case 'SUNNY': return <Sun size={14} className="text-yellow-400" />;
      case 'RAINY': return <CloudRain size={14} className="text-blue-400" />;
      default: return <Cloud size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col font-sans relative overflow-hidden">
      
      {/* Header & Controls */}
      <header className="absolute top-0 left-0 w-full z-40 bg-gradient-to-b from-[#0A0E14] to-transparent pt-6 pb-10 px-6">
          <div className="flex items-center justify-between mb-4">
              <button onClick={onBack} className="p-3 bg-[#161B22]/80 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-white/20 transition-colors">
                  <ArrowLeft size={20} />
              </button>
              
              {/* View Toggle */}
              <div className="bg-[#161B22]/80 backdrop-blur-md p-1 rounded-full border border-white/10 flex gap-1">
                <button 
                  onClick={() => setViewMode('MAP')}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black transition-all ${viewMode === 'MAP' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <MapIcon size={14} /> HARİTA
                </button>
                <button 
                  onClick={() => setViewMode('LIST')}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black transition-all ${viewMode === 'LIST' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <LayoutGrid size={14} /> LİSTE
                </button>
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-full text-white border transition-colors backdrop-blur-md ${showFilters ? 'bg-red-500 border-red-500 text-white' : 'bg-[#161B22]/80 border-white/10 hover:bg-white/20'}`}
              >
                  <Filter size={20} />
              </button>
          </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {viewMode === 'MAP' ? (
          <div 
            ref={mapContainerRef}
            className="w-full h-full overflow-hidden relative bg-[#050812] flex items-center justify-center"
          >
              <div 
                className="w-full h-full relative transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                  {/* High Quality Map Background */}
                  <div className="absolute inset-0" style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200&h=1200')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'grayscale(100%) contrast(150%) brightness(30%)'
                  }}></div>

                  {/* Grid Lines for Tech Feel */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
                  
                  {/* Pulsing Pins */}
                  {MOCK_TEAMS.map((team) => {
                      const isSelected = selectedTeam?.id === team.id;
                      return (
                          <div 
                              key={team.id}
                              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'}`}
                              style={{ left: `${team.coordinates?.x}%`, top: `${team.coordinates?.y}%` }}
                              onClick={() => setSelectedTeam(team)}
                          >
                              <div className="relative">
                                {/* Glowing Ring */}
                                <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                                {/* Pulsing Ring */}
                                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40"></div>
                                
                                <div className={`relative w-16 h-16 rounded-full border-2 p-1 bg-[#161B22] shadow-2xl transition-all ${isSelected ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'border-white/20'}`}>
                                    <img src={team.logo} alt={team.name} className="w-full h-full rounded-full object-cover" />
                                </div>
                              </div>
                          </div>
                      );
                  })}
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-24 right-6 flex flex-col gap-2 z-40">
                <button onClick={handleZoomIn} className="w-12 h-12 bg-[#161B22]/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95">
                  <Plus size={24} />
                </button>
                <button onClick={handleZoomOut} className="w-12 h-12 bg-[#161B22]/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95">
                  <span className="text-2xl font-bold leading-none mb-1">-</span>
                </button>
              </div>
          </div>
        ) : (
          <div className="w-full h-full pt-32 px-6 overflow-y-auto custom-scrollbar space-y-4 pb-10">
            {MOCK_TEAMS.map((team) => (
              <motion.div 
                key={team.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={() => setSelectedTeam(team)}
                className="bg-[#161B22] border border-white/5 rounded-[28px] p-5 flex items-center gap-5 hover:border-red-500/30 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#0A0E14] border border-white/10 p-2 shrink-0">
                  <img src={team.logo} className="w-full h-full object-contain" alt={team.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter truncate group-hover:text-red-500 transition-colors">{team.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><MapPin size={10} /> {team.distance}</span>
                    <span className="text-[10px] font-bold text-red-500 uppercase">{team.level}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">W.R.</p>
                  <p className="text-2xl font-black text-white">%{team.winRate}</p>
                </div>
                <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Team Detail Overlay (Formation) */}
      <AnimatePresence>
          {selectedTeam && lobbyState === 'NONE' && (
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-[50] bg-[#0A0E14] flex flex-col"
              >
                  {/* Detail Header */}
                  <header className="p-6 flex items-center justify-between border-b border-white/5 bg-[#0A0E14]/80 backdrop-blur-xl sticky top-0 z-10">
                    <button onClick={() => setSelectedTeam(null)} className="w-10 h-10 bg-[#161B22] rounded-full flex items-center justify-center text-white border border-white/5">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="text-center">
                      <h2 className="text-sm font-black tracking-widest uppercase italic text-red-500">TAKIM ANALİZİ</h2>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">{selectedTeam.name}</p>
                    </div>
                    <div className="w-10" />
                  </header>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
                    {/* Team Profile */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-3xl bg-[#161B22] border-2 border-red-500/20 p-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <img src={selectedTeam.logo} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{selectedTeam.name}</h3>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black rounded-lg border border-red-500/20 uppercase">PRO KULÜP</span>
                          <span className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-black rounded-lg border border-white/10 uppercase">{selectedTeam.level}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setActiveStatTab('WINRATE')}
                        className={`p-5 rounded-3xl border transition-all text-center ${activeStatTab === 'WINRATE' ? 'bg-red-500 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-[#161B22] border-white/5'}`}
                      >
                        <Trophy size={24} className={`mx-auto mb-2 ${activeStatTab === 'WINRATE' ? 'text-white' : 'text-red-500'}`} />
                        <p className={`text-2xl font-black ${activeStatTab === 'WINRATE' ? 'text-white' : 'text-white'}`}>%{selectedTeam.winRate}</p>
                        <p className={`text-[10px] font-bold uppercase ${activeStatTab === 'WINRATE' ? 'text-white/70' : 'text-gray-500'}`}>WIN RATE</p>
                      </button>
                      <button 
                        onClick={() => setActiveStatTab('MATCHES')}
                        className={`p-5 rounded-3xl border transition-all text-center ${activeStatTab === 'MATCHES' ? 'bg-red-500 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-[#161B22] border-white/5'}`}
                      >
                        <Zap size={24} className={`mx-auto mb-2 ${activeStatTab === 'MATCHES' ? 'text-white' : 'text-red-500'}`} />
                        <p className={`text-2xl font-black ${activeStatTab === 'MATCHES' ? 'text-white' : 'text-white'}`}>{selectedTeam.matches}</p>
                        <p className={`text-[10px] font-bold uppercase ${activeStatTab === 'MATCHES' ? 'text-white/70' : 'text-gray-500'}`}>MATCHES</p>
                      </button>
                    </div>

                    {/* Conditional Stat View */}
                    <AnimatePresence mode="wait">
                      {activeStatTab === 'MATCHES' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">SON MAÇLAR</h4>
                          {selectedTeam.matchHistory?.map((match: MatchScore) => (
                            <div key={match.id} className="bg-[#161B22] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-black text-white uppercase">{match.opponent}</p>
                                <p className="text-[8px] text-gray-500 font-bold">{match.date}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-lg font-black text-white">{match.score}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black ${match.result === 'WIN' ? 'bg-green-500 text-black' : match.result === 'LOSS' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
                                  {match.result}
                                </span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Formation Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Shield size={16} className="text-red-500" /> DİZİLİŞ ({selectedTeam.formation?.name})
                        </h4>
                        <span className="text-[10px] text-red-500 font-black uppercase animate-pulse">ÖZEL KARTLAR AKTİF</span>
                      </div>
                      <FormationView formation={selectedTeam.formation} />
                    </div>

                    {/* Match Info - Highlighted */}
                    <div className="space-y-4">
                      <div className="bg-red-950/20 p-6 rounded-[32px] border border-red-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
                              <MapPin size={28} />
                            </div>
                            <div>
                              <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-1">ARANAN SAHA</p>
                              <p className="text-lg font-black text-white uppercase leading-tight">{selectedTeam.pitch}</p>
                            </div>
                          </div>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedTeam.pitch || '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all"
                          >
                            <Navigation size={20} />
                          </a>
                        </div>
                      </div>

                      <div className="bg-red-950/20 p-6 rounded-[32px] border border-red-500/20 relative overflow-hidden">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <Clock size={28} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-1">MAÇ DETAYI</p>
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-black text-white uppercase">{selectedTeam.time}</p>
                              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                                <WeatherIcon condition={selectedTeam.weather?.condition || 'SUNNY'} />
                                <span className="text-xs font-black text-white">{selectedTeam.weather?.temp}°C</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold mt-1">{selectedTeam.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-6 bg-[#0A0E14] border-t border-white/5 sticky bottom-0 z-20">
                    <button 
                      onClick={handleChallenge}
                      className="w-full h-16 bg-red-500 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(239,68,68,0.4)] active:scale-95 transition-all"
                    >
                      <Swords size={24} />
                      MEYDAN OKU
                    </button>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Pre-Lobby / Waiting Screen */}
      <AnimatePresence>
        {lobbyState !== 'NONE' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0A0E14] flex flex-col"
          >
            {/* Pulsing Background Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500 rounded-full blur-[120px]"
              />
            </div>

            <header className="p-6 flex items-center justify-between relative z-10">
              <button onClick={() => setLobbyState('NONE')} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10">
                <X size={20} />
              </button>
              <h2 className="text-sm font-black tracking-widest uppercase italic text-red-500">MAÇ LOBİSİ</h2>
              <div className="w-10" />
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
              {lobbyState === 'WAITING' ? (
                <div className="space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center border-2 border-red-500/30 animate-pulse">
                      <Loader2 size={48} className="text-red-500 animate-spin" />
                    </div>
                    <div className="absolute -inset-4 border-2 border-red-500/20 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">RAKİP BEKLENİYOR</h3>
                    <p className="text-gray-400 text-xs max-w-[240px] mx-auto">Meydan okumanız {selectedTeam?.name} kaptanına iletildi. Onay bekleniyor...</p>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-10 w-full"
                >
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-3xl bg-white/5 border-2 border-white/10 p-4">
                        <img src="https://api.dicebear.com/7.x/identicon/svg?seed=myteam" className="w-full h-full" />
                      </div>
                      <span className="text-[10px] font-black text-white uppercase">TAKIMINIZ</span>
                    </div>
                    <div className="relative">
                      <Swords size={32} className="text-red-500" />
                      <div className="absolute inset-0 blur-lg bg-red-500/50"></div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500 p-4 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        <img src={selectedTeam?.logo} className="w-full h-full" />
                      </div>
                      <span className="text-[10px] font-black text-red-500 uppercase">{selectedTeam?.name}</span>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-[32px] flex flex-col items-center gap-2">
                    <CheckCircle2 size={32} className="text-green-500" />
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">MEYDAN OKUMA KABUL EDİLDİ!</h4>
                    <p className="text-[10px] text-green-400 font-bold uppercase">Maç onaylandı, ödeme aşamasına geçebilirsiniz.</p>
                  </div>

                  <div className="bg-[#161B22] p-6 rounded-[32px] border border-white/5 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-black uppercase">SAHA</span>
                      <span className="text-xs font-bold text-white uppercase">{selectedTeam?.pitch}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-black uppercase">SAAT</span>
                      <span className="text-xs font-bold text-white uppercase">{selectedTeam?.time}</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-black uppercase">TOPLAM TUTAR</span>
                      <span className="text-xl font-black text-[#FFFF00]">2.800₺</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Lobby Footer */}
            <div className="p-6 bg-[#0A0E14] border-t border-white/5 sticky bottom-0 z-20">
              <button 
                onClick={() => onNavigate('PAYMENT')}
                disabled={lobbyState !== 'READY'}
                className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all shadow-lg ${lobbyState === 'READY' ? 'bg-[#FFFF00] text-black shadow-yellow-900/20 active:scale-95' : 'bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed'}`}
              >
                <CreditCard size={24} />
                ÖDEME YAP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OpponentFinder;
