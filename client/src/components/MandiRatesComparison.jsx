import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Calendar,
  Building2
} from 'lucide-react';
import { getMandiRateComparison } from '../services/api';
import {
  translations,
  translateCrop,
  translateMandi,
  translateMarketType,
  translateLocation
} from '../translations';

const CROP_ADVISORIES = {
  wheat: {
    day0Rate: 2480,
    day30Rate: 2620,
    day60Rate: 2740,
    day90Rate: 2790,
    storageCost60D: 30, // ₹16 rent + ₹14 handling/insurance
    recommendedAction: "HOLD", // 'HOLD' | 'SELL'
    gainPerQ: 230,
    percentGain: "+9.3%",
    reasonEn: "Harvest arrival glut is depressing current rates. Agmarknet 5-year trends indicate +₹260/Q price appreciation by Day 60 as local mill demand rises.",
    reasonHi: "कटाई के समय अधिक आवक से भाव दबाव में हैं। पिछले 5 वर्षों के आंकड़ों के अनुसार 60 दिनों में भाव ₹260 बढ़ेंगे। गोदाम खर्च काटकर शुद्ध ₹230/कुंतल अधिक मिलेंगे।",
    reasonPa: "ਵਾਢੀ ਵੇਲੇ ਮੰਡੀਆਂ ਵਿੱਚ ਭਾਰੀ ਆਵਕ ਕਾਰਨ ਭਾਅ ਦਬਿਆ ਹੋਇਆ ਹੈ। 60 ਦਿਨਾਂ ਵਿੱਚ ਭਾਅ ₹260 ਵਧਣ ਦਾ ਅਨੁਮਾਨ ਹੈ। ਗੋਦਾਮ ਖਰਚਾ ਕੱਟ ਕੇ ਸ਼ੁੱਧ ₹230/ਕੁਇੰਟਲ ਵੱਧ ਮਿਲੇਗਾ।"
  },
  onion: {
    day0Rate: 2650,
    day30Rate: 2950,
    day60Rate: 3150,
    day90Rate: 3300,
    storageCost60D: 45,
    recommendedAction: "HOLD",
    gainPerQ: 455,
    percentGain: "+17.2%",
    reasonEn: "Current rabi arrivals are peaking. Storage in accredited cold link preserves weight and yields ₹455/Q net profit in 60 days.",
    reasonHi: "वर्तमान में रबी प्याज की आवक चरम पर है। कोल्ड स्टोरेज में रखने पर 60 दिनों में ₹455 प्रति क्विंटल का शुद्ध अतिरिक्त लाभ होगा।",
    reasonPa: "ਪਿਆਜ਼ ਦੀ ਆਵਕ ਸਿਖਰ 'ਤੇ ਹੈ। ਕੋਲਡ ਸਟੋਰੇਜ ਵਿੱਚ ਰੱਖਣ 'ਤੇ 60 ਦਿਨਾਂ ਵਿੱਚ ₹455 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਦਾ ਸ਼ੁੱਧ ਵਾਧੂ ਲਾਭ ਹੋਵੇਗਾ।"
  },
  tomato: {
    day0Rate: 2900,
    day30Rate: 2750,
    day60Rate: 2400,
    day90Rate: 2200,
    storageCost60D: 90,
    recommendedAction: "SELL",
    gainPerQ: 0,
    percentGain: "0%",
    reasonEn: "Tomato is highly perishable with 3.8% transit decay per 100km. Immediate sale at current peak wholesale price is strongly recommended.",
    reasonHi: "टमाटर अत्यधिक संवेदनशील और जल्दी खराब होने वाली फसल है। वर्तमान उच्च भाव पर तुरंत बेचना सबसे अधिक लाभदायक है।",
    reasonPa: "ਟਮਾਟਰ ਜਲਦੀ ਖਰਾਬ ਹੋਣ ਵਾਲੀ ਫਸਲ ਹੈ। ਮੌਜੂਦਾ ਉੱਚੇ ਭਾਅ 'ਤੇ ਤੁਰੰਤ ਵੇਚਣਾ ਹੀ ਸਭ ਤੋਂ ਵੱਧ ਲਾਭਕਾਰੀ ਹੈ।"
  },
  paddy: {
    day0Rate: 3350,
    day30Rate: 3520,
    day60Rate: 3680,
    day90Rate: 3750,
    storageCost60D: 32,
    recommendedAction: "HOLD",
    gainPerQ: 298,
    percentGain: "+8.9%",
    reasonEn: "Basmati export shipments pick up momentum in November-December. Holding in WDRA warehouse yields +₹298/Q after costs.",
    reasonHi: "बासमती चावल का निर्यात नवंबर-दिसंबर में तेज होता है। डब्ल्यूडीआरए गोदाम में 60 दिन रखने से ₹298 प्रति क्विंटल अधिक मिलेंगे।",
    reasonPa: "ਬਾਸਮਤੀ ਨਿਰਯਾਤ ਨਵੰਬਰ-ਦਸੰਬਰ ਵਿੱਚ ਤੇਜ਼ ਹੁੰਦਾ ਹੈ। ਗੋਦਾਮ ਵਿੱਚ 60 ਦਿਨ ਰੱਖਣ ਨਾਲ ₹298 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਵੱਧ ਮਿਲਣਗੇ।"
  },
  mustard: {
    day0Rate: 5980,
    day30Rate: 6240,
    day60Rate: 6450,
    day90Rate: 6520,
    storageCost60D: 28,
    recommendedAction: "HOLD",
    gainPerQ: 442,
    percentGain: "+7.4%",
    reasonEn: "Oil processing mills begin major crushing runs 45 days post-harvest. Net gain after warehouse rent is ₹442/Q.",
    reasonHi: "तेल मिलें कटाई के 45 दिन बाद बड़ी पेराई शुरू करती हैं। गोदाम किराया काटकर शुद्ध लाभ ₹442 प्रति क्विंटल है।",
    reasonPa: "ਤੇਲ ਮਿੱਲਾਂ ਵਾਢੀ ਦੇ 45 ਦਿਨਾਂ ਬਾਅਦ ਪੀੜਾਈ ਸ਼ੁਰੂ ਕਰਦੀਆਂ ਹਨ। ਗੋਦਾਮ ਖਰਚਾ ਕੱਟ ਕੇ ਸ਼ੁੱਧ ਲਾਭ ₹442 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ।"
  },
  potato: {
    day0Rate: 1750,
    day30Rate: 1950,
    day60Rate: 2100,
    day90Rate: 2250,
    storageCost60D: 40,
    recommendedAction: "HOLD",
    gainPerQ: 310,
    percentGain: "+17.7%",
    reasonEn: "Cold storage preserves tuber quality until lean summer window. Net gain after rent is +₹310/Q.",
    reasonHi: "कोल्ड स्टोरेज में आलू रखने से गर्मियों के सीजन में भाव तेज होते हैं। किराया काटकर शुद्ध लाभ ₹310 प्रति क्विंटल है।",
    reasonPa: "ਕੋਲਡ ਸਟੋਰੇਜ ਵਿੱਚ ਆਲੂ ਰੱਖਣ ਨਾਲ ਗਰਮੀਆਂ ਦੇ ਸੀਜ਼ਨ ਵਿੱਚ ਭਾਅ ਤੇਜ਼ ਹੁੰਦੇ ਹਨ। ਕਿਰਾਇਆ ਕੱਟ ਕੇ ਸ਼ੁੱਧ ਲਾਭ ₹310 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ।"
  },
  cotton: {
    day0Rate: 7150,
    day30Rate: 7380,
    day60Rate: 7550,
    day90Rate: 7680,
    storageCost60D: 35,
    recommendedAction: "HOLD",
    gainPerQ: 365,
    percentGain: "+5.1%",
    reasonEn: "Textile mill procurement quotas expand post-Diwali. Holding in SWC warehouse yields +₹365/Q.",
    reasonHi: "कपड़ा मिलों की खरीद दिवाली के बाद बढ़ती है। वेयरहाउस में रखने पर ₹365 प्रति क्विंटल का शुद्ध लाभ होगा।",
    reasonPa: "ਕੱਪੜਾ ਮਿੱਲਾਂ ਦੀ ਖਰੀਦ ਦੀਵਾਲੀ ਤੋਂ ਬਾਅਦ ਵਧਦੀ ਹੈ। ਵੇਅਰਹਾਊਸ ਵਿੱਚ ਰੱਖਣ 'ਤੇ ₹365 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਦਾ ਸ਼ੁੱਧ ਲਾਭ ਹੋਵੇਗਾ।"
  }
};

export default function MandiRatesComparison({ onNavigateToTab, currentLang = 'en', defaultCrop = 'wheat' }) {
  const t = translations[currentLang] || translations.en;
  const [selectedCrop, setSelectedCrop] = useState(defaultCrop);
  const [activeView, setActiveView] = useState('rates'); // 'rates' | 'advisory'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadComparison = async (cropId) => {
    setLoading(true);
    try {
      const res = await getMandiRateComparison(cropId);
      setData(res);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to load Mandi rate comparison", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison(selectedCrop);
  }, [selectedCrop]);

  const handleCropSelect = (cropId) => {
    setSelectedCrop(cropId);
  };

  const handleRefresh = () => {
    loadComparison(selectedCrop);
  };

  // Filter mandis by search, state, and type
  const filteredMandis = (data?.mandis || []).filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = stateFilter === 'ALL' || 
      (stateFilter === 'PUNJAB' && /Punjab/i.test(m.state)) ||
      (stateFilter === 'HARYANA' && /Haryana/i.test(m.state)) ||
      (stateFilter === 'DELHI' && /Delhi/i.test(m.state));

    const matchesType = typeFilter === 'ALL' ||
      (typeFilter === 'APMC' && /APMC/i.test(m.type)) ||
      (typeFilter === 'DIRECT' && (/Institutional|FPO/i.test(m.type) || m.apmcCessPercent === 0));

    return matchesSearch && matchesState && matchesType;
  });

  const summary = data?.summary || {};
  const commodity = data?.commodity || {};
  const allCommodities = data?.allCommodities || [];
  const advisory = CROP_ADVISORIES[selectedCrop] || CROP_ADVISORIES.wheat;

  return (
    <div className="space-y-6 text-xs">
      {/* 1. Header Banner with Live Feed Sync Badge */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.agmarknetSyncBadge}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {t.agmarknetTitle}
          </h2>
          <p className="text-slate-500 text-[11px] mt-0.5">
            {t.agmarknetSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-view Switcher: Live Rates vs Sale Window Advisory */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveView('rates')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'rates'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.liveRatesTab || "Live Mandi Comparison"}</span>
            </button>
            <button
              onClick={() => setActiveView('advisory')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'advisory'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.saleWindowTab || "Sale Window & Storage Advisory"}</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold">New</span>
            </button>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            title={t.refreshRates}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{t.refreshRates}</span>
          </button>
        </div>
      </div>

      {/* 2. Commodity Selector Chips */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            {t.selectCommodity}:
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {allCommodities.length} {t.records || "Commodities"}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {allCommodities.map((c) => {
            const isSelected = selectedCrop === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCropSelect(c.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="text-sm">{c.icon || '🌾'}</span>
                <span>{translateCrop(c.name, currentLang)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional View: Sale Window Advisory vs Live Mandis Comparison */}
      {activeView === 'advisory' ? (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Header Summary for Advisory */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  {t.sellNowVsStore || "Sell Now vs. Store Advisory"}
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{commodity.icon || '🌾'}</span>
                  <span>{translateCrop(commodity.name || selectedCrop, currentLang)}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    advisory.recommendedAction === 'HOLD'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {advisory.recommendedAction === 'HOLD' ? t.recommendationHold : t.recommendationSell}
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Today's Harvest Rate</span>
                <span className="text-xl font-bold font-mono text-slate-900">₹{advisory.day0Rate}/Q</span>
              </div>
            </div>

            {/* Projected Price Trend Timeline */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Price Trend & Optimal Harvest Sale Window (Agmarknet 5-Year Model)</span>
                </span>
                <span className="text-[10px] text-slate-400">Localized to Sangrur & Punjab Terminal Hubs</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Day 0 (Today)</span>
                    <span className="text-slate-400">Peak Harvest</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800">
                    ₹{advisory.day0Rate}/Q
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Mandi glut, supply peak
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Day 30</span>
                    <span className="text-emerald-600 font-bold">+₹{advisory.day30Rate - advisory.day0Rate}</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900">
                    ₹{advisory.day30Rate}/Q
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Post-harvest recovery
                  </div>
                </div>

                <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 space-y-1 relative shadow-xs">
                  <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    Optimal Window
                  </span>
                  <div className="flex justify-between text-[11px] text-emerald-900 font-bold">
                    <span>Day 60</span>
                    <span className="text-emerald-700 font-bold">+₹{advisory.day60Rate - advisory.day0Rate}</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-800">
                    ₹{advisory.day60Rate}/Q
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    Lean season mill demand
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Day 90</span>
                    <span className="text-emerald-600 font-bold">+₹{advisory.day90Rate - advisory.day0Rate}</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900">
                    ₹{advisory.day90Rate}/Q
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Inter-state deficit pricing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Sell Now */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Option A: Sell Today</h4>
                    <p className="text-[11px] text-slate-500">Immediate harvest sale at local mandi</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                    Harvest Low
                  </span>
                </div>

                <div className="space-y-1.5 py-2 border-y border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Modal Rate:</span>
                    <span className="font-mono font-bold text-slate-900">₹{advisory.day0Rate}/Q</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Gross for 3 Quintals:</span>
                    <span className="font-mono font-bold text-slate-900">₹{(advisory.day0Rate * 3).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Holding / Storage:</span>
                    <span className="font-mono text-emerald-700">₹0 (Zero wait)</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-2">
                  Provides quick liquidity today, but you forfeit the off-season price appreciation.
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('pricing')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Calculate Net Return Today</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Card 2: Store in WDRA Warehouse */}
            <div className="bg-white p-5 rounded-xl border-2 border-emerald-500 shadow-xs space-y-3 flex flex-col justify-between relative">
              <span className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                ⭐ Recommended Option
              </span>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">Option B: Store in WDRA Warehouse</h4>
                    <p className="text-[11px] text-emerald-700">Hold 45–60 days in accredited silo</p>
                  </div>
                </div>

                <div className="space-y-1.5 py-2 border-y border-emerald-100 text-xs bg-emerald-50/50 p-2.5 rounded-lg">
                  <div className="flex justify-between text-slate-700">
                    <span>Projected Rate (Day 60):</span>
                    <span className="font-mono font-bold text-emerald-800">₹{advisory.day60Rate}/Q</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Holding Cost (Rent + Ins.):</span>
                    <span className="font-mono text-rose-600">-₹{advisory.storageCost60D}/Q</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold border-t border-emerald-200 pt-1">
                    <span>Net Gain per Quintal:</span>
                    <span className="font-mono text-emerald-700 text-sm">+{advisory.percentGain} (+₹{advisory.gainPerQ}/Q)</span>
                  </div>
                  <div className="flex justify-between text-emerald-900 font-semibold text-[11px]">
                    <span>Total Extra on 3Q:</span>
                    <span className="font-mono font-bold text-emerald-800">+₹{(advisory.gainPerQ * 3).toLocaleString('en-IN')} Cash</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mt-2">
                  {currentLang === 'pa' ? advisory.reasonPa : (currentLang === 'hi' ? advisory.reasonHi : advisory.reasonEn)}
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('transport')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>View WDRA Warehouses & Book</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Card 3: e-NWR Liquidity Cash Advance */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-indigo-950 text-sm">e-NWR Cash Advance</h4>
                    <p className="text-[11px] text-indigo-700">Solve liquidity constraints without selling</p>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                    75% PNB Advance
                  </span>
                </div>

                <div className="space-y-1.5 py-2 border-y border-indigo-100 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Stored Produce Value (3Q):</span>
                    <span className="font-mono font-bold text-slate-900">₹{(advisory.day0Rate * 3).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Eligible Instant Advance:</span>
                    <span className="font-mono font-bold text-indigo-700 text-sm">₹{Math.round(advisory.day0Rate * 3 * 0.75).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Agri Interest Rate:</span>
                    <span className="font-mono text-emerald-700 font-semibold">7% Subsidized (KCC)</span>
                  </div>
                </div>

                <p className="text-[11px] text-indigo-900 mt-2">
                  Pledge your electronic warehouse receipt to get cash in your PNB account (****4091) immediately while your wheat gains +₹690 in value!
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('transport')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Apply for 75% Advance</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 3. Key Benchmark Cards for Selected Crop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* MSP Floor */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-medium">{t.govtMspLabel}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                ₹{summary.baseMsp?.toLocaleString('en-IN') || '—'}{t.perQuintalUnit || '/Q'}
              </div>
              <p className="text-[11px] text-slate-400">
                {t.govtMspDesc}
              </p>
            </div>

            {/* National Avg */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-medium">{t.nationalAvgLabel}</span>
                <BarChart3 className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-sky-700 font-mono">
                ₹{summary.nationalAvg?.toLocaleString('en-IN') || '—'}{t.perQuintalUnit || '/Q'}
              </div>
              <p className="text-[11px] text-slate-400">
                {t.nationalAvgDesc}
              </p>
            </div>

            {/* Highest Mandi Today */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-medium">{t.highestMandiLabel}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 font-mono">
                ₹{summary.highestMandi?.price?.toLocaleString('en-IN') || '—'}{t.perQuintalUnit || '/Q'}
              </div>
              <p className="text-[11px] text-emerald-800 truncate font-medium">
                {translateMandi(summary.highestMandi?.name, currentLang)}
              </p>
            </div>

            {/* Spread / Arbitrage */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="font-semibold">{t.arbitrageLabel}</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 font-mono">
                +₹{summary.spread || 0}{t.perQuintalUnit || '/Q'}
              </div>
              <p className="text-[11px] text-emerald-700">
                {t.arbitrageDesc}
              </p>
            </div>
          </div>

          {/* 4. Visual Rate Comparison Bar Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>{t.compareChartTitle}</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {translateCrop(commodity.name, currentLang)}
              </span>
            </div>

            {/* Horizontal Comparative Chart */}
            <div className="space-y-2.5 pt-1">
              {/* MSP Benchmark reference bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    {t.govtMspLabel} ({t.govtMspDesc})
                  </span>
                  <span className="font-mono font-bold text-slate-700">₹{summary.baseMsp}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              {/* Mandis Comparison Bars */}
              {(data?.mandis || []).slice(0, 6).map((m) => {
                const isDirect = /Institutional|FPO/i.test(m.type) || m.apmcCessPercent === 0;
                const isTop = m.modalPrice === summary.highestMandi?.price;
                const widthPct = Math.min(100, Math.max(20, Math.round(((m.modalPrice - 2000) / 1000) * 100)));

                return (
                  <div key={m.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">
                          {translateMandi(m.name, currentLang)}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          isDirect ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {translateMarketType(m.type, currentLang)}
                        </span>
                        {isTop && (
                          <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            {t.bestProfit || "Top Rate"}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{m.modalPrice}{t.perQuintalUnit || '/Q'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isTop ? 'bg-emerald-600' : isDirect ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${widthPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Detailed Comparison Table with Filters */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{t.mandiTableTitle}</span>
                <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  {filteredMandis.length} {t.marketsFound || "Markets"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.searchMandiPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-40 sm:w-48"
                  />
                </div>

                {/* State Filter */}
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">{t.allStates}</option>
                  <option value="PUNJAB">{translateLocation("Punjab", currentLang)}</option>
                  <option value="HARYANA">{translateLocation("Haryana", currentLang)}</option>
                  <option value="DELHI">{translateLocation("Delhi", currentLang)}</option>
                </select>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">{t.allTypes}</option>
                  <option value="APMC">{t.apmcOnly}</option>
                  <option value="DIRECT">{t.directOnly}</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3">{t.marketHeader}</th>
                    <th className="py-2.5 px-3">{t.typeHeader}</th>
                    <th className="py-2.5 px-3 font-mono text-right">{t.modalRateHeader}</th>
                    <th className="py-2.5 px-3 font-mono text-right">{t.minMaxHeader}</th>
                    <th className="py-2.5 px-3 font-mono text-right">{t.diffMspHeader}</th>
                    <th className="py-2.5 px-3 font-mono text-right">{t.arrivalsHeader}</th>
                    <th className="py-2.5 px-3 font-mono text-right">{t.distanceHeader}</th>
                    <th className="py-2.5 px-3 font-mono text-right">{t.cessHeader}</th>
                    <th className="py-2.5 px-3 text-right">{t.actionCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMandis.map((m) => {
                    const isDirect = /Institutional|FPO/i.test(m.type) || m.apmcCessPercent === 0;
                    const isHighest = m.modalPrice === summary.highestMandi?.price;
                    const diffMsp = m.modalPrice - summary.baseMsp;

                    return (
                      <tr key={m.id} className={isHighest ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{translateMandi(m.name, currentLang)}</span>
                            {isHighest && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                {t.topRateBadge || "Top"}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {translateLocation(m.state, currentLang)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isDirect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {translateMarketType(m.type, currentLang)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-xs">
                          ₹{m.modalPrice}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-500">
                          ₹{m.minPrice} - ₹{m.maxPrice}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                          <span className={diffMsp >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                            {diffMsp >= 0 ? `+₹${diffMsp}` : `-₹${Math.abs(diffMsp)}`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-600">
                          {m.dailyArrivalsQuintals} {t.quintals}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-600">
                          {m.distanceKm} km
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                          {m.apmcCessPercent === 0 ? (
                            <span className="text-emerald-700 font-bold">0% (Zero)</span>
                          ) : (
                            <span className="text-slate-600">{m.apmcCessPercent}%</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              onNavigateToTab('pricing');
                            }}
                            className="bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            {t.calculateNetReturn}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. All 7 Commodities National Rate Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t.nationalMatrixTitle}</h3>
                <p className="text-[11px] text-slate-500">{t.nationalMatrixSubtitle}</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                7 {t.cropsActive || "Crops"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3">{t.cropHeader}</th>
                    <th className="py-2.5 px-3">{t.mspHeader}</th>
                    <th className="py-2.5 px-3">{t.currentModalHeader}</th>
                    <th className="py-2.5 px-3">{t.trendHeader}</th>
                    <th className="py-2.5 px-3">{t.topMarketHeader}</th>
                    <th className="py-2.5 px-3 text-right">{t.actionCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {allCommodities.map((c) => {
                    const isCurrent = c.id === selectedCrop;
                    const diff = c.currentAvgRate - c.baseMsp;
                    return (
                      <tr key={c.id} className={isCurrent ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{c.icon}</span>
                          <span>{translateCrop(c.name, currentLang)}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">₹{c.baseMsp}{t.perQuintalUnit || '/Q'}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">₹{c.currentAvgRate}{t.perQuintalUnit || '/Q'}</td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className="text-emerald-700 font-medium">
                            +₹{diff} ({t.aboveMsp || "above MSP"})
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-emerald-800">
                          {translateMandi("ITC e-Choupal Direct Hub", currentLang)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleCropSelect(c.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {isCurrent ? (t.verified || 'Selected') : (t.compareAllRatesBtn || 'Compare')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
