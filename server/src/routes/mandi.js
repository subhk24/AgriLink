import express from 'express';
import { commodities, mandis } from '../data/mockDb.js';

const router = express.Router();

// Live ticker rates with minor dynamic variations
router.get('/ticker', (req, res) => {
  const randomizedCommodities = commodities.map(c => {
    const delta = Math.floor(Math.random() * 25) - 10;
    const currentPrice = c.currentAvgRate + delta;
    const percentChange = Number(((delta / c.currentAvgRate) * 100).toFixed(2));
    return {
      ...c,
      livePrice: currentPrice,
      delta,
      percentChange,
      isPositive: delta >= 0
    };
  });

  return res.json({
    timestamp: new Date().toISOString(),
    source: "Agmarknet Live API Gateway (Simulated)",
    data: randomizedCommodities
  });
});

// All mandis and buyers
router.get('/mandis', (req, res) => {
  return res.json({
    total: mandis.length,
    mandis
  });
});

// Live Agmarknet Mandi Rates & Comparison Engine
router.get('/compare', (req, res) => {
  const cropId = (req.query.crop || 'wheat').toLowerCase();
  const commodity = commodities.find(c => c.id === cropId) || commodities[0];

  // Map mandis with live Agmarknet benchmark comparison
  const comparedMandis = mandis.map(m => {
    const modalPrice = m.prices[commodity.id] || commodity.currentAvgRate;
    const minPrice = Math.round(modalPrice * 0.96);
    const maxPrice = Math.round(modalPrice * 1.04);
    
    // Arrival volumes based on market size
    const arrivalsMap = {
      'mandi-azadpur': 6850,
      'mandi-ghazipur': 4200,
      'mandi-khanna': 5900,
      'mandi-sangrur': 3100,
      'mandi-ludhiana': 4450,
      'mandi-karnal': 2800,
      'buyer-itc': 1800,
      'buyer-motherdairy': 1400,
      'buyer-fpo': 950
    };
    const arrivalsQuintals = arrivalsMap[m.id] || 2500;

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
      arrivalsQuintals,
      diffFromMsp,
      percentDiffFromMsp,
      diffFromAvg,
      percentDiffFromAvg,
      isAboveMsp: diffFromMsp >= 0,
      badge: m.badge || null
    };
  });

  // Sort by modalPrice descending
  comparedMandis.sort((a, b) => b.modalPrice - a.modalPrice);

  const highest = comparedMandis[0];
  const lowest = comparedMandis[comparedMandis.length - 1];

  return res.json({
    timestamp: new Date().toISOString(),
    source: "Agmarknet Live API Gateway (DMI, MoA&FW, GoI)",
    commodity: {
      id: commodity.id,
      name: commodity.name,
      category: commodity.category,
      baseMsp: commodity.baseMsp,
      currentAvgRate: commodity.currentAvgRate,
      unit: commodity.unit,
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
    allCommodities: commodities.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      baseMsp: c.baseMsp,
      currentAvgRate: c.currentAvgRate
    }))
  });
});

export default router;
