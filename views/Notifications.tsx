
import React from 'react';
import { X, Bell, Calendar, CreditCard, Star, Trophy, ChevronRight } from 'lucide-react';

interface NotificationsProps {
  onBack: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onBack }) => {
  const notifs = [
      {
          id: 1,
          type: 'INVITE',
          title: 'Maç Daveti',
          desc: 'Yıldızlar FC seni bu akşamki maça davet etti.',
          time: '15 dk önce',
          icon: <Trophy size={20} />,
          color: 'bg-yellow-500',
          textColor: 'text-yellow-500'
      },
      {
          id: 2,
          type: 'PAYMENT',
          title: 'Ödeme Hatırlatması',
          desc: 'Yarınki maç için kaporanın son 2 saati!',
          time: '2 saat önce',
          icon: <CreditCard size={20} />,
          color: 'bg-red-500',
          textColor: 'text-red-500'
      },
      {
          id: 3,
          type: 'RATING',
          title: 'Maçı Puanla',
          desc: 'Dünkü maç nasıldı? Sahayı ve kaleciyi puanla.',
          time: 'Dün',
          icon: <Star size={20} />,
          color: 'bg-blue-500',
          textColor: 'text-blue-500'
      },
      {
          id: 4,
          type: 'SYSTEM',
          title: 'Yeni Özellik',
          desc: 'Artık detaylı maç istatistiklerine erişebilirsin.',
          time: '2 gün önce',
          icon: <Bell size={20} />,
          color: 'bg-gray-500',
          textColor: 'text-gray-500'
      }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E14] p-6">
       {/* Modal Header Structure: Title Left, Close Action Right */}
       <header className="flex items-center justify-between mb-8 pt-2">
           <div>
               <h1 className="text-2xl font-black text-white tracking-tight">Bildirimler</h1>
               <p className="text-xs text-gray-400 font-medium">Son aktivitelerin burada.</p>
           </div>
           
           {/* Dismiss Action (Close) */}
           <button 
             onClick={onBack} 
             className="w-11 h-11 flex items-center justify-center rounded-full bg-[#161B22] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg"
             aria-label="Kapat"
           >
               <X size={20} />
           </button>
       </header>

       <div className="space-y-4">
           {notifs.map(n => (
               <div key={n.id} className="bg-[#161B22] border border-white/5 rounded-[24px] p-4 flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer group active:scale-[0.98] duration-200">
                   <div className={`w-12 h-12 rounded-2xl ${n.color} bg-opacity-10 flex items-center justify-center ${n.textColor} shrink-0`}>
                       {n.icon}
                   </div>
                   <div className="flex-1">
                       <div className="flex justify-between items-start">
                           <h4 className="font-bold text-white text-sm">{n.title}</h4>
                           <span className="text-[10px] text-gray-500 font-medium">{n.time}</span>
                       </div>
                       <p className="text-xs text-gray-400 mt-1 leading-relaxed">{n.desc}</p>
                   </div>
                   <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <ChevronRight size={16} className="text-gray-600" />
                   </div>
               </div>
           ))}
       </div>
       
       <div className="mt-8 text-center">
           <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors py-3 px-6 rounded-full hover:bg-white/5">
               Tümünü Okundu İşaretle
           </button>
       </div>
    </div>
  );
};

export default Notifications;
