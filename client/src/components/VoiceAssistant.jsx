import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  ArrowRight,
  Send,
  Sparkles,
  Check,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { queryBhashiniVoice } from '../services/api';
import { translations } from '../translations';

export const DIALECTS = [
  { code: "hi", name: "हिन्दी (Hindi)", bcp47: "hi-IN" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", bcp47: "pa-IN" },
  { code: "en", name: "English", bcp47: "en-IN" },
  { code: "mr", name: "मराठी (Marathi)", bcp47: "mr-IN" },
  { code: "te", name: "తెలుగు (Telugu)", bcp47: "te-IN" },
  { code: "bn", name: "বাংলা (Bengali)", bcp47: "bn-IN" },
  { code: "gu", name: "ગુજરાતી (Gujarati)", bcp47: "gu-IN" }
];

export const DIALECT_TO_SPEECH_LANG = {
  hi: 'hi-IN',
  pa: 'pa-IN',
  en: 'en-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  gu: 'gu-IN'
};

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
  const [isDocked, setIsDocked] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [activeCrop, setActiveCrop] = useState('wheat');
  const [availableBuyers, setAvailableBuyers] = useState(null);
  const [confirmedDeal, setConfirmedDeal] = useState(null);
  const [micError, setMicError] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const hasSubmittedRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const isAssistantSpeakingRef = useRef(false);

  const samplePrompts = [
    t.promptShowBuyers || "Show me this crop's rates which buyer is giving",
    t.promptSellToBuyer || "I wanna sell my crop to this person",
    t.promptSellITC || "Sell 3Q wheat to ITC Limited",
    t.prompt2 || "Find shared truck in village"
  ];

  // Sync dialect with UI language when modal opens
  useEffect(() => {
    if (isOpen && currentLang && (!currentDialect || currentDialect !== currentLang)) {
      if (['en', 'hi', 'pa'].includes(currentLang)) {
        setCurrentDialect(currentLang);
      }
    }
  }, [isOpen, currentLang]);

  // Browser Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }
    setIsSpeechSupported(true);

    try {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.maxAlternatives = 1;
      const targetLang = DIALECT_TO_SPEECH_LANG[currentDialect] || 'hi-IN';
      recog.lang = targetLang;

      recog.onstart = () => {
        setIsListening(true);
        setMicError(null);
        hasSubmittedRef.current = false;
      };

      recog.onresult = (event) => {
        // Critical: Do NOT process or transcribe laptop speaker audio while assistant is speaking
        if (isAssistantSpeakingRef.current) {
          return;
        }

        let fullText = '';
        let isFinal = false;
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript;
          if (event.results[i].isFinal) isFinal = true;
        }
        fullText = fullText.trim();
        if (fullText) {
          setTranscript(fullText);
          currentTranscriptRef.current = fullText;

          // 2000ms pause timer to allow farmer ample time to speak naturally without premature cutoff
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (currentTranscriptRef.current && !hasSubmittedRef.current && !isAssistantSpeakingRef.current) {
              hasSubmittedRef.current = true;
              try { recog.stop(); } catch (e) {}
              handleQuery(currentTranscriptRef.current);
            }
          }, 2000);
        }
      };

      recog.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        const textToSubmit = currentTranscriptRef.current.trim();
        if (textToSubmit && !hasSubmittedRef.current && !isAssistantSpeakingRef.current) {
          hasSubmittedRef.current = true;
          handleQuery(textToSubmit);
        }
      };

      recog.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicError("Microphone permission was blocked. Please click the lock or camera icon in your browser address bar to allow microphone access.");
        } else if (event.error === 'no-speech') {
          const textToSubmit = currentTranscriptRef.current.trim();
          if (textToSubmit && !hasSubmittedRef.current && !isAssistantSpeakingRef.current) {
            hasSubmittedRef.current = true;
            handleQuery(textToSubmit);
          }
        } else if (event.error === 'network') {
          setMicError("Speech recognition network error. Please check your internet connection or type below.");
        } else if (event.error === 'language-not-supported') {
          console.warn(`Dialect not supported by browser speech engine, attempting fallback to hi-IN`);
          try {
            recog.lang = 'hi-IN';
            recog.start();
            setIsListening(true);
            return;
          } catch (e) {
            setMicError("Speech recognition for this dialect is not supported by your browser. Please use the quick prompt buttons or type below.");
          }
        }
      };

      recognitionRef.current = recog;
    } catch (e) {
      console.error('Failed to initialize SpeechRecognition:', e);
      setIsSpeechSupported(false);
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, [currentDialect]);

  const startListeningHandsFree = () => {
    if (!isSpeechSupported || !recognitionRef.current || isAssistantSpeakingRef.current) return;
    setTranscript('');
    currentTranscriptRef.current = '';
    hasSubmittedRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    try {
      recognitionRef.current.abort();
    } catch (e) {}

    setTimeout(() => {
      if (isAssistantSpeakingRef.current) return;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Hands-free listening start notice:', e);
      }
    }, 200);
  };

  // Auto-start listening hands-free whenever opened
  useEffect(() => {
    if (isOpen) {
      setIsDocked(false);
      setConfirmedDeal(null);
      const timer = setTimeout(() => {
        startListeningHandsFree();
      }, 400);
      return () => clearTimeout(timer);
    } else {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      isAssistantSpeakingRef.current = false;
    }
  }, [isOpen]);

  const speakText = (text, onComplete) => {
    if (!text) {
      if (onComplete) onComplete();
      return;
    }

    // Immediately mute/abort microphone to prevent audio feedback loop
    isAssistantSpeakingRef.current = true;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    try {
      if (recognitionRef.current) recognitionRef.current.abort();
    } catch (e) {}
    setIsListening(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      const langCode = DIALECT_TO_SPEECH_LANG[currentDialect] || 'en-IN';

      try {
        const voices = window.speechSynthesis.getVoices();
        let voice = voices.find(v => v.lang === langCode || v.lang.replace('_', '-').startsWith(currentDialect));
        if (!voice && (currentDialect === 'pa' || currentDialect === 'hi')) {
          voice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
        }
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = (currentDialect === 'pa' || currentDialect === 'hi') ? 'hi-IN' : 'en-IN';
        }
      } catch (e) {
        utterance.lang = 'hi-IN';
      }

      let completed = false;
      const handleDone = () => {
        if (completed) return;
        completed = true;
        // 700ms grace period so room echo and speaker vibration completely subside
        setTimeout(() => {
          isAssistantSpeakingRef.current = false;
          if (onComplete) onComplete();
        }, 700);
      };

      utterance.onend = handleDone;
      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis notice:', err);
        handleDone();
      };

      // Safety timer in case browser synthesis hangs
      const maxSpeechMs = Math.max(3500, text.length * 85);
      setTimeout(handleDone, maxSpeechMs);

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        isAssistantSpeakingRef.current = false;
        if (onComplete) onComplete();
      }, 1500);
    }
  };

  const handleToggleMic = async () => {
    setMicError(null);
    if (!isSpeechSupported || !recognitionRef.current) {
      setMicError("Speech recognition is not supported in this browser. Please type your query below or use Chrome/Safari.");
      return;
    }

    if (isListening) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      const textToSubmit = currentTranscriptRef.current.trim();
      if (textToSubmit && !hasSubmittedRef.current) {
        hasSubmittedRef.current = true;
        handleQuery(textToSubmit);
      }
    } else {
      setTranscript('');
      currentTranscriptRef.current = '';
      hasSubmittedRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop());
        }
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicError("Microphone permission was denied. Please allow microphone access in your browser settings / address bar.");
          return;
        }
      }

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        try {
          recognitionRef.current.abort();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch (err2) {
              setMicError("Could not start microphone. Please try again or type below.");
            }
          }, 120);
        } catch (err2) {
          setMicError("Could not start microphone. Please try again or type below.");
        }
      }
    }
  };

  const handleQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;
    setLoading(true);
    setInputText('');
    setTranscript('');
    currentTranscriptRef.current = '';
    setMicError(null);

    try {
      const context = {
        activeCrop,
        availableBuyers: availableBuyers ? availableBuyers.map(b => b.shortName) : null
      };
      const res = await queryBhashiniVoice(queryText, currentDialect, context);
      if (res && res.result) {
        setLastResponse(res.result);

        if (res.result.intent === 'COMPARE_BUYERS') {
          setActiveCrop(res.result.crop || activeCrop);
          setAvailableBuyers(res.result.buyers || null);
          setConfirmedDeal(null);

          // 1. Instantly navigate background screen to Mandi Rates page!
          if (onActionTrigger) {
            onActionTrigger('VIEW_MANDI_RATES');
          }

          // 2. Dock to bottom floating bar so the full Mandi Rates page is visible!
          setIsDocked(true);

          // 3. Assistant speaks rates out loud, then auto-re-arms mic for Step 2!
          speakText(res.result.speechText || res.result.responseMessage, () => {
            startListeningHandsFree();
          });
        } else if (res.result.intent === 'CONFIRM_VOICE_DEAL') {
          setConfirmedDeal(res.result.deal);
          setIsDocked(true);

          // Trigger automated booking & navigate to orders tab
          if (onVoiceBookDeal) {
            onVoiceBookDeal(res.result.deal);
          }

          // Speak victory audio and dismiss after celebration
          speakText(res.result.speechText || res.result.responseMessage, () => {
            setTimeout(() => {
              onClose();
            }, 3500);
          });
        } else {
          speakText(res.result.speechText || res.result.responseMessage);
        }
      }
    } catch (e) {
      console.error('Voice assistant query error:', e);
      setMicError("Failed to process query. Please try again or type below.");
    } finally {
      setLoading(false);
      hasSubmittedRef.current = false;
    }
  };

  const handleRunDemo = () => {
    const q1 = currentDialect === 'pa'
      ? "ਮੈਨੂੰ ਇਸ ਫਸਲ ਦੇ ਭਾਅ ਦਿਖਾਓ ਕਿਹੜਾ ਖਰੀਦਦਾਰ ਦੇ ਰਿਹਾ ਹੈ"
      : (currentDialect === 'hi'
        ? "इस फसल के भाव दिखाओ कौन खरीदार क्या दे रहा है"
        : "Show me this crop's rates which buyer is giving");

    setInputText(q1);
    handleQuery(q1);

    setTimeout(() => {
      const q2 = currentDialect === 'pa'
        ? "ਮੈਂ ਆਪਣੀ ਫਸਲ ਇਸ ਬੰਦੇ ਨੂੰ ਵੇਚਣੀ ਹੈ"
        : (currentDialect === 'hi'
          ? "मैं इस व्यक्ति को अपनी फसल बेचना चाहता हूँ"
          : "I wanna sell my crop to this person");
      setInputText(q2);
      handleQuery(q2);
    }, 4500);
  };

  const handleSelectBuyer = (buyer) => {
    const query = currentDialect === 'pa'
      ? `ਮੈਂ ਆਪਣੀ ਫਸਲ ${buyer.shortName} ਨੂੰ ਵੇਚਣੀ ਹੈ`
      : (currentDialect === 'hi'
        ? `मैं इस व्यक्ति (${buyer.shortName}) को अपनी फसल बेचना चाहता हूँ`
        : `I wanna sell my crop to ${buyer.shortName}`);
    handleQuery(query);
  };

  if (!isOpen) return null;

  // Render Mode 1: Docked Sleek Hands-Free Bar (Does not block the page!)
  if (isDocked) {
    return (
      <div className="fixed bottom-4 inset-x-3 sm:inset-x-6 max-w-3xl mx-auto z-50 animate-in slide-in-from-bottom duration-300">
        {confirmedDeal ? (
          // Deal Confirmed Celebration Banner
          <div className="bg-emerald-700 text-white rounded-2xl shadow-2xl p-4 border-2 border-emerald-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                ✓
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm leading-snug">
                  {t.voiceBookingSuccess || "Deal Confirmed & Escrow Locked!"}
                </div>
                <div className="text-xs text-emerald-100 truncate">
                  {confirmedDeal.buyerName} • {confirmedDeal.quantityQuintals}Q • ₹{confirmedDeal.totalEscrowAmount?.toLocaleString('en-IN')} in Vault • Kakra Shared Truck Booked!
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  onActionTrigger('VIEW_ESCROW');
                  onClose();
                }}
                className="bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs"
              >
                {t.viewOrdersBtn || "View Escrow"}
              </button>
              <button
                onClick={onClose}
                className="text-emerald-200 hover:text-white p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          // Active Hands-Free Voice Controller
          <div className="bg-white/95 backdrop-blur-md text-slate-800 rounded-2xl shadow-2xl p-3.5 border-2 border-emerald-500 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={handleToggleMic}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md transition-all active:scale-95 ${
                  isListening ? 'bg-rose-600 ring-4 ring-rose-200 scale-105 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                title={isListening ? "Tap to stop" : "Tap to speak"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide truncate">
                    {isListening
                      ? (currentDialect === 'pa' ? '🎙️ ਬੋਲੋ (ਸੁਣ ਰਿਹਾ ਹੈ...)' : (currentDialect === 'hi' ? '🎙️ बोलें (सुन रहा है...)' : '🎙️ Listening Hands-Free...'))
                      : (currentDialect === 'pa' ? 'ਸਹਾਇਕ ਚਾਲੂ ਹੈ' : 'Voice Assistant Active')}
                  </span>
                  {transcript && (
                    <span className="text-[11px] text-emerald-800 font-medium italic truncate max-w-[220px]">
                      "{transcript}"
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                  {availableBuyers && availableBuyers[0]
                    ? (currentDialect === 'pa'
                      ? `ਸਭ ਤੋਂ ਵੱਧ ਭਾਅ: ${availableBuyers[0].shortName} (${availableBuyers[0].rateFormatted}) • ਬੋਲੋ "ਇਸ ਬੰਦੇ ਨੂੰ ਵੇਚਣੀ ਹੈ"`
                      : (currentDialect === 'hi'
                        ? `सबसे अधिक भाव: ${availableBuyers[0].shortName} (${availableBuyers[0].rateFormatted}) • बोलें "इस व्यक्ति को बेचना है"`
                        : `Top: ${availableBuyers[0].shortName} (${availableBuyers[0].rateFormatted}) • Say "I wanna sell my crop to this person"`))
                    : (lastResponse?.responseMessage || "Speak your crop or buyer rates query...")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 justify-end">
              {availableBuyers && availableBuyers[0] && (
                <button
                  onClick={() => handleSelectBuyer(availableBuyers[0])}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  title="Auto-book with highest buyer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {currentDialect === 'pa'
                      ? `👉 ${availableBuyers[0].shortName} ਨੂੰ ਵੇਚੋ`
                      : (currentDialect === 'hi'
                        ? `👉 ${availableBuyers[0].shortName} को बेचें`
                        : `👉 Sell to ${availableBuyers[0].shortName}`)}
                  </span>
                </button>
              )}
              <button
                onClick={() => setIsDocked(false)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Expand to Full View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                  try { recognitionRef.current?.abort(); } catch (e) {}
                  onClose();
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-bold text-xs"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Mode 2: Full Interactive Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 text-center border-b border-slate-100 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1">
            <button
              onClick={() => setIsDocked(true)}
              title="Dock to bottom and view page"
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                if (recognitionRef.current) {
                  try { recognitionRef.current.abort(); } catch (e) {}
                }
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold transition-colors"
            >
              ✕
            </button>
          </div>

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
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-medium"
            >
              {DIALECTS.map((d) => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Big Center Microphone Button with visual sound feedback */}
          <div className="py-2 text-center space-y-2">
            <div className="relative inline-flex items-center justify-center">
              {isListening && (
                <>
                  <span className="absolute w-20 h-20 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
                  <span className="absolute w-16 h-16 rounded-full bg-rose-500/30 animate-pulse pointer-events-none" />
                </>
              )}
              <button
                onClick={handleToggleMic}
                title={isListening ? "Tap to stop speaking" : "Tap to speak"}
                className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-95 ${
                  isListening
                    ? 'bg-rose-600 ring-4 ring-rose-200 scale-105'
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>

            <div>
              <p className={`text-xs font-semibold ${isListening ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`}>
                {isListening ? (t.micListening || "Listening... Speak your query now") : (t.micClick || "Tap microphone to speak")}
              </p>
              <p className="text-slate-400 text-[10px] mt-0.5">
                {isListening ? "🎙️ Hands-free continuous listening active" : `Dialect: ${DIALECTS.find(d => d.code === currentDialect)?.name || currentDialect}`}
              </p>
            </div>

            <button
              onClick={handleRunDemo}
              className="mt-1 w-full max-w-xs mx-auto bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-300 text-emerald-900 py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentDialect === 'pa' ? '▶ ਲਾਈਵ ਵੌਇਸ ਡੈਮੋ ਚਲਾਓ (2-Step Auto Demo)' : (currentDialect === 'hi' ? '▶ लाइव वॉयस डेमो चलाएं (2-Step Auto Demo)' : '▶ Run 2-Step Hands-Free Voice Demo')}</span>
            </button>
          </div>

          {/* Microphone Error Message Banner */}
          {micError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-relaxed">
                {micError}
              </div>
              <button
                onClick={() => setMicError(null)}
                className="text-rose-400 hover:text-rose-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Browser Unsupported Warning */}
          {!isSpeechSupported && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Voice speech recognition works best on Chrome, Safari, or Edge. You can also type or click the sample queries below.</span>
            </div>
          )}

          {/* Live Transcript Banner with 1-Click Send Button */}
          {transcript && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse flex-shrink-0" />
                <span className="text-emerald-950 text-xs italic font-medium truncate">
                  "{transcript}"
                </span>
              </div>
              <button
                onClick={() => {
                  if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                  try { recognitionRef.current?.stop(); } catch (e) {}
                  setIsListening(false);
                  if (!hasSubmittedRef.current) {
                    hasSubmittedRef.current = true;
                    handleQuery(transcript);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs flex-shrink-0"
              >
                <span>Send</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-600 text-xs">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Analyzing mandi rates & verified buyers...</span>
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

              <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs flex items-center justify-between gap-2 shadow-xs animate-pulse">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold block text-[11px] text-emerald-950 truncate">
                      {currentDialect === 'pa' ? '🎙️ ਬਿਨਾਂ ਹੱਥ ਲਾਏ ਬੋਲੋ (Step 2 of 2):' : (currentDialect === 'hi' ? '🎙️ बिना हाथ लगाए बोलें (Step 2 of 2):' : '🎙️ Hands-Free Active (Step 2 of 2):')}
                    </span>
                    <span className="text-[10px] text-emerald-800 italic truncate block">
                      "{currentDialect === 'pa' ? 'ਮੈਂ ਆਪਣੀ ਫਸਲ ਇਸ ਬੰਦੇ ਨੂੰ ਵੇਚਣੀ ਹੈ' : (currentDialect === 'hi' ? 'मैं इस व्यक्ति को अपनी फसल बेचना चाहता हूँ' : 'I wanna sell my crop to this person')}"
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectBuyer(availableBuyers[0])}
                  className="text-[10px] bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold px-2 py-1 rounded-md flex-shrink-0 shadow-xs"
                >
                  {currentDialect === 'pa' ? 'ਵੇਚੋ' : (currentDialect === 'hi' ? 'बेचें' : 'Sell')}
                </button>
              </div>
            </div>
          )}

          {/* Standard Text Response Box */}
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
