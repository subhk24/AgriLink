import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VoiceAssistant from './components/VoiceAssistant';
import LoginModal from './components/LoginModal';
import DatabasePage from './views/DatabasePage';
import FarmerDashboard from './views/FarmerDashboard';
import MandiRatesComparison from './components/MandiRatesComparison';
import NetProfitCalculator from './components/NetProfitCalculator';
import PoolingHub from './components/PoolingHub';
import EscrowTracker from './components/EscrowTracker';
import { translations } from './translations';

const DEFAULT_USER = {
  id: 'usr-demo-01',
  name: 'Harpreet Singh',
  phone: '9876512340',
  role: 'farmer',
  village: 'Kakra',
  district: 'Sangrur',
  state: 'Punjab',
  crops: 'Wheat, Paddy',
  bank_account: 'Punjab National Bank - ****4091',
  upi_id: 'harpreet98@okhdfcbank',
  is_demo_user: 1
};

export default function App() {
  // If user visits /database or /db directly, show the separate Database page
  const isDatabaseRoute = window.location.pathname === '/database' || window.location.pathname === '/db';

  if (isDatabaseRoute) {
    return <DatabasePage />;
  }

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agrilink_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_USER;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [currentDialect, setCurrentDialect] = useState('hi');
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('agrilink_lang') || 'en';
  });

  const handleLangChange = (newLang) => {
    setCurrentLang(newLang);
    localStorage.setItem('agrilink_lang', newLang);
  };

  useEffect(() => {
    if (!localStorage.getItem('agrilink_user')) {
      localStorage.setItem('agrilink_user', JSON.stringify(DEFAULT_USER));
    }
  }, []);

  const handleLoginSuccess = (user, lang) => {
    const userToSave = user || DEFAULT_USER;
    setCurrentUser(userToSave);
    if (lang) {
      setCurrentLang(lang);
      localStorage.setItem('agrilink_lang', lang);
    }
    localStorage.setItem('agrilink_user', JSON.stringify(userToSave));
    setIsAuthModalOpen(false);
    setDataRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    setIsAuthModalOpen(true);
  };

  const handleVoiceAction = (action) => {
    switch (action) {
      case 'VIEW_MANDI_RATES':
      case 'COMPARE_RATES':
        setActiveTab('rates');
        break;
      case 'NAVIGATE_NET_PROFIT':
        setActiveTab('pricing');
        break;
      case 'OPEN_POOLING_VIEW':
      case 'JOIN_POOL':
        setActiveTab('transport');
        break;
      case 'VIEW_ESCROW':
        setActiveTab('orders');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Bar with Multilingual Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentLang={currentLang}
        onSelectLang={handleLangChange}
      />

      {/* 3. Main Body Views */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <FarmerDashboard
            key={dataRefreshKey}
            currentUser={currentUser}
            onNavigateToTab={setActiveTab}
            onReloadData={() => setDataRefreshKey(prev => prev + 1)}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'rates' && (
          <MandiRatesComparison
            onNavigateToTab={setActiveTab}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'pricing' && (
          <NetProfitCalculator
            onInitiateDeal={() => setActiveTab('orders')}
            onNavigateToRates={() => setActiveTab('rates')}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'transport' && (
          <PoolingHub
            currentLang={currentLang}
          />
        )}

        {activeTab === 'orders' && (
          <EscrowTracker
            currentLang={currentLang}
          />
        )}
      </main>

      {/* 4. Login Modal with Multilingual Switcher */}
      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentLang={currentLang}
        onSelectLang={handleLangChange}
      />

      {/* 5. Voice Assistant Modal (Preserved as is with dialect choice) */}
      <VoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        currentDialect={currentDialect}
        setCurrentDialect={setCurrentDialect}
        onActionTrigger={handleVoiceAction}
        currentLang={currentLang}
      />

      {/* 6. Clean Prototype Footer (No database links) */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <span>{translations[currentLang]?.footerText || 'AgriLink • SIH 2026 Prototype'}</span>
        </div>
      </footer>
    </div>
  );
}
