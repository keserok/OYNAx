
import React from 'react';
import { ArrowLeft, Calendar, MapPin, Shield, Lock, Share2, Users, Layout } from 'lucide-react';
import { MatchHistoryItem } from '../types';
import { MATCH_HISTORY } from '../constants';

interface MatchDiaryDetailProps {
  diaryId: string | null;
  onBack: () => void;
}

const MatchDiaryDetail: React.FC<MatchDiaryDetailProps> = ({ diaryId, onBack }) => {
  const match = MATCH_HISTORY.find(m => m.id === diaryId);

  if (!match) return null;

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col relative">
      
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-[#0A0E14]/90 backdrop-blur-xl z-20 border-b border-white/5">
        <button 
            onClick={onBack} 
            className="w-11 h-11 flex items-center justify-center bg-[#161B22] rounded-full border border-white/5 text-white hover:bg-white/10 active:scale-95 transition-all"
        >
            <ArrowLeft size={20} />
        </button>
        <div className="text-center">
            <h1 className="text-sm font-black text-white tracking-widest uppercase">MAÇ DETAYI</h1>
            <p className="text-[10px] text-gray-500 font-bold">{match.date}</p>
        </div>
        <button className="w-11 h-11 flex items-center justify-center bg-[#161B22] rounded-full border border-white/5 text-white hover:bg-white/10 active:scale-95 transition-all">
            <Share2 size={20} />
        </button>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* 1. Score & Result Card */}
          <div className="bg-gradient-to-br from-[#161B22] to-[#0A0E14] border border-white/10 rounded-[32px] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><Shield size={120} /></div>
              
              <div className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 border ${
                  match.result === 'WIN' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                  match.result === 'LOSS' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
              }`}>
                  {match.result === 'WIN' ? 'GALİBİYET' : match.result === 'LOSS' ? 'MAĞLUBİYET' : 'BERABERLİK'}
              </div>

              <h2 className="text-6xl font-black text-white mb-2 tracking-tighter">{match.score}</h2>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <MapPin size={14} /> {match.pitchName}
              </div>
          </div>

          {/* 2. Formation Info Strip */}
          <div className="bg-[#161B22] border border-white/5 rounded-[24px] p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1B4332] rounded-xl flex items-center justify-center border border-white/10">
                      <Layout size={24} className="text-white" />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Diziliş</p>
                      <p className="text-lg font-black text-white">{match.formation}</p>
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Süre</p>
                  <p className="text-lg font-black text-white">60 Dk</p>
              </div>
          </div>

          {/* 3. The Visual Pitch (Tactical Board) */}
          <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 ml-2 flex items-center gap-2">
                  <Users size={14} /> SAHADAKİ DİZİLİŞ
              </h3>
              
              <div className="relative w-full aspect-[2/3] max-h-[500px] bg-[#1B4332] rounded-[32px] border-4 border-[#161B22] shadow-2xl overflow-hidden mx-auto max-w-sm">
                    {/* Field Markings */}
                    <div className="absolute inset-4 border-2 border-white/20 rounded-sm pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b-2 border-l-2 border-r-2 border-white/20 rounded-b-lg pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-l-2 border-r-2 border-white/20 rounded-t-lg pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white/10 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/10 rounded-full pointer-events-none"></div>

                    {/* Players */}
                    {match.rosterSnapshot.map((player, idx) => {
                        // Assuming current user is "Burak"
                        const isMe = player.name === "Burak"; 
                        
                        return (
                            <div
                                key={idx}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                                style={{ left: `${player.x}%`, top: `${player.y}%` }}
                            >
                                <div className={`relative w-10 h-10 rounded-full border-2 shadow-lg overflow-hidden ${isMe ? 'border-[#FFFF00] ring-4 ring-[#FFFF00]/30 scale-110' : 'border-white'}`}>
                                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${isMe ? 'bg-[#FFFF00] text-black' : 'bg-black/60 backdrop-blur-sm text-white'}`}>
                                    {player.name}
                                </div>
                            </div>
                        );
                    })}
               </div>
          </section>

          {/* 4. Personal Note (Diary) */}
          <section className="animate-in slide-in-from-bottom-10 duration-500">
              <div className="bg-[#161B22] border border-[#FFFF00]/10 rounded-[32px] p-6 relative">
                  <div className="flex items-center gap-2 mb-4 text-[#FFFF00]">
                      <Lock size={16} />
                      <h3 className="text-xs font-black uppercase tracking-widest">Kişisel Notun</h3>
                  </div>
                  
                  <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10"></div>
                      <p className="pl-4 text-gray-300 font-serif text-lg italic leading-relaxed">
                          "{match.personalNote}"
                      </p>
                  </div>

                  <p className="text-[10px] text-gray-600 mt-6 text-right">Sadece sen görebilirsin.</p>
              </div>
          </section>

      </main>
    </div>
  );
};

export default MatchDiaryDetail;
