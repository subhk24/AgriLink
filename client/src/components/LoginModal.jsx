import React, { useState } from 'react';
import { Sprout, Lock, Phone, ArrowRight, Globe, X } from 'lucide-react';
import { loginDemoUser } from '../services/api';
import { translations } from '../translations';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentLang = 'en', onSelectLang }) {
  const [lang, setLang] = useState(currentLang);
  const [phone, setPhone] = useState('9876512340');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const t = translations[lang] || translations.en;

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    if (onSelectLang) onSelectLang(newLang);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!phone) {
      setErrorMsg(lang === 'pa' ? "ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ" : (lang === 'hi' ? "मोबाइल नंबर दर्ज करें" : "Please enter your mobile number"));
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginDemoUser();
      if (res && res.success && res.user) {
        onLoginSuccess(res.user, lang);
      } else {
        // Fallback default farmer object
        onLoginSuccess({
          id: 'usr-demo-01',
          name: 'Harpreet Singh',
          phone: phone || '9876512340',
          village: 'Kakra',
          district: 'Sangrur',
          state: 'Punjab',
          role: 'farmer',
          is_demo_user: 1
        }, lang);
      }
    } catch (err) {
      // Offline fallback
      onLoginSuccess({
        id: 'usr-demo-01',
        name: 'Harpreet Singh',
        phone: phone || '9876512340',
        village: 'Kakra',
        district: 'Sangrur',
        state: 'Punjab',
        role: 'farmer',
        is_demo_user: 1
      }, lang);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden relative">
        {/* Top Language Switcher Bar & Close */}
        <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.language}:</span>
          </div>
          <div className="flex items-center gap-1">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'pa', label: 'ਪੰਜਾਬੀ' }
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => handleLanguageChange(item.code)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  lang === item.code
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="ml-1 p-1 text-slate-400 hover:text-slate-600 rounded"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="p-5 text-center border-b border-slate-100">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{t.loginTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.loginSubtitle}</p>
        </div>

        {/* Standard Clean Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {t.mobileNumber}
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.mobilePlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>{t.rememberMe}</span>
            </label>
            <span className="text-emerald-700 hover:underline cursor-pointer">
              {t.forgotPassword}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer mt-1"
          >
            <span>{loading ? t.signingIn : t.signIn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
