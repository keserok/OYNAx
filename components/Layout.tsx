
import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, Users, ShoppingBag, User, Settings, 
  Shield, Menu, X, Bell, Wallet, LogOut, ChevronRight, ShieldCheck
} from 'lucide-react';
import { AppView } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  userRole?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, userRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'DASHBOARD', label: 'Ana Sayfa', icon: LayoutDashboard },
    { id: 'MATCH_DISCOVERY', label: 'Maç Bul', icon: Calendar },
    { id: 'MY_TEAM', label: 'Takımım', icon: Users },
    { id: 'MARKETPLACE_GK', label: 'Transfer', icon: ShoppingBag },
    { id: 'PROFILE', label: 'Profil', icon: User },
    { id: 'ADMIN_PANEL', label: 'Yönetici Paneli', icon: ShieldCheck }, // Added Panel Link
    { id: 'SETTINGS', label: 'Ayarlar', icon: Settings },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white font-sans flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#161B22] border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFFF00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,0,0.3)]">
              <span className="text-black font-black text-xl italic">O</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter italic">OYNA</h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">WEB PANEL</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="ml-auto lg:hidden text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Simple check if the current view "starts with" the nav item ID to handle sub-views if needed
            // But for now, direct match or logical grouping
            let isActive = currentView === item.id;
            
            // Grouping logic for active states
            if (item.id === 'MATCH_DISCOVERY' && ['MATCH_CALENDAR', 'MATCH_LOBBY', 'OPPONENT_FINDER', 'MATCH_JOIN'].includes(currentView)) isActive = true;
            if (item.id === 'MARKETPLACE_GK' && ['MARKETPLACE_REF', 'LISTING_DETAILS'].includes(currentView)) isActive = true;
            if (item.id === 'MY_TEAM' && ['TEAM_BUILDER', 'STUDIO'].includes(currentView)) isActive = true;
            if (item.id === 'PROFILE' && ['WALLET', 'SCOUT_DASHBOARD', 'MATCH_DIARY_DETAIL'].includes(currentView)) isActive = true;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as AppView);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${isActive ? 'bg-[#FFFF00] text-black shadow-[0_0_20px_rgba(255,255,0,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={20} className={isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'} />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-[#0A0E14] rounded-2xl p-3 flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=kaptan" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Kaptan</p>
              <p className="text-[10px] text-gray-500 truncate">Pro Üye</p>
            </div>
            <button className="text-gray-500 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-[#0A0E14]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden w-10 h-10 flex items-center justify-center bg-[#161B22] rounded-xl text-white">
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-black italic tracking-tighter text-white hidden sm:block">
              {navItems.find(n => n.id === currentView)?.label || 'OYNA'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('WALLET')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#161B22] rounded-full border border-white/5 hover:border-green-500/50 transition-all group"
            >
              <Wallet size={16} className="text-green-400 group-hover:text-green-300" />
              <span className="text-xs font-bold text-white">450₺</span>
            </button>

            <button 
              onClick={() => onNavigate('NOTIFICATIONS')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#161B22] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-all relative"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;
