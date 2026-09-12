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
  CheckCircle2,
  Building2,
  Store,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getMandiRateComparison } from '../services/api';
import {
  translations,
  translateCrop,
  translateMandi,
  translateMarketType,
  translateLocation
} from '../translations';

export default function MandiRatesComparison({ onNavigateToTab, currentLang = 'en', defaultCrop = 'wheat' }) {
  const t = translations[currentLang] || translations.en;
  const [selectedCrop, setSelectedCrop] = useState(defaultCrop);
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
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-emerald-700 font-mono">
                      {m.diffFromMsp >= 0 ? `+₹${m.diffFromMsp}` : `-₹${Math.abs(m.diffFromMsp)}`}
                    </span>
                    <span className="font-mono font-bold text-slate-900">₹{m.modalPrice}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isTop ? 'bg-emerald-600' : (isDirect ? 'bg-emerald-500' : 'bg-sky-600')
                    }`}
                    style={{ width: `${widthPct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Detailed Mandi Rate Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden space-y-0">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchMandi}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs font-medium cursor-pointer"
            >
              <option value="ALL">{t.allStates}</option>
              <option value="PUNJAB">{t.punjab}</option>
              <option value="HARYANA">{t.haryana}</option>
              <option value="DELHI">{t.delhi}</option>
            </select>

            {/* Market Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs font-medium cursor-pointer"
            >
              <option value="ALL">{t.allMandis}</option>
              <option value="APMC">{t.apmcOnly}</option>
              <option value="DIRECT">{t.directOnly}</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                <th className="py-3 px-4">{t.mandiCol}</th>
                <th className="py-3 px-4">{t.typeCol}</th>
                <th className="py-3 px-4">{t.rateCol}</th>
                <th className="py-3 px-4">{t.rangeCol}</th>
                <th className="py-3 px-4">{t.vsMspCol}</th>
                <th className="py-3 px-4">{t.vsAvgCol}</th>
                <th className="py-3 px-4">{t.arrivalsCol}</th>
                <th className="py-3 px-4">{t.distanceCessCol}</th>
                <th className="py-3 px-4 text-right">{t.actionCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredMandis.map((m) => {
                const isDirect = /Institutional|FPO/i.test(m.type) || m.apmcCessPercent === 0;
                const isHighest = m.modalPrice === summary.highestMandi?.price;

                return (
                  <tr key={m.id} className={`hover:bg-slate-50/80 transition-colors ${isHighest ? 'bg-emerald-50/40' : ''}`}>
                    {/* Mandi Name & State */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5">
                          {translateMandi(m.name, currentLang)}
                          {isHighest && (
                            <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                              {t.bestProfit || "Top"}
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {translateLocation(m.state, currentLang)}
                        </span>
                      </div>
                    </td>

                    {/* Market Type */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        isDirect 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {translateMarketType(m.type, currentLang)}
                      </span>
                    </td>

                    {/* Live Modal Rate */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                      ₹{m.modalPrice}
                      <span className="text-[10px] text-slate-400 font-normal">{t.perQuintalUnit || '/Q'}</span>
                    </td>

                    {/* Min - Max Range */}
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      ₹{m.minPrice} - ₹{m.maxPrice}
                    </td>

                    {/* vs MSP */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold font-mono ${
                        m.diffFromMsp >= 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {m.diffFromMsp >= 0 ? `+₹${m.diffFromMsp}` : `-₹${Math.abs(m.diffFromMsp)}`}
                      </span>
                    </td>

                    {/* vs National Avg */}
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className={m.diffFromAvg >= 0 ? 'text-emerald-600 font-medium' : 'text-amber-600'}>
                        {m.diffFromAvg >= 0 ? `+₹${m.diffFromAvg} (▲${m.percentDiffFromAvg}%)` : `₹${m.diffFromAvg} (▼${Math.abs(m.percentDiffFromAvg)}%)`}
                      </span>
                    </td>

                    {/* Daily Arrivals */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {m.arrivalsQuintals?.toLocaleString('en-IN')} {t.quintals || 'Q'}
                    </td>

                    {/* Distance & Cess */}
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      <div>{m.distanceKm} km</div>
                      <div className={`text-[10px] ${m.apmcCessPercent === 0 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                        {m.apmcCessPercent === 0 ? '0% Cess (Direct)' : `${m.apmcCessPercent}% APMC Cess`}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigateToTab && onNavigateToTab('pricing')}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                        title={t.calcNetProfitBtn}
                      >
                        <span>{t.calcNetProfitBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Multi-Crop All-India Agmarknet Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">{t.multiCropTitle}</h3>
            <p className="text-slate-500 text-[11px] mt-0.5">{t.multiCropDesc}</p>
          </div>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-600">
            7 {t.records || "Crops"}
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
    </div>
  );
}
