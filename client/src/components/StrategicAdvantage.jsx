import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  Users,
  Percent,
  Cpu,
  Layers,
  FileText
} from 'lucide-react';
import { getImpactAnalytics } from '../services/api';

export default function StrategicAdvantage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getImpactAnalytics().then(res => setData(res)).catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-800/40">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400/20 text-amber-300 font-bold px-3 py-1 rounded-full text-xs border border-amber-400/30 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Platform Benchmark & Economics</span>
            </span>
            <span className="text-emerald-300 text-xs font-semibold">
              Empowering India's Agricultural Supply Chain
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Impact, Viability & Strategic Advantage
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            A structural comparison of AgriLink against conventional APMC commission cartels, government listing portals (e-NAM / Kisan Sabha),
            and centralized agritech platforms (Ninjacart / DeHaat).
          </p>
        </div>
      </div>

      {/* 3 Key Impact Metric Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/30 shadow-md relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Core Beneficiary Focus
          </span>
          <div className="text-4xl sm:text-5xl font-black text-emerald-700 tracking-tight font-mono">
            {data.metrics.smallholdersEmpoweredPercent}
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-2">
            Smallholder Farmers Empowered
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Eliminating distress farm-gate sales for marginal farmers producing 2–5 quintal harvests.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-teal-500/30 shadow-md relative overflow-hidden group hover:border-teal-500 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Hyperlocal Freight Savings
          </span>
          <div className="text-4xl sm:text-5xl font-black text-teal-700 tracking-tight font-mono">
            {data.metrics.freightCostReductionRange}
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-2">
            Freight Cost Reduction via Pooling
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Consolidating sub-scale loads in 5–10 km village clusters cuts standalone transport extortion.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-500/30 shadow-md relative overflow-hidden group hover:border-indigo-500 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Cold Chain & Direct Hop
          </span>
          <div className="text-4xl sm:text-5xl font-black text-indigo-700 tracking-tight font-mono">
            {data.metrics.transitWastageReduction}
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-2">
            Perishable Transit Wastage Cut
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Algorithmic direct routing and farm-gate AI grading prevents transit delays and spoilage.
          </p>
        </div>
      </div>

      {/* Competitive Benchmark Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Industry Comparison: How AgriLink Outperforms Existing Systems
            </h3>
            <p className="text-xs text-slate-500">
              Transforming agricultural trade from opaque middleman cartels to transparent, direct commerce
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Verified Structural Advantage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 w-1/5">Parameter</th>
                <th className="py-3.5 px-4 w-1/5 text-slate-600">Traditional APMC</th>
                <th className="py-3.5 px-4 w-1/5 text-slate-600">Kisan Sabha / e-NAM</th>
                <th className="py-3.5 px-4 w-1/5 text-slate-600">Ninjacart / DeHaat</th>
                <th className="py-3.5 px-4 sm:px-6 w-1/5 bg-emerald-50 text-emerald-900 font-black border-l border-r border-emerald-200">
                  🌟 AgriLink Platform
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.comparisonMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 bg-slate-50/40">
                    {row.parameter}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <span className="inline-block text-rose-700 font-medium">
                      ✕ {row.traditionalApmc}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <span className="inline-block text-amber-700 font-medium">
                      △ {row.kisanSabhaENam}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <span className="inline-block text-slate-700 font-medium">
                      • {row.ninjacartDeHaat}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-emerald-900 bg-emerald-50/50 border-l border-r border-emerald-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{row.agriLink}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
