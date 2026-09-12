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

export const BUYERS_BY_CROP = {
  wheat: [
    {
      id: "itc",
      name: "ITC Limited (e-Choupal)",
      shortName: "ITC Limited",
      price: 2580,
      rateFormatted: "₹2,580 / Q",
      distance: "34 km",
      type: "Direct Escrow Partner",
      tag: "Highest Net Profit",
      badgeColor: "emerald",
      netAdvantage: "+₹100 over MSP • 0% APMC cess"
    },
    {
      id: "azadpur",
      name: "Azadpur APMC Terminal Mandi",
      shortName: "Azadpur APMC",
      price: 2540,
      rateFormatted: "₹2,540 / Q",
      distance: "95 km",
      type: "APMC Terminal",
      tag: "High Volume Hub",
      badgeColor: "blue",
      netAdvantage: "Verified Traders • ₹45 unloading"
    },
    {
      id: "pungrain",
      name: "PUNGRAIN State Procurement",
      shortName: "PUNGRAIN",
      price: 2530,
      rateFormatted: "₹2,530 / Q",
      distance: "58 km",
      type: "State Procurement",
      tag: "Govt MSP Backed",
      badgeColor: "amber",
      netAdvantage: "Direct Bank DBT • 2% cess"
    },
    {
      id: "motherdairy",
      name: "Mother Dairy Safal Procurement",
      shortName: "Mother Dairy",
      price: 2490,
      rateFormatted: "₹2,490 / Q",
      distance: "42 km",
      type: "Institutional Retail",
      tag: "Instant DBT",
      badgeColor: "purple",
      netAdvantage: "Zero Commission • Cold Chain"
    }
  ],
  onion: [
    {
      id: "motherdairy",
      name: "Mother Dairy Safal Procurement",
      shortName: "Mother Dairy",
      price: 2890,
      rateFormatted: "₹2,890 / Q",
      distance: "42 km",
      type: "Direct Escrow Partner",
      tag: "Highest Net Profit",
      badgeColor: "emerald",
      netAdvantage: "+₹240 over local mandi"
    },
    {
      id: "azadpur",
      name: "Azadpur APMC Mandi",
      shortName: "Azadpur APMC",
      price: 2850,
      rateFormatted: "₹2,850 / Q",
      distance: "95 km",
      type: "APMC Terminal",
      tag: "High Demand",
      badgeColor: "blue",
      netAdvantage: "140+ verified commission agents"
    },
    {
      id: "itc",
      name: "ITC e-Choupal Hub",
      shortName: "ITC Limited",
      price: 2720,
      rateFormatted: "₹2,720 / Q",
      distance: "34 km",
      type: "Direct Procurement",
      tag: "Guaranteed Escrow",
      badgeColor: "purple",
      netAdvantage: "Zero deduction for moisture"
    }
  ],
  tomato: [
    {
      id: "bigbasket",
      name: "BigBasket Direct Collection Center",
      shortName: "BigBasket Direct",
      price: 3280,
      rateFormatted: "₹3,280 / Q",
      distance: "38 km",
      type: "Direct Escrow Partner",
      tag: "Highest Net Profit",
      badgeColor: "emerald",
      netAdvantage: "Refrigerated transport included"
    },
    {
      id: "azadpur",
      name: "Azadpur APMC Mandi",
      shortName: "Azadpur APMC",
      price: 3150,
      rateFormatted: "₹3,150 / Q",
      distance: "95 km",
      type: "APMC Terminal",
      tag: "Daily Wholesale Demand",
      badgeColor: "blue",
      netAdvantage: "Quick same-day auction"
    }
  ],
  paddy: [
    {
      id: "itc",
      name: "ITC e-Choupal Export Hub",
      shortName: "ITC Limited",
      price: 3490,
      rateFormatted: "₹3,490 / Q",
      distance: "34 km",
      type: "Direct Escrow Partner",
      tag: "Highest Net Profit",
      badgeColor: "emerald",
      netAdvantage: "+₹140 premium for quality"
    },
    {
      id: "pungrain",
      name: "PUNGRAIN Khanna Grain Market",
      shortName: "PUNGRAIN",
      price: 3460,
      rateFormatted: "₹3,460 / Q",
      distance: "58 km",
      type: "State Procurement",
      tag: "Govt MSP Assured",
      badgeColor: "amber",
      netAdvantage: "Guaranteed purchase quota"
    }
  ],
  mustard: [
    {
      id: "adani",
      name: "Adani Agri Logistics Hub",
      shortName: "Adani Agri Logistics",
      price: 6120,
      rateFormatted: "₹6,120 / Q",
      distance: "48 km",
      type: "Direct Escrow Partner",
      tag: "Highest Net Profit",
      badgeColor: "emerald",
      netAdvantage: "+₹140 over APMC rates"
    },
    {
      id: "fpo",
      name: "Sangrur Farmers Producer Org (FPO)",
      shortName: "Local FPO",
      price: 6080,
      rateFormatted: "₹6,080 / Q",
      distance: "12 km",
      type: "Cooperative Buyer",
      tag: "Closest Distance",
      badgeColor: "blue",
      netAdvantage: "Zero transport cost deduction"
    }
  ],
  potato: [
    {
      id: "motherdairy",
      name: "Mother Dairy Safal Procurement Center",
      shortName: "Mother Dairy",
      price: 1910,
      rateFormatted: "₹1,910 / Q",
      distance: "42 km",
      type: "Direct Escrow Partner",
      tag: "Highest Net Profit",
      badgeColor: "emerald",
      netAdvantage: "+₹60 over mandi price"
    },
    {
      id: "azadpur",
      name: "Azadpur Mandi Cold Cluster",
      shortName: "Azadpur APMC",
      price: 1890,
      rateFormatted: "₹1,890 / Q",
      distance: "95 km",
      type: "APMC Terminal",
      tag: "Bulk Purchase",
      badgeColor: "blue",
      netAdvantage: "Direct warehouse delivery"
    }
  ]
};

export function parseVoiceQuery(spokenText, dialectCode = "hi", context = {}) {
  const query = (spokenText || "").toLowerCase().trim();

  // Detect Crop
  let crop = context.activeCrop || "wheat";
  if (query.includes("onion") || query.includes("pyaz") || query.includes("kanda") || query.includes("ਪਿਆਜ਼") || query.includes("कांदा")) crop = "onion";
  else if (query.includes("tomato") || query.includes("tamatar") || query.includes("ਟਮਾਟਰ") || query.includes("टोमॅटो")) crop = "tomato";
  else if (query.includes("paddy") || query.includes("dhan") || query.includes("chawal") || query.includes("ਝੋਨਾ") || query.includes("ਧਾਨ") || query.includes("धान")) crop = "paddy";
  else if (query.includes("mustard") || query.includes("sarson") || query.includes("ਸਰ੍ਹੋਂ") || query.includes("सरसो")) crop = "mustard";
  else if (query.includes("potato") || query.includes("aloo") || query.includes("बटाटा") || query.includes("ਆਲੂ")) crop = "potato";
  else if (query.includes("wheat") || query.includes("gehu") || query.includes("kanak") || query.includes("ਕਣਕ") || query.includes("गेहूं")) crop = "wheat";

  // Check Intent: Step 2 - Direct Selling & Automated Booking
  // Examples: "I want to sell my crop to this person", "Sell to ITC Limited", "आईटीसी को बेचना है", "ਆਈਟੀਸੀ ਨੂੰ ਵੇਚਣਾ ਹੈ"
  const isSellingQuery =
    query.includes("sell") ||
    query.includes("bech") ||
    query.includes("bechna") ||
    query.includes("becho") ||
    query.includes("vech") ||
    query.includes("vechna") ||
    query.includes("vecho") ||
    query.includes("बेच") ||
    query.includes("बेचना") ||
    query.includes("बेचो") ||
    query.includes("बिक्री") ||
    query.includes("ਵੇਚ") ||
    query.includes("ਵੇਚਣਾ") ||
    query.includes("ਵੇਚੋ") ||
    query.includes("book") ||
    query.includes("lock") ||
    query.includes("confirm") ||
    query.includes("le lo") ||
    query.includes("de do") ||
    query.includes("de diyo") ||
    query.includes("this person") ||
    query.includes("this buyer") ||
    query.includes("wanna sell") ||
    query.includes("want to sell") ||
    query.includes("sell this") ||
    query.includes("sell at") ||
    query.includes("sell this at this") ||
    query.includes("want to sell this") ||
    query.includes("wanna sell this") ||
    query.includes("i want to sell") ||
    query.includes("i wanna sell") ||
    query.includes("sell my crop") ||
    query.includes("best buyer") ||
    query.includes("highest buyer") ||
    query.includes("ਬੰਦੇ") ||
    query.includes("bande") ||
    query.includes("ਵਿਅਕਤੀ") ||
    query.includes("vyakti") ||
    query.includes("ਵੇਚਣੀ") ||
    query.includes("vechni") ||
    query.includes("ਵੇਚ ਦਿਓ") ||
    query.includes("vech dio") ||
    query.includes("ਇਸ ਭਾਅ") ||
    query.includes("ਇਸ ਰੇਟ") ||
    query.includes("ਇਸ ਨੂੰ") ||
    query.includes("ਸੌਦਾ ਪੱਕਾ") ||
    query.includes("ਬੁਕਿੰਗ") ||
    query.includes("आईटीसी") ||
    query.includes("ਆਈਟੀਸੀ") ||
    (context.availableBuyers && (query.includes("itc") || query.includes("azadpur") || query.includes("mother") || query.includes("pungrain")));

  if (isSellingQuery) {
    return generateVoiceDealConfirmation(query, dialectCode, crop, context);
  }

  // Check Intent: Step 1 - Compare Buyers & Rates
  // Examples: "Show me this crop's rates which buyer is giving", "Wheat buyers and rates", "गेहूं के खरीदार और भाव दिखाओ"
  const isBuyerQuery =
    query.includes("buyer") ||
    query.includes("kharidar") ||
    query.includes("kharidaar") ||
    query.includes("kharedidar") ||
    query.includes("खरीदार") ||
    query.includes("ਖਰੀਦਦਾਰ") ||
    query.includes("giving") ||
    query.includes("who is") ||
    query.includes("kaun") ||
    query.includes("koun") ||
    query.includes("kisne") ||
    query.includes("which") ||
    query.includes("compare") ||
    query.includes("rate") ||
    query.includes("daam") ||
    query.includes("bhav") ||
    query.includes("kimat") ||
    query.includes("bhaav") ||
    query.includes("price") ||
    query.includes("ਮੁੱਲ") ||
    query.includes("ਦਰ") ||
    query.includes("ਦਰਾਂ") ||
    query.includes("ਭਾਅ") ||
    query.includes("ਭਾ") ||
    query.includes("ਕਿਹੜਾ") ||
    query.includes("ਕਿਹੜੇ") ||
    query.includes("ਦੇ ਰਿਹਾ") ||
    query.includes("ਦੇ ਰਹੇ") ||
    query.includes("kehda") ||
    query.includes("keda") ||
    query.includes("de reha") ||
    query.includes("भाव") ||
    query.includes("भाव दिखाओ") ||
    query.includes("भाव बताओ") ||
    query.includes("mandi") ||
    query.includes("ਮੰਡੀ") ||
    query.includes("मंडी") ||
    query.includes("wheat") ||
    query.includes("gehu") ||
    query.includes("kanak") ||
    query.includes("ਕਣਕ") ||
    query.includes("गेहूं") ||
    query.includes("onion") ||
    query.includes("pyaz") ||
    query.includes("tomato") ||
    query.includes("tamatar") ||
    query.includes("paddy") ||
    query.includes("dhan") ||
    query.includes("mustard") ||
    query.includes("potato") ||
    query.includes("aloo");

  if (isBuyerQuery) {
    return generateBuyerComparisonResponse(crop, dialectCode);
  }

  // Intent 3: Net-Profit Destination / Kahan bechein?
  if (
    query.includes("kahan") ||
    query.includes("kithe") ||
    query.includes("where") ||
    query.includes("profit") ||
    query.includes("munafa") ||
    query.includes("fayda") ||
    query.includes("vikan") ||
    query.includes("विक्री") ||
    query.includes("ਲਾਭ")
  ) {
    return generateProfitAdviceResponse(dialectCode);
  }

  // Intent 4: Transport Pooling / Gadi share
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

  // Intent 5: Escrow & Payment Status
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

// Step 1 Generator: Compare buyers giving rates for crop
export function generateBuyerComparisonResponse(crop, lang = "hi") {
  const buyers = BUYERS_BY_CROP[crop] || BUYERS_BY_CROP.wheat;
  const topBuyer = buyers[0];
  const secondBuyer = buyers[1] || buyers[0];

  const cropNames = {
    wheat: { en: "Wheat", hi: "गेहूं", pa: "ਕਣਕ", mr: "गहू" },
    onion: { en: "Red Onion", hi: "प्याज", pa: "ਪਿਆਜ਼", mr: "कांदा" },
    tomato: { en: "Hybrid Tomato", hi: "टमाटर", pa: "ਟਮਾਟਰ", mr: "टोमॅटो" },
    paddy: { en: "Basmati Paddy", hi: "धान (बासमती)", pa: "ਬਾਸਮਤੀ ਝੋਨਾ", mr: "धान" },
    mustard: { en: "Mustard", hi: "सरसों", pa: "ਸਰ੍ਹੋਂ", mr: "मोहरी" },
    potato: { en: "Potato", hi: "आलू", pa: "ਆਲੂ", mr: "बटाटा" }
  };
  const cropLabel = (cropNames[crop] && cropNames[crop][lang]) || cropNames[crop]?.en || crop;

  let text = "";
  let spokenAudioText = "";

  switch (lang) {
    case "pa":
      text = `${cropLabel} ਦੇ ਮੁੱਖ ਖਰੀਦਦਾਰ: ${topBuyer.shortName} ਸਭ ਤੋਂ ਵੱਧ ${topBuyer.rateFormatted} ਦੇ ਰਿਹਾ ਹੈ, ਅਤੇ ${secondBuyer.shortName} ${secondBuyer.rateFormatted} ਦੇ ਰਿਹਾ ਹੈ। ਤੁਸੀਂ ਕਿਸ ਖਰੀਦਦਾਰ ਨੂੰ ਵੇਚਣਾ ਚਾਹੁੰਦੇ ਹੋ?`;
      spokenAudioText = `${cropLabel} ਲਈ ਸਭ ਤੋਂ ਵੱਧ ਭਾਅ ${topBuyer.shortName} ਵੱਲੋਂ ${topBuyer.price} ਰੁਪਏ ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਮਿਲ ਰਿਹਾ ਹੈ। ਕੀ ਤੁਸੀਂ ${topBuyer.shortName} ਨੂੰ ਵੇਚਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਬੋਲੋ ${topBuyer.shortName} ਨੂੰ ਵੇਚ ਦਿਓ।`;
      break;
    case "mr":
      text = `${cropLabel} साठी सर्वोच्च खरेदी दर ${topBuyer.shortName} कडून ${topBuyer.rateFormatted} आणि ${secondBuyer.shortName} कडून ${secondBuyer.rateFormatted} उपलब्ध आहे. तुम्हाला कोणत्या खरेदीदाराला विकायचे आहे?`;
      spokenAudioText = `${cropLabel} साठी ${topBuyer.shortName} सर्वात जास्त ${topBuyer.price} रुपये भाव देत आहे. तुम्हाला विकायचे असल्यास सांगा.`;
      break;
    case "en":
      text = `Top buyers offering rates for ${cropLabel}: ${topBuyer.shortName} offers ${topBuyer.rateFormatted} (Highest), and ${secondBuyer.shortName} offers ${secondBuyer.rateFormatted}. Which buyer would you like to sell to?`;
      spokenAudioText = `Here are the top buyers for ${cropLabel}. ${topBuyer.shortName} is giving the highest rate at ${topBuyer.price} rupees per quintal. Would you like to sell to ${topBuyer.shortName}? Just say "Sell to ${topBuyer.shortName}".`;
      break;
    case "hi":
    default:
      text = `${cropLabel} के प्रमुख खरीदार: ${topBuyer.shortName} सबसे अधिक ${topBuyer.rateFormatted} दे रहा है, और ${secondBuyer.shortName} ${secondBuyer.rateFormatted} दे रहा है। आप किस खरीदार को बेचना चाहते हैं?`;
      spokenAudioText = `किसान भाई, ${cropLabel} के लिए सबसे अधिक भाव ${topBuyer.shortName} ₹${topBuyer.price} प्रति क्विंटल दे रहा है। क्या आप ${topBuyer.shortName} को बेचना चाहते हैं? बोलें "${topBuyer.shortName} को बेच दो"।`;
      break;
  }

  return {
    intent: "COMPARE_BUYERS",
    crop,
    cropLabel,
    displayRate: topBuyer.rateFormatted,
    bestBuyer: topBuyer.shortName,
    buyers,
    responseMessage: text,
    speechText: spokenAudioText,
    action: "PROMPT_BUYER_SELECTION"
  };
}

// Step 2 Generator: Automated deal confirmation, Smart Escrow lock & Shared Truck booking
export function generateVoiceDealConfirmation(query, lang = "hi", crop = "wheat", context = {}) {
  const buyers = BUYERS_BY_CROP[crop] || BUYERS_BY_CROP.wheat;

  // Extract selected buyer
  let selectedBuyer = buyers[0]; // Default to highest bidder (ITC Limited for wheat)
  if (query.includes("azadpur") || query.includes("delhi") || query.includes("आज़ादपुर") || query.includes("आजादपुर") || query.includes("ਆਜ਼ਾਦਪੁਰ")) {
    selectedBuyer = buyers.find(b => b.id === "azadpur") || buyers[1];
  } else if (query.includes("mother") || query.includes("dairy") || query.includes("safal") || query.includes("मदर") || query.includes("ਡੇਅਰੀ") || query.includes("ਸਫਲ") || query.includes("सफल")) {
    selectedBuyer = buyers.find(b => b.id === "motherdairy") || buyers[0];
  } else if (query.includes("pungrain") || query.includes("khanna") || query.includes("pun grain") || query.includes("पनग्रेन") || query.includes("ਪਨਗ੍ਰੇਨ")) {
    selectedBuyer = buyers.find(b => b.id === "pungrain") || buyers[0];
  } else if (query.includes("adani") || query.includes("अदानी") || query.includes("ਅਡਾਨੀ")) {
    selectedBuyer = buyers.find(b => b.id === "adani") || buyers[0];
  } else if (query.includes("bigbasket") || query.includes("big basket") || query.includes("बिगबास्केट")) {
    selectedBuyer = buyers.find(b => b.id === "bigbasket") || buyers[0];
  } else if (query.includes("itc") || query.includes("आईटीसी") || query.includes("ਆਈਟੀਸੀ") || query.includes("choupal") || query.includes("चौपाल")) {
    selectedBuyer = buyers.find(b => b.id === "itc") || buyers[0];
  }

  // Extract quantity (default 3.0 Quintals from farmer's listing)
  let quantity = 3.0;
  const match = query.match(/(\d+(?:\.\d+)?)\s*(?:quintal|quintals|q|kg|kilo|ਕੁਇੰਟਲ|क्विंटल|कु\.)?/i);
  if (match && parseFloat(match[1]) > 0 && parseFloat(match[1]) <= 50) {
    quantity = parseFloat(match[1]);
  }

  const agreedRate = selectedBuyer.price;
  const totalEscrowAmount = quantity * agreedRate;
  const freightDeduction = 180; // Hyperlocal Kakra village shared Tata Ace
  const netPayout = totalEscrowAmount - freightDeduction;

  const cropTitles = {
    wheat: "Wheat (Grade A)",
    onion: "Red Onion (Grade A)",
    tomato: "Hybrid Tomato",
    paddy: "Basmati Paddy",
    mustard: "Mustard Seed",
    potato: "Potato (Aloo Jyoti)"
  };

  const dealDetails = {
    dealId: `tx-esc-${Math.floor(1000 + Math.random() * 9000)}`,
    buyerName: selectedBuyer.shortName,
    buyerFullName: selectedBuyer.name,
    crop: cropTitles[crop] || "Wheat (Grade A)",
    quantityQuintals: quantity,
    agreedRate: agreedRate,
    totalEscrowAmount: totalEscrowAmount,
    freightDeduction: freightDeduction,
    netPayout: netPayout,
    farmerName: "Harpreet Singh",
    farmerPhone: "9876512340",
    bankAccount: "Punjab National Bank - ****4091",
    village: "Kakra",
    clusterId: "cluster-sgr-01",
    assignedTruck: "Tata Ace Mini-Truck (PB 11 AB 4092)",
    pickupSlot: "Tomorrow Morning 07:30 AM",
    status: "VAULT_LOCKED"
  };

  let text = "";
  let spokenAudioText = "";

  switch (lang) {
    case "pa":
      text = `ਸੌਦਾ ਪੱਕਾ! ${dealDetails.buyerName} ਨਾਲ ${quantity} ਕੁਇੰਟਲ ਦਾ ਸੌਦਾ ₹${agreedRate} ਦੇ ਭਾਅ 'ਤੇ ਪੱਕਾ ਹੋ ਗਿਆ। ₹${totalEscrowAmount.toLocaleString('en-IN')} ਸਮਾਰਟ ਐਸਕਰੋ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹਨ ਅਤੇ ਕਾਕੜਾ ਪਿੰਡ ਤੋਂ ਸਾਂਝੀ ਗੱਡੀ ਬੁੱਕ ਹੋ ਗਈ ਹੈ। ਡਿਲੀਵਰੀ ਹੁੰਦੇ ਹੀ ₹${netPayout.toLocaleString('en-IN')} ਸਿੱਧਾ ਤੁਹਾਡੇ ਪੀਐਨਬੀ ਖਾਤੇ (****4091) ਵਿੱਚ ਆ ਜਾਣਗੇ।`;
      spokenAudioText = `ਵਧਾਈ ਹੋਵੇ ਹਰਪ੍ਰੀਤ ਜੀ! ${dealDetails.buyerName} ਨਾਲ ਸੌਦਾ ਪੱਕਾ ਹੋ ਗਿਆ ਹੈ। ਪੈਸੇ ਸਮਾਰਟ ਐਸਕਰੋ ਵਿੱਚ ਲੌਕ ਹੋ ਚੁੱਕੇ ਹਨ ਅਤੇ ਸਾਂਝੀ ਗੱਡੀ ਬੁੱਕ ਹੋ ਗਈ ਹੈ।`;
      break;
    case "en":
      text = `Deal Confirmed! Sold ${quantity}Q to ${dealDetails.buyerName} at ₹${agreedRate}/Q. ₹${totalEscrowAmount.toLocaleString('en-IN')} locked in Smart Escrow Vault, and shared truck booked from Kakra village. Net ₹${netPayout.toLocaleString('en-IN')} will be credited directly to your PNB account (****4091) upon delivery.`;
      spokenAudioText = `Congratulations! Your deal with ${dealDetails.buyerName} is confirmed. ${totalEscrowAmount} rupees are secured in the Escrow Vault, and a shared truck is booked for pickup.`;
      break;
    case "hi":
    default:
      text = `सौदा पक्का! ${dealDetails.buyerName} को ${quantity} क्विंटल फसल ₹${agreedRate} के भाव पर बेच दी गई। ₹${totalEscrowAmount.toLocaleString('en-IN')} स्मार्ट एस्क्रो वॉल्ट में सुरक्षित जमा हैं और काकरा गांव से साझा गाड़ी बुक हो गई है। डिलीवरी पर ₹${netPayout.toLocaleString('en-IN')} सीधे आपके पीएनबी खाते (****4091) में क्रेडिट हो जाएंगे।`;
      spokenAudioText = `बधाई हो हरप्रीत जी! ${dealDetails.buyerName} के साथ आपका सौदा पक्का हो गया है। ₹${totalEscrowAmount} एस्क्रो वॉल्ट में सुरक्षित हैं और काकरा से साझा गाड़ी बुक हो चुकी है।`;
      break;
  }

  return {
    intent: "CONFIRM_VOICE_DEAL",
    deal: dealDetails,
    responseMessage: text,
    speechText: spokenAudioText,
    action: "VIEW_ESCROW"
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
    responseMessage: "नमस्ते किसान भाई! आप बोलकर किसी भी फसल का ताज़ा भाव पूछ सकते हैं, खरीदारों की तुलना कर सकते हैं, और सीधे बोलकर फसल बेच सकते हैं।",
    speechText: "Kisan bhai, aap bolkar mandi bhav pooch sakte hain ya direct buyer ko fasal bech sakte hain.",
    action: "SHOW_PROMPTS"
  };
}
