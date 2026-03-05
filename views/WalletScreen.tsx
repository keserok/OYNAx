
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, History, ChevronRight, CheckCircle2, Loader2, Smartphone, Wallet, MoreHorizontal } from 'lucide-react';
import { WALLET_HISTORY } from '../constants';

interface WalletScreenProps {
  onBack: () => void;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ onBack }) => {
  const [balance, setBalance] = useState(450.00);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  const CARDS = [
      { id: 1, last4: '4242', brand: 'Mastercard', color: 'from-orange-600 to-red-600', holder: 'BURAK KAPTAN' },
      { id: 2, last4: '8812', brand: 'Visa', color: 'from-blue-600 to-indigo-700', holder: 'BURAK KAPTAN' },
  ];

  const QUICK_AMOUNTS = [100, 250, 500, 1000];

  const handleTopUp = () => {
      setIsProcessing(true);
      const amountToAdd = selectedAmount || parseInt(customAmount) || 0;
      
      setTimeout(() => {
          setBalance(prev => prev + amountToAdd);
          setIsProcessing(false);
          setSelectedAmount(null);
          setCustomAmount('');
          // Haptic feedback
          if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] flex flex-col font-sans relative">
      
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center sticky top-0 z-20 bg-[#0A0E14]/90 backdrop-blur-xl border-b border-white/5">
          <button onClick={onBack} className="w-11 h-11 flex items-center justify-center bg-[#161B22] rounded-full border border-white/5 text-white hover:bg-white/10 active:scale-95 transition-all">
              <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-white">Cüzdanım</h1>
          <button className="w-11 h-11 flex items-center justify-center bg-[#161B22] rounded-full border border-white/5 text-white hover:bg-white/10 active:scale-95 transition-all">
              <MoreHorizontal size={20} />
          </button>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32">
          
          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-[32px] p-8 mb-8 bg-gradient-to-br from-[#161B22] to-[#0A0E14] border border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Wallet size={120} /></div>
              <div className="relative z-10">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Mevcut Bakiye</p>
                  <h2 className="text-5xl font-black text-white tracking-tight">{balance.toFixed(2)}₺</h2>
                  <div className="flex gap-2 mt-6">
                      <button className="flex-1 bg-[#FFFF00] text-black py-3 rounded-xl font-bold text-sm shadow-lg shadow-yellow-900/20 active:scale-95 transition-all">
                          Para Yükle
                      </button>
                      <button className="flex-1 bg-[#161B22] border border-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/5 active:scale-95 transition-all">
                          Çek
                      </button>
                  </div>
              </div>
          </div>

          {/* Payment Methods (Carousel) */}
          <div className="mb-8">
              <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard size={16} className="text-[#FFFF00]" /> Kayıtlı Kartlar
                  </h3>
                  <button className="text-[10px] text-blue-400 font-bold flex items-center gap-1 bg-blue-900/20 px-2 py-1 rounded-lg hover:bg-blue-900/40 transition-colors">
                      <Plus size={12} /> Yeni Kart
                  </button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
                  {CARDS.map((card, idx) => (
                      <div 
                        key={card.id}
                        onClick={() => setActiveCard(idx)}
                        className={`snap-center shrink-0 w-72 h-44 rounded-2xl bg-gradient-to-br ${card.color} p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border-2 cursor-pointer ${activeCard === idx ? 'border-white scale-100 shadow-2xl' : 'border-transparent scale-95 opacity-70'}`}
                      >
                          <div className="flex justify-between items-start">
                              <span className="font-mono text-white/80 text-sm">{card.brand}</span>
                              {activeCard === idx && <div className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> SEÇİLİ</div>}
                          </div>
                          <div>
                              <p className="text-white font-mono text-lg tracking-widest">•••• •••• •••• {card.last4}</p>
                              <p className="text-white/60 text-[10px] font-bold mt-2 uppercase">{card.holder}</p>
                          </div>
                          {/* Chip */}
                          <div className="absolute top-6 right-6 w-10 h-8 bg-yellow-400/30 rounded-md border border-yellow-200/40"></div>
                      </div>
                  ))}
                  
                  {/* Add New Placeholder */}
                  <button className="snap-center shrink-0 w-16 h-44 rounded-2xl bg-[#161B22] border border-white/5 border-dashed flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white hover:border-white/20 transition-all">
                      <Plus size={24} />
                  </button>
              </div>
          </div>

          {/* Quick Top Up */}
          <div className="mb-8">
              <h3 className="text-sm font-bold text-white mb-4 px-1">Yüklenecek Tutar</h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                  {QUICK_AMOUNTS.map(amount => (
                      <button
                        key={amount}
                        onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                        className={`py-3 rounded-xl font-black text-sm transition-all border ${
                            selectedAmount === amount 
                            ? 'bg-white text-black border-white shadow-lg scale-105' 
                            : 'bg-[#161B22] text-gray-400 border-white/5 hover:bg-white/5'
                        }`}
                      >
                          {amount}₺
                      </button>
                  ))}
              </div>
              <div className="bg-[#161B22] p-4 rounded-2xl border border-white/5 flex items-center gap-2 focus-within:border-[#FFFF00] transition-colors">
                  <span className="text-gray-500 font-bold">Diğer:</span>
                  <input 
                    type="number" 
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    placeholder="0.00"
                    className="bg-transparent text-white font-bold w-full outline-none"
                  />
                  <span className="text-white font-black">₺</span>
              </div>
          </div>

          {/* History Teaser */}
          <div>
              <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <History size={16} className="text-gray-500" /> Son İşlemler
                  </h3>
              </div>
              <div className="space-y-3">
                  {WALLET_HISTORY.map(tx => (
                      <div key={tx.id} className="bg-[#161B22] p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {tx.amount > 0 ? <Plus size={18} /> : <ArrowLeft size={18} className="rotate-45" />}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-white">{tx.description}</p>
                                  <p className="text-[10px] text-gray-500">{tx.date}</p>
                              </div>
                          </div>
                          <span className={`font-black text-sm ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount}₺
                          </span>
                      </div>
                  ))}
              </div>
          </div>

      </main>

      {/* Sticky Action Button */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-[#0A0E14]/90 backdrop-blur-xl border-t border-white/10 z-30">
          <button 
            disabled={(!selectedAmount && !customAmount) || isProcessing}
            onClick={handleTopUp}
            className={`w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                (!selectedAmount && !customAmount) || isProcessing
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-[#FFFF00] text-black hover:bg-yellow-300 active:scale-95 shadow-yellow-900/20'
            }`}
          >
              {isProcessing ? (
                  <>
                      <Loader2 size={24} className="animate-spin" /> İŞLENİYOR...
                  </>
              ) : (
                  <>
                      <Wallet size={20} /> {(selectedAmount || customAmount || 0)}₺ YÜKLE
                  </>
              )}
          </button>
      </div>

    </div>
  );
};

export default WalletScreen;
