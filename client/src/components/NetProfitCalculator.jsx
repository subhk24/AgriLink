import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Truck,
  Users,
  CheckCircle2,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { calculateNetProfit } from '../services/api';
import { translations, translateCrop, translateMandi } from '../translations';

const CROPS = [
  { id: "wheat", raw: "Wheat (Gehu)" },
  { id: "onion", raw: "Red Onion (Pyaz)" },
  { id: "tomato", raw: "Hybrid Tomato" },
  { id: "paddy", raw: "Basmati Paddy" },
  { id: "mustard", raw: "Mustard (Sarson)" },
  { id: "potato", raw: "Potato (Aloo)" }
];

export default function NetProfitCalculator({ selectedCropId = "wheat", onInitiateDeal, onNavigateToRates, currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;
  const [cropId, setCropId] = useState(selectedCropId);
  const [quantity, setQuantity] = useState(3.0);
  const [isPooled, setIsPooled] = useState(true);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCropId) setCropId(selectedCropId);
  }, [selectedCropId]);

  const runCalculation = async () => {
    setLoading(true);
    try {
      const res = await calculateNetProfit(cropId, quantity, isPooled);
      setCalculation(res);
    } catch (err) {
      console.error("Net-profit calculation failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [cropId, quantity, isPooled]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t.priceDiscoveryTitle}</h2>
          <p className="text-slate-500 text-[11px] mt-0.5">
            {t.priceDiscoveryDesc}
          </p>
        </div>
        <div className="bg-slate-100 px-2.5 py-1 rounded text-[11px] font-mono text-slate-700">
          {t.netFormula}
        </div>
      </div>

      {/* Agmarknet Benchmark Comparison Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.seeComparisonBanner || "Official Agmarknet benchmark: Compare 9 mandis before deductions →"}</span>
        </div>
        {onNavigateToRates && (
          <button
            onClick={onNavigateToRates}
            className="text-emerald-700 font-bold hover:underline whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>{t.compareRatesLink || "Compare Live Mandi Rates →"}</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">{t.selectCrop}</label>
          <select
            value={cropId}
            onChange={(e) => setCropId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900"
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {translateCrop(c.raw, currentLang)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">{t.qtyCol} ({quantity} {t.quintals})</label>
          <input
            type="range"
            min="0.5"
            max="15.0"
            step="0.5"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">{t.sharedTransportTitle}</label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setIsPooled(true)}
              className={`py-1.5 px-2 rounded-lg font-medium text-[11px] border transition-colors ${
                isPooled ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {t.sharedTransportToggle}
            </button>
            <button
              onClick={() => setIsPooled(false)}
              className={`py-1.5 px-2 rounded-lg font-medium text-[11px] border transition-colors ${
                !isPooled ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {t.soloHireToggle}
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3">{t.marketCol}</th>
              <th className="py-2.5 px-3">{t.distanceCol}</th>
              <th className="py-2.5 px-3">{t.grossRateCol}</th>
              <th className="py-2.5 px-3">{t.freightCol}</th>
              <th className="py-2.5 px-3">{t.tollsCessCol}</th>
              <th className="py-2.5 px-3 font-bold text-slate-900">{t.netInHandCol}</th>
              <th className="py-2.5 px-3 text-right">{t.actionCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {calculation?.destinations?.map((dest) => {
              const isTop = dest.isRecommendedBest;
              return (
                <tr key={dest.mandiId} className={isTop ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{translateMandi(dest.mandiName, currentLang)}</span>
                      {isTop && (
                        <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                          {t.bestProfit}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{dest.distanceKm} km</td>
                  <td className="py-3 px-3 font-mono">₹{dest.grossPricePerQ}{t.perQuintalUnit || '/Q'}</td>
                  <td className="py-3 px-3 font-mono text-rose-600">-₹{dest.breakdown.freightCost}</td>
                  <td className="py-3 px-3 font-mono text-rose-600">
                    -₹{dest.breakdown.tollShare + dest.breakdown.cessAmount}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ₹{dest.netProfit.toLocaleString('en-IN')} (₹{dest.netRatePerQuintal}{t.perQuintalUnit || '/Q'})
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onInitiateDeal && onInitiateDeal(dest, cropId, quantity, isPooled)}
                      className="text-emerald-600 hover:underline font-medium"
                    >
                      {t.sellHere}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
