import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  ArrowRight,
  Send,
  Sparkles,
  Check,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { queryBhashiniVoice } from '../services/api';
import { translations } from '../translations';

export const DIALECTS = [
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
  { code: "en", name: "English" }
];

export default function VoiceAssistant({
  isOpen,
  onClose,
  currentDialect,
  setCurrentDialect,
  onActionTrigger,
  onVoiceBookDeal,
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [activeCrop, setActiveCrop] = useState('wheat');
  const [availableBuyers, setAvailableBuyers] = useState(null);
  const [confirmedDeal, setConfirmedDeal] = useState(null);
  const recognitionRef = useRef(null);

  const samplePrompts = [
    t.promptShowBuyers || "Show wheat buyers & rates",
    t.promptSellToBuyer || "Sell 3Q wheat to ITC Limited",
    t.prompt2 || "Find shared truck in village",
    t.prompt3 || "Where to get highest profit?"
  ];

  // Browser Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = currentDialect === 'pa' ? 'pa-Guru-IN' : (currentDialect === 'mr' ? 'mr-IN' : (currentDialect === 'en' ? 'en-IN' : 'hi-IN'));

      recog.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      recog.onend = () => setIsListening(false);
      recog.onerror = () => setIsListening(false);
      recognitionRef.current = recog;
    }
  }, [currentDialect]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      if (currentDialect === 'pa') utterance.lang = 'pa-IN';
      else if (currentDialect === 'hi') utterance.lang = 'hi-IN';
      else if (currentDialect === 'mr') utterance.lang = 'mr-IN';
      else if (currentDialect === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript) handleQuery(transcript);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleQuery = async (queryText) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setInputText('');
    setTranscript('');
    try {
      const context = {
        activeCrop,
        availableBuyers: availableBuyers ? availableBuyers.map(b => b.shortName) : null
      };
      const res = await queryBhashiniVoice(queryText, currentDialect, context);
      if (res.result) {
        setLastResponse(res.result);

        if (res.result.intent === 'COMPARE_BUYERS') {
          setActiveCrop(res.result.crop || activeCrop);
          setAvailableBuyers(res.result.buyers || null);
          setConfirmedDeal(null);
        } else if (res.result.intent === 'CONFIRM_VOICE_DEAL') {
          setConfirmedDeal(res.result.deal);
          if (onVoiceBookDeal) {
            onVoiceBookDeal(res.result.deal);
          }
        }

        speakText(res.result.speechText || res.result.responseMessage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBuyer = (buyer) => {
    const cropName = activeCrop === 'wheat' ? 'wheat' : (activeCrop === 'onion' ? 'onion' : activeCrop);
    const query = currentDialect === 'pa'
      ? `${buyer.shortName} ਨੂੰ 3 ਕੁਇੰਟਲ ${cropName} ਵੇਚ ਦਿਓ`
      : (currentDialect === 'hi'
        ? `${buyer.shortName} को 3 क्विंटल ${cropName} बेच दो`
        : `Sell 3 quintals ${cropName} to ${buyer.shortName}`);
    handleQuery(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 text-center border-b border-slate-100 relative">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
          >
            ✕
          </button>

          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
            <Mic className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t.voiceTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.voiceSubtitle}</p>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
          {/* Language Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">{t.voiceLang}</label>
            <select
              value={currentDialect}
              onChange={(e) => setCurrentDialect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
            >
              {DIALECTS.map((d) => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Big Center Microphone Button */}
          <div className="py-2 text-center space-y-1.5">
            <button
              onClick={handleToggleMic}
              className={`w-13 h-13 rounded-full mx-auto flex items-center justify-center text-white transition-all shadow-sm ${
                isListening
                  ? 'bg-rose-600 animate-pulse ring-4 ring-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <p className="text-slate-500 text-[11px]">
              {isListening ? t.micListening : t.micClick}
            </p>
          </div>

          {/* Live Transcript */}
          {transcript && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] italic text-center">
              "{transcript}"
            </div>
          )}

          {/* Confirmed Deal Celebration Card */}
          {confirmedDeal && (
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl space-y-2.5 text-slate-800 shadow-xs animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <div className="font-bold text-emerald-950 text-xs leading-tight">
                    {t.voiceBookingSuccess || "Deal Confirmed & Escrow Locked!"}
                  </div>
                  <div className="text-[10px] text-emerald-700">
                    {t.voiceBookingSummary || "Produce sold directly! Escrow funds locked and shared truck booked."}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-emerald-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Buyer</span>
                  <span className="font-bold text-slate-900">{confirmedDeal.buyerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Produce & Agreed Rate</span>
                  <span className="font-semibold text-slate-800">{confirmedDeal.quantityQuintals}Q @ ₹{confirmedDeal.agreedRate}/Q</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">{t.totalEscrowLocked || "Total Escrow Locked"}</span>
                  <span className="font-bold text-emerald-700 text-xs">₹{confirmedDeal.totalEscrowAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Net Bank DBT Payout</span>
                  <span className="font-bold text-indigo-700 text-xs">₹{confirmedDeal.netPayout?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] px-1 text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  🚚 {t.sharedTruckBooked || "Shared Truck Booked"}: Kakra Tata Ace
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                  42% Freight Saved
                </span>
              </div>

              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  onActionTrigger('VIEW_ESCROW');
                  onClose();
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.viewOrdersBtn || "View Order in Escrow Tracker"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Interactive Buyer Comparison Cards */}
          {!confirmedDeal && availableBuyers && availableBuyers.length > 0 && (
            <div className="space-y-2 mt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>{t.voiceBuyerQuestion || "Which buyer would you like to sell to?"}</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize">
                  {lastResponse?.cropLabel || activeCrop}
                </span>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {availableBuyers.map((buyer, idx) => (
                  <div
                    key={buyer.id || idx}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs truncate">{buyer.shortName}</span>
                        {buyer.tag && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                            buyer.badgeColor === 'emerald'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : buyer.badgeColor === 'amber'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {buyer.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span>📍 {buyer.distance}</span>
                        <span>•</span>
                        <span className="truncate">{buyer.netAdvantage}</span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="font-bold text-emerald-700 text-xs">
                        {buyer.rateFormatted}
                      </div>
                      <button
                        onClick={() => handleSelectBuyer(buyer)}
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1 shadow-xs"
                      >
                        <span>{t.sellToThisBuyer || "Sell to Buyer"}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>
                  Say: <em>"{t.promptSellToBuyer || 'Sell to ITC Limited'}"</em> or tap <strong>{t.sellToThisBuyer || "Sell to Buyer"}</strong>!
                </span>
              </div>
            </div>
          )}

          {/* Standard Text Response Box (When not confirmed deal or comparing buyers) */}
          {lastResponse && !confirmedDeal && (!availableBuyers || availableBuyers.length === 0) && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <p className="text-slate-800 font-medium leading-relaxed">
                {lastResponse.responseMessage}
              </p>

              {lastResponse.displayRate && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-[11px]">
                  <span className="font-bold text-emerald-700">{lastResponse.displayRate}</span>
                  {lastResponse.bestBuyer && (
                    <span className="text-slate-600">{lastResponse.bestBuyer}</span>
                  )}
                </div>
              )}

              {lastResponse.action && (
                <button
                  onClick={() => {
                    onActionTrigger(lastResponse.action);
                    onClose();
                  }}
                  className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-md font-semibold text-[11px] transition-colors flex items-center justify-center gap-1"
                >
                  <span>{t.goToSection}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Text Input Fallback */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQuery(inputText);
              }}
              placeholder={t.voicePlaceholder}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
            />
            <button
              onClick={() => handleQuery(inputText)}
              disabled={loading || !inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white px-3 rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-slate-400 text-[10px] block mb-1.5 uppercase font-semibold">
              {t.sampleQueriesLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleQuery(p)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
