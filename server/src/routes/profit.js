import express from 'express';
import { calculateNetProfitOptions } from '../services/netProfitEngine.js';

const router = express.Router();

// Calculate Net-Profit across destinations
router.post('/calculate', (req, res) => {
  const { cropId, quantityQuintals, isPooledTransport } = req.body;
  const result = calculateNetProfitOptions(cropId, quantityQuintals, isPooledTransport !== false);
  return res.json(result);
});

export default router;
