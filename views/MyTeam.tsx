
import React, { useState, useRef } from 'react';
import { Share2, X, UserPlus, Trash2, Shield, Swords, Activity } from 'lucide-react';
import { MY_TEAM } from '../constants';
import { PlayerStyle, Player, AppView } from '../types';

interface MyTeamProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

const StyleBadge: React.FC<{ style: PlayerStyle; small?: boolean }> = ({ style, small }) => {
  const getStyleConfig = (s: PlayerStyle) => {
    switch (s) {
      case PlayerStyle.KING: return { color: 'text-yellow-400', bg: 'bg-yellow-400', icon: '👑' };
      case PlayerStyle.MAGE: return { color: 'text-purple-400', bg: 'bg-purple-400', icon: '🔮' };
      case PlayerStyle.WARRIOR: return { color: 'text-red-400', bg: 'bg-red-400', icon: '🛡️' };
      case PlayerStyle.LOVER: return { color: 'text-pink-400', bg: 'bg-pink-400', icon: '❤️' };
    }
  };
  const config = getStyleConfig(style);

  if (small) {
    return (
      <div className={`w-4 h-4 rounded-full ${config.bg} text-black flex items-center justify-center text-[10px] border border-white shadow-sm`}>
        {config.icon}
      </div>
    );
  }

  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border flex items-center gap-1 bg-opacity-10 ${config.bg.replace('bg-', 'bg-opacity-10 ' + config.bg)} ${config.color} border-opacity-20 ${config.bg.replace('bg-', 'border-')}`}>
      {config.icon} {style}
    </span>
  );
};

const MyTeam: React.FC<MyTeamProps> = ({ onBack, onNavigate }) => {
  const [roster, setRoster] = useState<Player[]>(MY_TEAM.roster);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const pitchRef = useRef<HTMLDivElement>(null);

  // Formation Presets
  const applyFormation = (type: '2-3-1' | '3-2-1') => {
    const newRoster = [...roster];
    if (type === '2-3-1') {
      // GK, 2 Def, 3 Mid, 1 Fwd
      newRoster[0].x = 50; newRoster[0].y = 10; // FWD
      newRoster[1].x = 20; newRoster[1].y = 45; // LM
      newRoster[2].x = 50; newRoster[2].y = 45; // CM
      newRoster[3].x = 80; newRoster[3].y = 45; // RM
      newRoster[4].x = 30; newRoster[4].y = 80; // CB
      newRoster[5].x = 70; newRoster[5].y = 80; // CB
    } else if (type === '3-2-1') {
       newRoster[0].x = 50; newRoster[0].y = 15; // FWD
       newRoster[1].x = 35; newRoster[1].y = 50; // CM
       newRoster[2].x = 65; newRoster[2].y = 50; // CM
       newRoster[3].x = 20; newRoster[3].y = 80; // LB
       newRoster[4].x = 50; newRoster[4].y = 85; // CB
       newRoster[5].x = 80; newRoster[5].y = 80; // RB
    }
    setRoster(newRoster);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedPlayer && pitchRef.current) {
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

  const removePlayer = (id: string) => {
      setRoster(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col relative">
      
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-[#161B22]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div>
                <h1 className="font-black text-white text-lg tracking-tight uppercase">Taktik Tahtası</h1>
                <p className="text-[10px] text-gray-400 font-medium">Kaptan Modu: Aktif</p>
            </div>
        </div>
        <button className="p-2 bg-white/5 rounded-full text-white">
            <Share2 size={20} />
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        
        {/* Pitch Area */}
        <section>
             {/* Controls */}
            <div className="w-full flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <button onClick={() => applyFormation('2-3-1')} className="px-3 py-1.5 bg-[#161B22] border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:border-white/30 transition-colors">
                        2-3-1
                    </button>
                    <button onClick={() => applyFormation('3-2-1')} className="px-3 py-1.5 bg-[#161B22] border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:border-white/30 transition-colors">
                        3-2-1
                    </button>
                </div>
            </div>

            {/* Tactical Board */}
            <div 
                ref={pitchRef}
                className="relative w-full aspect-[2/3] max-h-[60vh] bg-[#1B4332] rounded-[24px] border-4 border-[#161B22] shadow-2xl overflow-hidden touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={() => setDraggedPlayer(null)}
                onPointerLeave={() => {
                    setDraggedPlayer(null);
                }}
            >
                {/* Markings */}
                <div className="absolute inset-4 border-2 border-white/30 rounded-sm pointer-events-none"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b-2 border-l-2 border-r-2 border-white/30 rounded-b-lg pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-l-2 border-r-2 border-white/30 rounded-t-lg pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/20 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full pointer-events-none"></div>

                {/* Draggable Players */}
                {roster.map((player) => (
                    <div
                        key={player.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing active:scale-110 transition-transform"
                        style={{ left: `${player.x}%`, top: `${player.y}%`, zIndex: (draggedPlayer === player.id) ? 50 : 10 }}
                        onPointerDown={(e) => {
                            e.currentTarget.releasePointerCapture(e.pointerId);
                            setDraggedPlayer(player.id);
                        }}
                    >
                        <div className="flex flex-col items-center gap-1 relative">
                            <div className={`relative w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden ${draggedPlayer === player.id ? 'ring-4 ring-[#FFFF00]' : ''}`}>
                                <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap flex items-center gap-1">
                                {player.name}
                                <StyleBadge style={player.style} small />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Team Stats Summary */}
        <section className="grid grid-cols-3 gap-3">
             <div className="bg-[#161B22] p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                 <Swords className="text-yellow-400 mb-1" size={20} />
                 <span className="text-xl font-black text-white">12</span>
                 <span className="text-[9px] text-gray-500 uppercase font-bold">Galibiyet</span>
             </div>
             <div className="bg-[#161B22] p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                 <Shield className="text-blue-400 mb-1" size={20} />
                 <span className="text-xl font-black text-white">%85</span>
                 <span className="text-[9px] text-gray-500 uppercase font-bold">Güven Skoru</span>
             </div>
             <div className="bg-[#161B22] p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                 <Activity className="text-green-400 mb-1" size={20} />
                 <span className="text-xl font-black text-white">4.8</span>
                 <span className="text-[9px] text-gray-500 uppercase font-bold">Form</span>
             </div>
        </section>

        {/* Roster List & Management */}
        <section className="bg-[#161B22] border border-white/5 rounded-[32px] p-5">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="font-black text-white">Kadro Yönetimi</h3>
                 <button 
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 bg-[#FFFF00] text-black px-3 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-300 transition-colors"
                 >
                     <UserPlus size={14} /> Ekle
                 </button>
             </div>
             <div className="space-y-3">
                 {roster.map((player) => (
                     <div key={player.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors">
                         <div className="flex items-center gap-3">
                             <img src={player.avatar} className="w-10 h-10 rounded-full bg-gray-700" alt={player.name} />
                             <div>
                                 <p className="font-bold text-white text-sm">{player.name}</p>
                                 <StyleBadge style={player.style} />
                             </div>
                         </div>
                         <button 
                            onClick={() => removePlayer(player.id)}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                         >
                             <Trash2 size={16} />
                         </button>
                     </div>
                 ))}
             </div>
        </section>

      </div>

      {/* Invite Modal Overlay */}
      {showInviteModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-[#161B22] w-full max-w-sm rounded-[32px] border border-white/10 p-6 shadow-2xl relative">
                   <button 
                    onClick={() => setShowInviteModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                   >
                       <X size={20} />
                   </button>
                   <h3 className="text-xl font-black text-white mb-4">Oyuncu Davet Et</h3>
                   <input type="text" placeholder="Kullanıcı Adı Ara..." className="w-full bg-[#0A0E14] border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-[#FFFF00] mb-4" />
                   
                   <p className="text-xs text-gray-500 font-bold uppercase mb-2">Rehberden Önerilenler</p>
                   <div className="space-y-2 mb-6">
                       <div className="flex items-center justify-between p-2 bg-[#0A0E14] rounded-xl border border-gray-800">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">A</div>
                               <span className="text-sm font-bold">Ahmet K.</span>
                           </div>
                           <button className="text-[#FFFF00] text-xs font-bold border border-[#FFFF00] px-2 py-1 rounded-lg hover:bg-[#FFFF00] hover:text-black transition-colors">Davet Et</button>
                       </div>
                       <div className="flex items-center justify-between p-2 bg-[#0A0E14] rounded-xl border border-gray-800">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold">M</div>
                               <span className="text-sm font-bold">Mehmet Y.</span>
                           </div>
                           <button className="text-[#FFFF00] text-xs font-bold border border-[#FFFF00] px-2 py-1 rounded-lg hover:bg-[#FFFF00] hover:text-black transition-colors">Davet Et</button>
                       </div>
                   </div>

                   <button className="w-full py-3 bg-[#FFFF00] text-black font-black rounded-xl hover:bg-yellow-300">
                       Bağlantı Paylaş
                   </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default MyTeam;
