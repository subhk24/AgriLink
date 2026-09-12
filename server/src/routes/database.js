import express from 'express';
import { dbAll, sqlQueryLogs, seedDemoProject, clearUserData } from '../data/db.js';

const router = express.Router();

// Live Database Inspector
router.get('/inspect', async (req, res) => {
  try {
    const users = await dbAll(`SELECT * FROM users ORDER BY created_at DESC`);
    const listings = await dbAll(`SELECT * FROM produce_listings ORDER BY created_at DESC`);
    const clusters = await dbAll(`SELECT * FROM pooling_clusters`);
    const clusterMembers = await dbAll(`SELECT * FROM cluster_members ORDER BY pickup_order ASC`);
    const escrow = await dbAll(`SELECT * FROM escrow_transactions ORDER BY locked_at DESC`);

    const tableCounts = {
      users: users.length,
      produce_listings: listings.length,
      pooling_clusters: clusters.length,
      cluster_members: clusterMembers.length,
      escrow_transactions: escrow.length
    };

    return res.json({
      databaseEngine: "SQLite 3 (On-Disk Persistent)",
      dbPath: "server/data/agrilink.db",
      tableCounts,
      tables: {
        users,
        produce_listings: listings,
        pooling_clusters: clusters,
        cluster_members: clusterMembers,
        escrow_transactions: escrow
      },
      recentSqlLogs: sqlQueryLogs.slice(0, 20)
    });
  } catch (err) {
    console.error("Database inspect error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Seed demo project data
router.post('/seed-demo', async (req, res) => {
  try {
    await seedDemoProject();
    return res.json({ success: true, message: "Demo project data successfully seeded into SQLite!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Clear data for user
router.post('/clear-user', async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) {
      await clearUserData(userId);
    }
    return res.json({ success: true, message: "User data cleared to fresh clean state" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
