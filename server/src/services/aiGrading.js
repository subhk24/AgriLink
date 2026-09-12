// YOLOv8 Farm-Gate AI Quality Grading Simulation
// Real-time computer vision inference for crop produce classification, defect detection, and dynamic pricing

export function assessCropQuality(cropType, sampleType = "fresh") {
  const crop = (cropType || "wheat").toLowerCase();
  
  // Realistic computer vision detection simulation based on crop type
  let result = {
    crop: cropType,
    assessedAt: new Date().toISOString(),
    aiModel: "AgriLink-YOLOv8-AgriCV-v2.4",
    inferenceLatencyMs: 240,
    metrics: {},
    detections: [],
    grade: "Grade A",
    defectScorePercent: 2.5,
    confidence: 96.4,
    priceMultiplier: 1.05, // +5% premium
    verdict: "High-Grade Export Quality. Eligible for direct institutional buyer matching with 0% middleman deductions."
  };

  if (crop.includes("wheat") || crop.includes("kanak") || crop.includes("gehu")) {
    if (sampleType === "spotted" || sampleType === "fair") {
      result.grade = "Grade B";
      result.defectScorePercent = 7.8;
      result.confidence = 92.1;
      result.priceMultiplier = 0.98;
      result.verdict = "Standard Mandi Quality. Good kernel weight, minor chaff and broken kernels (<8%).";
      result.metrics = {
        moistureContentPercent: 12.8,
        shriveledGrainsPercent: 3.5,
        foreignMatterPercent: 1.2,
        proteinEstimatePercent: 11.2
      };
      result.detections = [
        { label: "Optimal Grain Size", box: [20, 25, 45, 50], confidence: 0.95, isDefect: false },
        { label: "Chaff / Husk", box: [65, 30, 20, 18], confidence: 0.89, isDefect: true },
        { label: "Broken Grain", box: [40, 70, 18, 15], confidence: 0.84, isDefect: true }
      ];
    } else {
      result.grade = "Grade A";
      result.defectScorePercent = 2.1;
      result.confidence = 97.2;
      result.priceMultiplier = 1.08; // 8% premium
      result.verdict = "Premium Sharbati Grade A. High luster, uniform grain density, negligible moisture.";
      result.metrics = {
        moistureContentPercent: 11.2,
        shriveledGrainsPercent: 0.8,
        foreignMatterPercent: 0.3,
        proteinEstimatePercent: 12.8
      };
      result.detections = [
        { label: "Premium Grain Density", box: [15, 20, 70, 60], confidence: 0.98, isDefect: false },
        { label: "Uniform Golden Luster", box: [30, 40, 40, 35], confidence: 0.96, isDefect: false }
      ];
    }
  } else if (crop.includes("onion") || crop.includes("pyaz")) {
    if (sampleType === "spotted" || sampleType === "fair") {
      result.grade = "Grade B";
      result.defectScorePercent = 9.4;
      result.confidence = 91.5;
      result.priceMultiplier = 0.95;
      result.verdict = "Medium Grade Onion. Suitable for domestic city APMC auction.";
      result.metrics = {
        diameterMm: 45,
        sproutingPercent: 2.1,
        skinPeelPercent: 5.2,
        rotPercent: 1.1
      };
      result.detections = [
        { label: "Standard Bulb", box: [25, 30, 50, 48], confidence: 0.93, isDefect: false },
        { label: "Skin Defect", box: [60, 20, 22, 24], confidence: 0.87, isDefect: true }
      ];
    } else {
      result.grade = "Grade A";
      result.defectScorePercent = 2.9;
      result.confidence = 96.8;
      result.priceMultiplier = 1.10; // 10% premium for export quality Nashik onion
      result.verdict = "Nashik Export Grade A. Solid deep pink skin, uniform 55mm+ diameter, zero sprouting.";
      result.metrics = {
        diameterMm: 58,
        sproutingPercent: 0.0,
        skinPeelPercent: 1.2,
        rotPercent: 0.0
      };
      result.detections = [
        { label: "Uniform Export Bulb", box: [20, 20, 60, 60], confidence: 0.97, isDefect: false },
        { label: "Intact Dry Outer Skin", box: [35, 35, 30, 30], confidence: 0.95, isDefect: false }
      ];
    }
  } else if (crop.includes("tomato") || crop.includes("tamatar")) {
    if (sampleType === "spotted" || sampleType === "fair") {
      result.grade = "Grade B";
      result.defectScorePercent = 8.5;
      result.confidence = 93.0;
      result.priceMultiplier = 0.94;
      result.verdict = "Table Consumption Grade. Minor mechanical scuffs, good color.";
      result.metrics = {
        firmnessScore: "7.2 / 10",
        colorHueReds: "82%",
        blemishAreaPercent: 4.8,
        shelfLifeDays: 5
      };
      result.detections = [
        { label: "Ripe Red Fruit", box: [20, 25, 40, 45], confidence: 0.94, isDefect: false },
        { label: "Blemish / Scuff", box: [65, 45, 18, 16], confidence: 0.88, isDefect: true }
      ];
    } else {
      result.grade = "Grade A";
      result.defectScorePercent = 1.8;
      result.confidence = 98.1;
      result.priceMultiplier = 1.12; // 12% premium
      result.verdict = "Supermarket Grade A (Mother Dairy / BigBasket Qualified). Firm fruit, uniform round shape, optimal brix index.";
      result.metrics = {
        firmnessScore: "9.4 / 10",
        colorHueReds: "96%",
        blemishAreaPercent: 0.5,
        shelfLifeDays: 9
      };
      result.detections = [
        { label: "Optimal Firmness & Color", box: [15, 15, 70, 70], confidence: 0.98, isDefect: false },
        { label: "Clean Stem Calyx", box: [42, 10, 16, 14], confidence: 0.94, isDefect: false }
      ];
    }
  } else {
    // Default fallback
    result.grade = "Grade A";
    result.defectScorePercent = 3.2;
    result.confidence = 94.0;
    result.priceMultiplier = 1.04;
    result.metrics = {
      purityScore: "96.8%",
      moistureLevel: "Optimal",
      defectRatio: "3.2%"
    };
    result.detections = [
      { label: "Verified Produce", box: [20, 20, 60, 60], confidence: 0.95, isDefect: false }
    ];
  }

  return result;
}
