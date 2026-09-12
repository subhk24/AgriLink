import express from 'express';
import { dbAll, dbRun, dbGet } from '../data/db.js';
import { assessCropQuality } from '../services/aiGrading.js';

const router = express.Router();

// Get listings
router.get('/', async (req, res) => {
  try {
    const { crop, userId, onlyUser } = req.query;
    let sql = `SELECT * FROM produce_listings WHERE 1=1`;
    const params = [];

    if (onlyUser === 'true' && userId) {
      sql += ` AND user_id = ?`;
      params.push(userId);
    } else if (userId) {
      sql += ` AND (user_id = ? OR is_demo_data = 1)`;
      params.push(userId);
    }

    if (crop) {
      sql += ` AND LOWER(crop) LIKE ?`;
      params.push(`%${crop.toLowerCase()}%`);
    }

    sql += ` ORDER BY created_at DESC`;
    const listings = await dbAll(sql, params);

    return res.json({
      total: listings.length,
      listings
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// AI Quality Scan (YOLOv8 simulation)
router.post('/ai-scan', (req, res) => {
  const { crop, sampleType } = req.body;
  const assessment = assessCropQuality(crop, sampleType);
  return res.json({
    success: true,
    assessment
  });
});

// Create new produce listing (stored in SQLite)
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      farmerName,
      village,
      district,
      state,
      phone,
      crop,
      quantityQuintals,
      expectedPricePerQ,
      sampleType,
      photoUrl,
      clusterId,
      createdVia
    } = req.body;

    const assessment = assessCropQuality(crop, sampleType);
    const listingId = `LIST-${Date.now()}`;

    const q = parseFloat(quantityQuintals) || 3.0;
    const price = parseFloat(expectedPricePerQ) || 2500;
    const fName = farmerName || "Harpreet Singh";
    const vName = village || "Kakra";
    const dName = district || "Sangrur";
    const sName = state || "Punjab";
    const phoneNo = phone || "+91 98765-12340";
    const cName = crop || "Wheat (Gehu)";
    const imgUrl = photoUrl || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80";
    const cId = clusterId || "cluster-sgr-01";
    const method = createdVia || "Voice (Bhashini AI)";
    const uId = userId || "usr-demo-01";

    await dbRun(`
      INSERT INTO produce_listings (
        id, user_id, farmer_name, village, district, state, phone,
        crop, quantity_quintals, expected_price_per_q, quality_grade,
        defect_score_percent, ai_confidence, status, photo_url,
        cluster_id, created_via, is_demo_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE_MATCHING', ?, ?, ?, 0)
    `, [
      listingId, uId, fName, vName, dName, sName, phoneNo,
      cName, q, price, assessment.grade, assessment.defectScorePercent,
      assessment.confidence, imgUrl, cId, method
    ]);

    const newListing = await dbGet(`SELECT * FROM produce_listings WHERE id = ?`, [listingId]);

    return res.status(201).json({
      success: true,
      message: "Produce listing successfully committed to SQLite database!",
      listing: newListing,
      assessment
    });
  } catch (err) {
    console.error("Listing insert error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
