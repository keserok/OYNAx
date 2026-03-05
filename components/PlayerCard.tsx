import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, QrCode, Share2 } from 'lucide-react';
import { PlayerCardData } from '../types';

interface PlayerCardProps {
  name: string;
  photo: string;
  cardData: PlayerCardData;
  onShare?: () => void;
}

const VideoModal = ({ url, statName, onClose }: { url: string, statName: string, onClose: () => void }) => (
  <AnimatePresence>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#161B22] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0A0E14]">
          <div className="flex items-center gap-2">
            <Play size={16} className="text-[#FFFF00]" />
            <h3 className="text-white font-black uppercase tracking-widest">{statName} <span className="text-gray-400">ANALİZİ</span></h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="aspect-video bg-black relative flex items-center justify-center">
          {/* Mock Video Player */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
          <img src="https://images.unsplash.com/photo-1574629810360-7efbb192453a?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Video Thumbnail" />
          <div className="w-16 h-16 rounded-full bg-[#FFFF00]/20 flex items-center justify-center backdrop-blur-md border border-[#FFFF00]/50 z-20 cursor-pointer hover:scale-110 transition-transform">
            <Play size={32} className="text-[#FFFF00] ml-1" />
          </div>
          <div className="absolute bottom-4 left-4 z-20">
            <p className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-md">Oyna AI Vision™</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export const PlayerCard: React.FC<PlayerCardProps> = ({ name, photo, cardData, onShare }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{url: string, name: string} | null>(null);

  const getTierStyles = (tier: string) => {
    switch (tier) {
      case 'gold':
        return {
          bg: 'from-yellow-600 via-yellow-400 to-yellow-700',
          border: 'border-yellow-300/50',
          text: 'text-yellow-900',
          shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
          accent: 'bg-yellow-900/10'
        };
      case 'silver':
        return {
          bg: 'from-gray-300 via-gray-100 to-gray-400',
          border: 'border-gray-200/50',
          text: 'text-gray-900',
          shadow: 'shadow-[0_0_30px_rgba(156,163,175,0.3)]',
          accent: 'bg-gray-900/10'
        };
      case 'bronze':
        return {
          bg: 'from-orange-700 via-orange-500 to-orange-800',
          border: 'border-orange-400/50',
          text: 'text-orange-950',
          shadow: 'shadow-[0_0_30px_rgba(194,65,12,0.3)]',
          accent: 'bg-orange-900/10'
        };
      default:
        return {
          bg: 'from-gray-800 via-gray-600 to-gray-900',
          border: 'border-gray-500/50',
          text: 'text-white',
          shadow: 'shadow-[0_0_30px_rgba(0,0,0,0.5)]',
          accent: 'bg-black/20'
        };
    }
  };

  const styles = getTierStyles(cardData.tier);

  const handleStatClick = (e: React.MouseEvent, statName: string, videoUrl: string | null) => {
    e.stopPropagation();
    if (videoUrl) {
      setActiveVideo({ url: videoUrl, name: statName });
    }
  };

  const StatRow = ({ label, stat, name }: { label: string, stat: any, name: string }) => (
    <div 
      className={`flex justify-between items-center p-1.5 rounded-lg cursor-pointer transition-colors ${stat.videoUrl ? 'hover:bg-black/10' : 'opacity-70'}`}
      onClick={(e) => handleStatClick(e, name, stat.videoUrl)}
    >
      <span className={`text-[10px] font-black uppercase tracking-widest ${styles.text} opacity-80`}>{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-black ${styles.text}`}>{stat.value}</span>
        {stat.videoUrl && <Play size={10} className={`${styles.text} opacity-50`} />}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative w-full max-w-[280px] mx-auto perspective-1000 group">
        <motion.div
          className="w-full aspect-[2.5/3.5] relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* FRONT */}
          <div className={`absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br ${styles.bg} ${styles.border} border-2 ${styles.shadow} overflow-hidden flex flex-col`}>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-50 pointer-events-none mix-blend-overlay transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {/* Top Section: Photo & Overall */}
            <div className="relative h-[45%] flex items-end justify-center pb-2">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply" />
              
              <div className="absolute top-4 left-4 flex flex-col items-center">
                <span className={`text-4xl font-black leading-none tracking-tighter ${styles.text}`}>{cardData.overall}</span>
                <span className={`text-[8px] font-black uppercase tracking-widest ${styles.text} opacity-80`}>{cardData.tier}</span>
              </div>
              
              <img src={photo} alt={name} className="w-32 h-32 object-cover rounded-full border-4 border-white/20 shadow-xl relative z-10" referrerPolicy="no-referrer" />
              
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <img src="/logo.svg" alt="Oyna" className="w-4 h-4 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                <span className={`text-xs font-black ${styles.text} opacity-80`}>O</span>
              </div>
            </div>

            {/* Bottom Section: Stats */}
            <div className={`flex-1 ${styles.accent} backdrop-blur-md p-4 flex flex-col justify-between border-t border-white/20`}>
              <div className="text-center mb-2">
                <h2 className={`text-xl font-black uppercase tracking-tighter ${styles.text}`}>{name}</h2>
                <div className={`h-0.5 w-12 mx-auto mt-1 rounded-full ${styles.text} opacity-20`} />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <StatRow label="PAC" stat={cardData.stats.pace} name="Hız" />
                <StatRow label="DRI" stat={cardData.stats.dribbling} name="Top Sürme" />
                <StatRow label="SHO" stat={cardData.stats.shooting} name="Şut" />
                <StatRow label="DEF" stat={cardData.stats.defense} name="Defans" />
                <StatRow label="PAS" stat={cardData.stats.passing} name="Pas" />
                <StatRow label="PHY" stat={cardData.stats.physical} name="Fizik" />
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className={`absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br ${styles.bg} ${styles.border} border-2 ${styles.shadow} overflow-hidden flex flex-col items-center justify-center rotate-y-180`}>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply" />
            
            <div className="relative z-10 flex flex-col items-center p-6 text-center">
              <QrCode size={80} className={`${styles.text} opacity-80 mb-4`} />
              <h3 className={`text-lg font-black uppercase tracking-widest ${styles.text} mb-2`}>Oyna ID</h3>
              <p className={`text-xs font-bold ${styles.text} opacity-70 mb-6`}>Bu QR kodu okutarak oyuncunun detaylı analiz raporuna ve maç geçmişine ulaşabilirsiniz.</p>
              
              <div className={`w-full p-3 rounded-xl ${styles.accent} border border-white/10 flex justify-between items-center`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${styles.text} opacity-80`}>Doğrulanmış Veri</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Share Button */}
        {onShare && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onShare}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#161B22] border border-white/10 px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors shadow-lg"
          >
            <Share2 size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">Kartı Paylaş</span>
          </motion.button>
        )}
      </div>

      {activeVideo && (
        <VideoModal 
          url={activeVideo.url} 
          statName={activeVideo.name} 
          onClose={() => setActiveVideo(null)} 
        />
      )}
    </>
  );
};
