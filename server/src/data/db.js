import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.resolve(__dirname, '../../data');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'agrilink.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err);
  } else {
    console.log(`🗄️ Connected to persistent SQLite database: ${dbPath}`);
  }
});

// Helper promise wrapper for queries
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    logSqlQuery(sql, params);
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    logSqlQuery(sql, params);
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    logSqlQuery(sql, params);
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// In-memory query log for Live Database Inspector
export const sqlQueryLogs = [];

function logSqlQuery(sql, params) {
  const logEntry = {
    id: Date.now() + Math.random().toString(36).substr(2, 4),
    query: sql.trim().replace(/\s+/g, ' '),
    params: params && params.length ? JSON.stringify(params) : null,
    timestamp: new Date().toISOString()
  };
  sqlQueryLogs.unshift(logEntry);
  if (sqlQueryLogs.length > 50) sqlQueryLogs.pop();
}

// Initialize tables
export async function initializeDatabase() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      village TEXT,
      district TEXT,
      state TEXT,
      crops TEXT,
      bank_account TEXT,
      upi_id TEXT,
      role TEXT DEFAULT 'farmer',
      is_demo_user INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS produce_listings (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      farmer_name TEXT NOT NULL,
      village TEXT,
      district TEXT,
      state TEXT,
      phone TEXT,
      crop TEXT NOT NULL,
      quantity_quintals REAL NOT NULL,
      expected_price_per_q REAL NOT NULL,
      quality_grade TEXT DEFAULT 'Grade A',
      defect_score_percent REAL DEFAULT 2.5,
      ai_confidence REAL DEFAULT 95.0,
      status TEXT DEFAULT 'ACTIVE_MATCHING',
      photo_url TEXT,
      cluster_id TEXT,
      created_via TEXT DEFAULT 'Voice / PWA',
      is_demo_data INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS pooling_clusters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      hub_village TEXT NOT NULL,
      district TEXT,
      state TEXT,
      radius_km REAL,
      vehicle_number TEXT,
      vehicle_model TEXT,
      driver_name TEXT,
      driver_phone TEXT,
      total_capacity_quintals REAL,
      current_load_quintals REAL,
      rate_standalone REAL,
      rate_pooled REAL,
      savings_percent REAL,
      status TEXT DEFAULT 'OPEN_FOR_POOLING',
      target_destination TEXT
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS cluster_members (
      id TEXT PRIMARY KEY,
      cluster_id TEXT NOT NULL,
      farmer_name TEXT NOT NULL,
      village TEXT,
      crop TEXT,
      quantity_quintals REAL NOT NULL,
      pickup_order INTEGER,
      status TEXT DEFAULT 'SCHEDULED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS escrow_transactions (
      id TEXT PRIMARY KEY,
      buyer_name TEXT NOT NULL,
      buyer_gst TEXT,
      farmer_name TEXT NOT NULL,
      farmer_phone TEXT,
      farmer_village TEXT,
      farmer_bank TEXT,
      crop TEXT NOT NULL,
      quantity_quintals REAL NOT NULL,
      agreed_rate_per_q REAL NOT NULL,
      gross_amount REAL NOT NULL,
      transport_deduction REAL NOT NULL,
      net_farmer_payout REAL NOT NULL,
      status TEXT DEFAULT 'VAULT_LOCKED',
      utr_number TEXT,
      tracking_id TEXT,
      is_demo_data INTEGER DEFAULT 0,
      locked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      dispatched_at DATETIME,
      delivered_at DATETIME,
      dbt_released_at DATETIME
    )
  `);

  // Check if clusters are seeded
  const existingClusters = await dbAll(`SELECT COUNT(*) as count FROM pooling_clusters`);
  if (existingClusters[0].count === 0) {
    await seedBaseClusters();
  }
}

async function seedBaseClusters() {
  await dbRun(`
    INSERT INTO pooling_clusters (id, name, hub_village, district, state, radius_km, vehicle_number, vehicle_model, driver_name, driver_phone, total_capacity_quintals, current_load_quintals, rate_standalone, rate_pooled, savings_percent, status, target_destination)
    VALUES
    ('cluster-sgr-01', 'Sangrur-Bhawanigarh Agricultural Cluster', 'Bhawanigarh', 'Sangrur', 'Punjab', 7.5, 'PB-13-BB-8924', 'Tata Ace Gold (Mini Truck)', 'Gurpreet Singh', '+91 98721-45012', 10.0, 5.5, 26, 14, 42, 'OPEN_FOR_POOLING', 'Azadpur APMC Mandi, Delhi'),
    ('cluster-nsk-02', 'Niphad-Lasalgaon Onion Cluster', 'Niphad', 'Nashik', 'Maharashtra', 6.0, 'MH-15-EG-4419', 'Mahindra Bolero Maxi Truck', 'Santosh Shinde', '+91 94222-77180', 15.0, 9.0, 28, 15, 46, 'OPEN_FOR_POOLING', 'Vashi APMC, Navi Mumbai'),
    ('cluster-knl-03', 'Gharaunda-Nilokheri Vegetable Cluster', 'Gharaunda', 'Karnal', 'Haryana', 8.0, 'HR-05-AL-3188', 'Ashok Leyland Dost+', 'Kuldeep Rana', '+91 98120-66431', 12.0, 7.0, 25, 13.5, 44, 'OPEN_FOR_POOLING', 'Mother Dairy Safal Procurement Center')
  `);

  await dbRun(`
    INSERT INTO cluster_members (id, cluster_id, farmer_name, village, crop, quantity_quintals, pickup_order, status)
    VALUES
    ('m-1', 'cluster-sgr-01', 'Harpreet Singh', 'Kakra', 'Wheat (Gehu)', 3.0, 1, 'LOADED'),
    ('m-2', 'cluster-sgr-01', 'Gurmeet Singh', 'Balial', 'Wheat (Gehu)', 2.5, 2, 'SCHEDULED'),
    ('m-3', 'cluster-nsk-02', 'Ramesh Patil', 'Kundewadi', 'Red Onion', 4.0, 1, 'LOADED'),
    ('m-4', 'cluster-nsk-02', 'Balasaheb Jadhav', 'Pimpalgaon', 'Red Onion', 5.0, 2, 'LOADED')
  `);
}

// Seed Demo Project Data
export async function seedDemoProject() {
  // Demo User
  await dbRun(`
    INSERT OR REPLACE INTO users (id, name, phone, village, district, state, crops, bank_account, upi_id, role, is_demo_user)
    VALUES ('usr-demo-01', 'Harpreet Singh', '9876512340', 'Kakra', 'Sangrur', 'Punjab', 'Wheat, Paddy', 'Punjab National Bank - ****4091', 'harpreet98@okhdfcbank', 'farmer', 1)
  `);

  // Demo Listings
  await dbRun(`
    INSERT OR REPLACE INTO produce_listings (id, user_id, farmer_name, village, district, state, phone, crop, quantity_quintals, expected_price_per_q, quality_grade, defect_score_percent, ai_confidence, status, photo_url, cluster_id, created_via, is_demo_data)
    VALUES
    ('LIST-101', 'usr-demo-01', 'Harpreet Singh', 'Kakra', 'Sangrur', 'Punjab', '+91 98765-12340', 'Wheat (Gehu)', 3.0, 2580, 'Grade A', 2.1, 96.8, 'SOLD_ESCROW', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80', 'cluster-sgr-01', 'Voice (Bhashini Punjabi)', 1),
    ('LIST-102', 'usr-demo-01', 'Harpreet Singh', 'Kakra', 'Sangrur', 'Punjab', '+91 98765-12340', 'Basmati Paddy (Dhan)', 4.5, 3420, 'Grade A', 1.9, 97.4, 'ACTIVE_MATCHING', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'cluster-sgr-01', 'Voice (Bhashini Punjabi)', 1)
  `);

  // Demo Escrow Transactions
  await dbRun(`
    INSERT OR REPLACE INTO escrow_transactions (id, buyer_name, buyer_gst, farmer_name, farmer_phone, farmer_village, farmer_bank, crop, quantity_quintals, agreed_rate_per_q, gross_amount, transport_deduction, net_farmer_payout, status, utr_number, tracking_id, is_demo_data)
    VALUES
    ('ESC-2026-9014', 'ITC e-Choupal Sourcing Division', '07AAACI1681G1ZM', 'Harpreet Singh', '+91 98765-12340', 'Kakra, Sangrur', 'Punjab National Bank (A/C: ****4091)', 'Wheat (Sharbati Grade-A)', 3.0, 2580, 7740, 390, 7350, 'INSTANT_DBT_RELEASED', 'UPI/326719823091/PUNB', 'TRK-PB-8924-01', 1),
    ('ESC-2026-9015', 'Mother Dairy Safal Procurement', '07AAACM4819Q1ZP', 'Harpreet Singh', '+91 98765-12340', 'Kakra, Sangrur', 'Punjab National Bank (A/C: ****4091)', 'Basmati Paddy', 4.5, 3420, 15390, 680, 14710, 'DELIVERY_CONFIRMED', NULL, 'TRK-PB-8924-02', 1)
  `);
}

// Clear non-demo listings to simulate a brand new empty user profile
export async function clearUserData(userId) {
  await dbRun(`DELETE FROM produce_listings WHERE user_id = ?`, [userId]);
  await dbRun(`DELETE FROM escrow_transactions WHERE farmer_phone IN (SELECT phone FROM users WHERE id = ?)`, [userId]);
}

export default db;
