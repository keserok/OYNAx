
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Scale, Star, Navigation, Sparkles } from 'lucide-react';
import { Goalkeeper, Referee } from '../../types';

interface MarketplaceCardProps {
  item: Goalkeeper | Referee;
  type: 'GK' | 'REF';
  onClick: () => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ item, type, onClick }) => {
  const isGK = type === 'GK';
  const accentColor = isGK ? 'text-green-400' : 'text-yellow-400';
  const accentBg = isGK ? 'bg-green-500' : 'bg-yellow-500';
  const glowColor = isGK ? 'shadow-green-500/20' : 'shadow-yellow-500/20';
  
  // Cast to any for easy access to stats
  const stats = item.stats as any;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className={`relative bg-[#161B22] rounded-[32px] overflow-hidden border ${item.isElite ? 'border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.15)]' : 'border-white/5'} cursor-pointer group transition-all duration-500`}
    >
      {/* Elite Badge */}
      {item.isElite && (
        <div className="absolute top-4 right-4 z-20 bg-[#FFD700] text-black text-[8px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Sparkles size={10} />
          ELITE
        </div>
      )}

      {/* Card Header/Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.avatar} 
          alt={item.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 flex flex-col items-center">
          <div className={`w-12 h-12 ${accentBg} rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-xl`}>
            {item.rating}
          </div>
          <div className="text-[10px] font-black text-white mt-1 tracking-widest uppercase">OVR</div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 pt-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.level || 'Professional'}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">ÜCRET</p>
            <p className={`text-xl font-black ${accentColor}`}>{item.fee}₺</p>
          </div>
        </div>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {isGK ? (
            <>
              <div className="bg-[#0A0E14] rounded-xl p-2 text-center border border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Refleks</p>
                <p className="text-xs font-black text-white">{stats.reflexes}</p>
              </div>
              <div className="bg-[#0A0E14] rounded-xl p-2 text-center border border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Uçuş</p>
                <p className="text-xs font-black text-white">{stats.diving}</p>
              </div>
              <div className="bg-[#0A0E14] rounded-xl p-2 text-center border border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Pozisyon</p>
                <p className="text-xs font-black text-white">{stats.positioning}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#0A0E14] rounded-xl p-2 text-center border border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Maç</p>
                <p className="text-xs font-black text-white">{stats.matchCount}</p>
              </div>
              <div className="bg-[#0A0E14] rounded-xl p-2 text-center border border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Kart Ort.</p>
                <p className="text-xs font-black text-white">{stats.avgCards}</p>
              </div>
              <div className="bg-[#0A0E14] rounded-xl p-2 text-center border border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Mesafe</p>
                <p className="text-xs font-black text-white">{stats.avgDistance}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Navigation size={12} className="text-gray-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.distance || '2.4'} km yakında</span>
          </div>
          <div className="flex items-center gap-1">
            {isGK ? <Shield size={12} className="text-green-500/50" /> : <Scale size={12} className="text-yellow-500/50" />}
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{isGK ? 'GK' : 'REF'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
