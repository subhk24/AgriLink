import express from 'express';

const router = express.Router();

router.get('/impact', (req, res) => {
  return res.json({
    metrics: {
      smallholdersEmpoweredPercent: "86%+",
      freightCostReductionRange: "35% - 50%",
      transitWastageReduction: "< 8%",
      averageFarmerIncomeIncrease: "24.5%",
      totalDirectTradesFacilitated: "₹14,28,400",
      activeVillageClusters: 18,
      instantDbtSettlementRateSeconds: "< 120s"
    },
    comparisonMatrix: [
      {
        parameter: "Price Visibility",
        traditionalApmc: "Opaque / Cartelized (Commission agents dictate)",
        kisanSabhaENam: "Gross Listing Only (Ignoring logistics drag)",
        ninjacartDeHaat: "Fixed Closed Rate (Middleman margin taken)",
        agriLink: "True Net In-Hand Profit (Algorithmic net cash ranking)"
      },
      {
        parameter: "Interface Barrier",
        traditionalApmc: "Physical Middlemen (Exploitative 25-35% cut)",
        kisanSabhaENam: "Form-heavy UI (English/Hindi text friction)",
        ninjacartDeHaat: "Middleman app (Field agent dependent)",
        agriLink: "Voice AI in 12+ Dialects (Zero-typing Bhashini)"
      },
      {
        parameter: "Quality Grading",
        traditionalApmc: "Arbitrary Rate Cuts (Subjective manual rejection)",
        kisanSabhaENam: "Manual at Mandi (Post-transit disputes)",
        ninjacartDeHaat: "Centralized Hubs (Transit risk borne by farmer)",
        agriLink: "Instant Farm-Gate AI Scan (YOLOv8 CV before dispatch)"
      },
      {
        parameter: "Logistics Model",
        traditionalApmc: "Individual / High Cost (Solo pickup extortion)",
        kisanSabhaENam: "Unassisted (Farmer arranges solo truck)",
        ninjacartDeHaat: "Heavy Owned Fleet (High operational overhead)",
        agriLink: "Crowd-Pooled Freight (35-50% off via 5-10km clusters)"
      },
      {
        parameter: "Payment Guarantee",
        traditionalApmc: "Delayed Cash / Chits (15-45 days credit cycle)",
        kisanSabhaENam: "Indirect Mandi Clearance (Bureaucratic delay)",
        ninjacartDeHaat: "Weekly Scheduled Payouts",
        agriLink: "Smart Escrow Vault + Instant DBT (Direct to bank on delivery)"
      }
    ]
  });
});

export default router;
