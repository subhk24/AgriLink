import React, { useState, useEffect } from 'react';
import { Truck, Plus, CheckCircle2 } from 'lucide-react';
import { getHyperlocalClusters, joinTransportPool, dispatchPoolVehicle } from '../services/api';
import {
  translations,
  translateCrop,
  translateStatus,
  translateMandi,
  translatePerson,
  translateLocation,
  translateVehicle
} from '../translations';

export default function PoolingHub({ currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('');
  const [crop, setCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState(2.0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClusters = async () => {
    try {
      const res = await getHyperlocalClusters();
      if (res.clusters) {
        setClusters(res.clusters);
        setSelectedCluster(res.clusters[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!selectedCluster) return;
    setSubmitting(true);
    setMessage('');
    try {
      const res = await joinTransportPool({
        clusterId: selectedCluster.id,
        farmerName: farmerName || "New Farmer",
        village: village || selectedCluster.hubVillage,
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

  if (!selectedCluster) return null;

  const vehicle = selectedCluster.assignedVehicle;
  const loadPercent = Math.min(100, Math.round((vehicle.currentLoadQuintals / vehicle.totalCapacityQuintals) * 100));

  return (
    <div className="space-y-5 text-xs">
      {/* Cluster Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {clusters.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCluster(c)}
            className={`px-3 py-1.5 rounded-lg font-medium border whitespace-nowrap transition-colors ${
              selectedCluster.id === c.id
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {translateLocation(c.name.split(' ')[0], currentLang)} {t.hub} ({c.freightSavingsPercent}% {t.savedFreight})
          </button>
        ))}
      </div>

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
                  {t.vehicleLabel}: <strong>{translateVehicle(vehicle.model, currentLang)}</strong> ({vehicle.vehicleNumber}) • {t.driverLabel}: {translatePerson(vehicle.driverName, currentLang)}
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
                <span>{vehicle.currentLoadQuintals} / {vehicle.totalCapacityQuintals} {t.quintals} ({loadPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${loadPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{t.spaceLeft}: {(vehicle.totalCapacityQuintals - vehicle.currentLoadQuintals).toFixed(1)} {t.quintals}</span>
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
              className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
                  placeholder={t.namePlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.village}</label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={t.villagePlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.cropLabel}</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  <option value="Wheat">{translateCrop("Wheat", currentLang)}</option>
                  <option value="Onion">{translateCrop("Onion", currentLang)}</option>
                  <option value="Tomato">{translateCrop("Tomato", currentLang)}</option>
                  <option value="Paddy">{translateCrop("Paddy", currentLang)}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.loadLabel} ({quantity} {t.quintals})</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min="0.5"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                {submitting ? t.booking : t.bookSlotBtn}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
