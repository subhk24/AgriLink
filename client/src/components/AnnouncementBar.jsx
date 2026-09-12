import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SIHBanner() {
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white text-xs border-b border-emerald-800/40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-emerald-300">National Farm-Gate Linkage Network</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="text-slate-300 hidden sm:inline">
            Direct Institutional Buyer Matching & Verified Escrow Settlements
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RBI-Compliant Escrow</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1 text-teal-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Agmarknet Live Sync</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:18001801551"
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 text-[11px] transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span className="hidden sm:inline">Kisan Helpline:</span> 1800-180-1551
            </a>

            <button
              onClick={() => setShowNetworkInfo(!showNetworkInfo)}
              className="flex items-center gap-1 text-slate-400 hover:text-white text-[11px] font-medium transition-colors"
            >
              <span>{showNetworkInfo ? "Less" : "Network Details"}</span>
              {showNetworkInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {showNetworkInfo && (
        <div className="bg-slate-950/95 border-t border-emerald-900/40 px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-300 animate-fade-in">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-slate-500 block font-semibold text-[11px] uppercase tracking-wider">Zero-Middleman Mandates</span>
              <span className="text-emerald-300 font-medium">Direct Institutional Sourcing (ITC, Mother Dairy, FPOs)</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[11px] uppercase tracking-wider">Vernacular Voice Support</span>
              <span className="text-teal-300 font-medium">12+ Regional Dialects via Bhashini Gateway</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[11px] uppercase tracking-wider">Shared Logistics Hub</span>
              <span className="text-white font-medium">Hyperlocal 5–10 km Village Pooling (35%–50% Off)</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-[11px] uppercase tracking-wider">Settlement Guarantee</span>
              <span className="text-amber-300 font-medium font-mono">Instant DBT Payouts upon Delivery Sign-off</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
