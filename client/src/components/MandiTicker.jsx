import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Radio, RefreshCw } from 'lucide-react';
import { getLiveMandiTicker } from '../services/api';
import { translations, translateCrop } from '../translations';

export default function MandiTicker({ onSelectCrop, currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;
  const [commodities, setCommodities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTicker = async () => {
    try {
      setIsRefreshing(true);
      const res = await getLiveMandiTicker();
      if (res.data) {
        setCommodities(res.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to load mandi ticker", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, 12000); // 12-sec refresh cycle
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white overflow-hidden py-2 px-3 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 shrink-0 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline">{t.liveAgmarknet}</span>
          <span className="sm:hidden">{t.liveBadge}</span>
        </div>

        {/* Scrolling / Flex Ticker list */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 text-xs">
          {commodities.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectCrop && onSelectCrop(item.id)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-all text-left group"
            >
              <span className="text-base">{item.icon}</span>
              <div>
                <span className="font-semibold text-slate-200 group-hover:text-emerald-300">
                  {translateCrop(item.name, currentLang)}
                </span>
                <span className="text-slate-400 ml-1.5 font-mono">
                  ₹{item.livePrice.toLocaleString('en-IN')}{t.perQuintalUnit || '/Q'}
                </span>
              </div>
              <span
                className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.isPositive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {item.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {item.delta > 0 ? `+${item.delta}` : item.delta}
              </span>
            </button>
          ))}
        </div>

        {/* Manual Refresh & Sync */}
        <button
          onClick={fetchTicker}
          title={t.refreshPrices}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>
    </div>
  );
}
