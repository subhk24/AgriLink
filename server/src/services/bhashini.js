// Bhashini-Powered Voice-First Vernacular AI Engine
// Zero-typing dialect-first conversational interface for rural farmers across 12+ Indian languages

export const supportedDialects = [
  { code: "hi", name: "Hindi (हिन्दी)", speechCode: "hi-IN" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)", speechCode: "pa-IN" },
  { code: "mr", name: "Marathi (मराठी)", speechCode: "mr-IN" },
  { code: "te", name: "Telugu (తెలుగు)", speechCode: "te-IN" },
  { code: "bn", name: "Bengali (বাংলা)", speechCode: "bn-IN" },
  { code: "ta", name: "Tamil (தமிழ்)", speechCode: "ta-IN" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", speechCode: "gu-IN" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)", speechCode: "kn-IN" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)", speechCode: "or-IN" },
  { code: "ml", name: "Malayalam (മലയാളം)", speechCode: "ml-IN" },
  { code: "bho", name: "Bhojpuri (भोजपुरी)", speechCode: "hi-IN" },
  { code: "har", name: "Haryanvi (हरियाणवी)", speechCode: "hi-IN" },
  { code: "en", name: "English (Indian)", speechCode: "en-IN" }
];

export function parseVoiceQuery(spokenText, dialectCode = "hi") {
  const query = (spokenText || "").toLowerCase().trim();

  // Intent 1: Check Price / Mandi Rates
  if (
    query.includes("rate") ||
    query.includes("daam") ||
    query.includes("bhav") ||
    query.includes("kimat") ||
    query.includes("bhaav") ||
    query.includes("kilo") ||
    query.includes("quintal") ||
    query.includes("price") ||
    query.includes("ਮੁੱਲ") ||
    query.includes("ਦਰ") ||
    query.includes("दर") ||
    query.includes("भाव") ||
    query.includes("ధర")
  ) {
    let crop = "wheat";
    if (query.includes("onion") || query.includes("pyaz") || query.includes("kanda") || query.includes("ਪਿਆਜ਼") || query.includes("कांदा")) crop = "onion";
    else if (query.includes("tomato") || query.includes("tamatar") || query.includes("ਟਮਾਟਰ") || query.includes("टोमॅटो")) crop = "tomato";
    else if (query.includes("paddy") || query.includes("dhan") || query.includes("chawal") || query.includes("ਝੋਨਾ") || query.includes("धान")) crop = "paddy";
    else if (query.includes("mustard") || query.includes("sarson") || query.includes("ਸਰ੍ਹੋਂ") || query.includes("सरसो")) crop = "mustard";
    else if (query.includes("potato") || query.includes("aloo") || query.includes("बटाटा") || query.includes("ਆਲੂ")) crop = "potato";

    return generatePriceResponse(crop, dialectCode);
  }

  // Intent 2: Net-Profit Destination / Kahan bechein?
  if (
    query.includes("kahan") ||
    query.includes("kithe") ||
    query.includes("where") ||
    query.includes("profit") ||
    query.includes("munafa") ||
    query.includes("fayda") ||
    query.includes("bechu") ||
    query.includes("becho") ||
    query.includes("vikan") ||
    query.includes("विक्री") ||
    query.includes("ਲਾਭ")
  ) {
    return generateProfitAdviceResponse(dialectCode);
  }

  // Intent 3: Transport Pooling / Gadi share
  if (
    query.includes("gadi") ||
    query.includes("truck") ||
    query.includes("pool") ||
    query.includes("transport") ||
    query.includes("tempo") ||
    query.includes("kiraya") ||
    query.includes("freight") ||
    query.includes("ਸਾਂਝਾ") ||
    query.includes("गाडी") ||
    query.includes("भाडे")
  ) {
    return generatePoolingResponse(dialectCode);
  }

  // Intent 4: Escrow & Payment Status
  if (
    query.includes("paisa") ||
    query.includes("payment") ||
    query.includes("khata") ||
    query.includes("bank") ||
    query.includes("escrow") ||
    query.includes("dbt") ||
    query.includes("rupee") ||
    query.includes("ਪੈਸੇ") ||
    query.includes("खाते")
  ) {
    return generateEscrowResponse(dialectCode);
  }

  // Fallback default helpful greeting
  return generateHelpResponse(dialectCode);
}

function generatePriceResponse(crop, lang) {
  const cropRates = {
    wheat: { en: "Wheat", hi: "गेहूं", pa: "ਕਣਕ", mr: "गहू", te: "గోధుమలు", rate: "₹2,540 / Quintal", buyer: "ITC e-Choupal (₹2,580)" },
    onion: { en: "Red Onion", hi: "प्याज", pa: "ਪਿਆਜ਼", mr: "कांदा", te: "ఉల్లిపాయలు", rate: "₹2,850 / Quintal", buyer: "Mother Dairy (₹2,890)" },
    tomato: { en: "Tomato", hi: "टमाटर", pa: "ਟਮਾਟਰ", mr: "टोमॅटो", te: "టమాటాలు", rate: "₹3,150 / Quintal", buyer: "BigBasket Direct (₹3,280)" },
    paddy: { en: "Basmati Paddy", hi: "धान", pa: "ਝੋਨਾ", mr: "धान", te: "వరి", rate: "₹3,420 / Quintal", buyer: "APMC Azadpur (₹3,420)" },
    mustard: { en: "Mustard", hi: "सरसों", pa: "ਸਰ੍ਹੋਂ", mr: "मोहरी", te: "ఆవాలు", rate: "₹6,050 / Quintal", buyer: "Local FPO (₹6,080)" },
    potato: { en: "Potato", hi: "आलू", pa: "ਆਲੂ", mr: "बटाटा", te: "బంగాళదుంప", rate: "₹1,890 / Quintal", buyer: "Mother Dairy (₹1,910)" }
  };

  const item = cropRates[crop] || cropRates.wheat;

  let text = "";
  let spokenAudioText = "";

  switch (lang) {
    case "pa":
      text = `ਅੱਜ ${item.pa} ਦਾ ਮੰਡੀ ਰੇਟ ${item.rate} ਹੈ। ਸਭ ਤੋਂ ਉੱਚੀ ਬੋਲੀ ${item.buyer} ਵੱਲੋਂ ਮਿਲ ਰਹੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਆਪਣੀ ਫਸਲ ਲਿਸਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?`;
      spokenAudioText = `Sat Sri Akal! Ajj ${item.pa} da rate ${item.rate} hai. ITC te Mother Dairy vallo vadh rate mil reha hai.`;
      break;
    case "mr":
      text = `आज ${item.mr} चा कृषी उत्पन्न बाजार दर ${item.rate} आहे. सर्वोच्च थेट खरेदी दर ${item.buyer} कडून उपलब्ध आहे. तुम्हाला विक्रीसाठी नोंदणी करायची आहे का?`;
      spokenAudioText = `Namaskar! Aaj ${item.mr} cha dar ${item.rate} aahe. Direct kharedidar sarkhe ${item.buyer} jaast faayda det ahet.`;
      break;
    case "te":
      text = `ఈరోజు మార్కెట్లో ధర ${item.rate}. అత్యధిక ధర ${item.buyer} ద్వారా లభిస్తోంది. మీ పంటను అమ్మకానికి జాబితా చేయాలా?`;
      spokenAudioText = `Namaskaram! Ee roju mandi rate ${item.rate} ga undhi.`;
      break;
    case "hi":
    default:
      text = `आज ${item.hi} का मंडी भाव ${item.rate} चल रहा है। सबसे अधिक शुद्ध मुनाफा ${item.buyer} दे रहा है। क्या आप अपनी फसल तुरंत लिस्ट करना चाहते हैं?`;
      spokenAudioText = `Kisan bhai, aaj ${item.hi} ka bhav ${item.rate} hai. Direct buyer se aapko 25 percent tak zyada munafa mil sakta hai.`;
      break;
  }

  return {
    intent: "CHECK_PRICE",
    crop,
    displayRate: item.rate,
    bestBuyer: item.buyer,
    responseMessage: text,
    speechText: spokenAudioText,
    action: "NAVIGATE_NET_PROFIT"
  };
}

function generateProfitAdviceResponse(lang) {
  let text = "नेट-प्रॉफिट इंजन के अनुसार, आपके गांव से साझा ट्रांसपोर्ट (Hyperlocal Pooling) इस्तेमाल करने पर आपको 42% कम भाड़ा लगेगा और हाथ में ₹2,485 प्रति क्विंटल शुद्ध नकद मिलेगा!";
  let speech = "Net Profit Engine ke hisaab se shared transport lene par aapko 42 percent transport bachat hogi.";
  
  if (lang === "pa") {
    text = "ਸਾਡੇ ਨੈੱਟ-ਪ੍ਰੌਫਿਟ ਇੰਜਨ ਮੁਤਾਬਕ, ਜੇ ਤੁਸੀਂ ਪਿੰਡ ਦੇ ਦੂਜੇ ਕਿਸਾਨਾਂ ਨਾਲ ਸਾਂਝਾ ਟੈਂਪੂ ਲੈਂਦੇ ਹੋ, ਤਾਂ ਭਾੜਾ 42% ਘਟੇਗਾ ਅਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ਮੁਨਾਫਾ ਮਿਲੇਗਾ!";
    speech = "Sanjha transport naal tuhada kharcha 42 percent ghat javega te chokha munafa milega.";
  } else if (lang === "mr") {
    text = "आमच्या नेट-प्रॉफिट इंजिननुसार, सामूहिक वाहतूक वापरल्यास वाहतूक खर्चात ४५% बचत होऊन हातात जास्तीत जास्त नफा मिळेल!";
    speech = "Samuhik vaahatuk vaprlyaas tumhala 45 takke bachat hoil.";
  }

  return {
    intent: "BEST_MANDI",
    responseMessage: text,
    speechText: speech,
    action: "OPEN_POOLING_VIEW"
  };
}

function generatePoolingResponse(lang) {
  let text = "आपके गांव के क्लस्टर में टाटा ऐस मिनी ट्रक में 4.5 क्विंटल जगह बाकी है। अभी जुड़कर भाड़े में 40% की बचत करें!";
  let speech = "Aapke gaon ke cluster mein Tata Ace mini truck tayyar hai. 40 percent transport bachat ke liye judein.";

  if (lang === "pa") {
    text = "ਤੁਹਾਡੇ ਪਿੰਡ ਦੇ ਕਲੱਸਟਰ ਵਿੱਚ ਟਾਟਾ ਏਸ (ਛੋਟਾ ਹਾਥੀ) ਤਿਆਰ ਹੈ। 4.5 ਕੁਇੰਟਲ ਥਾਂ ਖਾਲੀ ਹੈ, 42% ਭਾੜਾ ਬਚਾਉਣ ਲਈ ਹੁਣੇ ਸ਼ਾਮਲ ਹੋਵੋ!";
    speech = "Tuhade pind vich chhota hathi tayyar hai. 42 percent bhada bachao.";
  }

  return {
    intent: "POOL_TRANSPORT",
    responseMessage: text,
    speechText: speech,
    action: "JOIN_POOL"
  };
}

function generateEscrowResponse(lang) {
  let text = "स्मार्ट एस्क्रो वॉल्ट: खरीदार ने पहले ही पूरा भुगतान सुरक्षित कर दिया है। माल पहुंचते ही DBT के माध्यम से तुरंत आपके बैंक खाते में पैसे क्रेडिट हो जाएंगे।";
  let speech = "Smart Escrow vault mein paisa safe hai. Delivery hote hi direct bank transfer se turant milega.";

  if (lang === "pa") {
    text = "ਸਮਾਰਟ ਐਸਕਰੋ ਵਾਲਟ: ਖਰੀਦਦਾਰ ਦੇ ਪੈਸੇ ਲੌਕ ਹੋ ਚੁੱਕੇ ਹਨ। ਮਾਲ ਪਹੁੰਚਦੇ ਹੀ ਸਿੱਧਾ ਤੁਹਾਡੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ UPI ਰਾਹੀਂ ਪੈਸੇ ਟਰਾਂਸਫਰ ਹੋ ਜਾਣਗੇ।";
    speech = "Kharidar da paisa escrow vich safe hai. Delivery hundeyan hi seedha bank a/c vich aavega.";
  }

  return {
    intent: "ESCROW_STATUS",
    responseMessage: text,
    speechText: speech,
    action: "VIEW_ESCROW"
  };
}

function generateHelpResponse(lang) {
  return {
    intent: "GENERAL_HELP",
    responseMessage: "नमस्ते किसान भाई! आप बोलकर किसी भी फसल का ताज़ा भाव पूछ सकते हैं, साझा गाड़ी बुक कर सकते हैं, या अपनी फसल बेच सकते हैं।",
    speechText: "Kisan bhai, aap bolkar mandi bhav pooch sakte hain ya sasti shared gadi book kar sakte hain.",
    action: "SHOW_PROMPTS"
  };
}
