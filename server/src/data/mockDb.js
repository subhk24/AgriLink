// Mock Database for AgriLink (SIH 2026 PID26132)

export const commodities = [
  {
    id: "wheat",
    name: "Wheat (Gehu / Kanak)",
    category: "Cereals",
    baseMsp: 2275, // Govt Minimum Support Price per Quintal (₹)
    currentAvgRate: 2480,
    perishability: "low",
    wastageRatePer100Km: 0.3,
    unit: "Quintal",
    icon: "🌾"
  },
  {
    id: "paddy",
    name: "Basmati Paddy (Dhan)",
    category: "Cereals",
    baseMsp: 2183,
    currentAvgRate: 3350,
    perishability: "low",
    wastageRatePer100Km: 0.4,
    unit: "Quintal",
    icon: "🌾"
  },
  {
    id: "onion",
    name: "Red Onion (Pyaz)",
    category: "Vegetables",
    baseMsp: 1800,
    currentAvgRate: 2650,
    perishability: "medium",
    wastageRatePer100Km: 1.8,
    unit: "Quintal",
    icon: "🧅"
  },
  {
    id: "tomato",
    name: "Hybrid Tomato (Tamatar)",
    category: "Vegetables",
    baseMsp: 1200,
    currentAvgRate: 2900,
    perishability: "high",
    wastageRatePer100Km: 3.8,
    unit: "Quintal",
    icon: "🍅"
  },
  {
    id: "mustard",
    name: "Mustard Seed (Sarson)",
    category: "Oilseeds",
    baseMsp: 5650,
    currentAvgRate: 5980,
    perishability: "low",
    wastageRatePer100Km: 0.2,
    unit: "Quintal",
    icon: "🌻"
  },
  {
    id: "potato",
    name: "Potato (Aloo Jyoti)",
    category: "Vegetables",
    baseMsp: 1100,
    currentAvgRate: 1750,
    perishability: "medium",
    wastageRatePer100Km: 1.2,
    unit: "Quintal",
    icon: "🥔"
  },
  {
    id: "cotton",
    name: "Medium Staple Cotton (Kapas)",
    category: "Fiber",
    baseMsp: 6620,
    currentAvgRate: 7150,
    perishability: "low",
    wastageRatePer100Km: 0.1,
    unit: "Quintal",
    icon: "🌱"
  }
];

export const mandis = [
  {
    id: "mandi-azadpur",
    name: "Azadpur APMC Mandi, Delhi",
    type: "Terminal APMC",
    state: "Delhi",
    distanceKm: 95,
    apmcCessPercent: 1.5,
    tollsEstimate: 320,
    unloadingChargePerQ: 45,
    prices: {
      wheat: 2540,
      paddy: 3420,
      onion: 2850,
      tomato: 3150,
      mustard: 6050,
      potato: 1890,
      cotton: 7250
    },
    demandLevel: "Very High",
    verifiedBuyerCount: 142
  },
  {
    id: "mandi-ghazipur",
    name: "Ghazipur Fruit & Veg Mandi",
    type: "Terminal APMC",
    state: "Delhi NCR",
    distanceKm: 85,
    apmcCessPercent: 1.5,
    tollsEstimate: 280,
    unloadingChargePerQ: 40,
    prices: {
      wheat: 2490,
      paddy: 3380,
      onion: 2780,
      tomato: 3200,
      mustard: 5980,
      potato: 1820,
      cotton: 7180
    },
    demandLevel: "High",
    verifiedBuyerCount: 88
  },
  {
    id: "mandi-karnal",
    name: "Karnal Grain Market",
    type: "Local APMC",
    state: "Haryana",
    distanceKm: 28,
    apmcCessPercent: 2.0,
    tollsEstimate: 0,
    unloadingChargePerQ: 35,
    prices: {
      wheat: 2460,
      paddy: 3410,
      onion: 2520,
      tomato: 2750,
      mustard: 6020,
      potato: 1680,
      cotton: 7100
    },
    demandLevel: "Moderate",
    verifiedBuyerCount: 54
  },
  {
    id: "mandi-sangrur",
    name: "Sangrur APMC Grain Market",
    type: "Local APMC",
    state: "Punjab",
    distanceKm: 14,
    apmcCessPercent: 2.0,
    tollsEstimate: 0,
    unloadingChargePerQ: 30,
    prices: {
      wheat: 2470,
      paddy: 3400,
      onion: 2540,
      tomato: 2800,
      mustard: 5990,
      potato: 1700,
      cotton: 7120
    },
    demandLevel: "Local APMC Hub",
    verifiedBuyerCount: 42
  },
  {
    id: "mandi-khanna",
    name: "Khanna APMC Grain Market",
    type: "Terminal APMC",
    state: "Punjab",
    distanceKm: 58,
    apmcCessPercent: 2.0,
    tollsEstimate: 120,
    unloadingChargePerQ: 35,
    prices: {
      wheat: 2530,
      paddy: 3460,
      onion: 2750,
      tomato: 2980,
      mustard: 6040,
      potato: 1840,
      cotton: 7220
    },
    demandLevel: "Very High",
    verifiedBuyerCount: 165
  },
  {
    id: "mandi-ludhiana",
    name: "Ludhiana Wholesale Grain Market",
    type: "Regional APMC",
    state: "Punjab",
    distanceKm: 65,
    apmcCessPercent: 2.0,
    tollsEstimate: 140,
    unloadingChargePerQ: 35,
    prices: {
      wheat: 2510,
      paddy: 3430,
      onion: 2790,
      tomato: 3050,
      mustard: 6010,
      potato: 1860,
      cotton: 7190
    },
    demandLevel: "High",
    verifiedBuyerCount: 95
  },
  {
    id: "buyer-itc",
    name: "ITC e-Choupal Direct Hub",
    type: "Institutional Buyer",
    state: "Pan-India Agri Corridor",
    distanceKm: 34,
    apmcCessPercent: 0.0, // Direct procurement - zero APMC middleman cess!
    tollsEstimate: 0,
    unloadingChargePerQ: 0, // Absorbed by buyer
    prices: {
      wheat: 2580,
      paddy: 3490,
      onion: 2720,
      tomato: 3050,
      mustard: 6120,
      potato: 1800,
      cotton: 7300
    },
    demandLevel: "Guaranteed Escrow",
    verifiedBuyerCount: 1,
    badge: "Direct Escrow Partner"
  },
  {
    id: "buyer-motherdairy",
    name: "Mother Dairy Safal Procurement Center",
    type: "Institutional Buyer",
    state: "Regional Cold Hub",
    distanceKm: 42,
    apmcCessPercent: 0.0,
    tollsEstimate: 80,
    unloadingChargePerQ: 0,
    prices: {
      wheat: 2490,
      paddy: 3350,
      onion: 2890,
      tomato: 3280,
      mustard: 5950,
      potato: 1910,
      cotton: 7050
    },
    demandLevel: "High Priority",
    verifiedBuyerCount: 1,
    badge: "Cold Chain Verified"
  },
  {
    id: "buyer-fpo",
    name: "Kisan Samriddhi FPO Federation",
    type: "Farmer Producer Org (FPO)",
    state: "Hyperlocal Cluster",
    distanceKm: 12,
    apmcCessPercent: 0.0,
    tollsEstimate: 0,
    unloadingChargePerQ: 20,
    prices: {
      wheat: 2510,
      paddy: 3440,
      onion: 2680,
      tomato: 2950,
      mustard: 6080,
      potato: 1760,
      cotton: 7200
    },
    demandLevel: "FPO Collective",
    verifiedBuyerCount: 1,
    badge: "Cooperative Model"
  }
];

export const clusters = [
  {
    id: "cluster-sgr-01",
    name: "Sangrur-Bhawanigarh Agricultural Cluster",
    district: "Sangrur",
    state: "Punjab",
    radiusKm: 7.5,
    hubVillage: "Bhawanigarh",
    assignedVehicle: {
      vehicleNumber: "PB-13-BB-8924",
      model: "Tata Ace Gold (Mini Truck)",
      driverName: "Gurpreet Singh",
      driverPhone: "+91 98721-45012",
      totalCapacityQuintals: 10.0,
      currentLoadQuintals: 5.5,
      ratePerKmStandalone: 26,
      ratePerKmPooled: 14
    },
    farmersInPool: [
      {
        farmerId: "f-101",
        name: "Harpreet Singh",
        village: "Kakra",
        crop: "Wheat (Gehu)",
        quantityQuintals: 3.0,
        pickupOrder: 1,
        status: "LOADED"
      },
      {
        farmerId: "f-102",
        name: "Gurmeet Singh",
        village: "Balial",
        crop: "Wheat (Gehu)",
        quantityQuintals: 2.5,
        pickupOrder: 2,
        status: "SCHEDULED"
      }
    ],
    status: "OPEN_FOR_POOLING",
    freightSavingsPercent: 42,
    targetDestination: "Azadpur APMC Mandi, Delhi"
  },
  {
    id: "cluster-nsk-02",
    name: "Niphad-Lasalgaon Onion Cluster",
    district: "Nashik",
    state: "Maharashtra",
    radiusKm: 6.0,
    hubVillage: "Niphad",
    assignedVehicle: {
      vehicleNumber: "MH-15-EG-4419",
      model: "Mahindra Bolero Maxi Truck Plus",
      driverName: "Santosh Shinde",
      driverPhone: "+91 94222-77180",
      totalCapacityQuintals: 15.0,
      currentLoadQuintals: 9.0,
      ratePerKmStandalone: 28,
      ratePerKmPooled: 15
    },
    farmersInPool: [
      {
        farmerId: "f-201",
        name: "Ramesh Patil",
        village: "Kundewadi",
        crop: "Red Onion",
        quantityQuintals: 4.0,
        pickupOrder: 1,
        status: "LOADED"
      },
      {
        farmerId: "f-202",
        name: "Balasaheb Jadhav",
        village: "Pimpalgaon",
        crop: "Red Onion",
        quantityQuintals: 5.0,
        pickupOrder: 2,
        status: "LOADED"
      }
    ],
    status: "OPEN_FOR_POOLING",
    freightSavingsPercent: 46,
    targetDestination: "Vashi APMC, Navi Mumbai"
  },
  {
    id: "cluster-knl-03",
    name: "Gharaunda-Nilokheri Vegetable Cluster",
    district: "Karnal",
    state: "Haryana",
    radiusKm: 8.0,
    hubVillage: "Gharaunda",
    assignedVehicle: {
      vehicleNumber: "HR-05-AL-3188",
      model: "Ashok Leyland Dost+",
      driverName: "Kuldeep Rana",
      driverPhone: "+91 98120-66431",
      totalCapacityQuintals: 12.0,
      currentLoadQuintals: 7.0,
      ratePerKmStandalone: 25,
      ratePerKmPooled: 13.5
    },
    farmersInPool: [
      {
        farmerId: "f-301",
        name: "Suresh Kumar",
        village: "Bastara",
        crop: "Hybrid Tomato",
        quantityQuintals: 3.5,
        pickupOrder: 1,
        status: "SCHEDULED"
      },
      {
        farmerId: "f-302",
        name: "Devender Sharma",
        village: "Arainpura",
        crop: "Hybrid Tomato",
        quantityQuintals: 3.5,
        pickupOrder: 2,
        status: "SCHEDULED"
      }
    ],
    status: "OPEN_FOR_POOLING",
    freightSavingsPercent: 44,
    targetDestination: "Mother Dairy Safal Procurement Center"
  }
];

export const escrowTransactions = [
  {
    id: "ESC-2026-9014",
    buyerName: "ITC e-Choupal Sourcing Division",
    buyerGst: "07AAACI1681G1ZM",
    farmerName: "Harpreet Singh",
    farmerPhone: "+91 98765-12340",
    farmerVillage: "Kakra, Sangrur",
    farmerBank: "Punjab National Bank (A/C: ****4091, IFSC: PUNB0019200)",
    crop: "Wheat (Sharbati Grade-A)",
    quantityQuintals: 3.0,
    agreedRatePerQ: 2580,
    totalGrossAmount: 7740,
    transportCostDeduction: 390, // Pooled shared transport!
    netFarmerPayout: 7350,
    status: "INSTANT_DBT_RELEASED",
    escrowLockedAt: "2026-09-11T14:30:00Z",
    dispatchedAt: "2026-09-11T16:00:00Z",
    deliveredAt: "2026-09-11T18:45:00Z",
    dbtReleasedAt: "2026-09-11T18:47:12Z",
    utrNumber: "UPI/326719823091/PUNB",
    trackingId: "TRK-PB-8924-01"
  },
  {
    id: "ESC-2026-9015",
    buyerName: "Mother Dairy Safal Procurement",
    buyerGst: "07AAACM4819Q1ZP",
    farmerName: "Ramesh Patil",
    farmerPhone: "+91 94220-88312",
    farmerVillage: "Kundewadi, Nashik",
    farmerBank: "Bank of Baroda (A/C: ****7721, IFSC: BARB0NIPHAD)",
    crop: "Red Onion (Grade-A Export)",
    quantityQuintals: 4.0,
    agreedRatePerQ: 2890,
    totalGrossAmount: 11560,
    transportCostDeduction: 620,
    netFarmerPayout: 10940,
    status: "DELIVERY_CONFIRMED",
    escrowLockedAt: "2026-09-11T17:10:00Z",
    dispatchedAt: "2026-09-11T18:20:00Z",
    deliveredAt: "2026-09-11T19:05:00Z",
    dbtReleasedAt: null,
    utrNumber: null,
    trackingId: "TRK-MH-4419-02"
  },
  {
    id: "ESC-2026-9016",
    buyerName: "BigBasket Direct Farm Sourcing",
    buyerGst: "29AABCB1890L1ZR",
    farmerName: "Suresh Kumar",
    farmerPhone: "+91 98123-99011",
    farmerVillage: "Bastara, Karnal",
    farmerBank: "State Bank of India (A/C: ****5540, IFSC: SBIN0001280)",
    crop: "Hybrid Tomato",
    quantityQuintals: 3.5,
    agreedRatePerQ: 3280,
    totalGrossAmount: 11480,
    transportCostDeduction: 480,
    netFarmerPayout: 11000,
    status: "VAULT_LOCKED",
    escrowLockedAt: "2026-09-11T18:50:00Z",
    dispatchedAt: null,
    deliveredAt: null,
    dbtReleasedAt: null,
    utrNumber: null,
    trackingId: "TRK-HR-3188-03"
  }
];

export const produceListings = [
  {
    id: "LIST-101",
    farmerName: "Harpreet Singh",
    village: "Kakra",
    district: "Sangrur",
    state: "Punjab",
    phone: "+91 98765-12340",
    crop: "Wheat (Gehu)",
    quantityQuintals: 3.0,
    harvestDate: "2026-09-10",
    expectedPricePerQ: 2550,
    qualityGrade: "Grade A",
    defectScorePercent: 2.1,
    aiConfidence: 96.8,
    status: "SOLD_ESCROW",
    photoUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    clusterId: "cluster-sgr-01",
    createdVia: "Voice (Bhashini Punjabi)"
  },
  {
    id: "LIST-102",
    farmerName: "Gurmeet Singh",
    village: "Balial",
    district: "Sangrur",
    state: "Punjab",
    phone: "+91 98722-33441",
    crop: "Wheat (Gehu)",
    quantityQuintals: 2.5,
    harvestDate: "2026-09-11",
    expectedPricePerQ: 2540,
    qualityGrade: "Grade A",
    defectScorePercent: 3.4,
    aiConfidence: 94.2,
    status: "MATCHED_POOLING",
    photoUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    clusterId: "cluster-sgr-01",
    createdVia: "Voice (Bhashini Punjabi)"
  },
  {
    id: "LIST-103",
    farmerName: "Ramesh Patil",
    village: "Kundewadi",
    district: "Nashik",
    state: "Maharashtra",
    phone: "+91 94220-88312",
    crop: "Red Onion (Pyaz)",
    quantityQuintals: 4.0,
    harvestDate: "2026-09-10",
    expectedPricePerQ: 2800,
    qualityGrade: "Grade A",
    defectScorePercent: 4.1,
    aiConfidence: 95.1,
    status: "IN_TRANSIT",
    photoUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    clusterId: "cluster-nsk-02",
    createdVia: "Voice (Bhashini Marathi)"
  },
  {
    id: "LIST-104",
    farmerName: "Suresh Kumar",
    village: "Bastara",
    district: "Karnal",
    state: "Haryana",
    phone: "+91 98123-99011",
    crop: "Hybrid Tomato",
    quantityQuintals: 3.5,
    harvestDate: "2026-09-11",
    expectedPricePerQ: 3200,
    qualityGrade: "Grade B+",
    defectScorePercent: 6.2,
    aiConfidence: 92.5,
    status: "OFFERED",
    photoUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    clusterId: "cluster-knl-03",
    createdVia: "Voice (Bhashini Hindi)"
  }
];
