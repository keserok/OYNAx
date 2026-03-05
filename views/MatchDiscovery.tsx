
import React, { useState } from 'react';
import { ArrowLeft, Filter, MapPin, Clock, Star, Shield, Users, Zap } from 'lucide-react';
import { MATCH_LISTINGS } from '../constants';
import { MatchListing } from '../types';

interface MatchDiscoveryProps {
  onBack: () => void;
  onSelect: (match: MatchListing) => void;
}

const MatchDiscovery: React.FC<MatchDiscoveryProps> = ({ onBack, onSelect }) => {
  const [selectedFilter, setSelectedFilter] = useState('Tümü');
  const userRating = 4.2; // Mock user rating for validation

  const filters = ['Tümü', 'Defans', 'Orta Saha', 'Forvet', 'Kaleci'];

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-6 flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-[#0A0E14]/90 backdrop-blur-xl z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-white">Maça Katıl</h1>
        </div>
        <button className="p-3 bg-[#161B22] rounded-full text-white border border-white/10 hover:bg-white/5">
            <Filter size={20} />
        </button>
      </header>

      {/* Filter Chips */}
      <div className="px-6 py-4 overflow-x-auto custom-scrollbar flex gap-3">
          {filters.map((f, i) => (
              <button 
                key={i}
                onClick={() => setSelectedFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                    selectedFilter === f 
                    ? 'bg-[#FFFF00] text-black border-[#FFFF00]' 
                    : 'bg-[#161B22] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                  {f}
              </button>
          ))}
      </div>

      {/* Match List */}
      <div className="flex-1 px-6 space-y-6 overflow-y-auto custom-scrollbar">
          {MATCH_LISTINGS.map(match => {
              const canJoin = userRating >= match.minRating;
              const missingCount = match.missingPositions.reduce((acc, curr) => acc + curr.count, 0);

              return (
                  <div 
                    key={match.id}
                    onClick={() => canJoin && onSelect(match)}
                    className={`bg-[#161B22] rounded-[32px] overflow-hidden border border-white/5 group transition-all duration-300 ${canJoin ? 'hover:border-[#FFFF00]/30 cursor-pointer active:scale-[0.98]' : 'opacity-75 grayscale'}`}
                  >
                      {/* Image & Badges */}
                      <div className="relative h-40">
                          <img src={match.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] to-transparent"></div>
                          
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                              {match.badges.map((b, i) => (
                                  <span key={i} className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">
                                      {b}
                                  </span>
                              ))}
                          </div>

                          <div className="absolute top-4 right-4 bg-[#FFFF00] text-black px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-lg">
                              <Zap size={10} fill="black" /> {match.difficulty}
                          </div>

                          {!canJoin && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                  <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                                      <Shield size={14} /> Reyting Yetersiz ({match.minRating}+)
                                  </div>
                              </div>
                          )}
                      </div>

                      {/* Content */}
                      <div className="p-5 pt-2">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <h3 className="text-lg font-black text-white leading-tight">{match.title}</h3>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                      <span className="flex items-center gap-1"><Clock size={12} /> {match.time}, {match.date}</span>
                                      <span className="flex items-center gap-1"><MapPin size={12} /> {match.location}</span>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-xs text-gray-500 font-bold uppercase">Payın</p>
                                  <p className="text-xl font-black text-[#FFFF00]">{match.price}₺</p>
                              </div>
                          </div>

                          {/* Missing Positions */}
                          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                              <div className="flex gap-2">
                                  {match.missingPositions.map((pos, i) => (
                                      <div key={i} className="flex items-center gap-1 bg-[#0A0E14] px-2 py-1 rounded-lg border border-white/5">
                                          <Users size={12} className="text-blue-400" />
                                          <span className="text-[10px] font-bold text-gray-300">{pos.role}</span>
                                          <span className="text-[10px] font-black text-white bg-blue-600 px-1.5 rounded ml-1">{pos.count}</span>
                                      </div>
                                  ))}
                              </div>
                              {canJoin && (
                                  <div className="text-xs font-bold text-green-400 flex items-center gap-1">
                                      {missingCount} Yer Kaldı
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};

export default MatchDiscovery;
