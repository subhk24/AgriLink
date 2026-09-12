import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Lock,
  CheckCircle2,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { getProduceListings, createEscrowDeposit } from '../services/api';

const BUYER_PROFILES = [
  {
    id: "itc",
    name: "ITC e-Choupal Sourcing Division",
    type: "Institutional Agribusiness",
    gst: "07AAACI1681G1ZM",
    verifiedEscrowBalance: "₹45,00,000",
    headquarters: "New Delhi & Central Procurement Hub"
  },
  {
    id: "motherdairy",
    name: "Mother Dairy Safal Procurement",
    type: "Cold Chain Dairy & Fresh Retail",
    gst: "07AAACM4819Q1ZP",
    verifiedEscrowBalance: "₹28,50,000",
    headquarters: "Delhi NCR Cold Link"
  },
  {
    id: "bigbasket",
    name: "BigBasket Direct Farm Sourcing",
    type: "B2B E-Commerce Agri Network",
    gst: "29AABCB1890L1ZR",
    verifiedEscrowBalance: "₹36,00,000",
    headquarters: "Bengaluru & Pan-India Hubs"
  }
];

export default function BuyerDashboard({ onNavigateToTab }) {
  const [selectedBuyer, setSelectedBuyer] = useState(BUYER_PROFILES[0]);
  const [listings, setListings] = useState([]);
  const [lockingListing, setLockingListing] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchListings = async () => {
    try {
      const res = await getProduceListings();
      if (res.listings) setListings(res.listings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleLockDeal = async (item) => {
    setIsProcessing(true);
    setSuccessMessage('');
    try {
      const gross = item.quantityQuintals * item.expectedPricePerQ;
      const transportDeduct = Math.round(gross * 0.05); // ~5% pooled transport

      const res = await createEscrowDeposit({
        buyerName: selectedBuyer.name,
        buyerGst: selectedBuyer.gst,
        farmerName: item.farmerName,
        farmerPhone: item.phone,
        farmerVillage: `${item.village}, ${item.district}`,
        crop: item.crop,
        quantityQuintals: item.quantityQuintals,
        agreedRatePerQ: item.expectedPricePerQ,
        transportCostDeduction: transportDeduct
      });

      if (res.success) {
        setSuccessMessage(`Deal locked! 100% Funds (₹${gross.toLocaleString('en-IN')}) pre-secured in Smart Escrow Vault.`);
        setTimeout(() => {
          onNavigateToTab('escrow');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert("Error locking escrow deal");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Buyer Header & Balance Vault Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 font-bold px-3 py-0.5 rounded-full text-xs border border-indigo-400/30">
                Institutional Buyer & FPO Portal
              </span>
              <span className="text-emerald-400 text-xs font-semibold">
                Direct Farm-Gate Matching
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Verified Procurement Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
              Source verified Grade A & B crops directly from smallholder clusters.
              Pre-lock payments in escrow to guarantee delivery without middleman delays or arbitrary mandi cuts.
            </p>
          </div>

          {/* Active Buyer Profile Switcher */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[280px]">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
              Active Institutional Buyer Account:
            </span>
            <select
              value={selectedBuyer.id}
              onChange={(e) => setSelectedBuyer(BUYER_PROFILES.find(b => b.id === e.target.value))}
              className="w-full bg-slate-900/80 border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white mb-2"
            >
              {BUYER_PROFILES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Pre-Funded Escrow Pool:</span>
              <span className="font-mono font-bold text-emerald-400">{selectedBuyer.verifiedEscrowBalance}</span>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <span className="text-emerald-700 underline">Navigating to Escrow Vault...</span>
        </div>
      )}

      {/* Produce Listings Available for Direct Procurement */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Verified Farmer Produce Available for Sourcing
            </h3>
            <p className="text-xs text-slate-500">
              All listings include farm-gate computer vision quality inspection reports
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {listings.length} Active Batches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((item) => {
            const grossVal = item.quantityQuintals * item.expectedPricePerQ;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-16/9 bg-slate-100">
                  <img
                    src={item.photoUrl}
                    alt={item.crop}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow">
                    AI: {item.qualityGrade} ({item.aiConfidence}%)
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    Defect: {item.defectScorePercent}%
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Farmer Cluster • {item.village}, {item.state}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{item.crop}</h4>
                    <span className="text-xs text-slate-500 font-medium">Producer: {item.farmerName}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Harvest Batch:</span>
                      <span className="font-bold text-slate-800">{item.quantityQuintals} Quintals</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quoted Farm Rate:</span>
                      <span className="font-mono font-bold text-slate-900">₹{item.expectedPricePerQ}/Q</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                      <span>Total Lot Value:</span>
                      <span className="font-mono text-sm">₹{grossVal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleLockDeal(item)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Deal & Deposit to Escrow Vault</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
