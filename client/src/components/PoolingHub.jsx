import React, { useState, useEffect } from 'react';
import {
  Truck,
  Building2,
  ShieldCheck,
  Check,
  Sparkles,
  FileText,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getHyperlocalClusters,
  joinTransportPool,
  dispatchPoolVehicle,
  getStorageWarehouses,
  bookWarehouseStorage,
  getENWRReceipts,
  pledgeENWRReceipt
} from '../services/api';
import {
  translations,
  translateCrop,
  translateStatus,
  translateMandi,
  translatePerson,
  translateLocation,
  translateVehicle
} from '../translations';

export default function PoolingHub({ currentLang = 'en', currentUser = {} }) {
  const t = translations[currentLang] || translations.en;
  const [activeHubTab, setActiveHubTab] = useState('transport'); // 'transport' | 'storage'

  // Transport Pooling State
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('');
  const [crop, setCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState(2.0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Storage Warehousing State
  const [warehouses, setWarehouses] = useState([]);
  const [enwrReceipts, setENWRReceipts] = useState([]);
  const [selectedWh, setSelectedWh] = useState(null);
  const [storageCrop, setStorageCrop] = useState('Wheat');
  const [storageQuantity, setStorageQuantity] = useState(3.0);
  const [storageNotice, setStorageNotice] = useState('');
  const [storageLoading, setStorageLoading] = useState(false);

  const fetchClusters = async () => {
    try {
      const res = await getHyperlocalClusters();
      if (res.clusters) {
        setClusters(res.clusters);
        if (!selectedCluster) setSelectedCluster(res.clusters[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStorageData = async () => {
    try {
      const [whRes, rcRes] = await Promise.all([
        getStorageWarehouses(),
        getENWRReceipts()
      ]);
      if (whRes.warehouses) {
        setWarehouses(whRes.warehouses);
        if (!selectedWh) setSelectedWh(whRes.warehouses[0]);
      }
      if (rcRes.receipts) {
        setENWRReceipts(rcRes.receipts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClusters();
    fetchStorageData();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!selectedCluster) return;
    setSubmitting(true);
    setMessage('');
    try {
      const res = await joinTransportPool({
        clusterId: selectedCluster.id,
        farmerName: farmerName || currentUser?.name || "Harpreet Singh",
        village: village || currentUser?.village || selectedCluster.hubVillage,
        crop,
        quantityQuintals: quantity
      });
      if (res.success) {
        setMessage(res.message);
        fetchClusters();
      } else {
        alert(res.error || "Failed to join");
      }
    } catch (err) {
      alert("Error joining pool");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispatch = async (id) => {
    try {
      const res = await dispatchPoolVehicle(id);
      if (res.success) {
        alert("Vehicle dispatched!");
        fetchClusters();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookStorage = async (wh) => {
    setStorageLoading(true);
    setStorageNotice('');
    try {
      const res = await bookWarehouseStorage({
        warehouseId: wh.id,
        farmerName: 'Harpreet Singh',
        crop: storageCrop,
        quantityQuintals: Number(storageQuantity)
      });
      if (res.success) {
        setStorageNotice(t.storageBookedSuccess || "Storage Slot Confirmed & e-NWR Generated!");
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        fetchStorageData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStorageLoading(false);
    }
  };

  const handlePledgeAdvance = async (receiptId) => {
    setStorageLoading(true);
    try {
      const res = await pledgeENWRReceipt(receiptId);
      if (res.success) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        setStorageNotice(`₹${res.disbursedAmount?.toLocaleString('en-IN')} ${t.pledgeDisbursedSuccess || 'disbursed to PNB (****4091)!'}`);
        fetchStorageData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStorageLoading(false);
    }
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {activeHubTab === 'transport'
              ? (t.transport || "Hyperlocal Transport Pooling Hub")
              : (t.warehousesTitle || "WDRA Accredited Warehouses & e-NWR Storage")}
          </h2>
          <p className="text-slate-500 text-[11px] mt-0.5">
            {activeHubTab === 'transport'
              ? (t.poolingSubtitle || "Cut village freight costs by 40%+ using shared mini-trucks")
              : (t.warehousesSubtitle || "Safe storage with electronic Negotiable Warehouse Receipts (e-NWR) & 75% instant bank advance")}
          </p>
        </div>

        {/* Sub-Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveHubTab('transport')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeHubTab === 'transport'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t.transportPoolingTab || "Shared Transport Pooling"}</span>
          </button>
          <button
            onClick={() => setActiveHubTab('storage')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeHubTab === 'storage'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.storagePledgeTab || "WDRA Storage & e-NWR Advance"}</span>
            <span className="bg-indigo-100 text-indigo-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold">WDRA</span>
          </button>
        </div>
      </div>

      {activeHubTab === 'transport' ? (
        <>
          {/* Cluster Tabs */}
          {selectedCluster && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {clusters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCluster(c)}
                  className={`px-3 py-1.5 rounded-lg font-medium border whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCluster.id === c.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {translateLocation(c.name.split(' ')[0], currentLang)} {t.hub} ({c.freightSavingsPercent}% {t.savedFreight})
                </button>
              ))}
            </div>
          )}

          {selectedCluster && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Left 2 Cols: Vehicle & Farmers */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {translateLocation(selectedCluster.name.split(' ')[0], currentLang)} {t.clusterLabel} {t.hub}
                      </h3>
                      <p className="text-slate-500 text-[11px]">
                        {t.vehicleLabel}: <strong>{translateVehicle(selectedCluster.assignedVehicle.model, currentLang)}</strong> ({selectedCluster.assignedVehicle.vehicleNumber}) • {t.driverLabel}: {translatePerson(selectedCluster.assignedVehicle.driverName, currentLang)}
                      </p>
                    </div>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {translateStatus(selectedCluster.status, currentLang)}
                    </span>
                  </div>

                  {/* Load Meter */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{t.truckCapacity}:</span>
                      <span>
                        {selectedCluster.assignedVehicle.currentLoadQuintals} / {selectedCluster.assignedVehicle.totalCapacityQuintals} {t.quintals} (
                        {Math.min(100, Math.round((selectedCluster.assignedVehicle.currentLoadQuintals / selectedCluster.assignedVehicle.totalCapacityQuintals) * 100))}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.round((selectedCluster.assignedVehicle.currentLoadQuintals / selectedCluster.assignedVehicle.totalCapacityQuintals) * 100))}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{t.spaceLeft}: {(selectedCluster.assignedVehicle.totalCapacityQuintals - selectedCluster.assignedVehicle.currentLoadQuintals).toFixed(1)} {t.quintals}</span>
                      <span>{t.destination}: {translateMandi(selectedCluster.targetDestination, currentLang)}</span>
                    </div>
                  </div>

                  {/* Farmers in this vehicle */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">{t.farmersInTruck}</h4>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <th className="py-2 px-3">{t.farmerName}</th>
                            <th className="py-2 px-3">{t.village}</th>
                            <th className="py-2 px-3">{t.cropLabel}</th>
                            <th className="py-2 px-3">{t.loadLabel}</th>
                            <th className="py-2 px-3">{t.statusCol}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {selectedCluster.farmersInPool.map((f, i) => (
                            <tr key={i}>
                              <td className="py-2.5 px-3 font-medium text-slate-900">{translatePerson(f.name, currentLang)}</td>
                              <td className="py-2.5 px-3">{translateLocation(f.village, currentLang)}</td>
                              <td className="py-2.5 px-3">{translateCrop(f.crop, currentLang)}</td>
                              <td className="py-2.5 px-3 font-mono font-semibold">{f.quantityQuintals} {t.quintals}</td>
                              <td className="py-2.5 px-3">
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                  {translateStatus(f.status, currentLang)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDispatch(selectedCluster.id)}
                    className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    {t.dispatchBtn}
                  </button>
                </div>
              </div>

              {/* Right Col: Add your load */}
              <div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">{t.joinTruckTitle}</h3>
                  <p className="text-slate-500 text-[11px]">{t.joinTruckDesc}</p>

                  {message && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px]">
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleJoin} className="space-y-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">{t.yourName}</label>
                      <input
                        type="text"
                        required
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder={currentUser?.name || "Harpreet Singh"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">{t.yourVillage}</label>
                      <input
                        type="text"
                        required
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Kakra, Sangrur"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">{t.cropLabel}</label>
                        <input
                          type="text"
                          required
                          value={crop}
                          onChange={(e) => setCrop(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">{t.quantityQ}</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.joinPoolBtn}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Storage & e-NWR Warehousing View */
        <div className="space-y-5 animate-in fade-in duration-200">
          {storageNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">{storageNotice}</span>
            </div>
          )}

          {/* 1. Storage Value Proposition Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Prevent Distress Sales</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono">
                ₹8 / Q / Month
              </div>
              <p className="text-[11px] text-slate-500">
                WDRA accredited moisture-controlled silos with Govt insurance included.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-1">
              <div className="flex items-center justify-between text-indigo-900">
                <span className="font-semibold">{t.enwrPledgeTitle || "e-NWR Instant Cash Advance"}</span>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl font-bold text-indigo-700 font-mono">
                75% Instant Credit
              </div>
              <p className="text-[11px] text-indigo-800">
                Pledge stored produce for immediate bank advance without distress selling.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Subsidized Agri Credit</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-bold text-emerald-700 font-mono">
                7% KCC Interest
              </div>
              <p className="text-[11px] text-slate-500">
                Direct bank transfer into Punjab National Bank account (****4091).
              </p>
            </div>
          </div>

          {/* 2. Accredited WDRA Warehouses List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Nearby Accredited WDRA Grain Warehouses & Silos</h3>
                <p className="text-[11px] text-slate-500">Verified storage centers mapped to Sangrur & Central Punjab agricultural corridor</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                3 Warehouses Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {warehouses.map((wh) => (
                <div key={wh.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs">{wh.name}</span>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold">
                        {wh.wdraRegNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      📍 {wh.village}, {wh.district} • {wh.distanceKm} km away • {wh.specs}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                      <span>Capacity: {wh.availableSpaceQuintals}Q space available</span>
                      <span>•</span>
                      <span className="font-bold text-emerald-700">Rent: ₹{wh.monthlyRentPerQ}/Q/month</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookStorage(wh)}
                      disabled={storageLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{t.bookStorageBtn || "Book Storage Space"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. e-NWR Electronic Warehouse Receipts & Loan Disbursement Tracker */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>My Electronic Negotiable Warehouse Receipts (e-NWR)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {t.enwrPledgeDesc || "Prevent distress selling! Get 75% advance credit directly to your bank account against stored produce."}
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                PNB Partner Vault
              </span>
            </div>

            <div className="space-y-3">
              {enwrReceipts.map((rc) => (
                <div
                  key={rc.receiptId}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">{rc.receiptId}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        rc.pledged
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rc.pledged ? '75% Advance Disbursed' : 'Unpledged Receipt (Eligible for 75% Advance)'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <strong>{rc.crop}</strong> ({rc.quantityQuintals} Quintals) stored at <strong>{rc.warehouseName}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Valuation: ₹{rc.estimatedValue?.toLocaleString('en-IN')} • Eligible 75% Bank Advance: <strong className="text-indigo-700">₹{rc.maxEligibleLoan?.toLocaleString('en-IN')}</strong>
                    </div>
                    {rc.bankUtr && (
                      <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                        DBT Reference: {rc.bankUtr} • Deposited into Punjab National Bank (****4091)
                      </div>
                    )}
                  </div>

                  <div>
                    {!rc.pledged ? (
                      <button
                        onClick={() => handlePledgeAdvance(rc.receiptId)}
                        disabled={storageLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.applyPledgeBtn || "Disburse 75% Advance (PNB)"}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>₹{rc.disbursedAmount?.toLocaleString('en-IN')} Disbursed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
