// Net-Profit Engine (SIH 2026 PID26132)
// Formula: Net Profit = (Mandi Price * Quantity) - (Freight + Tolls + Wastage + APMC Cess)
// Objective: Rank destinations by actual cash in-hand rather than gross headline rates that get eroded by transport costs.

import { mandis, commodities } from "../data/mockDb.js";

export function calculateNetProfitOptions(cropId = "wheat", quantityQuintals = 3.0, isPooledTransport = true) {
  const q = Math.max(0.5, parseFloat(quantityQuintals) || 3.0);
  const commodity = commodities.find(c => c.id === cropId) || commodities[0];

  const results = mandis.map(mandi => {
    const grossPricePerQ = mandi.prices[cropId] || commodity.currentAvgRate;
    const grossRevenue = grossPricePerQ * q;

    // Freight calculation:
    // Standalone Solo Hire (e.g. ₹26/km) vs AgriLink Hyperlocal Pooled (e.g. ₹13.5/km shared amongst 2-3 farmers)
    const soloFreightPerKm = 26;
    const pooledFreightPerKm = 14;
    const freightRate = isPooledTransport ? pooledFreightPerKm : soloFreightPerKm;
    
    // Total vehicle freight shared proportionally by weight fraction
    // In pooling, a farmer with 3Q pays only for 3Q out of ~10Q truck load!
    const soloFreight = Math.round(mandi.distanceKm * soloFreightPerKm);
    const pooledFreight = Math.round((mandi.distanceKm * pooledFreightPerKm * (q / 8.0)) + 120); // base handling
    const freightCost = isPooledTransport ? Math.min(soloFreight * 0.58, pooledFreight) : soloFreight;
    const freightSavings = soloFreight - freightCost;

    // Tolls (Shared in pooling or zero for local/direct)
    const tollShare = isPooledTransport ? Math.round(mandi.tollsEstimate * 0.4) : mandi.tollsEstimate;

    // Transit Perishable Wastage
    // Distance * wastageRatePer100Km * perishable weight value
    // Pooled direct transport reduces handling & transit hops, cutting wastage by ~50%
    const baseWastageFactor = (mandi.distanceKm / 100) * (commodity.wastageRatePer100Km / 100);
    const wastageEfficiency = isPooledTransport ? 0.55 : 1.0;
    const estimatedWastageCost = Math.round(grossRevenue * baseWastageFactor * wastageEfficiency);

    // APMC Mandi Cess & Unloading (0% for Direct FPO / Institutional Escrow, 1.5-2.0% at APMC)
    const cessAmount = Math.round(grossRevenue * (mandi.apmcCessPercent / 100));
    const unloadingCost = Math.round(mandi.unloadingChargePerQ * q);

    // Total Deductions
    const totalDeductions = freightCost + tollShare + estimatedWastageCost + cessAmount + unloadingCost;
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
        wastageCost: estimatedWastageCost,
        cessAmount,
        unloadingCost,
        totalDeductions
      },
      netProfit: Math.round(netProfit),
      netRatePerQuintal,
      profitPercentage: Number(((netProfit / grossRevenue) * 100).toFixed(1))
    };
  });

  // Rank by Net Profit (highest cash in-hand first)
  results.sort((a, b) => b.netProfit - a.netProfit);

  // Mark the #1 optimal choice
  if (results.length > 0) {
    results[0].isRecommendedBest = true;
    results[0].recommendationReason = isPooledTransport 
      ? "Highest net in-hand payout due to direct escrow pricing & shared freight savings!"
      : "Highest in-hand payout despite standalone transport costs.";
  }

  return {
    crop: commodity.name,
    cropId: commodity.id,
    quantityQuintals: q,
    isPooledTransport,
    destinations: results,
    topRecommendation: results[0] || null
  };
}
