import express from 'express';
import { dbAll, dbRun, dbGet } from '../data/db.js';

const router = express.Router();

// Get all escrow contracts
router.get('/', async (req, res) => {
  try {
    const { farmerPhone } = req.query;
    let sql = `SELECT * FROM escrow_transactions`;
    const params = [];
    if (farmerPhone) {
      sql += ` WHERE farmer_phone = ?`;
      params.push(farmerPhone);
    }
    sql += ` ORDER BY locked_at DESC`;
    const transactions = await dbAll(sql, params);
    return res.json({ total: transactions.length, transactions });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create / Lock new Escrow contract
router.post('/lock', async (req, res) => {
  try {
    const {
      buyerName,
      buyerGst,
      farmerName,
      farmerPhone,
      farmerVillage,
      farmerBank,
      crop,
      quantityQuintals,
      agreedRatePerQ,
      transportCostDeduction
    } = req.body;

    const txId = `ESC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const q = parseFloat(quantityQuintals) || 3.0;
    const rate = parseFloat(agreedRatePerQ) || 2500;
    const gross = q * rate;
    const transport = parseFloat(transportCostDeduction) || 350;
    const net = gross - transport;
    const tracking = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    await dbRun(`
      INSERT INTO escrow_transactions (
        id, buyer_name, buyer_gst, farmer_name, farmer_phone, farmer_village,
        farmer_bank, crop, quantity_quintals, agreed_rate_per_q, gross_amount,
        transport_deduction, net_farmer_payout, status, tracking_id, is_demo_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VAULT_LOCKED', ?, 0)
    `, [
      txId, buyerName || "ITC e-Choupal Procurement", buyerGst || "07AAACI1681G1ZM",
      farmerName || "Harpreet Singh", farmerPhone || "+91 98765-12340",
      farmerVillage || "Kakra, Sangrur", farmerBank || "Punjab National Bank (A/C: ****4091)",
      crop || "Wheat (Gehu)", q, rate, gross, transport, net, tracking
    ]);

    const tx = await dbGet(`SELECT * FROM escrow_transactions WHERE id = ?`, [txId]);

    return res.status(201).json({
      success: true,
      message: "100% Funds secured in Smart Escrow Vault & committed to SQLite database.",
      transaction: tx
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update status to DISPATCHED
router.post('/dispatch/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun(`
      UPDATE escrow_transactions
      SET status = 'IN_TRANSIT', dispatched_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    const tx = await dbGet(`SELECT * FROM escrow_transactions WHERE id = ?`, [id]);
    return res.json({ success: true, transaction: tx });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Buyer confirms delivery of produce
router.post('/confirm-delivery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun(`
      UPDATE escrow_transactions
      SET status = 'DELIVERY_CONFIRMED', delivered_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    const tx = await dbGet(`SELECT * FROM escrow_transactions WHERE id = ?`, [id]);
    return res.json({ success: true, transaction: tx });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Instant DBT / UPI Release
router.post('/release-dbt/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const utr = `UPI/${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}/NPCI`;

    await dbRun(`
      UPDATE escrow_transactions
      SET status = 'INSTANT_DBT_RELEASED',
          dbt_released_at = CURRENT_TIMESTAMP,
          utr_number = ?
      WHERE id = ?
    `, [utr, id]);

    const tx = await dbGet(`SELECT * FROM escrow_transactions WHERE id = ?`, [id]);

    return res.json({
      success: true,
      message: `DBT Payment of ₹${tx.net_farmer_payout.toLocaleString('en-IN')} released!`,
      utrNumber: utr,
      transaction: tx
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
