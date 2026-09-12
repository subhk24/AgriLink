import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  ArrowRight,
  Send,
  Sparkles
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
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const recognitionRef = useRef(null);

  const samplePrompts = [
    t.prompt1,
    t.prompt2,
    t.prompt3
  ];

  // Browser Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = currentDialect === 'pa' ? 'pa-Guru-IN' : (currentDialect === 'mr' ? 'mr-IN' : 'hi-IN');

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
      const res = await queryBhashiniVoice(queryText, currentDialect);
      if (res.result) {
        setLastResponse(res.result);
        speakText(res.result.speechText || res.result.responseMessage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Exact Login Modal Matching Header */}
        <div className="p-6 text-center border-b border-slate-100 relative">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
          >
            ✕
          </button>

          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center mb-2">
            <Mic className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t.voiceTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.voiceSubtitle}</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Language Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">{t.voiceLang}</label>
            <select
              value={currentDialect}
              onChange={(e) => setCurrentDialect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {DIALECTS.map((d) => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Big Center Microphone Button */}
          <div className="py-3 text-center space-y-2">
            <button
              onClick={handleToggleMic}
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white transition-all shadow-sm ${
                isListening
                  ? 'bg-rose-600 animate-pulse ring-4 ring-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
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

          {/* Response Box */}
          {lastResponse && (
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
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQuery(inputText);
              }}
              placeholder={t.voicePlaceholder}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
