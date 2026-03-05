
import React, { useState } from 'react';
import { UserRole, AppView, MatchListing, Goalkeeper, Referee } from './types';
import SplashScreen from './views/SplashScreen';
import AuthScreen from './views/AuthScreen';
import RoleSelection from './views/RoleSelection';
import Dashboard from './views/Dashboard';
import PitchDiscovery from './views/PitchDiscovery';
import PaymentScreen from './views/PaymentScreen';
import MyTeam from './views/MyTeam';
import Marketplace from './views/Marketplace';
import MyListings from './views/MyListings';
import ListingDetails from './views/ListingDetails';
import ProfileScreen from './views/ProfileScreen';
import Notifications from './views/Notifications';
import BookingAddons from './views/BookingAddons';
import SettingsScreen from './views/SettingsScreen';
import VotingScreen from './views/VotingScreen';
import MotmReveal from './views/MotmReveal';
import OynaTv from './views/OynaTv';
import MatchDiscovery from './views/MatchDiscovery';
import MatchJoin from './views/MatchJoin';
import PremiumScreen from './views/PremiumScreen';
import ChatScreen from './views/ChatScreen';
import MatchTicket from './views/MatchTicket';
import ScoutDashboard from './views/ScoutDashboard';
import PostMatchReport from './views/PostMatchReport';
import MatchDiaryDetail from './views/MatchDiaryDetail';
import Studio from './views/Studio';
import WalletScreen from './views/WalletScreen';
import MatchLobby from './views/MatchLobby';
import OpponentFinder from './views/OpponentFinder';
import LocationPrompt from './views/LocationPrompt';
import MatchCalendar from './views/MatchCalendar';
import AdminPanel from './views/AdminPanel';
import { TeamBuilder } from './views/TeamBuilder';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('ROLE_SELECTION');
  const [role, setRole] = useState<UserRole | null>(null);

  // Mock state to carry add-on total to payment
  const [addOnTotal, setAddOnTotal] = useState(0);
  
  // Mock state for MOTM Discount Coupon
  const [hasMotmCoupon, setHasMotmCoupon] = useState(false);

  // Mock state for Selected Match Listing
  const [selectedMatch, setSelectedMatch] = useState<MatchListing | null>(null);

  // Mock state for Premium User
  const [isUserPro, setIsUserPro] = useState(false);

  // Mock state for Match Diary Detail
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);

  const [selectedGk, setSelectedGk] = useState<Goalkeeper | null>(null);
  const [selectedRef, setSelectedRef] = useState<Referee | null>(null);

  const [marketplaceReturnView, setMarketplaceReturnView] = useState<AppView>('DASHBOARD');

  const handleRoleSelect = (selectedRole: UserRole, data?: any) => {
    setRole(selectedRole);
    setView('DASHBOARD');
  };

  const renderContent = () => {
    switch (view) {
      case 'ADMIN_PANEL':
        return <AdminPanel onBack={() => setView('DASHBOARD')} />;
      case 'DASHBOARD':
        return <Dashboard 
          onNavigate={(newView) => {
            if (newView === 'MARKETPLACE_GK' || newView === 'MARKETPLACE_REF') {
              setMarketplaceReturnView('DASHBOARD');
            }
            setView(newView);
          }} 
          onBack={() => setView('ROLE_SELECTION')}
          selectedGk={selectedGk}
          selectedRef={selectedRef}
        />;
      case 'PITCH_DISCOVERY':
        return <PitchDiscovery 
          onBack={() => setView('DASHBOARD')} 
          onBook={() => setView('BOOKING_ADDONS')}
        />;
      case 'MARKETPLACE_GK':
        return <Marketplace 
          type="GK" 
          onBack={() => setView(marketplaceReturnView)} 
          onSelect={(gk) => {
            setSelectedGk(gk as Goalkeeper);
            setView(marketplaceReturnView);
          }}
        />;
      case 'MARKETPLACE_REF':
        return <Marketplace 
          type="REF" 
          onBack={() => setView(marketplaceReturnView)} 
          onSelect={(ref) => {
            setSelectedRef(ref as Referee);
            setView(marketplaceReturnView);
          }}
        />;
      case 'MY_LISTINGS':
        return <MyListings onBack={() => setView('DASHBOARD')} onNavigate={(v) => setView(v)} />;
      case 'LISTING_DETAILS':
        return <ListingDetails onBack={() => setView('MY_LISTINGS')} />;
      case 'BOOKING_ADDONS':
        return <BookingAddons 
          onBack={() => setView('PITCH_DISCOVERY')}
          selectedGk={selectedGk}
          selectedRef={selectedRef}
          onRemoveGk={() => setSelectedGk(null)}
          onRemoveRef={() => setSelectedRef(null)}
          onNavigate={(newView) => {
            if (newView === 'MARKETPLACE_GK' || newView === 'MARKETPLACE_REF') {
              setMarketplaceReturnView('BOOKING_ADDONS');
            }
            setView(newView);
          }}
          onContinue={(total) => {
            setAddOnTotal(total);
            setView('PAYMENT');
          }}
        />;
      case 'PAYMENT':
        return <PaymentScreen 
            extraFee={addOnTotal} 
            hasMotmCoupon={hasMotmCoupon} 
            onBack={() => setView('BOOKING_ADDONS')} 
            onUpgradeRequest={() => setView('PREMIUM')}
            onViewTicket={() => setView('MATCH_TICKET')}
        />;
      case 'MY_TEAM':
        return <MyTeam onBack={() => setView('DASHBOARD')} onNavigate={(v) => setView(v)} />;
      case 'STUDIO':
        return <Studio onBack={() => setView('DASHBOARD')} onNavigate={(v) => setView(v)} />;
      case 'PROFILE':
        return <ProfileScreen 
          role={role || UserRole.PLAYER} 
          onBack={() => setView('DASHBOARD')} 
          onNavigate={(v) => setView(v)} 
          onOpenDiaryEntry={(id) => {
            setSelectedDiaryId(id);
            setView('MATCH_DIARY_DETAIL');
          }}
          isPro={isUserPro} 
        />;
      case 'WALLET':
        return <WalletScreen onBack={() => setView('DASHBOARD')} />;
      case 'MATCH_LOBBY':
        return <MatchLobby onBack={() => setView('DASHBOARD')} onNavigate={(v) => setView(v)} />;
      case 'OPPONENT_FINDER':
        return <OpponentFinder onBack={() => setView('DASHBOARD')} onNavigate={(v) => setView(v)} />;
      case 'MATCH_CALENDAR':
        return <MatchCalendar onBack={() => setView('DASHBOARD')} onNavigate={(v) => setView(v)} />;
      case 'MATCH_DIARY_DETAIL':
        return <MatchDiaryDetail 
          diaryId={selectedDiaryId}
          onBack={() => setView('PROFILE')}
        />;
      case 'NOTIFICATIONS':
        return <Notifications onBack={() => setView('DASHBOARD')} />;
      case 'SETTINGS':
        return <SettingsScreen onBack={() => setView('DASHBOARD')} onNavigate={(v) => setView(v)} />;
      case 'VOTING':
        return <VotingScreen onBack={() => setView('DASHBOARD')} onComplete={() => setView('MOTM_REVEAL')} />;
      case 'MOTM_REVEAL':
        return <MotmReveal 
          onClaim={() => {
            setHasMotmCoupon(true);
            setView('DASHBOARD');
          }} 
          onBack={() => setView('DASHBOARD')}
        />;
      case 'OYNA_TV':
        return <OynaTv onBack={() => setView('DASHBOARD')} onNavigate={(v) => setView(v)} />;
      case 'MATCH_DISCOVERY':
        return <MatchDiscovery 
          onBack={() => setView('DASHBOARD')} 
          onSelect={(match) => {
            setSelectedMatch(match);
            setView('MATCH_JOIN');
          }}
        />;
      case 'MATCH_JOIN':
        return <MatchJoin 
          match={selectedMatch} 
          onBack={() => setView('MATCH_DISCOVERY')}
          onJoin={() => setView('MY_TEAM')} // After payment, go to tactics
        />;
      case 'PREMIUM':
        return <PremiumScreen 
          onBack={() => setView('DASHBOARD')} 
          onUpgrade={() => {
            setIsUserPro(true);
            setView('PROFILE');
          }}
        />;
      case 'CHAT':
        return <ChatScreen onBack={() => setView('DASHBOARD')} />;
      case 'MATCH_TICKET':
        return <MatchTicket onBack={() => setView('DASHBOARD')} />;
      case 'SCOUT_DASHBOARD':
        return <ScoutDashboard onBack={() => setView('PROFILE')} />;
      case 'POST_MATCH':
        return <PostMatchReport onBack={() => setView('PROFILE')} />;
      case 'TEAM_BUILDER':
        return <TeamBuilder onBack={() => setView('PROFILE')} />;
      default:
        return <Dashboard 
          onNavigate={(v) => setView(v)} 
          onBack={() => setView('ROLE_SELECTION')}
          selectedGk={selectedGk}
          selectedRef={selectedRef}
        />;
    }
  };

  const renderView = () => {
    // Views that are NOT wrapped in Layout (Full Screen / Onboarding)
    if (view === 'SPLASH') return <SplashScreen onStart={() => setView('AUTH')} />;
    if (view === 'AUTH') return <AuthScreen onSuccess={() => setView('LOCATION_PROMPT')} onBack={() => setView('SPLASH')} />;
    if (view === 'LOCATION_PROMPT') return <LocationPrompt onPermissionGranted={() => setView('ROLE_SELECTION')} onSkip={() => setView('ROLE_SELECTION')} />;
    if (view === 'ROLE_SELECTION') return <RoleSelection onSelect={handleRoleSelect} onBack={() => {}} onNavigate={(v) => setView(v)} />;

    // Authenticated Views wrapped in Layout
    return (
      <Layout currentView={view} onNavigate={setView} userRole={role || undefined}>
        {renderContent()}
      </Layout>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white font-['Inter']">
      {renderView()}
    </div>
  );
};

export default App;
