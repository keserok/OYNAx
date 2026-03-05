
import React, { useState, useRef } from 'react';
import { UserRole, AppView, MatchHistoryItem, Team, Player, PlayerCardData } from '../types';
import { Shield, ChevronRight, Wallet, CreditCard, Briefcase, Users, Plus, X, Search, CheckCircle2, Layout } from 'lucide-react';
import LoyaltyCard from './LoyaltyCard';
import { MATCH_HISTORY, USER_TEAMS, MOCK_FRIENDS } from '../constants';
import { PlayerCard } from '../components/PlayerCard';

interface ProfileScreenProps {
  role: UserRole;
  onBack: () => void;
  onNavigate?: (view: AppView) => void;
  onOpenDiaryEntry: (id: string) => void; 
  isPro?: boolean;
}

const FormationMiniMap: React.FC<{ formation: string }> = ({ formation }) => {
  const is231 = formation === '2-3-1';
  
  return (
      <div className="w-16 h-20 bg-[#1B4332] rounded-lg border-2 border-white/10 relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-1/2 w-full h-px bg-white/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-white/20 rounded-full"></div>
          
          <div className={`absolute w-full h-full p-1 flex flex-col justify-between items-center opacity-80`}>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mb-1"></div>
              
              {is231 ? (
                  <>
                    <div className="flex gap-4"><div className="w-1.5 h-1.5 bg-white rounded-full"></div><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                    <div className="flex gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div><div className="w-1.5 h-1.5 bg-white rounded-full"></div><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>
                  </>
              ) : (
                  <>
                    <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-white rounded-full"></div><div className="w-1.5 h-1.5 bg-white rounded-full"></div><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                    <div className="flex gap-4"><div className="w-1.5 h-1.5 bg-white rounded-full"></div><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>
                  </>
              )}
          </div>
      </div>
  );
};

const DiaryCard: React.FC<{ item: MatchHistoryItem; onClick: () => void }> = ({ item, onClick }) => {
  return (
      <button 
        onClick={onClick}
        className="w-full text-left bg-[#161B22] border border-white/5 rounded-[24px] overflow-hidden transition-all duration-300 hover:bg-white/5 active:scale-[0.98] group"
      >
          <div className="p-4 flex items-center gap-4">
              <FormationMiniMap formation={item.formation} />
              
              <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white text-sm">{item.pitchName}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          item.result === 'WIN' ? 'bg-green-500/20 text-green-400' :
                          item.result === 'LOSS' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                          {item.score}
                      </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                  
                  <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                          {item.rosterSnapshot.slice(0, 5).map((p, i) => (
                              <img key={i} src={p.avatar} className="w-6 h-6 rounded-full border border-[#161B22]" alt={p.name} />
                          ))}
                          {item.rosterSnapshot.length > 5 && (
                              <div className="w-6 h-6 rounded-full bg-gray-800 border border-[#161B22] flex items-center justify-center text-[8px] text-white">
                                  +{item.rosterSnapshot.length - 5}
                              </div>
                          )}
                      </div>
                      <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
              </div>
          </div>
      </button>
  );
};

const TeamCard: React.FC<{ team: Team; onClick: () => void }> = ({ team, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="w-full text-left bg-[#161B22] border border-white/5 rounded-[24px] overflow-hidden transition-all duration-300 hover:border-white/10 active:scale-[0.98] group relative"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Shield size={80} />
            </div>
            
            <div className="p-5 flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 bg-[#0A0E14] rounded-2xl flex items-center justify-center border border-white/5 text-4xl shadow-inner">
                    {team.logo}
                </div>
                <div className="flex-1">
                    <h3 className="font-black text-white text-lg">{team.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                            <Users size={12} /> {team.roster.length} Oyuncu
                        </span>
                        <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-bold border border-green-500/20">
                            {team.wins}G - {team.losses}M
                        </span>
                    </div>
                </div>
                <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
            </div>
        </button>
    );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ role, onBack, onNavigate, onOpenDiaryEntry, isPro = false }) => {
  const [activeTab, setActiveTab] = useState<'LOYALTY' | 'DIARY' | 'TEAMS'>('DIARY');
  const [userTeams, setUserTeams] = useState<Team[]>(USER_TEAMS);
  
  // Create Team Modal State
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedLogo, setSelectedLogo] = useState('🦅');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  
  // Step 3: Formation Editing State
  const [draggedPlayerId, setDraggedPlayerId] = useState<string | null>(null);
  const pitchRef = useRef<HTMLDivElement>(null);

  const LOGO_OPTIONS = ['🦅', '🦁', '🦈', '🐂', '⚡', '🔥', '🛡️', '⚔️', '🐲'];

  const mockCardData: PlayerCardData = {
    overall: 88,
    tier: 'gold',
    stats: {
      pace: { value: 85, videoUrl: 'https://example.com/video1' },
      shooting: { value: 88, videoUrl: 'https://example.com/video2' },
      passing: { value: 82, videoUrl: null },
      dribbling: { value: 90, videoUrl: 'https://example.com/video3' },
      defense: { value: 45, videoUrl: null },
      physical: { value: 78, videoUrl: null }
    }
  };

  const togglePlayerSelection = (player: Player) => {
      if (selectedPlayers.find(p => p.id === player.id)) {
          setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
      } else {
          // Add with default coords based on index to prevent stacking
          const count = selectedPlayers.length;
          const defaultX = 50;
          const defaultY = 50 + (count * 5);
          setSelectedPlayers([...selectedPlayers, { ...player, x: defaultX, y: defaultY }]);
      }
  };

  const applyFormation = (type: '2-3-1' | '3-2-1') => {
      const newPlayers = [...selectedPlayers];
      // Basic logic to distribute first 7 players
      const formations: any = {
          '2-3-1': [
              {x: 50, y: 15}, // FW
              {x: 20, y: 45}, // LM
              {x: 50, y: 45}, // CM
              {x: 80, y: 45}, // RM
              {x: 30, y: 80}, // LB
              {x: 70, y: 80}, // RB
              {x: 50, y: 92}  // GK
          ],
          '3-2-1': [
              {x: 50, y: 15}, // FW
              {x: 35, y: 50}, // CM
              {x: 65, y: 50}, // CM
              {x: 20, y: 80}, // LB
              {x: 50, y: 85}, // CB
              {x: 80, y: 80}, // RB
              {x: 50, y: 92}  // GK
          ]
      };

      const coords = formations[type];
      newPlayers.forEach((p, i) => {
          if (coords[i]) {
              p.x = coords[i].x;
              p.y = coords[i].y;
          }
      });
      setSelectedPlayers(newPlayers);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedPlayerId && pitchRef.current) {
      const rect = pitchRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setSelectedPlayers(prev => prev.map(p => 
        p.id === draggedPlayerId ? { ...p, x: clampedX, y: clampedY } : p
      ));
    }
  };

  const handleCreateTeam = () => {
      const newTeam: Team = {
          id: `team-${Date.now()}`,
          name: newTeamName,
          logo: selectedLogo,
          colors: ['#000000', '#FFFFFF'], // Default colors
          wins: 0,
          losses: 0,
          playStyle: 'Dengeli',
          roster: selectedPlayers
      };
      setUserTeams([...userTeams, newTeam]);
      setShowCreateTeamModal(false);
      setCreateStep(1);
      setNewTeamName('');
      setSelectedPlayers([]);
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] font-sans relative flex flex-col">
       
       {/* Create Team Modal */}
       {showCreateTeamModal && (
           <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
               <div className="bg-[#161B22] w-full max-w-md h-[90vh] sm:h-auto rounded-t-[32px] sm:rounded-[32px] border-t sm:border border-white/10 p-0 shadow-2xl relative animate-in slide-in-from-bottom duration-300 flex flex-col">
                   
                   {/* Modal Header */}
                   <div className="p-6 border-b border-white/5 flex justify-between items-center">
                       <h3 className="text-xl font-black text-white">YENİ TAKIM KUR</h3>
                       <button onClick={() => setShowCreateTeamModal(false)} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white">
                           <X size={20} />
                       </button>
                   </div>

                   <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                       {createStep === 1 ? (
                           <div className="space-y-6 animate-in slide-in-from-right duration-300">
                               <div>
                                   <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Takım İsmi</label>
                                   <input 
                                     type="text" 
                                     value={newTeamName}
                                     onChange={(e) => setNewTeamName(e.target.value)}
                                     placeholder="Örn: Yenilmezler FC" 
                                     className="w-full bg-[#0A0E14] border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#FFFF00] transition-colors"
                                     autoFocus
                                   />
                               </div>

                               <div>
                                   <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Logo Seçimi</label>
                                   <div className="grid grid-cols-5 gap-3">
                                       {LOGO_OPTIONS.map(logo => (
                                           <button 
                                             key={logo}
                                             onClick={() => setSelectedLogo(logo)}
                                             className={`aspect-square rounded-xl flex items-center justify-center text-2xl border transition-all ${selectedLogo === logo ? 'bg-[#FFFF00]/10 border-[#FFFF00] scale-110 shadow-[0_0_15px_rgba(255,255,0,0.3)]' : 'bg-[#0A0E14] border-white/5 hover:border-white/20'}`}
                                           >
                                               {logo}
                                           </button>
                                       ))}
                                   </div>
                               </div>
                           </div>
                       ) : createStep === 2 ? (
                           <div className="space-y-4 animate-in slide-in-from-right duration-300">
                               <div className="bg-[#0A0E14] rounded-2xl p-3 border border-white/5 flex items-center gap-2 mb-2">
                                   <Search size={18} className="text-gray-500" />
                                   <input type="text" placeholder="Arkadaş Ara..." className="bg-transparent w-full text-sm text-white outline-none" />
                               </div>
                               
                               <div className="space-y-2">
                                   {MOCK_FRIENDS.map(friend => {
                                       const isSelected = selectedPlayers.some(p => p.id === friend.id);
                                       return (
                                           <div 
                                             key={friend.id} 
                                             onClick={() => togglePlayerSelection(friend)}
                                             className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-green-500/10 border-green-500/30' : 'bg-[#0A0E14] border-white/5 hover:border-white/10'}`}
                                           >
                                               <div className="flex items-center gap-3">
                                                   <img src={friend.avatar} className="w-10 h-10 rounded-full bg-gray-700" />
                                                   <div>
                                                       <p className="text-sm font-bold text-white">{friend.name}</p>
                                                       <p className="text-[10px] text-gray-500">{friend.position} • {friend.style}</p>
                                                   </div>
                                               </div>
                                               <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                                                   {isSelected && <CheckCircle2 size={14} className="text-black" />}
                                               </div>
                                           </div>
                                       );
                                   })}
                               </div>
                           </div>
                       ) : (
                           // STEP 3: Formation / Tactics
                           <div className="space-y-4 animate-in slide-in-from-right duration-300">
                               <div className="flex justify-between items-center">
                                   <h3 className="text-xs font-bold text-gray-500 uppercase">Sahadaki Diziliş</h3>
                                   <div className="flex gap-2">
                                       <button onClick={() => applyFormation('2-3-1')} className="px-2 py-1 bg-[#161B22] border border-white/10 rounded text-[10px] font-bold text-white hover:bg-white/10">2-3-1</button>
                                       <button onClick={() => applyFormation('3-2-1')} className="px-2 py-1 bg-[#161B22] border border-white/10 rounded text-[10px] font-bold text-white hover:bg-white/10">3-2-1</button>
                                   </div>
                               </div>

                               <div 
                                   ref={pitchRef}
                                   className="relative w-full aspect-[2/3] max-h-[50vh] bg-[#1B4332] rounded-[24px] border-4 border-[#161B22] shadow-2xl overflow-hidden touch-none"
                                   onPointerMove={handlePointerMove}
                                   onPointerUp={() => setDraggedPlayerId(null)}
                                   onPointerLeave={() => setDraggedPlayerId(null)}
                               >
                                   {/* Markings */}
                                   <div className="absolute inset-4 border-2 border-white/30 rounded-sm pointer-events-none"></div>
                                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b-2 border-l-2 border-r-2 border-white/30 rounded-b-lg pointer-events-none"></div>
                                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-l-2 border-r-2 border-white/30 rounded-t-lg pointer-events-none"></div>
                                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/20 pointer-events-none"></div>
                                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full pointer-events-none"></div>

                                   {/* Players */}
                                   {selectedPlayers.map((player) => (
                                       <div
                                           key={player.id}
                                           className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 hover:z-20"
                                           style={{ left: `${player.x}%`, top: `${player.y}%` }}
                                           onPointerDown={(e) => {
                                               e.currentTarget.releasePointerCapture(e.pointerId);
                                               setDraggedPlayerId(player.id);
                                           }}
                                       >
                                           <div className="flex flex-col items-center gap-1">
                                               <div className={`relative w-10 h-10 rounded-full border-2 shadow-lg overflow-hidden ${draggedPlayerId === player.id ? 'border-[#FFFF00] scale-110' : 'border-white'}`}>
                                                   <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                                               </div>
                                               <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-white whitespace-nowrap">
                                                   {player.name}
                                               </div>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                               <p className="text-center text-[10px] text-gray-500">Oyuncuları sürükleyerek pozisyonlarını ayarla.</p>
                           </div>
                       )}
                   </div>

                   <div className="p-6 border-t border-white/5 bg-[#161B22] relative z-10">
                       {createStep === 1 ? (
                           <button 
                             onClick={() => setCreateStep(2)}
                             disabled={!newTeamName}
                             className="w-full h-14 bg-[#FFFF00] text-black font-black text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors"
                           >
                               DEVAM ET
                           </button>
                       ) : createStep === 2 ? (
                           <div className="flex gap-3">
                               <button 
                                 onClick={() => setCreateStep(1)}
                                 className="w-1/3 h-14 bg-[#0A0E14] text-white font-bold text-sm rounded-2xl border border-white/10 hover:bg-white/5"
                               >
                                   GERİ
                               </button>
                               <button 
                                 onClick={() => setCreateStep(3)}
                                 disabled={selectedPlayers.length === 0}
                                 className="flex-1 h-14 bg-[#FFFF00] text-black font-black text-lg rounded-2xl hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-900/20 disabled:opacity-50"
                               >
                                   DİZİLİŞ AYARLA ({selectedPlayers.length})
                               </button>
                           </div>
                       ) : (
                           <div className="flex gap-3">
                               <button 
                                 onClick={() => setCreateStep(2)}
                                 className="w-1/3 h-14 bg-[#0A0E14] text-white font-bold text-sm rounded-2xl border border-white/10 hover:bg-white/5"
                               >
                                   GERİ
                               </button>
                               <button 
                                 onClick={handleCreateTeam}
                                 className="flex-1 h-14 bg-[#FFFF00] text-black font-black text-lg rounded-2xl hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2"
                               >
                                   <Layout size={18} /> TAKIMI OLUŞTUR
                               </button>
                           </div>
                       )}
                   </div>
               </div>
           </div>
       )}

       {/* Profile Header */}
       <div className="p-6 bg-[#0A0E14]/90 backdrop-blur-xl sticky top-0 z-20 border-b border-white/5">
           <div className="flex flex-col items-center pb-8">
               <PlayerCard 
                 name="Burak Kaptan" 
                 photo="https://i.pravatar.cc/150?u=kaptan" 
                 cardData={mockCardData} 
                 onShare={() => {
                   if (navigator.share) {
                     navigator.share({
                       title: 'Oyna Player Card',
                       text: 'Check out my stats on Oyna App!',
                       url: window.location.href,
                     }).catch(console.error);
                   } else {
                     alert('Sharing is not supported on this browser.');
                   }
                 }}
               />
               
               <div className="flex gap-8 mt-16">
                   <div className="text-center">
                       <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">TOPLAM MAÇ</p>
                       <p className="text-2xl font-black text-white">42</p>
                   </div>
                   <div className="w-px h-10 bg-white/10"></div>
                   <div className="text-center">
                       <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">GÜVENİLİRLİK</p>
                       <div className="flex items-center justify-center gap-1 text-green-400">
                           <Shield size={16} fill="currentColor" />
                           <span className="text-2xl font-black">%100</span>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* Tabs */}
       <div className="px-6 pt-4 pb-2 bg-[#0A0E14]">
           <div className="flex gap-6 border-b border-white/10 overflow-x-auto custom-scrollbar">
               <button 
                onClick={() => setActiveTab('DIARY')}
                className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'DIARY' ? 'text-[#FFFF00] border-[#FFFF00]' : 'text-gray-500 border-transparent hover:text-white'}`}
               >
                   Maç Günlüğü
               </button>
               <button 
                onClick={() => setActiveTab('TEAMS')}
                className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'TEAMS' ? 'text-[#FFFF00] border-[#FFFF00]' : 'text-gray-500 border-transparent hover:text-white'}`}
               >
                   Takımlarım
               </button>
               <button 
                onClick={() => setActiveTab('LOYALTY')}
                className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'LOYALTY' ? 'text-[#FFFF00] border-[#FFFF00]' : 'text-gray-500 border-transparent hover:text-white'}`}
               >
                   Sadakat
               </button>
           </div>
       </div>

       <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
           {activeTab === 'DIARY' && (
               <div className="space-y-4 animate-in fade-in duration-300">
                   <div className="flex items-center justify-between mb-2">
                       <span className="text-xs text-gray-500 font-bold">SON AKTİVİTELER</span>
                       <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">{MATCH_HISTORY.length} Kayıt</span>
                   </div>
                   {MATCH_HISTORY.map(item => (
                       <DiaryCard key={item.id} item={item} onClick={() => onOpenDiaryEntry(item.id)} />
                   ))}
               </div>
           )}

           {activeTab === 'TEAMS' && (
               <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="flex gap-3">
                     <button 
                      onClick={() => setShowCreateTeamModal(true)}
                      className="flex-1 py-4 border-2 border-dashed border-white/10 rounded-[24px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group"
                     >
                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FFFF00] group-hover:text-black transition-colors">
                             <Plus size={18} />
                         </div>
                         <span className="font-bold text-xs uppercase tracking-widest">Yeni Takım</span>
                     </button>
                     
                     <button 
                      onClick={() => onNavigate && onNavigate('TEAM_BUILDER')}
                      className="flex-1 py-4 border-2 border-dashed border-[#FFFF00]/20 rounded-[24px] flex flex-col items-center justify-center gap-2 text-[#FFFF00]/70 hover:text-[#FFFF00] hover:border-[#FFFF00]/50 hover:bg-[#FFFF00]/5 transition-all group"
                     >
                         <div className="w-8 h-8 rounded-full bg-[#FFFF00]/10 flex items-center justify-center group-hover:bg-[#FFFF00] group-hover:text-black transition-colors">
                             <Users size={18} />
                         </div>
                         <span className="font-bold text-xs uppercase tracking-widest">Akıllı Dengeleme</span>
                     </button>
                   </div>

                   <div className="space-y-4">
                       <div className="flex items-center justify-between mb-2">
                           <span className="text-xs text-gray-500 font-bold">AKTİF TAKIMLAR</span>
                       </div>
                       {userTeams.map(team => (
                           <TeamCard key={team.id} team={team} onClick={() => {}} />
                       ))}
                   </div>
               </div>
           )}

           {activeTab === 'LOYALTY' && (
               <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="w-full">
                       <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">SADAKAT KARTIM</h3>
                       <div className="transform scale-100 origin-top-left">
                           <LoyaltyCard embedMode={true} />
                       </div>
                   </div>

                   <div className="space-y-3">
                        <button onClick={() => onNavigate && onNavigate('WALLET')} className="w-full bg-[#161B22] border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Wallet className="text-blue-400" size={20} />
                                <span className="text-sm font-bold text-white">Cüzdan</span>
                            </div>
                            <span className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">450.00₺</span>
                        </button>
                        <button className="w-full bg-[#161B22] border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-green-400" size={20} />
                                <span className="text-sm font-bold text-white">Kayıtlı Kartlar</span>
                            </div>
                            <ChevronRight className="text-gray-600 group-hover:text-white" size={18} />
                        </button>
                        <button onClick={() => onNavigate && onNavigate('SCOUT_DASHBOARD')} className="w-full bg-gradient-to-r from-yellow-900/20 to-[#161B22] border border-yellow-500/20 p-4 rounded-2xl flex items-center justify-between hover:border-yellow-500/40 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Briefcase className="text-[#FFFF00]" size={20} />
                                <span className="text-sm font-bold text-white">Scout Merkezi</span>
                            </div>
                            <ChevronRight className="text-gray-600 group-hover:text-[#FFFF00]" size={18} />
                        </button>
                   </div>
               </div>
           )}
       </main>

    </div>
  );
};

export default ProfileScreen;
