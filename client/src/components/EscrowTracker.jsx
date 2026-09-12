import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Truck, Lock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getEscrowTransactions,
  dispatchEscrow,
  confirmEscrowDelivery,
  releaseInstantDbt
} from '../services/api';
import {
  translations,
  translateCrop,
  translateStatus,
  translateBuyer,
  translatePerson,
  translateBank
} from '../translations';

export default function EscrowTracker({ currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await getEscrowTransactions();
      if (res.transactions) {
        setTransactions(res.transactions);
        if (!selectedTx && res.transactions.length > 0) {
          setSelectedTx(res.transactions[0]);
        } else if (selectedTx) {
          const updated = res.transactions.find(t => t.id === selectedTx.id);
          if (updated) setSelectedTx(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDispatch = async (id) => {
    setLoading(true);
    try {
      await dispatchEscrow(id);
      await fetchTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (id) => {
    setLoading(true);
    try {
      await confirmEscrowDelivery(id);
      await fetchTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseDbt = async (id) => {
    setLoading(true);
    try {
      await releaseInstantDbt(id);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      await fetchTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedTx) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
        {t.noOrders}
      </div>
    );
  }

  return (
    <div className="space-y-5 text-xs">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="font-bold text-sm text-slate-900">{t.ordersHeading}</h2>
          <p className="text-slate-500 text-[11px]">{t.ordersDesc}</p>
        </div>
        <span className="font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded text-slate-600">
          {transactions.length} {t.activeOrders}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Order List */}
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                selectedTx.id === tx.id
                  ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono font-bold text-slate-900">{tx.id}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                  {translateStatus(tx.status, currentLang)}
                </span>
              </div>
              <div className="text-slate-700 font-medium">
                {translateBuyer(tx.buyer_name || tx.buyerName, currentLang)}
              </div>
              <div className="flex justify-between text-slate-500 mt-1.5">
                <span>{translateCrop(tx.crop, currentLang)} ({tx.quantity_quintals || tx.quantityQuintals} {t.quintals})</span>
                <span className="font-mono font-bold text-emerald-700">
                  ₹{(tx.net_farmer_payout || tx.netFarmerPayout || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Columns: Order Detail & Actions */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-slate-400 font-mono text-[10px] block">{selectedTx.id}</span>
                <h3 className="font-bold text-sm text-slate-900">
                  {translateBuyer(selectedTx.buyer_name || selectedTx.buyerName, currentLang)}
                </h3>
                <span className="text-slate-500 text-[11px]">
                  {t.farmerName}: {translatePerson(selectedTx.farmer_name || selectedTx.farmerName, currentLang)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block">{t.netFarmerPayout}</span>
                <span className="text-lg font-bold text-emerald-700 font-mono">
                  ₹{(selectedTx.net_farmer_payout || selectedTx.netFarmerPayout || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Pipeline Steps */}
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className={`p-2 rounded-lg border ${
                selectedTx.status ? 'bg-slate-50 border-emerald-400 text-emerald-800 font-semibold' : 'bg-slate-50 text-slate-400'
              }`}>
                {t.step1}
              </div>
              <div className={`p-2 rounded-lg border ${
                ['IN_TRANSIT', 'DELIVERY_CONFIRMED', 'INSTANT_DBT_RELEASED'].includes(selectedTx.status)
                  ? 'bg-slate-50 border-emerald-400 text-emerald-800 font-semibold' : 'bg-slate-50 text-slate-400'
              }`}>
                {t.step2}
              </div>
              <div className={`p-2 rounded-lg border ${
                ['DELIVERY_CONFIRMED', 'INSTANT_DBT_RELEASED'].includes(selectedTx.status)
                  ? 'bg-slate-50 border-emerald-400 text-emerald-800 font-semibold' : 'bg-slate-50 text-slate-400'
              }`}>
                {t.step3}
              </div>
              <div className={`p-2 rounded-lg border ${
                selectedTx.status === 'INSTANT_DBT_RELEASED'
                  ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-50 text-slate-400'
              }`}>
                {t.step4}
              </div>
            </div>

            {/* Details */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.cropLabel}:</span>
                <span className="font-semibold text-slate-900">{translateCrop(selectedTx.crop, currentLang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.qtyCol}:</span>
                <span className="font-semibold text-slate-900">{selectedTx.quantity_quintals || selectedTx.quantityQuintals} {t.quintals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.priceCol}:</span>
                <span className="font-mono text-slate-900">₹{selectedTx.agreed_rate_per_q || selectedTx.agreedRatePerQ}{t.perQuintalUnit || '/Q'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.bankAccount}:</span>
                <span className="font-mono text-slate-700">
                  {translateBank(selectedTx.farmer_bank || selectedTx.farmerBank, currentLang)}
                </span>
              </div>
              {selectedTx.utr_number || selectedTx.utrNumber ? (
                <div className="flex justify-between pt-1 border-t border-slate-200 text-emerald-700 font-semibold font-mono">
                  <span>{t.utrLabel}:</span>
                  <span>{selectedTx.utr_number || selectedTx.utrNumber}</span>
                </div>
              ) : null}
            </div>

            {/* Actions to Advance Status */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {selectedTx.status === 'VAULT_LOCKED' && (
                <button
                  disabled={loading}
                  onClick={() => handleDispatch(selectedTx.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-medium"
                >
                  {t.markInTransit}
                </button>
              )}

              {selectedTx.status === 'IN_TRANSIT' && (
                <button
                  disabled={loading}
                  onClick={() => handleConfirmDelivery(selectedTx.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-medium"
                >
                  {t.confirmDelivery}
                </button>
              )}

              {selectedTx.status === 'DELIVERY_CONFIRMED' && (
                <button
                  disabled={loading}
                  onClick={() => handleReleaseDbt(selectedTx.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-bold shadow-xs"
                >
                  {t.releaseDbtBtn}
                </button>
              )}

              {selectedTx.status === 'INSTANT_DBT_RELEASED' && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>{t.paymentReleased}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
