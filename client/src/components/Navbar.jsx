import React, { useState } from 'react';
import {
  Sprout,
  Mic,
  Truck,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  LogOut,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { translations, translatePerson } from '../translations';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenVoiceAssistant,
  currentUser,
  onLogout,
  currentLang = 'en',
  onSelectLang
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang] || translations.en;

  const navItems = [
    { id: "home", label: t.home, icon: Sprout },
    { id: "rates", label: t.rates || t.mandiRates, icon: BarChart3 },
    { id: "pricing", label: t.pricing, icon: TrendingUp },
    { id: "transport", label: t.transport, icon: Truck },
    { id: "orders", label: t.orders, icon: ShieldCheck }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                {currentLang === 'en' ? (
                  <>Agri<span className="text-emerald-600">Link</span></>
                ) : (
                  <span className="text-emerald-700">{t.appTitle}</span>
                )}
              </span>
            </button>
          </div>

          {/* Clean Systematic Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Multilingual Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => onSelectLang && onSelectLang(item.code)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    currentLang === item.code
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Voice Assistant */}
            <button
              onClick={onOpenVoiceAssistant}
              title="Voice Assistant"
              className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.voice}</span>
            </button>

            {/* Current User & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
                <span className="font-medium text-slate-700 hidden sm:inline">
                  {translatePerson(currentUser.name, currentLang)}
                </span>
                <button
                  onClick={onLogout}
                  title={t.logout}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-2 space-y-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              {t.language}:
            </span>
            <div className="flex items-center gap-1">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    if (onSelectLang) onSelectLang(item.code);
                  }}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    currentLang === item.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                    isActive ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
