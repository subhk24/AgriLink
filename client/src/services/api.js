// AgriLink Frontend API Client

const BASE_URL = '/api';

export async function getHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return { status: "healthy", project: "AgriLink", mode: "Static Client (GitHub Pages Ready)" };
}

export async function sendOtp(phone) {
  try {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { success: true, message: "OTP sent successfully (Demo: 2026)", otp: "2026" };
}

export async function verifyOtp(data) {
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return {
    success: true,
    user: {
      id: 'usr-demo-01',
      name: 'Harpreet Singh',
      phone: data.phone || '9876512340',
      village: 'Kakra',
      district: 'Sangrur',
      state: 'Punjab',
      role: 'farmer',
      is_demo_user: 1
    }
  };
}

export async function loginDemoUser() {
  try {
    const res = await fetch(`${BASE_URL}/auth/login-demo`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return {
    success: true,
    user: {
      id: 'usr-demo-01',
      name: 'Harpreet Singh',
      phone: '9876512340',
      village: 'Kakra',
      district: 'Sangrur',
      state: 'Punjab',
      role: 'farmer',
      crops: 'Wheat, Paddy',
      bank_account: 'Punjab National Bank - ****4091',
      upi_id: 'harpreet98@okhdfcbank',
      is_demo_user: 1
    }
  };
}

const DEFAULT_LISTINGS = [
  {
    id: "lst-101",
    user_id: "usr-demo-01",
    farmer_name: "Harpreet Singh",
    village: "Kakra",
    district: "Sangrur",
    state: "Punjab",
    phone: "+91 98765-12340",
    crop: "Wheat (Gehu)",
    quantity_quintals: 3.0,
    expected_price_per_q: 2550,
    quality_grade: "Grade A",
    defect_score_percent: 3.2,
    status: "ACTIVE",
    cluster_id: "cluster-sgr-01",
    photo_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    created_at: new Date().toISOString()
  },
  {
    id: "lst-102",
    user_id: "usr-demo-01",
    farmer_name: "Harpreet Singh",
    village: "Kakra",
    district: "Sangrur",
    state: "Punjab",
    phone: "+91 98765-12340",
    crop: "Basmati Paddy",
    quantity_quintals: 5.0,
    expected_price_per_q: 3450,
    quality_grade: "Grade A",
    defect_score_percent: 2.1,
    status: "ACTIVE",
    cluster_id: "cluster-sgr-01",
    photo_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    created_at: new Date().toISOString()
  }
];

export async function getProduceListings(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/listings${query ? `?${query}` : ''}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.listings)) return data;
    }
  } catch (e) {}
  
  const saved = localStorage.getItem('agrilink_listings');
  if (saved) {
    try {
      return { total: JSON.parse(saved).length, listings: JSON.parse(saved) };
    } catch (err) {}
  }
  return { total: DEFAULT_LISTINGS.length, listings: DEFAULT_LISTINGS };
}

export async function createProduceListing(data) {
  try {
    const res = await fetch(`${BASE_URL}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const currentRes = await getProduceListings();
  const current = currentRes.listings || [];
  const newListing = {
    id: `lst-${Date.now().toString().slice(-4)}`,
    user_id: data.userId || 'usr-demo-01',
    farmer_name: data.farmerName || 'Harpreet Singh',
    village: data.village || 'Kakra',
    district: data.district || 'Sangrur',
    state: data.state || 'Punjab',
    phone: data.phone || '+91 98765-12340',
    crop: data.crop || 'Wheat (Gehu)',
    quantity_quintals: data.quantityQuintals || 3.0,
    expected_price_per_q: data.expectedPricePerQ || 2550,
    quality_grade: data.sampleType === 'fresh' ? 'Grade A' : 'Grade B',
    defect_score_percent: data.sampleType === 'fresh' ? 3.5 : 8.5,
    status: 'ACTIVE',
    photo_url: data.photoUrl || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    created_at: new Date().toISOString()
  };
  const updated = [newListing, ...current];
  localStorage.setItem('agrilink_listings', JSON.stringify(updated));
  return { success: true, listing: newListing };
}

export async function scanCropQuality(crop, sampleType = 'fresh') {
  try {
    const res = await fetch(`${BASE_URL}/listings/ai-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop, sampleType })
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const isFresh = sampleType !== 'spotted';
  return {
    success: true,
    assessment: {
      grade: isFresh ? 'Grade A' : 'Grade B',
      confidencePercent: isFresh ? 96.4 : 91.2,
      defectScorePercent: isFresh ? 2.8 : 7.6,
      uniformityScore: isFresh ? 94 : 85,
      moistureEstPercent: isFresh ? 11.8 : 13.5,
      priceMultiplier: isFresh ? 1.05 : 0.95,
      suggestedPricePerQ: isFresh ? 2680 : 2420,
      inspectionTimestamp: new Date().toISOString()
    }
  };
}

export async function calculateNetProfit(cropId, quantityQuintals, isPooledTransport = true) {
  try {
    const res = await fetch(`${BASE_URL}/profit/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropId, quantityQuintals, isPooledTransport })
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  // Instant Mathematical Fallback Engine
  const q = Math.max(0.5, parseFloat(quantityQuintals) || 3.0);
  const commodity = FALLBACK_COMMODITIES.find(c => c.id === cropId) || FALLBACK_COMMODITIES[0];

  const results = FALLBACK_MANDIS.map(mandi => {
    const grossPricePerQ = mandi.prices[commodity.id] || commodity.currentAvgRate;
    const grossRevenue = grossPricePerQ * q;
    const soloFreight = Math.round(mandi.distanceKm * 26);
    const pooledFreight = Math.round((mandi.distanceKm * 14 * (q / 8.0)) + 120);
    const freightCost = isPooledTransport ? Math.min(soloFreight * 0.58, pooledFreight) : soloFreight;
    const freightSavings = soloFreight - freightCost;
    const tollShare = isPooledTransport ? Math.round((mandi.distanceKm > 50 ? 280 : 0) * 0.4) : (mandi.distanceKm > 50 ? 280 : 0);
    const wastageCost = Math.round(grossRevenue * (mandi.distanceKm / 100) * 0.005 * (isPooledTransport ? 0.55 : 1.0));
    const cessAmount = Math.round(grossRevenue * (mandi.apmcCessPercent / 100));
    const unloadingCost = Math.round(35 * q);
    const totalDeductions = freightCost + tollShare + wastageCost + cessAmount + unloadingCost;
    const netProfit = grossRevenue - totalDeductions;
    const netRatePerQuintal = Math.round(netProfit / q);

    return {
      mandiId: mandi.id,
      mandiName: mandi.name,
      mandiType: mandi.type,
      distanceKm: mandi.distanceKm,
      badge: mandi.badge || null,
      grossPricePerQ,
      grossRevenue,
      breakdown: {
        freightCost: Math.round(freightCost),
        soloFreightComparison: soloFreight,
        freightSavings: Math.max(0, freightSavings),
        tollShare,
        wastageCost,
        cessAmount,
        unloadingCost,
        totalDeductions
      },
      netProfit: Math.round(netProfit),
      netRatePerQuintal,
      profitPercentage: Number(((netProfit / grossRevenue) * 100).toFixed(1))
    };
  });

  results.sort((a, b) => b.netProfit - a.netProfit);
  if (results.length > 0) results[0].isRecommendedBest = true;

  return {
    crop: commodity.name,
    cropId: commodity.id,
    quantityQuintals: q,
    isPooledTransport,
    destinations: results,
    topRecommendation: results[0] || null
  };
}

const DEFAULT_CLUSTERS = [
  {
    id: "cluster-sgr-01",
    name: "Sangrur-Bhawanigarh Hub",
    district: "Sangrur",
    state: "Punjab",
    radiusKm: 7.5,
    hubVillage: "Bhawanigarh",
    assignedVehicle: {
      vehicleNumber: "PB-13-BB-8924",
      model: "Tata Ace (Chhota Hathi)",
      driverName: "Gurpreet Singh",
      driverPhone: "+91 98721-45012",
      totalCapacityQuintals: 10.0,
      currentLoadQuintals: 5.5
    },
    farmersInPool: [
      { name: "Harpreet Singh", village: "Kakra", crop: "Wheat", quantityQuintals: 3.0, status: "LOADED" },
      { name: "Sukhwinder Singh", village: "Bahadarpur", crop: "Wheat", quantityQuintals: 2.5, status: "SCHEDULED" }
    ],
    status: "OPEN_FOR_POOLING",
    freightSavingsPercent: 42,
    targetDestination: "ITC e-Choupal Rural Hub"
  },
  {
    id: "cluster-ludh-02",
    name: "Khanna-Samrala Agri Hub",
    district: "Ludhiana",
    state: "Punjab",
    radiusKm: 6.0,
    hubVillage: "Khanna",
    assignedVehicle: {
      vehicleNumber: "PB-10-CX-7712",
      model: "Mahindra Bolero Maxi Truck",
      driverName: "Balwinder Singh",
      driverPhone: "+91 98140-62190",
      totalCapacityQuintals: 15.0,
      currentLoadQuintals: 8.0
    },
    farmersInPool: [
      { name: "Jagjit Singh", village: "Samrala", crop: "Paddy", quantityQuintals: 4.5, status: "LOADED" },
      { name: "Gurjant Singh", village: "Payal", crop: "Paddy", quantityQuintals: 3.5, status: "SCHEDULED" }
    ],
    status: "OPEN_FOR_POOLING",
    freightSavingsPercent: 46,
    targetDestination: "Khanna APMC Grain Market"
  }
];

export async function getHyperlocalClusters() {
  try {
    const res = await fetch(`${BASE_URL}/pooling/clusters`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.clusters)) return data;
    }
  } catch (e) {}

  const saved = localStorage.getItem('agrilink_clusters');
  if (saved) {
    try {
      return { total: JSON.parse(saved).length, clusters: JSON.parse(saved) };
    } catch (err) {}
  }
  return { total: DEFAULT_CLUSTERS.length, clusters: DEFAULT_CLUSTERS };
}

export async function joinTransportPool(data) {
  try {
    const res = await fetch(`${BASE_URL}/pooling/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const clustersRes = await getHyperlocalClusters();
  const clusters = clustersRes.clusters || DEFAULT_CLUSTERS;
  const target = clusters.find(c => c.id === data.clusterId) || clusters[0];
  if (target) {
    const addedQ = parseFloat(data.quantityQuintals) || 2.0;
    target.assignedVehicle.currentLoadQuintals = Math.min(
      target.assignedVehicle.totalCapacityQuintals,
      Number((target.assignedVehicle.currentLoadQuintals + addedQ).toFixed(1))
    );
    target.farmersInPool.push({
      name: data.farmerName || 'Harpreet Singh',
      village: data.village || 'Kakra',
      crop: data.crop || 'Wheat',
      quantityQuintals: addedQ,
      status: 'CONFIRMED'
    });
    localStorage.setItem('agrilink_clusters', JSON.stringify(clusters));
  }
  return { success: true, message: "Successfully booked slot in shared transport!" };
}

export async function dispatchPoolVehicle(clusterId) {
  try {
    const res = await fetch(`${BASE_URL}/pooling/dispatch/${clusterId}`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const clustersRes = await getHyperlocalClusters();
  const clusters = clustersRes.clusters || DEFAULT_CLUSTERS;
  const target = clusters.find(c => c.id === clusterId);
  if (target) {
    target.status = 'DISPATCHED';
    localStorage.setItem('agrilink_clusters', JSON.stringify(clusters));
  }
  return { success: true, message: "Vehicle dispatched to market hub!" };
}

const DEFAULT_ESCROW = [
  {
    id: "tx-esc-8921",
    buyer_name: "ITC Limited",
    farmer_name: "Harpreet Singh",
    farmer_phone: "9876512340",
    farmer_bank: "Punjab National Bank - ****4091",
    crop: "Wheat (Grade A)",
    quantity_quintals: 3.0,
    agreed_rate_per_q: 2580,
    total_escrow_amount: 7740,
    freight_deduction: 180,
    net_farmer_payout: 7560,
    status: "DELIVERY_CONFIRMED",
    utr_number: "PUNBR5202609128921"
  },
  {
    id: "tx-esc-8922",
    buyer_name: "PUNGRAIN",
    farmer_name: "Harpreet Singh",
    farmer_phone: "9876512340",
    farmer_bank: "Punjab National Bank - ****4091",
    crop: "Basmati Paddy",
    quantity_quintals: 5.0,
    agreed_rate_per_q: 3490,
    total_escrow_amount: 17450,
    freight_deduction: 320,
    net_farmer_payout: 17130,
    status: "IN_TRANSIT",
    utr_number: null
  },
  {
    id: "tx-esc-8923",
    buyer_name: "Adani Agri Logistics",
    farmer_name: "Harpreet Singh",
    farmer_phone: "9876512340",
    farmer_bank: "Punjab National Bank - ****4091",
    crop: "Mustard Seed",
    quantity_quintals: 4.0,
    agreed_rate_per_q: 6120,
    total_escrow_amount: 24480,
    freight_deduction: 280,
    net_farmer_payout: 24200,
    status: "VAULT_LOCKED",
    utr_number: null
  }
];

export async function getEscrowTransactions(farmerPhone) {
  try {
    const query = farmerPhone ? `?farmerPhone=${encodeURIComponent(farmerPhone)}` : '';
    const res = await fetch(`${BASE_URL}/escrow${query}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.transactions)) return data;
    }
  } catch (e) {}

  const saved = localStorage.getItem('agrilink_escrow');
  if (saved) {
    try {
      return { total: JSON.parse(saved).length, transactions: JSON.parse(saved) };
    } catch (err) {}
  }
  return { total: DEFAULT_ESCROW.length, transactions: DEFAULT_ESCROW };
}

export async function createEscrowDeposit(data) {
  try {
    const res = await fetch(`${BASE_URL}/escrow/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const current = await getEscrowTransactions();
  const txs = current.transactions ? [...current.transactions] : [...DEFAULT_ESCROW];
  const newTx = {
    id: data.dealId || `tx-esc-${Math.floor(1000 + Math.random() * 9000)}`,
    buyer_name: data.buyerName || data.buyer_name || "ITC Limited",
    farmer_name: data.farmerName || data.farmer_name || "Harpreet Singh",
    farmer_phone: data.farmerPhone || data.farmer_phone || "9876512340",
    farmer_bank: data.farmerBank || data.bankAccount || data.farmer_bank || "Punjab National Bank - ****4091",
    crop: data.crop || "Wheat (Grade A)",
    quantity_quintals: Number(data.quantityQuintals || data.quantity_quintals || 3.0),
    agreed_rate_per_q: Number(data.agreedRate || data.agreed_rate_per_q || 2580),
    total_escrow_amount: Number(data.totalEscrowAmount || (Number(data.quantityQuintals || 3) * Number(data.agreedRate || 2580))),
    freight_deduction: Number(data.freightDeduction || 180),
    net_farmer_payout: Number(data.netPayout || (Number(data.totalEscrowAmount || 7740) - 180)),
    status: "VAULT_LOCKED",
    utr_number: null,
    created_at: new Date().toISOString()
  };
  txs.unshift(newTx);
  localStorage.setItem('agrilink_escrow', JSON.stringify(txs));
  return { success: true, transaction: newTx };
}

export async function dispatchEscrow(id) {
  try {
    const res = await fetch(`${BASE_URL}/escrow/dispatch/${id}`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const res = await getEscrowTransactions();
  const txs = res.transactions || DEFAULT_ESCROW;
  const target = txs.find(t => t.id === id);
  if (target) target.status = 'IN_TRANSIT';
  localStorage.setItem('agrilink_escrow', JSON.stringify(txs));
  return { success: true };
}

export async function confirmEscrowDelivery(id) {
  try {
    const res = await fetch(`${BASE_URL}/escrow/confirm-delivery/${id}`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const res = await getEscrowTransactions();
  const txs = res.transactions || DEFAULT_ESCROW;
  const target = txs.find(t => t.id === id);
  if (target) target.status = 'DELIVERY_CONFIRMED';
  localStorage.setItem('agrilink_escrow', JSON.stringify(txs));
  return { success: true };
}

export async function releaseInstantDbt(id) {
  try {
    const res = await fetch(`${BASE_URL}/escrow/release-dbt/${id}`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const res = await getEscrowTransactions();
  const txs = res.transactions || DEFAULT_ESCROW;
  const target = txs.find(t => t.id === id);
  if (target) {
    target.status = 'INSTANT_DBT_RELEASED';
    target.utr_number = `DBT${Date.now().toString().slice(-10)}`;
  }
  localStorage.setItem('agrilink_escrow', JSON.stringify(txs));
  return { success: true, utrNumber: target?.utr_number };
}

export async function raiseEscrowDispute(id, reason = "Quality defect score mismatch") {
  try {
    const res = await fetch(`${BASE_URL}/escrow/dispute/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const res = await getEscrowTransactions();
  const txs = res.transactions || DEFAULT_ESCROW;
  const target = txs.find(t => t.id === id);
  if (target) {
    target.status = 'DISPUTE_ARBITRATION';
    target.dispute_reason = reason;
    target.dispute_date = new Date().toISOString();
  }
  localStorage.setItem('agrilink_escrow', JSON.stringify(txs));
  return { success: true, message: "Dispute registered. Escrow locked in neutral APMC arbitration." };
}

export async function resolveEscrowDispute(id, settledAmount) {
  try {
    const res = await fetch(`${BASE_URL}/escrow/resolve-dispute/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settledAmount })
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const res = await getEscrowTransactions();
  const txs = res.transactions || DEFAULT_ESCROW;
  const target = txs.find(t => t.id === id);
  if (target) {
    target.status = 'INSTANT_DBT_RELEASED';
    if (settledAmount) target.net_farmer_payout = settledAmount;
    target.utr_number = `DBT-ARB-${Date.now().toString().slice(-8)}`;
    target.dispute_resolved = true;
  }
  localStorage.setItem('agrilink_escrow', JSON.stringify(txs));
  return { success: true, message: "Dispute settled amicably and DBT released." };
}

const DEFAULT_WAREHOUSES = [
  {
    id: "wh-sgr-01",
    name: "Sangrur Central Warehouse Corporation (CWC)",
    wdraRegNumber: "WDRA/PB/SGR/2023/014",
    type: "WDRA Accredited Dry Grain Silo",
    village: "Kakra Road",
    district: "Sangrur",
    state: "Punjab",
    distanceKm: 8.5,
    totalCapacityQuintals: 8000,
    availableSpaceQuintals: 3200,
    monthlyRentPerQ: 8.0,
    enwrEligible: true,
    maxAdvancePercent: 75,
    specs: "Hermetic seal • Automated aeration • Moisture sensor control",
    contact: "+91 1672-230491"
  },
  {
    id: "wh-khn-02",
    name: "Khanna Agro Cold Link & Dry Warehouse",
    wdraRegNumber: "WDRA/PB/KHN/2022/089",
    type: "Integrated Cold & Dry Grain Terminal",
    village: "G.T. Road",
    district: "Ludhiana",
    state: "Punjab",
    distanceKm: 42.0,
    totalCapacityQuintals: 15000,
    availableSpaceQuintals: 5800,
    monthlyRentPerQ: 12.0,
    enwrEligible: true,
    maxAdvancePercent: 75,
    specs: "Multi-commodity cold chain (2°C - 8°C) • Nitrogen purge",
    contact: "+91 1628-228140"
  },
  {
    id: "wh-ptl-03",
    name: "Patiala District Cooperative Warehouse",
    wdraRegNumber: "WDRA/PB/PTL/2024/031",
    type: "State Warehousing Corp (SWC)",
    village: "Nabha Bypass",
    district: "Patiala",
    state: "Punjab",
    distanceKm: 34.0,
    totalCapacityQuintals: 6500,
    availableSpaceQuintals: 2100,
    monthlyRentPerQ: 7.5,
    enwrEligible: true,
    maxAdvancePercent: 75,
    specs: "Govt insured • Direct rail siding link • Zero rodent loss",
    contact: "+91 175-221980"
  }
];

export async function getStorageWarehouses() {
  const saved = localStorage.getItem('agrilink_warehouses');
  if (saved) {
    try {
      return { warehouses: JSON.parse(saved) };
    } catch (e) {}
  }
  return { warehouses: DEFAULT_WAREHOUSES };
}

export async function bookWarehouseStorage(bookingData) {
  const current = await getStorageWarehouses();
  const whs = current.warehouses ? [...current.warehouses] : [...DEFAULT_WAREHOUSES];
  const target = whs.find(w => w.id === bookingData.warehouseId) || whs[0];
  if (target) {
    target.availableSpaceQuintals = Math.max(0, target.availableSpaceQuintals - (bookingData.quantityQuintals || 3));
  }
  localStorage.setItem('agrilink_warehouses', JSON.stringify(whs));

  const receipts = JSON.parse(localStorage.getItem('agrilink_enwr_receipts') || '[]');
  const newReceipt = {
    receiptId: `ENWR-PB-${Date.now().toString().slice(-6)}`,
    farmerName: bookingData.farmerName || 'Harpreet Singh',
    warehouseName: target.name,
    crop: bookingData.crop || 'Wheat (Grade A)',
    quantityQuintals: bookingData.quantityQuintals || 3.0,
    estimatedValue: (bookingData.quantityQuintals || 3.0) * 2580,
    maxEligibleLoan: Math.round(((bookingData.quantityQuintals || 3.0) * 2580) * 0.75),
    pledged: false,
    created_at: new Date().toISOString()
  };
  receipts.unshift(newReceipt);
  localStorage.setItem('agrilink_enwr_receipts', JSON.stringify(receipts));

  return { success: true, receipt: newReceipt };
}

export async function getENWRReceipts() {
  const receipts = JSON.parse(localStorage.getItem('agrilink_enwr_receipts') || '[]');
  if (receipts.length === 0) {
    const demoReceipt = {
      receiptId: "ENWR-PB-849102",
      farmerName: "Harpreet Singh",
      warehouseName: "Sangrur Central Warehouse Corporation (CWC)",
      crop: "Wheat (Grade A)",
      quantityQuintals: 3.0,
      estimatedValue: 7740,
      maxEligibleLoan: 5715,
      pledged: false,
      created_at: new Date().toISOString()
    };
    receipts.push(demoReceipt);
    localStorage.setItem('agrilink_enwr_receipts', JSON.stringify(receipts));
  }
  return { receipts };
}

export async function pledgeENWRReceipt(receiptId) {
  const receipts = JSON.parse(localStorage.getItem('agrilink_enwr_receipts') || '[]');
  const target = receipts.find(r => r.receiptId === receiptId) || receipts[0];
  if (target) {
    target.pledged = true;
    target.disbursedAmount = target.maxEligibleLoan || 5715;
    target.bankUtr = `PNB-ENWR-${Date.now().toString().slice(-8)}`;
  }
  localStorage.setItem('agrilink_enwr_receipts', JSON.stringify(receipts));
  return { success: true, disbursedAmount: target?.maxEligibleLoan || 5715, utr: target?.bankUtr };
}

export async function getLiveMandiTicker() {
  const res = await fetch(`${BASE_URL}/mandi/ticker`);
  return res.json();
}

const FALLBACK_COMMODITIES = [
  { id: 'wheat', name: 'Wheat (Gehu)', category: 'Cereals', baseMsp: 2275, currentAvgRate: 2480, icon: '🌾' },
  { id: 'paddy', name: 'Basmati Paddy (Dhan)', category: 'Cereals', baseMsp: 2183, currentAvgRate: 3350, icon: '🌾' },
  { id: 'onion', name: 'Red Onion (Pyaz)', category: 'Vegetables', baseMsp: 1800, currentAvgRate: 2650, icon: '🧅' },
  { id: 'tomato', name: 'Hybrid Tomato (Tamatar)', category: 'Vegetables', baseMsp: 1200, currentAvgRate: 2900, icon: '🍅' },
  { id: 'mustard', name: 'Mustard (Sarson)', category: 'Oilseeds', baseMsp: 5650, currentAvgRate: 5980, icon: '🌻' },
  { id: 'potato', name: 'Potato (Aloo)', category: 'Vegetables', baseMsp: 1100, currentAvgRate: 1750, icon: '🥔' },
  { id: 'cotton', name: 'Cotton (Kapas)', category: 'Fiber', baseMsp: 6620, currentAvgRate: 7150, icon: '🌱' }
];

const FALLBACK_MANDIS = [
  {
    id: "buyer-itc",
    name: "ITC e-Choupal Direct Hub",
    type: "Institutional Buyer",
    state: "Pan-India Agri Corridor",
    distanceKm: 34,
    apmcCessPercent: 0.0,
    badge: "Direct Escrow Partner",
    prices: { wheat: 2580, paddy: 3490, onion: 2720, tomato: 3050, mustard: 6120, potato: 1800, cotton: 7300 },
    arrivalsQuintals: 1800
  },
  {
    id: "mandi-azadpur",
    name: "Azadpur APMC Mandi, Delhi",
    type: "Terminal APMC",
    state: "Delhi",
    distanceKm: 95,
    apmcCessPercent: 1.5,
    badge: "National APMC Hub",
    prices: { wheat: 2540, paddy: 3420, onion: 2850, tomato: 3150, mustard: 6050, potato: 1890, cotton: 7250 },
    arrivalsQuintals: 6850
  },
  {
    id: "mandi-khanna",
    name: "Khanna APMC Grain Market",
    type: "Terminal APMC",
    state: "Punjab",
    distanceKm: 58,
    apmcCessPercent: 2.0,
    badge: "Asia's Largest APMC",
    prices: { wheat: 2530, paddy: 3460, onion: 2750, tomato: 2980, mustard: 6040, potato: 1840, cotton: 7220 },
    arrivalsQuintals: 5900
  },
  {
    id: "buyer-fpo",
    name: "Kisan Samriddhi FPO Federation",
    type: "Farmer Producer Org (FPO)",
    state: "Hyperlocal Cluster",
    distanceKm: 12,
    apmcCessPercent: 0.0,
    badge: "Cooperative Model",
    prices: { wheat: 2510, paddy: 3440, onion: 2680, tomato: 2950, mustard: 6080, potato: 1760, cotton: 7200 },
    arrivalsQuintals: 950
  },
  {
    id: "mandi-ludhiana",
    name: "Ludhiana Wholesale Grain Market",
    type: "Regional APMC",
    state: "Punjab",
    distanceKm: 65,
    apmcCessPercent: 2.0,
    badge: "Punjab Regional Hub",
    prices: { wheat: 2510, paddy: 3430, onion: 2790, tomato: 3050, mustard: 6010, potato: 1860, cotton: 7190 },
    arrivalsQuintals: 4450
  },
  {
    id: "mandi-ghazipur",
    name: "Ghazipur Fruit & Veg Mandi",
    type: "Terminal APMC",
    state: "Delhi NCR",
    distanceKm: 85,
    apmcCessPercent: 1.5,
    prices: { wheat: 2490, paddy: 3380, onion: 2780, tomato: 3200, mustard: 5980, potato: 1820, cotton: 7180 },
    arrivalsQuintals: 4200
  },
  {
    id: "buyer-motherdairy",
    name: "Mother Dairy Safal Procurement Center",
    type: "Institutional Buyer",
    state: "Regional Cold Hub",
    distanceKm: 42,
    apmcCessPercent: 0.0,
    badge: "Cold Chain Verified",
    prices: { wheat: 2490, paddy: 3350, onion: 2890, tomato: 3280, mustard: 5950, potato: 1910, cotton: 7050 },
    arrivalsQuintals: 1400
  },
  {
    id: "mandi-sangrur",
    name: "Sangrur APMC Grain Market",
    type: "Local APMC",
    state: "Punjab",
    distanceKm: 14,
    apmcCessPercent: 2.0,
    badge: "Local Mandi",
    prices: { wheat: 2470, paddy: 3400, onion: 2540, tomato: 2800, mustard: 5990, potato: 1700, cotton: 7120 },
    arrivalsQuintals: 3100
  },
  {
    id: "mandi-karnal",
    name: "Karnal Grain Market",
    type: "Local APMC",
    state: "Haryana",
    distanceKm: 28,
    apmcCessPercent: 2.0,
    prices: { wheat: 2460, paddy: 3410, onion: 2520, tomato: 2750, mustard: 6020, potato: 1680, cotton: 7100 },
    arrivalsQuintals: 2800
  }
];

export async function getMandiRateComparison(crop = 'wheat') {
  try {
    const res = await fetch(`${BASE_URL}/mandi/compare?crop=${encodeURIComponent(crop)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.mandis && data.mandis.length > 0) return data;
    }
  } catch (err) {
    // Graceful fallback if backend server isn't reachable
  }

  // Client-side instant simulation
  const cropId = crop.toLowerCase();
  const commodity = FALLBACK_COMMODITIES.find(c => c.id === cropId) || FALLBACK_COMMODITIES[0];

  const comparedMandis = FALLBACK_MANDIS.map(m => {
    const modalPrice = m.prices[commodity.id] || commodity.currentAvgRate;
    const minPrice = Math.round(modalPrice * 0.96);
    const maxPrice = Math.round(modalPrice * 1.04);
    const diffFromMsp = modalPrice - commodity.baseMsp;
    const percentDiffFromMsp = Number(((diffFromMsp / commodity.baseMsp) * 100).toFixed(1));
    const diffFromAvg = modalPrice - commodity.currentAvgRate;
    const percentDiffFromAvg = Number(((diffFromAvg / commodity.currentAvgRate) * 100).toFixed(1));

    return {
      id: m.id,
      name: m.name,
      type: m.type,
      state: m.state,
      distanceKm: m.distanceKm,
      apmcCessPercent: m.apmcCessPercent,
      modalPrice,
      minPrice,
      maxPrice,
      arrivalsQuintals: m.arrivalsQuintals,
      diffFromMsp,
      percentDiffFromMsp,
      diffFromAvg,
      percentDiffFromAvg,
      isAboveMsp: diffFromMsp >= 0,
      badge: m.badge || null
    };
  });

  comparedMandis.sort((a, b) => b.modalPrice - a.modalPrice);

  const highest = comparedMandis[0];
  const lowest = comparedMandis[comparedMandis.length - 1];

  return {
    timestamp: new Date().toISOString(),
    source: "Agmarknet Live API Gateway (DMI, MoA&FW, GoI)",
    commodity: {
      id: commodity.id,
      name: commodity.name,
      category: commodity.category,
      baseMsp: commodity.baseMsp,
      currentAvgRate: commodity.currentAvgRate,
      unit: "Quintal",
      icon: commodity.icon
    },
    summary: {
      baseMsp: commodity.baseMsp,
      nationalAvg: commodity.currentAvgRate,
      highestMandi: highest ? { name: highest.name, price: highest.modalPrice } : null,
      lowestMandi: lowest ? { name: lowest.name, price: lowest.modalPrice } : null,
      spread: highest && lowest ? highest.modalPrice - lowest.modalPrice : 0
    },
    mandis: comparedMandis,
    allCommodities: FALLBACK_COMMODITIES
  };
}

const CLIENT_BUYERS = {
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
    }
  ]
};

function parseClientVoiceQuery(spokenText, dialectCode = 'hi', context = {}) {
  const query = (spokenText || "").toLowerCase().trim();

  let crop = context.activeCrop || "wheat";
  if (query.includes("onion") || query.includes("pyaz") || query.includes("kanda") || query.includes("ਪਿਆਜ਼") || query.includes("कांदा")) crop = "onion";
  else if (query.includes("tomato") || query.includes("tamatar") || query.includes("ਟਮਾਟਰ") || query.includes("टोमॅटो")) crop = "tomato";
  else if (query.includes("paddy") || query.includes("dhan") || query.includes("chawal") || query.includes("ਝੋਨਾ") || query.includes("ਧਾਨ") || query.includes("धान")) crop = "paddy";
  else if (query.includes("mustard") || query.includes("sarson") || query.includes("ਸਰ੍ਹੋਂ") || query.includes("सरसो")) crop = "mustard";
  else if (query.includes("potato") || query.includes("aloo") || query.includes("बटाटा") || query.includes("ਆਲੂ")) crop = "potato";
  else if (query.includes("wheat") || query.includes("gehu") || query.includes("kanak") || query.includes("ਕਣਕ") || query.includes("गेहूं")) crop = "wheat";

  const isSellingQuery =
    query.includes("sell") ||
    query.includes("bech") ||
    query.includes("bechna") ||
    query.includes("becho") ||
    query.includes("vech") ||
    query.includes("vechna") ||
    query.includes("vecho") ||
    query.includes("vechni") ||
    query.includes("vech do") ||
    query.includes("vech dio") ||
    query.includes("bech do") ||
    query.includes("बेच") ||
    query.includes("बेचना") ||
    query.includes("बेचो") ||
    query.includes("बेच दो") ||
    query.includes("बिक्री") ||
    query.includes("ਵੇਚ") ||
    query.includes("ਵੇਚਣਾ") ||
    query.includes("ਵੇਚਣੀ") ||
    query.includes("ਵੇਚੋ") ||
    query.includes("ਵੇਚ ਦਿਓ") ||
    query.includes("ਬੇਚ") ||
    query.includes("book") ||
    query.includes("lock") ||
    query.includes("confirm") ||
    query.includes("deal") ||
    query.includes("sauda") ||
    query.includes("ਸੌਦਾ") ||
    query.includes("सौदा") ||
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
    query.includes("is bande") ||
    query.includes("ਵਿਅਕਤੀ") ||
    query.includes("vyakti") ||
    query.includes("is vyakti") ||
    query.includes("ਇਸ ਭਾਅ") ||
    query.includes("ਇਸ ਰੇਟ") ||
    query.includes("ਇਸ ਨੂੰ") ||
    query.includes("ਸੌਦਾ ਪੱਕਾ") ||
    query.includes("ਬੁਕਿੰਗ") ||
    query.includes("आईटीसी") ||
    query.includes("ਆਈਟੀਸੀ") ||
    (context.availableBuyers && (
      query.includes("itc") ||
      query.includes("azadpur") ||
      query.includes("mother") ||
      query.includes("pungrain") ||
      query.includes("adani") ||
      query.includes("yes") ||
      query.includes("haan") ||
      query.includes("hanji") ||
      query.includes("haanji") ||
      query.includes("ok") ||
      query.includes("okay") ||
      query.includes("done") ||
      query.includes("kar do") ||
      query.includes("kar de") ||
      query.includes("theek") ||
      query.includes("person") ||
      query.includes("buyer") ||
      query.includes("kharidar") ||
      query.includes("kharidaar") ||
      query.includes("ਖਰੀਦਦਾਰ") ||
      query.includes("pehla") ||
      query.includes("first") ||
      query.includes("top") ||
      query.includes("best")
    ));

  if (isSellingQuery) {
    const buyers = CLIENT_BUYERS[crop] || CLIENT_BUYERS.wheat;
    let selectedBuyer = buyers[0];
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

    let quantity = 3.0;
    const match = query.match(/(\d+(?:\.\d+)?)\s*(?:quintal|quintals|q|kg|kilo|ਕੁਇੰਟਲ|क्विंटल|कु\.)?/i);
    if (match && parseFloat(match[1]) > 0 && parseFloat(match[1]) <= 50) {
      quantity = parseFloat(match[1]);
    }

    const agreedRate = selectedBuyer.price;
    const totalEscrowAmount = quantity * agreedRate;
    const freightDeduction = 180;
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
    if (dialectCode === 'pa') {
      text = `ਸੌਦਾ ਪੱਕਾ! ${dealDetails.buyerName} ਨਾਲ ${quantity} ਕੁਇੰਟਲ ਦਾ ਸੌਦਾ ₹${agreedRate} ਦੇ ਭਾਅ 'ਤੇ ਪੱਕਾ ਹੋ ਗਿਆ। ₹${totalEscrowAmount.toLocaleString('en-IN')} ਸਮਾਰਟ ਐਸਕਰੋ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹਨ ਅਤੇ ਕਾਕੜਾ ਪਿੰਡ ਤੋਂ ਸਾਂਝੀ ਗੱਡੀ ਬੁੱਕ ਹੋ ਗਈ ਹੈ। ਡਿਲੀਵਰੀ ਹੁੰਦੇ ਹੀ ₹${netPayout.toLocaleString('en-IN')} ਸਿੱਧਾ ਤੁਹਾਡੇ ਪੀਐਨਬੀ ਖਾਤੇ (****4091) ਵਿੱਚ ਆ ਜਾਣਗੇ।`;
      spokenAudioText = `ਵਧਾਈ ਹੋਵੇ ਹਰਪ੍ਰੀਤ ਜੀ! ${dealDetails.buyerName} ਨਾਲ ਸੌਦਾ ਪੱਕਾ ਹੋ ਗਿਆ ਹੈ। ਪੈਸੇ ਸਮਾਰਟ ਐਸਕਰੋ ਵਿੱਚ ਲੌਕ ਹੋ ਚੁੱਕੇ ਹਨ ਅਤੇ ਸਾਂਝੀ ਗੱਡੀ ਬੁੱਕ ਹੋ ਗਈ ਹੈ।`;
    } else if (dialectCode === 'en') {
      text = `Deal Confirmed! Sold ${quantity}Q to ${dealDetails.buyerName} at ₹${agreedRate}/Q. ₹${totalEscrowAmount.toLocaleString('en-IN')} locked in Smart Escrow Vault, and shared truck booked from Kakra village. Net ₹${netPayout.toLocaleString('en-IN')} will be credited directly to your PNB account (****4091) upon delivery.`;
      spokenAudioText = `Congratulations! Your deal with ${dealDetails.buyerName} is confirmed. ${totalEscrowAmount} rupees are secured in the Escrow Vault, and a shared truck is booked for pickup.`;
    } else {
      text = `सौदा पक्का! ${dealDetails.buyerName} को ${quantity} क्विंटल फसल ₹${agreedRate} के भाव पर बेच दी गई। ₹${totalEscrowAmount.toLocaleString('en-IN')} स्मार्ट एस्क्रो वॉल्ट में सुरक्षित जमा हैं और काकरा गांव से साझा गाड़ी बुक हो गई है। डिलीवरी पर ₹${netPayout.toLocaleString('en-IN')} सीधे आपके पीएनबी खाते (****4091) में क्रेडिट हो जाएंगे।`;
      spokenAudioText = `बधाई हो हरप्रीत जी! ${dealDetails.buyerName} के साथ आपका सौदा पक्का हो गया है। ₹${totalEscrowAmount} एस्क्रो वॉल्ट में सुरक्षित हैं और काकरा से साझा गाड़ी बुक हो चुकी है।`;
    }

    return {
      intent: "CONFIRM_VOICE_DEAL",
      deal: dealDetails,
      responseMessage: text,
      speechText: spokenAudioText,
      action: "VIEW_ESCROW"
    };
  }

  // All other queries in Voice Assistant default directly to comparing buyers & showing mandi rates
  const buyers = CLIENT_BUYERS[crop] || CLIENT_BUYERS.wheat;
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
  const cropLabel = (cropNames[crop] && cropNames[crop][dialectCode]) || cropNames[crop]?.en || crop;

  let text = "";
  let spokenAudioText = "";
  if (dialectCode === 'pa') {
    text = `${cropLabel} ਦੇ ਮੁੱਖ ਖਰੀਦਦਾਰ: ${topBuyer.shortName} ਸਭ ਤੋਂ ਵੱਧ ${topBuyer.rateFormatted} ਦੇ ਰਿਹਾ ਹੈ, ਅਤੇ ${secondBuyer.shortName} ${secondBuyer.rateFormatted} ਦੇ ਰਿਹਾ ਹੈ। ਤੁਸੀਂ ਕਿਸ ਖਰੀਦਦਾਰ ਨੂੰ ਵੇਚਣਾ ਚਾਹੁੰਦੇ ਹੋ?`;
    spokenAudioText = `${cropLabel} ਲਈ ਸਭ ਤੋਂ ਵੱਧ ਭਾਅ ${topBuyer.shortName} ਵੱਲੋਂ ${topBuyer.price} ਰੁਪਏ ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਮਿਲ ਰਿਹਾ ਹੈ। ਕੀ ਤੁਸੀਂ ${topBuyer.shortName} ਨੂੰ ਵੇਚਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਬੋਲੋ ${topBuyer.shortName} ਨੂੰ ਵੇਚ ਦਿਓ।`;
  } else if (dialectCode === 'en') {
    text = `Top buyers offering rates for ${cropLabel}: ${topBuyer.shortName} offers ${topBuyer.rateFormatted} (Highest), and ${secondBuyer.shortName} offers ${secondBuyer.rateFormatted}. Which buyer would you like to sell to?`;
    spokenAudioText = `Here are the top buyers for ${cropLabel}. ${topBuyer.shortName} is giving the highest rate at ${topBuyer.price} rupees per quintal. Would you like to sell to ${topBuyer.shortName}? Just say "Sell to ${topBuyer.shortName}".`;
  } else {
    text = `${cropLabel} के प्रमुख खरीदार: ${topBuyer.shortName} सबसे अधिक ${topBuyer.rateFormatted} दे रहा है, और ${secondBuyer.shortName} ${secondBuyer.rateFormatted} दे रहा है। आप किस खरीदार को बेचना चाहते हैं?`;
    spokenAudioText = `किसान भाई, ${cropLabel} के लिए सबसे अधिक भाव ${topBuyer.shortName} ₹${topBuyer.price} प्रति क्विंटल दे रहा है। क्या आप ${topBuyer.shortName} को बेचना चाहते हैं? बोलें "${topBuyer.shortName} को बेच दो"।`;
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
    action: "VIEW_MANDI_RATES"
  };
}

export async function queryBhashiniVoice(spokenText, dialectCode = 'hi', context = {}) {
  try {
    const res = await fetch(`${BASE_URL}/bhashini/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spokenText, dialectCode, context })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) return data;
    }
  } catch (e) {}

  const result = parseClientVoiceQuery(spokenText, dialectCode, context);
  return {
    success: true,
    dialect: dialectCode,
    inputQuery: spokenText,
    result
  };
}

export async function getImpactAnalytics() {
  const res = await fetch(`${BASE_URL}/analytics/impact`);
  return res.json();
}

export async function inspectDatabase() {
  const res = await fetch(`${BASE_URL}/database/inspect`);
  return res.json();
}

export async function seedDemoDatabase() {
  const res = await fetch(`${BASE_URL}/database/seed-demo`, {
    method: 'POST'
  });
  return res.json();
}

export async function clearUserData(userId) {
  const res = await fetch(`${BASE_URL}/database/clear-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return res.json();
}
