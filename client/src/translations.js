// Multilingual UI Translations (English, Hindi, Punjabi)

export const translations = {
  en: {
    appTitle: "AgriLink",
    appSubtitle: "Farmer & Market Linkage Portal",
    language: "Language",
    
    // Auth / Login
    loginTitle: "Sign In to AgriLink",
    loginSubtitle: "Direct Farmer & Market Linkage Portal",
    mobileNumber: "Mobile Number / User ID",
    mobilePlaceholder: "Enter 10-digit mobile number",
    password: "Password",
    passwordPlaceholder: "Enter password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signIn: "Sign In",
    signingIn: "Signing in...",
    logout: "Logout",
    
    // Navigation
    home: "Home",
    rates: "Mandi Rates",
    pricing: "Price Discovery",
    transport: "Shared Transport",
    orders: "Orders & Payments",
    voice: "Voice",
    
    // Home / Farmer Dashboard
    welcome: "Welcome",
    farmerDashboard: "Farmer Dashboard",
    checkPrices: "Check Market Prices",
    listProduce: "List Produce",
    activeListings: "Active Listings",
    total: "Total",
    quintals: "Quintals",
    optimalMandi: "Today's Optimal Mandi",
    directVerified: "Direct Escrow Verified",
    sharedTransportTitle: "Shared Transport",
    savedFreight: "Saved via Pooling",
    myListedProduce: "Your Listed Produce",
    records: "records",
    noProduceYet: "No produce listed yet",
    addFirstProduce: "Add a new crop listing or load sample demo data.",
    loadDemoDataBtn: "Load Demo Data",
    cropCol: "Crop",
    qtyCol: "Quantity",
    priceCol: "Price/Q",
    gradeCol: "AI Grade",
    statusCol: "Status",
    actionCol: "Action",
    viewOrders: "View Orders",
    village: "Village",
    state: "State",
    hub: "Hub",
    clusterLabel: "Cluster",
    aiCertified: "AI Certified",
    verified: "Verified",
    defect: "Defect",
    photoUrl: "Photo URL",
    
    // Modal: List Produce
    modalTitle: "List Produce for Sale",
    selectCrop: "Crop",
    qtyInQuintals: "Quantity (Quintals)",
    pricePerQuintal: "Price per Quintal (₹)",
    qualityCheck: "Quality Check",
    scanWithAiCamera: "Scan with AI Camera",
    saveListingBtn: "Save Listing",
    savingToDb: "Saving...",
    
    // Price Discovery
    priceDiscoveryTitle: "Price Discovery & Net Profit",
    priceDiscoveryDesc: "Compares gross rates against transport, tolls, and cess to show actual cash in-hand.",
    netFormula: "Net = (Rate × Q) - (Freight + Tolls + Wastage + Cess)",
    sharedTransportToggle: "Shared (40% Off)",
    soloHireToggle: "Solo Hire",
    marketCol: "Market / Buyer",
    distanceCol: "Distance",
    grossRateCol: "Gross Rate",
    freightCol: "Freight",
    tollsCessCol: "Tolls & Cess",
    netInHandCol: "Net In-Hand",
    sellHere: "Sell Here",
    bestProfit: "Best Profit",
    perQuintalUnit: "/Q",
    
    // Shared Transport
    sharedTransportHeading: "Village Shared Transport",
    vehicleLabel: "Vehicle",
    driverLabel: "Driver",
    truckCapacity: "Truck Capacity",
    spaceLeft: "Space left",
    destination: "Destination",
    farmersInTruck: "Farmers in this Vehicle:",
    farmerName: "Farmer",
    cropLabel: "Crop",
    loadLabel: "Load",
    dispatchBtn: "Dispatch Truck to Market",
    joinTruckTitle: "Join This Shared Truck",
    joinTruckDesc: "Save up to 40% on solo vehicle rent.",
    bookSlotBtn: "Book Truck Slot",
    booking: "Booking...",
    yourName: "Your Name",
    namePlaceholder: "e.g. Sukhwinder Singh",
    villagePlaceholder: "e.g. Kakra",
    
    // Orders & Payments
    ordersHeading: "Orders & Smart Escrow Payments",
    ordersDesc: "Buyer deposits funds into escrow; payout released upon delivery confirmation.",
    activeOrders: "Active Orders",
    noOrders: "No active orders found. List produce or initiate a deal in Price Discovery.",
    netFarmerPayout: "Net Farmer Payout",
    step1: "1. Funds In Escrow",
    step2: "2. In Transit",
    step3: "3. Delivered",
    step4: "4. DBT Released",
    markInTransit: "Mark In-Transit",
    confirmDelivery: "Confirm Delivery Sign-Off",
    releaseDbtBtn: "Release Instant DBT Payout",
    paymentReleased: "Payment Released to Farmer Bank Account",
    utrLabel: "UTR Reference",
    bankAccount: "Bank Account",
    
    // Live Agmarknet Mandi Rates & Comparison
    mandiRates: "Mandi Rates",
    agmarknetTitle: "Live Agmarknet Mandi Rates & Comparison",
    agmarknetSubtitle: "Official real-time wholesale rates across APMC mandis vs Direct Institutional Buyers.",
    agmarknetSyncBadge: "Govt of India Agmarknet Sync • Live Feed",
    refreshRates: "Refresh Live Feed",
    selectCommodity: "Select Commodity",
    govtMspLabel: "Govt MSP Floor",
    govtMspDesc: "Guaranteed minimum price floor",
    nationalAvgLabel: "Agmarknet National Avg",
    nationalAvgDesc: "All-India reporting modal price",
    highestMandiLabel: "Highest Mandi Today",
    arbitrageLabel: "Price Spread / Arbitrage",
    arbitrageDesc: "Extra cash per Quintal by choosing the optimal market",
    compareChartTitle: "Today's Mandi Rate Comparison (₹/Quintal)",
    allMandis: "All Mandis",
    apmcOnly: "APMC Mandis Only",
    directOnly: "Direct Buyers Only",
    allStates: "All States",
    punjab: "Punjab",
    haryana: "Haryana",
    delhi: "Delhi NCR",
    searchMandi: "Search mandi name, state...",
    mandiCol: "Mandi / Market Hub",
    typeCol: "Market Type",
    rateCol: "Today's Modal Rate",
    rangeCol: "Min - Max Range",
    vsMspCol: "vs Govt MSP",
    vsAvgCol: "vs National Avg",
    arrivalsCol: "Daily Arrivals",
    distanceCessCol: "Distance & Cess",
    aboveMsp: "above MSP",
    belowMsp: "below MSP",
    calcNetProfitBtn: "Calculate Net Profit",
    multiCropTitle: "National Agmarknet Matrix (All 7 Crops)",
    multiCropDesc: "Compare MSP, current modal price, and top market across all commodities today.",
    cropHeader: "Crop",
    mspHeader: "Govt MSP",
    currentModalHeader: "Current Modal Rate",
    trendHeader: "Trend",
    topMarketHeader: "Top Paying Market",
    highDemand: "High Demand",
    stableDemand: "Stable",
    compareAllRatesBtn: "Compare All Mandis",
    liveMandiRatesCard: "Live Agmarknet Mandi Rates",
    seeComparisonBanner: "Official Agmarknet benchmark: Compare 9 mandis before deductions →",
    compareRatesLink: "Compare Live Mandi Rates →",
    
    // Live Ticker
    liveAgmarknet: "LIVE AGMARKNET",
    liveBadge: "LIVE",
    refreshPrices: "Refresh prices",
    
    // Voice Assistant
    voiceTitle: "Voice Assistant",
    voiceSubtitle: "Speak or type in your regional language",
    voiceLang: "Language",
    micListening: "Listening... click to stop",
    micClick: "Click mic and speak",
    goToSection: "Go to Section",
    voicePlaceholder: "Or type a question...",
    sampleQueriesLabel: "Sample Queries:",
    prompt1: "Wheat rate today",
    prompt2: "Find shared truck in village",
    prompt3: "Where to get highest profit?",
    
    // Scanner
    scannerTitle: "AI Crop Quality Scanner",
    scannerSubtitle: "Computer Vision & Defect Detection Simulation",
    selectSample: "Select Sample Crop",
    runScan: "Run AI Scan",
    applyGrade: "Apply Certified Grade to Listing",
    confidenceLabel: "Confidence",
    defectRateLabel: "Defect Rate",
    
    // Footer
    footerText: "AgriLink • SIH 2026 Prototype"
  },
  
  hi: {
    appTitle: "एग्रीलिंक",
    appSubtitle: "किसान और मंडी संपर्क पोर्टल",
    language: "भाषा",
    
    // Auth / Login
    loginTitle: "एग्रीलिंक में लॉगिन करें",
    loginSubtitle: "किसान और सीधा मंडी संपर्क पोर्टल",
    mobileNumber: "मोबाइल नंबर / यूजर आईडी",
    mobilePlaceholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    signIn: "साइन इन करें",
    signingIn: "लॉगिन हो रहा है...",
    logout: "लॉगआउट",
    
    // Navigation
    home: "होम",
    rates: "मंडी भाव",
    pricing: "भाव और मुनाफा",
    transport: "साझा वाहन",
    orders: "ऑर्डर और भुगतान",
    voice: "आवाज़",
    
    // Home / Farmer Dashboard
    welcome: "स्वागत है",
    farmerDashboard: "किसान डैशबोर्ड",
    checkPrices: "मंडी भाव देखें",
    listProduce: "फसल बेचें",
    activeListings: "सक्रिय फसलें",
    total: "कुल",
    quintals: "क्विंटल",
    optimalMandi: "आज की सबसे लाभदायक मंडी",
    directVerified: "सीधा एस्क्रो द्वारा सत्यापित",
    sharedTransportTitle: "साझा परिवहन",
    savedFreight: "साझा वाहन से बचत",
    myListedProduce: "आपकी दर्ज की गई फसलें",
    records: "फसलें",
    noProduceYet: "अभी तक कोई फसल दर्ज नहीं की गई है",
    addFirstProduce: "नया फसल विवरण जोड़ें या नमूना डेमो डेटा लोड करें।",
    loadDemoDataBtn: "डेमो डेटा लोड करें",
    cropCol: "फसल",
    qtyCol: "मात्रा",
    priceCol: "भाव/क्विंटल",
    gradeCol: "एआई ग्रेड",
    statusCol: "स्थिति",
    actionCol: "कार्रवाई",
    viewOrders: "ऑर्डर देखें",
    village: "गांव",
    state: "राज्य",
    hub: "केंद्र",
    clusterLabel: "क्लस्टर",
    aiCertified: "एआई प्रमाणित",
    verified: "सत्यापित",
    defect: "दोष",
    photoUrl: "फोटो लिंक",
    
    // Modal: List Produce
    modalTitle: "फसल बिक्री के लिए दर्ज करें",
    selectCrop: "फसल चुनें",
    qtyInQuintals: "मात्रा (क्विंटल)",
    pricePerQuintal: "अपेक्षित भाव प्रति क्विंटल (₹)",
    qualityCheck: "गुणवत्ता जांच",
    scanWithAiCamera: "एआई कैमरा से स्कैन करें",
    saveListingBtn: "फसल सहेजें",
    savingToDb: "सहेजा जा रहा है...",
    
    // Price Discovery
    priceDiscoveryTitle: "मंडी भाव और शुद्ध मुनाफा",
    priceDiscoveryDesc: "किराया, टोल और टैक्स घटाकर हाथ में आने वाले वास्तविक पैसे दिखाता है।",
    netFormula: "शुद्ध मुनाफा = (भाव × मात्रा) - (किराया + टोल + नुकसान + उपकर)",
    sharedTransportToggle: "साझा वाहन (40% बचत)",
    soloHireToggle: "अकेला वाहन",
    marketCol: "मंडी / खरीदार",
    distanceCol: "दूरी",
    grossRateCol: "मंडी भाव",
    freightCol: "किराया",
    tollsCessCol: "टोल व टैक्स",
    netInHandCol: "हाथ में शुद्ध पैसे",
    sellHere: "यहां बेचें",
    bestProfit: "सर्वोत्तम मुनाफा",
    perQuintalUnit: "/क्विंटल",
    
    // Shared Transport
    sharedTransportHeading: "गांव का साझा परिवहन",
    vehicleLabel: "गाड़ी",
    driverLabel: "चालक",
    truckCapacity: "गाड़ी की क्षमता",
    spaceLeft: "खाली जगह",
    destination: "गंतव्य",
    farmersInTruck: "इस गाड़ी में जुड़े किसान:",
    farmerName: "किसान",
    cropLabel: "फसल",
    loadLabel: "बोझ",
    dispatchBtn: "गाड़ी को मंडी के लिए रवाना करें",
    joinTruckTitle: "इस साझा गाड़ी से जुड़ें",
    joinTruckDesc: "अकेली गाड़ी के किराए पर 40% तक की बचत करें।",
    bookSlotBtn: "गाड़ी में जगह बुक करें",
    booking: "बुकिंग हो रही है...",
    yourName: "आपका नाम",
    namePlaceholder: "उदा. सुखविंदर सिंह",
    villagePlaceholder: "उदा. काकरा",
    
    // Orders & Payments
    ordersHeading: "ऑर्डर और सुरक्षित एस्क्रो भुगतान",
    ordersDesc: "खरीदार का पैसा एस्क्रो में जमा रहता है; फसल पहुंचने पर तुरंत भुगतान मिलता है।",
    activeOrders: "सक्रिय ऑर्डर",
    noOrders: "कोई सक्रिय ऑर्डर नहीं मिला। फसल दर्ज करें या भाव खोज में सौदा शुरू करें।",
    netFarmerPayout: "किसान का शुद्ध भुगतान",
    step1: "1. पैसा एस्क्रो में सुरक्षित",
    step2: "2. रास्ते में",
    step3: "3. पहुंच गई",
    step4: "4. डीबीटी भुगतान जारी",
    markInTransit: "रास्ते में चिह्नित करें",
    confirmDelivery: "डिलीवरी की पुष्टि करें",
    releaseDbtBtn: "किसान के खाते में तुरंत DBT भेजें",
    paymentReleased: "किसान के बैंक खाते में पैसे जमा हो गए हैं",
    utrLabel: "बैंक संदर्भ संख्या (UTR)",
    bankAccount: "बैंक खाता",
    
    // Live Agmarknet Mandi Rates & Comparison
    mandiRates: "मंडी भाव",
    agmarknetTitle: "लाइव एगमार्कनेट मंडी भाव और तुलना",
    agmarknetSubtitle: "सरकारी एपीएमसी मंडियों और संस्थागत प्रत्यक्ष खरीदारों के दैनिक थोक भाव की तुलना।",
    agmarknetSyncBadge: "भारत सरकार एगमार्कनेट सिंक • लाइव फीड",
    refreshRates: "ताज़ा भाव लोड करें",
    selectCommodity: "फसल चुनें",
    govtMspLabel: "सरकारी एमएसपी (MSP)",
    govtMspDesc: "न्यूनतम समर्थन मूल्य (CACP मानक)",
    nationalAvgLabel: "राष्ट्रीय औसत भाव",
    nationalAvgDesc: "अखिल भारतीय मंडियों का औसत मॉडल भाव",
    highestMandiLabel: "आज का सर्वोच्च मंडी भाव",
    arbitrageLabel: "भाव में अंतर / मुनाफा",
    arbitrageDesc: "सही मंडी चुनकर प्रति क्विंटल अतिरिक्त लाभ",
    compareChartTitle: "आज के मंडी भावों की तुलना (₹/क्विंटल)",
    allMandis: "सभी मंडियां",
    apmcOnly: "केवल एपीएमसी मंडियां",
    directOnly: "केवल प्रत्यक्ष खरीदार",
    allStates: "सभी राज्य",
    punjab: "पंजाब",
    haryana: "हरियाणा",
    delhi: "दिल्ली एनसीआर",
    searchMandi: "मंडी या राज्य खोजें...",
    mandiCol: "मंडी / खरीद केंद्र",
    typeCol: "मंडी प्रकार",
    rateCol: "आज का मॉडल भाव",
    rangeCol: "न्यूनतम - अधिकतम",
    vsMspCol: "एमएसपी से अंतर",
    vsAvgCol: "राष्ट्रीय औसत से अंतर",
    arrivalsCol: "दैनिक आवक",
    distanceCessCol: "दूरी और टैक्स",
    aboveMsp: "एमएसपी से अधिक",
    belowMsp: "एमएसपी से कम",
    calcNetProfitBtn: "शुद्ध मुनाफा देखें",
    multiCropTitle: "राष्ट्रीय एगमार्कनेट तालिका (सभी 7 फसलें)",
    multiCropDesc: "सभी फसलों के सरकारी समर्थन मूल्य और आज के मंडी भाव की एक नज़र में तुलना।",
    cropHeader: "फसल",
    mspHeader: "सरकारी एमएसपी",
    currentModalHeader: "आज का मॉडल भाव",
    trendHeader: "रुझान",
    topMarketHeader: "सर्वोच्च भाव वाली मंडी",
    highDemand: "उच्च मांग",
    stableDemand: "स्थिर",
    compareAllRatesBtn: "सभी मंडियों के भाव देखें",
    liveMandiRatesCard: "लाइव एगमार्कनेट मंडी भाव",
    seeComparisonBanner: "किराया व टैक्स घटाने से पहले 9 मंडियों के सीधे सरकारी एगमार्कनेट भाव की तुलना करें →",
    compareRatesLink: "मंडी भावों की तुलना करें →",
    
    // Live Ticker
    liveAgmarknet: "लाइव एगमार्कनेट",
    liveBadge: "लाइव",
    refreshPrices: "भाव रीफ्रेश करें",
    
    // Voice Assistant
    voiceTitle: "आवाज़ सहायक",
    voiceSubtitle: "अपनी मातृभाषा में बोलें या सवाल लिखें",
    voiceLang: "भाषा",
    micListening: "सुन रहा है... रोकने के लिए दबाएं",
    micClick: "माइक दबाएं और बोलें",
    goToSection: "इस भाग पर जाएं",
    voicePlaceholder: "या सवाल लिखें...",
    sampleQueriesLabel: "नमूना प्रश्न:",
    prompt1: "आज गेहूं का भाव क्या है?",
    prompt2: "गांव में साझा गाड़ी ढूंढें",
    prompt3: "सबसे ज्यादा मुनाफा कहां मिलेगा?",
    
    // Scanner
    scannerTitle: "एआई फसल गुणवत्ता स्कैनर",
    scannerSubtitle: "कंप्यूटर विजन और दोष पहचान प्रणाली",
    selectSample: "नमूना फसल चुनें",
    runScan: "एआई जांच चलाएं",
    applyGrade: "प्रमाणित ग्रेड फसल में लगाएं",
    confidenceLabel: "सटीकता",
    defectRateLabel: "दोष दर",
    
    // Footer
    footerText: "एग्रीलिंक • एसआईएच 2026 प्रोटोटाइप"
  },
  
  pa: {
    appTitle: "ਐਗਰੀਲਿੰਕ",
    appSubtitle: "ਕਿਸਾਨ ਅਤੇ ਮੰਡੀ ਸੰਪਰਕ ਪੋਰਟਲ",
    language: "ਭਾਸ਼ਾ",
    
    // Auth / Login
    loginTitle: "ਐਗਰੀਲਿੰਕ ਵਿੱਚ ਲਾਗਇਨ ਕਰੋ",
    loginSubtitle: "ਕਿਸਾਨ ਅਤੇ ਸਿੱਧਾ ਮੰਡੀ ਸੰਪਰਕ ਪੋਰਟਲ",
    mobileNumber: "ਮੋਬਾਈਲ ਨੰਬਰ / ਯੂਜ਼ਰ ਆਈਡੀ",
    mobilePlaceholder: "10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    password: "ਪਾਸਵਰਡ",
    passwordPlaceholder: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ",
    rememberMe: "ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ",
    forgotPassword: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    signIn: "ਸਾਈਨ ਇਨ ਕਰੋ",
    signingIn: "ਲਾਗਇਨ ਹੋ ਰਿਹਾ ਹੈ...",
    logout: "ਲਾਗਆਉਟ",
    
    // Navigation
    home: "ਮੁੱਖ ਪੰਨਾ",
    rates: "ਮੰਡੀ ਭਾਵ",
    pricing: "ਭਾਅ ਅਤੇ ਮੁਨਾਫਾ",
    transport: "ਸਾਂਝੀ ਗੱਡੀ",
    orders: "ਆਰਡਰ ਅਤੇ ਭੁਗਤਾਨ",
    voice: "ਆਵਾਜ਼",
    
    // Home / Farmer Dashboard
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    farmerDashboard: "ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ",
    checkPrices: "ਮੰਡੀ ਭਾਅ ਦੇਖੋ",
    listProduce: "ਫਸਲ ਵੇਚੋ",
    activeListings: "ਦਰਜ ਫਸਲਾਂ",
    total: "ਕੁੱਲ",
    quintals: "ਕੁਇੰਟਲ",
    optimalMandi: "ਅੱਜ ਦੀ ਸਭ ਤੋਂ ਵੱਧ ਮੁਨਾਫੇ ਵਾਲੀ ਮੰਡੀ",
    directVerified: "ਸਿੱਧਾ ਐਸਕਰੋ ਦੁਆਰਾ ਤਸਦੀਕਸ਼ੁਦਾ",
    sharedTransportTitle: "ਸਾਂਝੀ ਢੋਆ-ਢੁਆਈ",
    savedFreight: "ਸਾਂਝੀ ਗੱਡੀ ਨਾਲ ਬੱਚਤ",
    myListedProduce: "ਤੁਹਾਡੀ ਦਰਜ ਕੀਤੀ ਫਸਲ",
    records: "ਫਸਲਾਂ",
    noProduceYet: "ਅਜੇ ਤੱਕ ਕੋਈ ਫਸਲ ਦਰਜ ਨਹੀਂ ਕੀਤੀ ਗਈ",
    addFirstProduce: "ਨਵੀਂ ਫਸਲ ਦਰਜ ਕਰੋ ਜਾਂ ਡੈਮੋ ਡੇਟਾ ਲੋਡ ਕਰੋ।",
    loadDemoDataBtn: "ਡੈਮੋ ਡੇਟਾ ਲੋਡ ਕਰੋ",
    cropCol: "ਫਸਲ",
    qtyCol: "ਮਾਤਰਾ",
    priceCol: "ਭਾਅ/ਕੁਇੰਟਲ",
    gradeCol: "ਏਆਈ ਗ੍ਰੇਡ",
    statusCol: "ਸਥਿਤੀ",
    actionCol: "ਕਾਰਵਾਈ",
    viewOrders: "ਆਰਡਰ ਦੇਖੋ",
    village: "ਪਿੰਡ",
    state: "ਰਾਜ",
    hub: "ਕੇਂਦਰ",
    clusterLabel: "ਕਲੱਸਟਰ",
    aiCertified: "ਏਆਈ ਪ੍ਰਮਾਣਿਤ",
    verified: "ਪ੍ਰਮਾਣਿਤ",
    defect: "ਖਾਮੀ",
    photoUrl: "ਫੋਟੋ ਲਿੰਕ",
    
    // Modal: List Produce
    modalTitle: "ਫਸਲ ਵਿਕਰੀ ਲਈ ਦਰਜ ਕਰੋ",
    selectCrop: "ਫਸਲ ਚੁਣੋ",
    qtyInQuintals: "ਮਾਤਰਾ (ਕੁਇੰਟਲ)",
    pricePerQuintal: "ਮੰਗਿਆ ਭਾਅ ਪ੍ਰਤੀ ਕੁਇੰਟਲ (₹)",
    qualityCheck: "ਗੁਣਵੱਤਾ ਦੀ ਜਾਂਚ",
    scanWithAiCamera: "ਏਆਈ ਕੈਮਰੇ ਨਾਲ ਸਕੈਨ ਕਰੋ",
    saveListingBtn: "ਫਸਲ ਸੇਵ ਕਰੋ",
    savingToDb: "ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ...",
    
    // Price Discovery
    priceDiscoveryTitle: "ਮੰਡੀ ਭਾਅ ਅਤੇ ਅਸਲ ਮੁਨਾਫਾ",
    priceDiscoveryDesc: "ਕਿਰਾਇਆ, ਟੋਲ ਅਤੇ ਖਰਚੇ ਕੱਟ ਕੇ ਹੱਥ ਵਿੱਚ ਆਉਣ ਵਾਲਾ ਅਸਲ ਪੈਸਾ ਦਿਖਾਉਂਦਾ ਹੈ।",
    netFormula: "ਅਸਲ ਮੁਨਾਫਾ = (ਭਾਅ × ਕੁਇੰਟਲ) - (ਕਿਰਾਇਆ + ਟੋਲ + ਖਰਾਬੀ + ਟੈਕਸ)",
    sharedTransportToggle: "ਸਾਂਝੀ ਗੱਡੀ (40% ਬੱਚਤ)",
    soloHireToggle: "ਇਕੱਲੀ ਗੱਡੀ",
    marketCol: "ਮੰਡੀ / ਖਰੀਦਦਾਰ",
    distanceCol: "ਦੂਰੀ",
    grossRateCol: "ਮੰਡੀ ਭਾਅ",
    freightCol: "ਕਿਰਾਇਆ",
    tollsCessCol: "ਟੋਲ ਤੇ ਖਰਚੇ",
    netInHandCol: "ਹੱਥ ਵਿੱਚ ਸ਼ੁੱਧ ਪੈਸਾ",
    sellHere: "ਇੱਥੇ ਵੇਚੋ",
    bestProfit: "ਸਭ ਤੋਂ ਵੱਧ ਮੁਨਾਫਾ",
    perQuintalUnit: "/ਕੁਇੰਟਲ",
    
    // Shared Transport
    sharedTransportHeading: "ਪਿੰਡ ਦੀ ਸਾਂਝੀ ਗੱਡੀ",
    vehicleLabel: "ਗੱਡੀ",
    driverLabel: "ਡਰਾਈਵਰ",
    truckCapacity: "ਗੱਡੀ ਦੀ ਸਮਰੱਥਾ",
    spaceLeft: "ਬਾਕੀ ਥਾਂ",
    destination: "ਮੰਜ਼ਿਲ",
    farmersInTruck: "ਇਸ ਗੱਡੀ ਵਿੱਚ ਜੁੜੇ ਕਿਸਾਨ:",
    farmerName: "ਕਿਸਾਨ",
    cropLabel: "ਫਸਲ",
    loadLabel: "ਭਾਰ",
    dispatchBtn: "ਗੱਡੀ ਮੰਡੀ ਲਈ ਰਵਾਨਾ ਕਰੋ",
    joinTruckTitle: "ਇਸ ਸਾਂਝੀ ਗੱਡੀ ਨਾਲ ਜੁੜੋ",
    joinTruckDesc: "ਇਕੱਲੀ ਗੱਡੀ ਦੇ ਕਿਰਾਏ 'ਤੇ 40% ਤੱਕ ਬਚਾਓ।",
    bookSlotBtn: "ਗੱਡੀ ਵਿੱਚ ਥਾਂ ਬੁੱਕ ਕਰੋ",
    booking: "ਬੁੱਕ ਹੋ ਰਿਹਾ ਹੈ...",
    yourName: "ਤੁਹਾਡਾ ਨਾਮ",
    namePlaceholder: "ਜਿਵੇਂ ਸੁਖਵਿੰਦਰ ਸਿੰਘ",
    villagePlaceholder: "ਜਿਵੇਂ ਕਾਕੜਾ",
    
    // Orders & Payments
    ordersHeading: "ਆਰਡਰ ਅਤੇ ਸੁਰੱਖਿਅਤ ਐਸਕਰੋ ਭੁਗਤਾਨ",
    ordersDesc: "ਖਰੀਦਦਾਰ ਦੇ ਪੈਸੇ ਐਸਕਰੋ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੁੰਦੇ ਹਨ; ਫਸਲ ਪਹੁੰਚਣ 'ਤੇ ਤੁਰੰਤ ਖਾਤੇ ਵਿੱਚ ਭੇਜੇ ਜਾਂਦੇ ਹਨ।",
    activeOrders: "ਸਰਗਰਮ ਆਰਡਰ",
    noOrders: "ਕੋਈ ਸਰਗਰਮ ਆਰਡਰ ਨਹੀਂ ਮਿਲਿਆ। ਫਸਲ ਦਰਜ ਕਰੋ ਜਾਂ ਭਾਅ ਖੋਜ ਵਿੱਚ ਸੌਦਾ ਸ਼ੁਰੂ ਕਰੋ।",
    netFarmerPayout: "ਕਿਸਾਨ ਦਾ ਸ਼ੁੱਧ ਭੁਗਤਾਨ",
    step1: "1. ਪੈਸਾ ਐਸਕਰੋ ਵਿੱਚ ਸੁਰੱਖਿਅਤ",
    step2: "2. ਰਸਤੇ ਵਿੱਚ",
    step3: "3. ਡਿਲੀਵਰ ਹੋ ਗਿਆ",
    step4: "4. ਡੀਬੀਟੀ ਜਾਰੀ",
    markInTransit: "ਰਸਤੇ ਵਿੱਚ ਮਾਰਕ ਕਰੋ",
    confirmDelivery: "ਡਿਲੀਵਰੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    releaseDbtBtn: "ਕਿਸਾਨ ਦੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਤੁਰੰਤ DBT ਪੈਸੇ ਭੇਜੋ",
    paymentReleased: "ਕਿਸਾਨ ਦੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਜਮ੍ਹਾਂ ਹੋ ਗਏ ਹਨ",
    utrLabel: "ਬੈਂਕ ਸੰਦਰਭ ਨੰਬਰ (UTR)",
    bankAccount: "ਬੈਂਕ ਖਾਤਾ",
    
    // Live Agmarknet Mandi Rates & Comparison
    mandiRates: "ਮੰਡੀ ਭਾਵ",
    agmarknetTitle: "ਲਾਈਵ ਐਗਮਾਰਕਨੈੱਟ ਮੰਡੀ ਭਾਵ ਅਤੇ ਤੁਲਨਾ",
    agmarknetSubtitle: "ਸਰਕਾਰੀ ਏਪੀਐਮਸੀ ਮੰਡੀਆਂ ਅਤੇ ਸਿੱਧੇ ਸੰਸਥਾਗਤ ਖਰੀਦਦਾਰਾਂ ਦੇ ਰੋਜ਼ਾਨਾ ਥੋਕ ਭਾਵਾਂ ਦੀ ਤੁਲਨਾ।",
    agmarknetSyncBadge: "ਭਾਰਤ ਸਰਕਾਰ ਐਗਮਾਰਕਨੈੱਟ ਸਿੰਕ • ਲਾਈਵ ਫੀਡ",
    refreshRates: "ਤਾਜ਼ਾ ਭਾਵ ਲੋਡ ਕਰੋ",
    selectCommodity: "ਫਸਲ ਚੁਣੋ",
    govtMspLabel: "ਸਰਕਾਰੀ ਐਮਐਸਪੀ (MSP)",
    govtMspDesc: "ਘੱਟੋ-ਘੱਟ ਸਮਰਥਨ ਮੁੱਲ (CACP ਮਿਆਰ)",
    nationalAvgLabel: "ਰਾਸ਼ਟਰੀ ਔਸਤ ਭਾਵ",
    nationalAvgDesc: "ਸਾਰੇ ਭਾਰਤ ਦੀਆਂ ਮੰਡੀਆਂ ਦਾ ਔਸਤ ਮਾਡਲ ਭਾਵ",
    highestMandiLabel: "ਅੱਜ ਦਾ ਸਭ ਤੋਂ ਵੱਧ ਮੰਡੀ ਭਾਵ",
    arbitrageLabel: "ਭਾਵ ਵਿੱਚ ਫਰਕ / ਮੁਨਾਫਾ",
    arbitrageDesc: "ਸਹੀ ਮੰਡੀ ਚੁਣ ਕੇ ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਵਾਧੂ ਮੁਨਾਫਾ",
    compareChartTitle: "ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਵਾਂ ਦੀ ਤੁਲਨਾ (₹/ਕੁਇੰਟਲ)",
    allMandis: "ਸਾਰੀਆਂ ਮੰਡੀਆਂ",
    apmcOnly: "ਸਿਰਫ਼ ਏਪੀਐਮਸੀ ਮੰਡੀਆਂ",
    directOnly: "ਸਿਰਫ਼ ਸਿੱਧੇ ਖਰੀਦਦਾਰ",
    allStates: "ਸਾਰੇ ਰਾਜ",
    punjab: "ਪੰਜਾਬ",
    haryana: "ਹਰਿਆਣਾ",
    delhi: "ਦਿੱਲੀ ਐਨਸੀਆਰ",
    searchMandi: "ਮੰਡੀ ਜਾਂ ਰਾਜ ਖੋਜੋ...",
    mandiCol: "ਮੰਡੀ / ਖਰੀਦ ਕੇਂਦਰ",
    typeCol: "ਮੰਡੀ ਦੀ ਕਿਸਮ",
    rateCol: "ਅੱਜ ਦਾ ਮਾਡਲ ਭਾਵ",
    rangeCol: "ਘੱਟੋ-ਘੱਟ - ਵੱਧ ਤੋਂ ਵੱਧ",
    vsMspCol: "ਐਮਐਸਪੀ ਨਾਲੋਂ ਫਰਕ",
    vsAvgCol: "ਰਾਸ਼ਟਰੀ ਔਸਤ ਨਾਲੋਂ ਫਰਕ",
    arrivalsCol: "ਰੋਜ਼ਾਨਾ ਆਮਦ",
    distanceCessCol: "ਦੂਰੀ ਅਤੇ ਟੈਕਸ",
    aboveMsp: "ਐਮਐਸਪੀ ਤੋਂ ਵੱਧ",
    belowMsp: "ਐਮਐਸਪੀ ਤੋਂ ਘੱਟ",
    calcNetProfitBtn: "ਸ਼ੁੱਧ ਮੁਨਾਫਾ ਦੇਖੋ",
    multiCropTitle: "ਰਾਸ਼ਟਰੀ ਐਗਮਾਰਕਨੈੱਟ ਸਾਰਣੀ (ਸਾਰੀਆਂ 7 ਫਸਲਾਂ)",
    multiCropDesc: "ਸਾਰੀਆਂ ਫਸਲਾਂ ਦੇ ਸਰਕਾਰੀ ਸਮਰਥਨ ਮੁੱਲ ਅਤੇ ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਵਾਂ ਦੀ ਇੱਕੋ ਨਜ਼ਰ ਵਿੱਚ ਤੁਲਨਾ।",
    cropHeader: "ਫਸਲ",
    mspHeader: "ਸਰਕਾਰੀ ਐਮਐਸਪੀ",
    currentModalHeader: "ਅੱਜ ਦਾ ਮਾਡਲ ਭਾਵ",
    trendHeader: "ਰੁਝਾਨ",
    topMarketHeader: "ਸਭ ਤੋਂ ਵੱਧ ਭਾਵ ਦੇਣ ਵਾਲੀ ਮੰਡੀ",
    highDemand: "ਉੱਚ ਮੰਗ",
    stableDemand: "ਸਥਿਰ",
    compareAllRatesBtn: "ਸਾਰੀਆਂ ਮੰਡੀਆਂ ਦੇ ਭਾਵ ਦੇਖੋ",
    liveMandiRatesCard: "ਲਾਈਵ ਐਗਮਾਰਕਨੈੱਟ ਮੰਡੀ ਭਾਵ",
    seeComparisonBanner: "ਕਿਰਾਇਆ ਅਤੇ ਟੈਕਸ ਕੱਟਣ ਤੋਂ ਪਹਿਲਾਂ 9 ਮੰਡੀਆਂ ਦੇ ਸਿੱਧੇ ਸਰਕਾਰੀ ਐਗਮਾਰਕਨੈੱਟ ਭਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ →",
    compareRatesLink: "ਮੰਡੀ ਭਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ →",
    
    // Live Ticker
    liveAgmarknet: "ਲਾਈਵ ਐਗਮਾਰਕਨੈੱਟ",
    liveBadge: "ਲਾਈਵ",
    refreshPrices: "ਭਾਅ ਤਾਜ਼ਾ ਕਰੋ",
    
    // Voice Assistant
    voiceTitle: "ਆਵਾਜ਼ ਸਹਾਇਕ",
    voiceSubtitle: "ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ ਬੋਲੋ ਜਾਂ ਸਵਾਲ ਲਿਖੋ",
    voiceLang: "ਭਾਸ਼ਾ / ਬੋਲੀ",
    micListening: "ਸੁਣ ਰਿਹਾ ਹੈ... ਰੋਕਣ ਲਈ ਦਬਾਓ",
    micClick: "ਮਾਈਕ ਦਬਾਓ ਅਤੇ ਬੋਲੋ",
    goToSection: "ਇਸ ਭਾਗ 'ਤੇ ਜਾਓ",
    voicePlaceholder: "ਜਾਂ ਸਵਾਲ ਲਿਖੋ...",
    sampleQueriesLabel: "ਨਮੂਨਾ ਸਵਾਲ:",
    prompt1: "ਅੱਜ ਕਣਕ ਦਾ ਕੀ ਭਾਅ ਹੈ?",
    prompt2: "ਪਿੰਡ ਵਿੱਚ ਸਾਂਝੀ ਗੱਡੀ ਲੱਭੋ",
    prompt3: "ਸਭ ਤੋਂ ਵੱਧ ਮੁਨਾਫਾ ਕਿੱਥੇ ਮਿਲੇਗਾ?",
    
    // Scanner
    scannerTitle: "ਏਆਈ ਫਸਲ ਗੁਣਵੱਤਾ ਸਕੈਨਰ",
    scannerSubtitle: "ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਅਤੇ ਖਾਮੀ ਪਛਾਣ ਪ੍ਰਣਾਲੀ",
    selectSample: "ਨਮੂਨਾ ਫਸਲ ਚੁਣੋ",
    runScan: "ਏਆਈ ਜਾਂਚ ਚਲਾਓ",
    applyGrade: "ਪ੍ਰਮਾਣਿਤ ਗ੍ਰੇਡ ਫਸਲ ਵਿੱਚ ਲਗਾਓ",
    confidenceLabel: "ਭਰੋਸੇਯੋਗਤਾ",
    defectRateLabel: "ਖਾਮੀ ਦਰ",
    
    // Footer
    footerText: "ਐਗਰੀਲਿੰਕ • ਐਸਆਈਐਚ 2026 ਪ੍ਰੋਟੋਟਾਈਪ"
  }
};

// Helper to translate crop names
export function translateCrop(cropName, lang = 'en') {
  if (!cropName) return '';
  const text = String(cropName);

  if (lang === 'pa') {
    if (/wheat|gehu/i.test(text)) return 'ਕਣਕ (Wheat)';
    if (/onion|pyaz/i.test(text)) return 'ਲਾਲ ਪਿਆਜ਼ (Onion)';
    if (/tomato/i.test(text)) return 'ਹਾਈਬ੍ਰਿਡ ਟਮਾਟਰ (Tomato)';
    if (/paddy|rice/i.test(text)) return 'ਬਾਸਮਤੀ ਝੋਨਾ (Basmati Paddy)';
    if (/mustard|sarson/i.test(text)) return 'ਸਰ੍ਹੋਂ (Mustard)';
    if (/potato|aloo/i.test(text)) return 'ਆਲੂ (Potato)';
    if (/cotton|kapas/i.test(text)) return 'ਨਰਮਾ/ਕਪਾਹ (Cotton)';
  } else if (lang === 'hi') {
    if (/wheat|gehu/i.test(text)) return 'गेहूं (Wheat)';
    if (/onion|pyaz/i.test(text)) return 'लाल प्याज (Onion)';
    if (/tomato/i.test(text)) return 'हाइब्रिड टमाटर (Tomato)';
    if (/paddy|rice/i.test(text)) return 'बासमती धान (Basmati Paddy)';
    if (/mustard|sarson/i.test(text)) return 'सरसों (Mustard)';
    if (/potato|aloo/i.test(text)) return 'आलू (Potato)';
    if (/cotton|kapas/i.test(text)) return 'कपास (Cotton)';
  }

  return cropName;
}

// Helper to translate pipeline/listing status
export function translateStatus(status, lang = 'en') {
  if (!status) return '';
  const normalized = String(status).toUpperCase().replace(/\s+/g, '_');

  if (lang === 'pa') {
    switch (normalized) {
      case 'ACTIVE_MATCHING':
      case 'ACTIVE':
        return 'ਸਰਗਰਮ ਮੇਲ';
      case 'VAULT_LOCKED':
        return 'ਐਸਕਰੋ ਸੁਰੱਖਿਅਤ';
      case 'IN_TRANSIT':
        return 'ਰਸਤੇ ਵਿੱਚ';
      case 'DELIVERY_CONFIRMED':
        return 'ਡਿਲੀਵਰੀ ਤਸਦੀਕ';
      case 'INSTANT_DBT_RELEASED':
        return 'ਡੀਬੀਟੀ ਭੁਗਤਾਨ ਜਾਰੀ';
      case 'WAITING_FOR_FILL':
        return 'ਭਰਨ ਦੀ ਉਡੀਕ';
      case 'DISPATCHED':
        return 'ਰਵਾਨਾ';
      case 'CONFIRMED':
        return 'ਪੁਸ਼ਟੀ ਹੋਈ';
      default:
        return status.replace(/_/g, ' ');
    }
  } else if (lang === 'hi') {
    switch (normalized) {
      case 'ACTIVE_MATCHING':
      case 'ACTIVE':
        return 'सक्रिय मिलान';
      case 'VAULT_LOCKED':
        return 'एस्क्रो में सुरक्षित';
      case 'IN_TRANSIT':
        return 'रास्ते में';
      case 'DELIVERY_CONFIRMED':
        return 'डिलीवरी सत्यापित';
      case 'INSTANT_DBT_RELEASED':
        return 'डीबीटी भुगतान जारी';
      case 'WAITING_FOR_FILL':
        return 'भरने की प्रतीक्षा';
      case 'DISPATCHED':
        return 'रवाना';
      case 'CONFIRMED':
        return 'पुष्टि की गई';
      default:
        return status.replace(/_/g, ' ');
    }
  }

  return status.replace(/_/g, ' ');
}

// Helper to translate quality grade
export function translateGrade(grade, lang = 'en') {
  if (!grade) return '';
  const text = String(grade);

  if (lang === 'pa') {
    if (/Grade A/i.test(text)) return 'ਗ੍ਰੇਡ ਏ (FAQ ਮਿਆਰੀ)';
    if (/Grade B/i.test(text)) return 'ਗ੍ਰੇਡ ਬੀ (ਔਸਤ ਗੁਣਵੱਤਾ)';
    if (/Grade C/i.test(text)) return 'ਗ੍ਰੇਡ ਸੀ (ਸਬ-ਸਟੈਂਡਰਡ)';
  } else if (lang === 'hi') {
    if (/Grade A/i.test(text)) return 'ग्रेड ए (FAQ मानक)';
    if (/Grade B/i.test(text)) return 'ग्रेड बी (औसत गुणवत्ता)';
    if (/Grade C/i.test(text)) return 'ग्रेड सी (उप-मानक)';
  }

  return grade;
}

// Helper to translate mandi names
export function translateMandi(mandiName, lang = 'en') {
  if (!mandiName) return '';
  const text = String(mandiName);

  if (lang === 'pa') {
    if (/Azadpur/i.test(text)) return 'ਆਜ਼ਾਦਪੁਰ ਏਪੀਐਮਸੀ ਮੰਡੀ, ਦਿੱਲੀ';
    if (/Ghazipur/i.test(text)) return 'ਗਾਜ਼ੀਪੁਰ ਫਲ ਅਤੇ ਸਬਜ਼ੀ ਮੰਡੀ';
    if (/Khanna/i.test(text)) return 'ਖੰਨਾ ਦਾਣਾ ਮੰਡੀ (ਏਸ਼ੀਆ ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ)';
    if (/Sangrur/i.test(text)) return 'ਸੰਗਰੂਰ ਦਾਣਾ ਮੰਡੀ (APMC)';
    if (/Ludhiana/i.test(text)) return 'ਲੁਧਿਆਣਾ ਥੋਕ ਦਾਣਾ ਮੰਡੀ';
    if (/Karnal/i.test(text)) return 'ਕਰਨਾਲ ਦਾਣਾ ਮੰਡੀ (APMC)';
    if (/ITC/i.test(text)) return 'ਆਈਟੀਸੀ ਈ-ਚੌਪਾਲ ਸਿੱਧਾ ਕੇਂਦਰ';
    if (/Mother Dairy|Safal/i.test(text)) return 'ਮਦਰ ਡੇਅਰੀ ਸਫਲ ਖਰੀਦ ਕੇਂਦਰ';
    if (/Samriddhi|FPO/i.test(text)) return 'ਕਿਸਾਨ ਸਮ੍ਰਿਧੀ ਐਫਪੀਓ ਫੈਡਰੇਸ਼ਨ';
    if (/Reliance/i.test(text)) return 'ਰਿਲਾਇੰਸ ਫਰੈੱਸ਼ ਖਰੀਦ ਕੇਂਦਰ';
  } else if (lang === 'hi') {
    if (/Azadpur/i.test(text)) return 'आज़ादपुर एपीएमसी मंडी, दिल्ली';
    if (/Ghazipur/i.test(text)) return 'गाज़ीपुर फल एवं सब्ज़ी मंडी';
    if (/Khanna/i.test(text)) return 'खन्ना अनाज मंडी (एशिया की सबसे बड़ी)';
    if (/Sangrur/i.test(text)) return 'संगरूर अनाज मंडी (APMC)';
    if (/Ludhiana/i.test(text)) return 'लुधियाना थोक अनाज मंडी';
    if (/Karnal/i.test(text)) return 'करनाल अनाज मंडी (APMC)';
    if (/ITC/i.test(text)) return 'आईटीसी ई-चौपाल ग्रामीण केंद्र';
    if (/Mother Dairy|Safal/i.test(text)) return 'मदर डेयरी सफल खरीद केंद्र';
    if (/Samriddhi|FPO/i.test(text)) return 'किसान समृद्धि एफपीओ फेडरेशन';
    if (/Reliance/i.test(text)) return 'रिलायंस फ्रेश खरीद केंद्र';
  }

  return mandiName;
}

// Helper to translate market types
export function translateMarketType(type, lang = 'en') {
  if (!type) return '';
  const text = String(type);

  if (lang === 'pa') {
    if (/Terminal/i.test(text)) return 'ਟਰਮੀਨਲ ਏਪੀਐਮਸੀ';
    if (/Local/i.test(text)) return 'ਸਥਾਨਕ ਏਪੀਐਮਸੀ';
    if (/Regional/i.test(text)) return 'ਖੇਤਰੀ ਏਪੀਐਮਸੀ';
    if (/Institutional/i.test(text)) return 'ਸੰਸਥਾਗਤ ਸਿੱਧਾ ਖਰੀਦਦਾਰ';
    if (/FPO|Farmer Producer/i.test(text)) return 'ਕਿਸਾਨ ਉਤਪਾਦਕ ਸੰਗਠਨ (FPO)';
  } else if (lang === 'hi') {
    if (/Terminal/i.test(text)) return 'टर्मिनल एपीएमसी';
    if (/Local/i.test(text)) return 'स्थानीय एपीएमसी';
    if (/Regional/i.test(text)) return 'क्षेत्रीय एपीएमसी';
    if (/Institutional/i.test(text)) return 'संस्थागत प्रत्यक्ष खरीदार';
    if (/FPO|Farmer Producer/i.test(text)) return 'किसान उत्पादक संगठन (FPO)';
  }

  return type;
}

// Helper to translate person names (farmers, drivers)
export function translatePerson(name, lang = 'en') {
  if (!name) return '';
  const text = String(name).trim();

  if (lang === 'pa') {
    if (/Harpreet/i.test(text)) return 'ਹਰਪ੍ਰੀਤ ਸਿੰਘ';
    if (/Sukhwinder/i.test(text)) return 'ਸੁਖਵਿੰਦਰ ਸਿੰਘ';
    if (/Balwinder/i.test(text)) return 'ਬਲਵਿੰਦਰ ਸਿੰਘ';
    if (/Gurpreet/i.test(text)) return 'ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ';
    if (/Jagjit/i.test(text)) return 'ਜਗਜੀਤ ਸਿੰਘ';
    if (/Manpreet/i.test(text)) return 'ਮਨਪ੍ਰੀਤ ਸਿੰਘ';
    if (/Gurjant/i.test(text)) return 'ਗੁਰਜੰਤ ਸਿੰਘ';
    if (/Farmer/i.test(text)) return 'ਕਿਸਾਨ ਵੀਰ';
  } else if (lang === 'hi') {
    if (/Harpreet/i.test(text)) return 'हरप्रीत सिंह';
    if (/Sukhwinder/i.test(text)) return 'सुखविंदर सिंह';
    if (/Balwinder/i.test(text)) return 'बलविंदर सिंह';
    if (/Gurpreet/i.test(text)) return 'गुरप्रीत सिंह';
    if (/Jagjit/i.test(text)) return 'जगजीत सिंह';
    if (/Manpreet/i.test(text)) return 'मनप्रीत सिंह';
    if (/Gurjant/i.test(text)) return 'गुरजंत सिंह';
    if (/Farmer/i.test(text)) return 'किसान साथी';
  }

  return name;
}

// Helper to translate buyer names
export function translateBuyer(name, lang = 'en') {
  if (!name) return '';
  const text = String(name).trim();

  if (lang === 'pa') {
    if (/PUNGRAIN/i.test(text)) return 'ਪਨਗ੍ਰੇਨ ਸਰਕਾਰੀ ਖਰੀਦ (PUNGRAIN)';
    if (/ITC/i.test(text)) return 'ਆਈਟੀਸੀ ਲਿਮਟਿਡ (ITC Limited)';
    if (/Adani/i.test(text)) return 'ਅਡਾਨੀ ਐਗਰੀ ਲੌਜਿਸਟਿਕਸ';
    if (/Mother Dairy/i.test(text)) return 'ਮਦਰ ਡੇਅਰੀ ਫਰੂਟ ਐਂਡ ਵੈਜ';
    if (/BigBasket/i.test(text)) return 'ਬਿੱਗਬਾਸਕੇਟ ਹੋਲਸੇਲ';
    if (/Reliance/i.test(text)) return 'ਰਿਲਾਇੰਸ ਫਰੈੱਸ਼';
  } else if (lang === 'hi') {
    if (/PUNGRAIN/i.test(text)) return 'पनग्रेन सरकारी खरीद (PUNGRAIN)';
    if (/ITC/i.test(text)) return 'आईटीसी लिमिटेड (ITC Limited)';
    if (/Adani/i.test(text)) return 'अडानी एग्री लॉजिस्टिक्स';
    if (/Mother Dairy/i.test(text)) return 'मदर डेयरी फ्रूट एंड वेज';
    if (/BigBasket/i.test(text)) return 'बिगबास्केट होलसेल';
    if (/Reliance/i.test(text)) return 'रिलायंस फ्रेश';
  }

  return name;
}

// Helper to translate village/district/state locations
export function translateLocation(loc, lang = 'en') {
  if (!loc) return '';
  const text = String(loc).trim();

  if (lang === 'pa') {
    if (/Kakra/i.test(text)) return 'ਕਾਕੜਾ';
    if (/Sangrur/i.test(text)) return 'ਸੰਗਰੂਰ';
    if (/Bahadarpur/i.test(text)) return 'ਬਹਾਦਰਪੁਰ';
    if (/Malerkotla/i.test(text)) return 'ਮਲੇਰਕੋਟਲਾ';
    if (/Ludhiana/i.test(text)) return 'ਲੁਧਿਆਣਾ';
    if (/Bhatinda|Bathinda/i.test(text)) return 'ਬਠਿੰਡਾ';
    if (/Patiala/i.test(text)) return 'ਪਟਿਆਲਾ';
    if (/Punjab/i.test(text)) return 'ਪੰਜਾਬ';
    if (/Haryana/i.test(text)) return 'ਹਰਿਆਣਾ';
  } else if (lang === 'hi') {
    if (/Kakra/i.test(text)) return 'काकरा';
    if (/Sangrur/i.test(text)) return 'संगरूर';
    if (/Bahadarpur/i.test(text)) return 'बहादरपुर';
    if (/Malerkotla/i.test(text)) return 'मलेरकोटला';
    if (/Ludhiana/i.test(text)) return 'लुधियाना';
    if (/Bhatinda|Bathinda/i.test(text)) return 'बठिंडा';
    if (/Patiala/i.test(text)) return 'पटियाला';
    if (/Punjab/i.test(text)) return 'पंजाब';
    if (/Haryana/i.test(text)) return 'हरियाणा';
  }

  return loc;
}

// Helper to translate vehicle model
export function translateVehicle(model, lang = 'en') {
  if (!model) return '';
  const text = String(model).trim();

  if (lang === 'pa') {
    if (/Tata Ace/i.test(text)) return 'ਟਾਟਾ ਏਸ (ਛੋਟਾ ਹਾਥੀ)';
    if (/Bolero/i.test(text)) return 'ਮਹਿੰਦਰਾ ਬੋਲੇਰੋ ਮੈਕਸੀ ਟਰੱਕ';
    if (/Dost/i.test(text)) return 'ਅਸ਼ੋਕ ਲੇਲੈਂਡ ਦੋਸਤ';
  } else if (lang === 'hi') {
    if (/Tata Ace/i.test(text)) return 'टाटा ऐस (छोटा हाथी)';
    if (/Bolero/i.test(text)) return 'महिंद्रा बोलेरो मैक्सी ट्रक';
    if (/Dost/i.test(text)) return 'अशोक लेलैंड दोस्त';
  }

  return model;
}

// Helper to translate bank names
export function translateBank(bank, lang = 'en') {
  if (!bank) return '';
  const text = String(bank).trim();

  if (lang === 'pa') {
    if (/Punjab National Bank/i.test(text)) {
      return text.replace(/Punjab National Bank/i, 'ਪੰਜਾਬ ਨੈਸ਼ਨਲ ਬੈਂਕ');
    }
    if (/State Bank of India/i.test(text)) {
      return text.replace(/State Bank of India/i, 'ਸਟੇਟ ਬੈਂਕ ਆਫ਼ ਇੰਡੀਆ');
    }
    if (/HDFC/i.test(text)) {
      return text.replace(/HDFC Bank/i, 'ਐਚਡੀਐਫਸੀ ਬੈਂਕ');
    }
  } else if (lang === 'hi') {
    if (/Punjab National Bank/i.test(text)) {
      return text.replace(/Punjab National Bank/i, 'पंजाब नेशनल बैंक');
    }
    if (/State Bank of India/i.test(text)) {
      return text.replace(/State Bank of India/i, 'भारतीय स्टेट बैंक');
    }
    if (/HDFC/i.test(text)) {
      return text.replace(/HDFC Bank/i, 'एचडीएफसी बैंक');
    }
  }

  return bank;
}
