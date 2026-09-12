import express from 'express';
import { dbAll, dbRun, dbGet } from '../data/db.js';

const router = express.Router();

// Get all hyperlocal clusters with members
router.get('/clusters', async (req, res) => {
  try {
    const clusters = await dbAll(`SELECT * FROM pooling_clusters`);
    const members = await dbAll(`SELECT * FROM cluster_members ORDER BY pickup_order ASC`);

    const result = clusters.map(c => {
      const clusterFarmers = members.filter(m => m.cluster_id === c.id).map(m => ({
        farmerId: m.id,
        name: m.farmer_name,
        village: m.village,
        crop: m.crop,
        quantityQuintals: m.quantity_quintals,
        pickupOrder: m.pickup_order,
        status: m.status
      }));

      return {
        id: c.id,
        name: c.name,
        hubVillage: c.hub_village,
        district: c.district,
        state: c.state,
        radiusKm: c.radius_km,
        freightSavingsPercent: c.savings_percent,
        status: c.status,
        targetDestination: c.target_destination,
        assignedVehicle: {
          vehicleNumber: c.vehicle_number,
          model: c.vehicle_model,
          driverName: c.driver_name,
          driverPhone: c.driver_phone,
          totalCapacityQuintals: c.total_capacity_quintals,
          currentLoadQuintals: c.current_load_quintals,
          ratePerKmStandalone: c.rate_standalone,
          ratePerKmPooled: c.rate_pooled
        },
        farmersInPool: clusterFarmers
      };
    });

    return res.json({ total: result.length, clusters: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Join a transport pool
router.post('/join', async (req, res) => {
  try {
    const { clusterId, farmerName, village, crop, quantityQuintals } = req.body;
    const q = parseFloat(quantityQuintals) || 2.0;

    const cluster = await dbGet(`SELECT * FROM pooling_clusters WHERE id = ?`, [clusterId]);
    if (!cluster) return res.status(404).json({ error: "Cluster not found" });

    const newLoad = cluster.current_load_quintals + q;
    if (newLoad > cluster.total_capacity_quintals) {
      return res.status(400).json({
        error: `Capacity exceeded! Truck only has ${(cluster.total_capacity_quintals - cluster.current_load_quintals).toFixed(1)} Quintals left.`
      });
    }

    const memberId = `m-${Date.now()}`;
    const existingCount = await dbGet(`SELECT COUNT(*) as cnt FROM cluster_members WHERE cluster_id = ?`, [clusterId]);

    await dbRun(`
      INSERT INTO cluster_members (id, cluster_id, farmer_name, village, crop, quantity_quintals, pickup_order, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED_PICKUP')
    `, [memberId, clusterId, farmerName || "New Farmer", village || cluster.hub_village, crop || "Wheat", q, (existingCount.cnt || 0) + 1]);

    let newStatus = cluster.status;
    if (newLoad >= cluster.total_capacity_quintals * 0.8) {
      newStatus = "VEHICLE_DISPATCH_READY";
    }

    await dbRun(`
      UPDATE pooling_clusters
      SET current_load_quintals = ?, status = ?
      WHERE id = ?
    `, [Number(newLoad.toFixed(1)), newStatus, clusterId]);

    return res.json({
      success: true,
      message: `Successfully booked transport slot! Committed to SQLite database. Saved ${cluster.savings_percent}% on freight.`,
      memberId
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Dispatch vehicle
router.post('/dispatch/:clusterId', async (req, res) => {
  try {
    const { clusterId } = req.params;
    await dbRun(`UPDATE pooling_clusters SET status = 'IN_TRANSIT' WHERE id = ?`, [clusterId]);
    await dbRun(`UPDATE cluster_members SET status = 'IN_TRANSIT' WHERE cluster_id = ?`, [clusterId]);
    return res.json({ success: true, message: "Vehicle dispatched and updated in SQLite database!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
