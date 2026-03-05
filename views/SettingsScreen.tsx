
import React, { useState } from 'react';
import { ArrowLeft, User, Globe, Bell, Shield, HelpCircle, LogOut, ChevronRight, RefreshCw, Moon } from 'lucide-react';
import { AppView } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate }) => {
  const [lang, setLang] = useState('TR');
  const [notifEnabled, setNotifEnabled] = useState(true);

  const SettingItem = ({ icon, title, value, onClick, color = 'text-gray-500' }: any) => (
      <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-[#161B22] border border-white/5 first:rounded-t-2xl last:rounded-b-2xl border-b-0 last:border-b hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
              <div className="text-gray-400">{icon}</div>
              <span className="text-sm font-bold text-white">{title}</span>
          </div>
          <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${color}`}>{value}</span>
              <ChevronRight size={16} className="text-gray-600" />
          </div>
      </button>
  );

  return (
    <div className="min-h-screen bg-[#0A0E14] pb-12">
       {/* Stack Header */}
       <header className="p-6 flex items-center gap-4 sticky top-0 bg-[#0A0E14]/90 backdrop-blur-xl z-20 border-b border-white/5">
           {/* Back Button (Standardized) */}
           <button 
             onClick={onBack} 
             className="w-11 h-11 flex items-center justify-center bg-[#161B22] rounded-full border border-white/5 text-white hover:bg-white/10 active:scale-95 transition-all"
             aria-label="Geri Dön"
           >
               <ArrowLeft size={20} />
           </button>
           <h1 className="text-xl font-black text-white">Ayarlar</h1>
       </header>

       <main className="p-6 space-y-8">
           
           {/* Account */}
           <section>
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Hesap</h3>
               <div className="flex flex-col">
                   <SettingItem icon={<User size={20} />} title="Profil Bilgileri" value="Düzenle" />
                   <SettingItem icon={<Shield size={20} />} title="Güvenlik & Gizlilik" value="" />
               </div>
           </section>

           {/* App Preferences */}
           <section>
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Uygulama</h3>
               <div className="flex flex-col">
                   <SettingItem 
                        icon={<Globe size={20} />} 
                        title="Dil / Language" 
                        value={lang === 'TR' ? 'Türkçe' : 'English'} 
                        onClick={() => setLang(lang === 'TR' ? 'EN' : 'TR')}
                        color="text-yellow-500"
                   />
                   <SettingItem 
                        icon={<Bell size={20} />} 
                        title="Bildirimler" 
                        value={notifEnabled ? 'Açık' : 'Kapalı'} 
                        onClick={() => setNotifEnabled(!notifEnabled)}
                        color={notifEnabled ? 'text-green-500' : 'text-red-500'}
                   />
                   <SettingItem icon={<Moon size={20} />} title="Tema" value="Karanlık Mod" />
               </div>
           </section>

           {/* Role Switcher */}
           <section>
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Mod Değiştir</h3>
               <div className="bg-gradient-to-r from-indigo-900/20 to-[#161B22] p-5 rounded-[24px] border border-indigo-500/20">
                   <div className="flex items-center gap-3 mb-4">
                       <RefreshCw size={24} className="text-indigo-400" />
                       <div>
                           <h4 className="font-bold text-white">Rol Değiştirici</h4>
                           <p className="text-xs text-gray-400">Farklı bir kimlikle devam et.</p>
                       </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => onNavigate('ROLE_SELECTION')} className="bg-[#0A0E14] py-3 rounded-xl border border-white/10 text-xs font-bold text-white hover:border-indigo-500 hover:text-indigo-400 transition-all">
                           Sahip Modu
                       </button>
                       <button onClick={() => onNavigate('ROLE_SELECTION')} className="bg-[#0A0E14] py-3 rounded-xl border border-white/10 text-xs font-bold text-white hover:border-yellow-500 hover:text-yellow-400 transition-all">
                           Oyuncu Modu
                       </button>
                   </div>
               </div>
           </section>

           {/* Support */}
           <section>
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Destek</h3>
               <div className="flex flex-col">
                   <SettingItem icon={<HelpCircle size={20} />} title="Yardım Merkezi" value="" />
                   <button className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-500/20 transition-colors">
                       <LogOut size={18} /> Çıkış Yap
                   </button>
               </div>
           </section>

           <div className="text-center">
               <p className="text-[10px] text-gray-600 font-mono">v2.4.0 • Build 20240324</p>
           </div>

       </main>
    </div>
  );
};

export default SettingsScreen;
