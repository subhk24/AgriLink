import React, { useState, useEffect } from 'react';
import {
  Plus,
  Camera,
  CheckCircle2,
  Inbox,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { getProduceListings, createProduceListing, seedDemoDatabase } from '../services/api';
import CropScannerModal from '../components/CropScannerModal';
import {
  translations,
  translateCrop,
  translateStatus,
  translateGrade,
  translateMandi,
  translatePerson,
  translateLocation,
  translateVehicle
} from '../translations';

export default function FarmerDashboard({
  currentUser,
  onNavigateToTab,
  onReloadData,
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;
  const [listings, setListings] = useState([]);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedAssessment, setScannedAssessment] = useState(null);

  // Form state
  const [crop, setCrop] = useState('Wheat (Gehu)');
  const [quantity, setQuantity] = useState(3.0);
  const [expectedPrice, setExpectedPrice] = useState(2550);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSeed, setLoadingSeed] = useState(false);

  const fetchListings = async () => {
    try {
      const params = {};
      if (currentUser) {
        if (!currentUser.is_demo_user) {
          params.userId = currentUser.id;
          params.onlyUser = 'true';
        } else {
          params.userId = currentUser.id;
        }
      }
      const res = await getProduceListings(params);
      if (res.listings) setListings(res.listings);
    } catch (err) {
      console.error("Failed to load listings", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentUser]);

  const handleApplyGrade = (assessment, sample) => {
    setScannedAssessment(assessment);
    if (sample && sample.image) setPhotoUrl(sample.image);
    if (assessment.priceMultiplier) {
      setExpectedPrice(Math.round(2500 * assessment.priceMultiplier));
    }
    setIsListingModalOpen(true);
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createProduceListing({
        userId: currentUser?.id || 'usr-demo-01',
        farmerName: currentUser?.name || 'Harpreet Singh',
        village: currentUser?.village || 'Kakra',
        district: currentUser?.district || 'Sangrur',
        state: currentUser?.state || 'Punjab',
        phone: currentUser?.phone || '+91 98765-12340',
        crop,
        quantityQuintals: quantity,
        expectedPricePerQ: expectedPrice,
        photoUrl,
        sampleType: scannedAssessment ? (scannedAssessment.defectScorePercent > 5 ? 'spotted' : 'fresh') : 'fresh',
        clusterId: 'cluster-sgr-01',
        createdVia: 'Web Portal'
      });

      if (res.success) {
        setIsListingModalOpen(false);
        setScannedAssessment(null);
        await fetchListings();
        if (onReloadData) onReloadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadDemoData = async () => {
    setLoadingSeed(true);
    try {
      await seedDemoDatabase();
      await fetchListings();
      if (onReloadData) onReloadData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSeed(false);
    }
  };

  const totalQuintals = listings.reduce((sum, item) => sum + (parseFloat(item.quantity_quintals || item.quantityQuintals) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Simple Clean Welcome Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 block">{t.farmerDashboard}</span>
          <h2 className="text-xl font-bold text-slate-900">
            {t.welcome}, {translatePerson(currentUser?.name || 'Farmer Partner', currentLang)}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.village}: {translateLocation(currentUser?.village || 'Kakra', currentLang)}, {translateLocation(currentUser?.state || 'Punjab', currentLang)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('rates')}
            className="text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.mandiRates}</span>
          </button>

          <button
            onClick={() => onNavigateToTab('pricing')}
            className="text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.checkPrices}</span>
          </button>

          <button
            onClick={() => onNavigateToTab('transport')}
            className="text-xs font-medium bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.transport || "Shared Transport"}</span>
          </button>

          <button
            onClick={() => setIsListingModalOpen(true)}
            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.listProduce}</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-slate-500 block">{t.activeListings}</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{listings.length}</span>
          <span className="text-slate-400 text-[11px]">{t.total}: {totalQuintals} {t.quintals}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-slate-500 block">{t.optimalMandi}</span>
          <span className="text-base font-bold text-emerald-700 mt-1 block">
            {translateMandi("ITC e-Choupal Rural Hub", currentLang)} (₹2,580{t.perQuintalUnit || '/Q'})
          </span>
          <span className="text-slate-400 text-[11px]">{t.directVerified}</span>
        </div>

        <div
          onClick={() => onNavigateToTab('transport')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 block">{t.sharedTransportTitle}</span>
            <span className="text-[10px] text-teal-600 group-hover:underline font-semibold flex items-center gap-0.5">
              <span>View Hub</span> &rarr;
            </span>
          </div>
          <span className="text-base font-bold text-teal-700 mt-1 block">
            {translateVehicle("Tata Ace", currentLang)} (42% {t.savedFreight})
          </span>
          <span className="text-slate-400 text-[11px]">
            {t.clusterLabel}: {translateLocation(currentUser?.village || 'Kakra', currentLang)} {t.hub}
          </span>
        </div>
      </div>

      {/* Live Agmarknet Comparison Highlights Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-xl border border-emerald-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              {t.liveAgmarknet || "LIVE AGMARKNET"}
            </span>
            <span className="font-bold text-slate-800 text-xs">
              {translateCrop("Wheat (Gehu)", currentLang)}: ₹2,480{t.perQuintalUnit || '/Q'}
            </span>
            <span className="text-emerald-700 font-semibold font-mono text-[11px]">
              (+₹205 {t.aboveMsp || "above MSP"})
            </span>
          </div>
          <p className="text-slate-600 text-[11px]">
            {t.seeComparisonBanner || "Compare raw Agmarknet rates across 9 mandis before calculating net deductions"}
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab('rates')}
          className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-3.5 py-2 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>{t.compareAllRatesBtn || "Compare All Mandis"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Produce Listings Table / Empty State */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">{t.myListedProduce}</h3>
          <span className="text-xs text-slate-500 font-mono">{listings.length} {t.records}</span>
        </div>

        {listings.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-xs">{t.noProduceYet}</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {t.addFirstProduce}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setIsListingModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                + {t.listProduce}
              </button>
              <button
                onClick={handleLoadDemoData}
                disabled={loadingSeed}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                {loadingSeed ? "Loading..." : t.loadDemoDataBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-4">{t.cropCol}</th>
                  <th className="py-2.5 px-4">{t.qtyCol}</th>
                  <th className="py-2.5 px-4">{t.priceCol}</th>
                  <th className="py-2.5 px-4">{t.gradeCol}</th>
                  <th className="py-2.5 px-4">{t.statusCol}</th>
                  <th className="py-2.5 px-4 text-right">{t.actionCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {translateCrop(item.crop, currentLang)}
                    </td>
                    <td className="py-3 px-4">{item.quantity_quintals || item.quantityQuintals} {t.quintals}</td>
                    <td className="py-3 px-4 font-mono font-medium">₹{item.expected_price_per_q || item.expectedPricePerQ}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded text-[11px]">
                        {translateGrade(item.quality_grade || item.qualityGrade, currentLang)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                        {translateStatus(item.status || 'ACTIVE', currentLang)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigateToTab('orders')}
                        className="text-emerald-600 hover:underline font-medium"
                      >
                        {t.viewOrders}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Produce Listing Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">{t.modalTitle}</h3>
              <button
                onClick={() => setIsListingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {scannedAssessment && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex justify-between items-center">
                <span>{t.aiCertified}: <strong>{translateGrade(scannedAssessment.grade, currentLang)}</strong> ({t.defect}: {scannedAssessment.defectScorePercent}%)</span>
                <span className="text-[11px] font-semibold text-emerald-700">{t.verified}</span>
              </div>
            )}

            <form onSubmit={handleSubmitListing} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">{t.selectCrop}</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                >
                  <option value="Wheat (Gehu)">{translateCrop("Wheat (Gehu)", currentLang)}</option>
                  <option value="Red Onion (Pyaz)">{translateCrop("Red Onion (Pyaz)", currentLang)}</option>
                  <option value="Hybrid Tomato">{translateCrop("Hybrid Tomato", currentLang)}</option>
                  <option value="Basmati Paddy">{translateCrop("Basmati Paddy", currentLang)}</option>
                  <option value="Mustard (Sarson)">{translateCrop("Mustard (Sarson)", currentLang)}</option>
                  <option value="Potato (Aloo)">{translateCrop("Potato (Aloo)", currentLang)}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.qtyInQuintals}</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.pricePerQuintal}</label>
                  <input
                    type="number"
                    required
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">{t.qualityCheck}</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsListingModalOpen(false);
                      setIsScannerOpen(true);
                    }}
                    className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Camera className="w-3 h-3" />
                    <span>{t.scanWithAiCamera}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder={t.photoUrl || "Photo URL"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[11px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold transition-colors"
              >
                {isSubmitting ? t.savingToDb : t.saveListingBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Camera Scan Modal */}
      <CropScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplyGrade={handleApplyGrade}
        defaultCrop="wheat"
        currentLang={currentLang}
      />
    </div>
  );
}
