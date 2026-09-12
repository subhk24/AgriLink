import React, { useState, useEffect } from 'react';
import {
  Check,
  AlertTriangle,
  AlertCircle,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getEscrowTransactions,
  dispatchEscrow,
  confirmEscrowDelivery,
  releaseInstantDbt,
  raiseEscrowDispute,
  resolveEscrowDispute
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
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeCategory, setDisputeCategory] = useState('Quality grade mismatch (Buyer claims Grade B vs Grade A)');
  const [disputeNotice, setDisputeNotice] = useState('');

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

  const handleRaiseDispute = async (id) => {
    setLoading(true);
    try {
      const res = await raiseEscrowDispute(id, disputeCategory);
      setShowDisputeModal(false);
      setDisputeNotice(res.message);
      await fetchTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (id, currentPayout) => {
    setLoading(true);
    try {
      const adjusted = Math.round((currentPayout || 7560) * 0.98); // 2% mutual settlement
      const res = await resolveEscrowDispute(id, adjusted);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      setDisputeNotice(res.message);
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

  const isDisputed = selectedTx.status === 'DISPUTE_ARBITRATION' || selectedTx.status === 'DISPUTE_HELD';

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

      {disputeNotice && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">{disputeNotice}</span>
          </div>
          <button
            onClick={() => setDisputeNotice('')}
            className="text-amber-700 hover:text-amber-900 font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Order List */}
        <div className="space-y-2">
          {transactions.map((tx) => {
            const isTxDisputed = tx.status === 'DISPUTE_ARBITRATION' || tx.status === 'DISPUTE_HELD';
            return (
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
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isTxDisputed
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
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
            );
          })}
        </div>

        {/* Right Column: Order Details & Escrow Stepper */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{selectedTx.id}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    isDisputed
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {translateStatus(selectedTx.status, currentLang)}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {t.buyerLabel}: <strong>{translateBuyer(selectedTx.buyer_name || selectedTx.buyerName, currentLang)}</strong> • {t.farmerLabel}: {translatePerson(selectedTx.farmer_name || selectedTx.farmerName, currentLang)}
                </p>
              </div>

              <div className="text-right">
                <span className="text-slate-400 text-[10px] block">{t.totalEscrowAmount}</span>
                <span className="font-mono font-bold text-base text-slate-900">
                  ₹{(selectedTx.total_escrow_amount || selectedTx.totalEscrowAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-700 text-xs">{t.lifecycleTitle}:</span>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { key: 'VAULT_LOCKED', label: t.step1, sub: t.step1Sub },
                  { key: 'IN_TRANSIT', label: t.step2, sub: t.step2Sub },
                  { key: 'DELIVERY_CONFIRMED', label: t.step3, sub: t.step3Sub },
                  { key: 'INSTANT_DBT_RELEASED', label: t.step4, sub: t.step4Sub }
                ].map((step, idx) => {
                  const statusKeys = ['VAULT_LOCKED', 'IN_TRANSIT', 'DELIVERY_CONFIRMED', 'INSTANT_DBT_RELEASED'];
                  const currentIndex = statusKeys.indexOf(selectedTx.status);
                  const stepIndex = statusKeys.indexOf(step.key);
                  const isDone = isDisputed ? stepIndex < 2 : (currentIndex >= stepIndex && currentIndex !== -1);
                  const isCurrent = !isDisputed && currentIndex === stepIndex;

                  return (
                    <div
                      key={step.key}
                      className={`p-2.5 rounded-lg border text-center space-y-1 transition-all ${
                        isDone
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                          : isCurrent
                          ? 'bg-emerald-100/50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold bg-white shadow-xs">
                        {isDone ? <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> : idx + 1}
                      </div>
                      <div className="font-bold text-[11px] leading-tight">{step.label}</div>
                      <div className="text-[9px] text-slate-500 leading-none">{step.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dispute Arbitration Callout (When Dispute Active) */}
            {isDisputed && (
              <div className="p-4 bg-rose-50/70 border-2 border-rose-300 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-rose-950 text-xs">
                      {t.disputeStatusFrozen || "Escrow Funds Frozen in Neutral APMC Arbitration"}
                    </h4>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      Issue: <strong>{selectedTx.dispute_reason || "Quality inspection defect score mismatch"}</strong>
                    </p>
                  </div>
                </div>

                {/* Inspection Comparison Audit */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-lg border border-rose-200">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Dispatch AI Computer Vision</span>
                    <span className="font-bold text-emerald-700">Grade A (3.2% defect score)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Buyer Arrival Claim</span>
                    <span className="font-bold text-rose-700">Grade B (4.6% moisture defect)</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100 text-[10px] text-slate-600">
                    ⚖️ <strong>APMC Neutral Arbitrator Finding:</strong> Minor transit moisture during evening rain (+1.4%). Recommended fair compromise: 2% moisture allowance adjustment.
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-rose-900 font-semibold">
                    Settlement Payout: ₹{Math.round((selectedTx.net_farmer_payout || 7560) * 0.98).toLocaleString('en-IN')} (Credited to PNB ****4091)
                  </span>
                  <button
                    disabled={loading}
                    onClick={() => handleResolveDispute(selectedTx.id, selectedTx.net_farmer_payout)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.resolveDisputeBtn || "Approve Settlement & Disburse DBT"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Raise Dispute Modal / Drawer */}
            {showDisputeModal && !isDisputed && (
              <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.disputeTitle || "Raise Formal Grievance / Quality Dispute"}</span>
                  </h4>
                  <button
                    onClick={() => setShowDisputeModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-[11px] text-amber-800">
                  {t.disputeDesc || "Transparent APMC/FPO neutral arbitration with AI inspection audit trail. Freezes escrow release until resolved."}
                </p>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t.disputeReasonLabel || "Select Dispute Category"}
                  </label>
                  <select
                    value={disputeCategory}
                    onChange={(e) => setDisputeCategory(e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Quality grade mismatch (Buyer claims Grade B vs Grade A)">
                      Quality Grade Mismatch (AI Scan Mismatch)
                    </option>
                    <option value="Weight / quantity discrepancy upon weighing">
                      Weight & Quantity Shortage Discrepancy
                    </option>
                    <option value="Transit moisture or spoilage damage">
                      Transit Moisture / Water Damage
                    </option>
                    <option value="Delayed delivery / unverified deduction">
                      Delayed Delivery / Excessive Unloading Cess
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowDisputeModal(false)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg font-medium text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleRaiseDispute(selectedTx.id)}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    Freeze Escrow & Submit Dispute
                  </button>
                </div>
              </div>
            )}

            {/* Financial Ledger Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <span className="font-semibold text-slate-700 text-xs">{t.paymentBreakdown}:</span>
              <div className="flex justify-between text-slate-600">
                <span>{t.grossValue} ({selectedTx.quantity_quintals || selectedTx.quantityQuintals} {t.quintals} @ ₹{selectedTx.agreed_rate_per_q || selectedTx.agreedRatePerQ || selectedTx.agreedRate || 2580}/Q):</span>
                <span className="font-mono font-semibold text-slate-900">
                  ₹{(selectedTx.total_escrow_amount || selectedTx.totalEscrowAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t.pooledFreight}:</span>
                <span className="font-mono text-emerald-700">
                  -₹{(selectedTx.freight_deduction || selectedTx.freightDeduction || 180).toLocaleString('en-IN')} ({t.freightSavedBadge || "42% saved"})
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-slate-900 font-bold">
                <span>{t.netPayoutToBank}:</span>
                <span className="font-mono text-emerald-700 text-sm">
                  ₹{(selectedTx.net_farmer_payout || selectedTx.netFarmerPayout || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>{t.bankAccount}:</span>
                <span className="font-medium text-slate-700">
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

            {/* Actions to Advance Status & Raise Dispute */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {selectedTx.status === 'VAULT_LOCKED' && (
                  <button
                    disabled={loading}
                    onClick={() => handleDispatch(selectedTx.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-medium cursor-pointer"
                  >
                    {t.markInTransit}
                  </button>
                )}

                {selectedTx.status === 'IN_TRANSIT' && (
                  <button
                    disabled={loading}
                    onClick={() => handleConfirmDelivery(selectedTx.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-medium cursor-pointer"
                  >
                    {t.confirmDelivery}
                  </button>
                )}

                {selectedTx.status === 'DELIVERY_CONFIRMED' && (
                  <button
                    disabled={loading}
                    onClick={() => handleReleaseDbt(selectedTx.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-bold shadow-xs cursor-pointer"
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

              {/* Dispute Button (Accessible when In Transit or Delivery Confirmed and not already in dispute) */}
              {(selectedTx.status === 'IN_TRANSIT' || selectedTx.status === 'DELIVERY_CONFIRMED') && !isDisputed && (
                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="border border-rose-300 hover:bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t.raiseDisputeBtn || "Raise Grievance / Dispute"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
