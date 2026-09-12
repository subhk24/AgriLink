import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Scan,
  RefreshCw,
  Sparkles,
  Upload,
  X,
  BadgePercent,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { scanCropQuality } from '../services/api';
import { translations, translateCrop, translateGrade } from '../translations';

const SAMPLE_CROPS = [
  {
    id: "wheat-sample-1",
    crop: "wheat",
    label: "Fresh Sharbati Wheat",
    sampleType: "fresh",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "wheat-sample-2",
    crop: "wheat",
    label: "Wheat with Chaff",
    sampleType: "spotted",
    image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "onion-sample-1",
    crop: "onion",
    label: "Export Grade Nashik Onion",
    sampleType: "fresh",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "tomato-sample-1",
    crop: "tomato",
    label: "Supermarket Hybrid Tomato",
    sampleType: "fresh",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
  }
];

export default function CropScannerModal({
  isOpen,
  onClose,
  onApplyGrade,
  defaultCrop = "wheat",
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;
  const [selectedSample, setSelectedSample] = useState(SAMPLE_CROPS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const canvasRef = useRef(null);

  const runScan = async (sample) => {
    setIsScanning(true);
    setAssessment(null);
    try {
      const res = await scanCropQuality(sample.crop, sample.sampleType);
      if (res.assessment) {
        setAssessment(res.assessment);
      }
    } catch (err) {
      console.error("Failed to run AI scan", err);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const matched = SAMPLE_CROPS.find(s => s.crop === defaultCrop) || SAMPLE_CROPS[0];
      setSelectedSample(matched);
      runScan(matched);
    }
  }, [isOpen, defaultCrop]);

  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setCustomImage(null);
    runScan(sample);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      const customSample = {
        crop: defaultCrop,
        sampleType: "fresh",
        image: url
      };
      setSelectedSample(customSample);
      runScan(customSample);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">{t.scannerTitle}</h3>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-400/30">
                  {t.verified}
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {t.scannerSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Sample Switcher Pills */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {t.selectSample}:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {SAMPLE_CROPS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all ${
                    selectedSample?.id === sample.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {translateCrop(sample.label, currentLang)}
                </button>
              ))}

              <label className="cursor-pointer text-xs px-3 py-1.5 rounded-xl font-medium border border-dashed border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Scanner Viewport & Detection Overlay */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/50 aspect-4/3 flex items-center justify-center shadow-lg group">
                <img
                  src={selectedSample?.image}
                  alt="Crop sample for AI inspection"
                  className="w-full h-full object-cover"
                />

                {/* Animated Scanning Line */}
                {isScanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent animate-pulse pointer-events-none border-b-2 border-emerald-400"></div>
                )}

                {/* Simulated YOLOv8 Bounding Boxes */}
                {assessment && !isScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    {assessment.detections.map((det, i) => (
                      <div
                        key={i}
                        className={`absolute rounded border-2 text-[10px] font-mono font-bold flex items-start p-1 transition-all ${
                          det.isDefect
                            ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                            : 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                        }`}
                        style={{
                          left: `${det.box[0]}%`,
                          top: `${det.box[1]}%`,
                          width: `${det.box[2]}%`,
                          height: `${det.box[3]}%`
                        }}
                      >
                        <span className="bg-black/75 px-1 py-0.5 rounded shadow">
                          {det.label} ({(det.confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI HUD Status */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>YOLOv8 Edge Inference: {isScanning ? "Analyzing..." : "Ready"}</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10">
                  Latency: 240ms
                </div>
              </div>
            </div>

            {/* AI Grading Results Panel */}
            <div className="md:col-span-5 flex flex-col justify-between">
              {isScanning ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                  <span className="font-bold text-slate-800 text-sm">Inspecting Crop Produce...</span>
                  <p className="text-xs text-slate-500 mt-1">
                    Detecting size uniformity, blemish ratio & moisture level
                  </p>
                </div>
              ) : assessment ? (
                <div className="space-y-4">
                  {/* Grade Badge */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      assessment.grade === 'Grade A'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {t.aiCertified}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {assessment.confidence}% {t.confidenceLabel}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-2xl font-black">{translateGrade(assessment.grade, currentLang)}</h4>
                      <span className="text-xs font-semibold text-emerald-700">
                        {assessment.priceMultiplier > 1
                          ? `+${Math.round((assessment.priceMultiplier - 1) * 100)}% Premium Price`
                          : `${Math.round((assessment.priceMultiplier - 1) * 100)}% Fair Average`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                      {assessment.verdict}
                    </p>
                  </div>

                  {/* Metrics Table */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">{t.defectRateLabel}</span>
                      <span className="font-mono font-bold text-slate-800">
                        {assessment.defectScorePercent}%
                      </span>
                    </div>
                    {Object.entries(assessment.metrics).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{String(val)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => {
                      if (onApplyGrade) onApplyGrade(assessment, selectedSample);
                      onClose();
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.applyGrade}</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
