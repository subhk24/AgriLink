import express from 'express';
import { dbGet, dbRun, dbAll } from '../data/db.js';

const router = express.Router();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Mobile number required" });
  }

  // Check if user already exists
  const existing = await dbGet(`SELECT * FROM users WHERE phone = ?`, [phone]);

  return res.json({
    success: true,
    message: "OTP sent successfully via SMS gateway",
    demoOtp: "2026",
    isExistingUser: !!existing,
    phone
  });
});

// Verify OTP & Register / Login
router.post('/verify-otp', async (req, res) => {
  const { phone, otp, name, village, district, state, crops, bankAccount, upiId, role } = req.body;

  if (otp !== "2026" && otp !== "1234") {
    return res.status(400).json({ error: "Invalid OTP. Use demo OTP: 2026" });
  }

  let user = await dbGet(`SELECT * FROM users WHERE phone = ?`, [phone]);

  if (!user) {
    // Insert new user into SQLite
    const newId = `usr-${Date.now()}`;
    const userName = name || "New Farmer";
    const userVillage = village || "Malerkotla";
    const userDistrict = district || "Sangrur";
    const userState = state || "Punjab";
    const userCrops = crops ? (Array.isArray(crops) ? crops.join(', ') : crops) : "Wheat";
    const userBank = bankAccount || "State Bank of India (A/C: ****5540)";
    const userUpi = upiId || `${phone}@upi`;
    const userRole = role || "farmer";

    await dbRun(`
      INSERT INTO users (id, name, phone, village, district, state, crops, bank_account, upi_id, role, is_demo_user)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [newId, userName, phone, userVillage, userDistrict, userState, userCrops, userBank, userUpi, userRole]);

    user = await dbGet(`SELECT * FROM users WHERE id = ?`, [newId]);
  }

  return res.json({
    success: true,
    message: "Authenticated successfully. Record stored in SQLite database.",
    user,
    token: `token-${user.id}`
  });
});

// One-click Login for Quick Demo User
router.post('/login-demo', async (req, res) => {
  let demoUser = await dbGet(`SELECT * FROM users WHERE is_demo_user = 1 LIMIT 1`);
  if (!demoUser) {
    const newId = 'usr-demo-01';
    await dbRun(`
      INSERT OR REPLACE INTO users (id, name, phone, village, district, state, crops, bank_account, upi_id, role, is_demo_user)
      VALUES (?, 'Harpreet Singh', '9876512340', 'Kakra', 'Sangrur', 'Punjab', 'Wheat, Paddy', 'Punjab National Bank - ****4091', 'harpreet98@okhdfcbank', 'farmer', 1)
    `, [newId]);
    demoUser = await dbGet(`SELECT * FROM users WHERE id = ?`, [newId]);
  }

  return res.json({
    success: true,
    message: "Logged in as Demo Farmer (Harpreet Singh)",
    user: demoUser,
    token: `token-${demoUser.id}`
  });
});

// Get current profile
router.get('/profile/:id', async (req, res) => {
  const user = await dbGet(`SELECT * FROM users WHERE id = ?`, [req.params.id]);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({ user });
});

export default router;
