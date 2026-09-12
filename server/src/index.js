import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import mandiRoutes from './routes/mandi.js';
import listingsRoutes from './routes/listings.js';
import profitRoutes from './routes/profit.js';
import poolingRoutes from './routes/pooling.js';
import escrowRoutes from './routes/escrow.js';
import bhashiniRoutes from './routes/bhashini.js';
import analyticsRoutes from './routes/analytics.js';
import databaseRoutes from './routes/database.js';
import { initializeDatabase } from './data/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/profit', profitRoutes);
app.use('/api/pooling', poolingRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/bhashini', bhashiniRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/database', databaseRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: "healthy",
    project: "AgriLink",
    database: "SQLite 3 (Persistent On-Disk)",
    timestamp: new Date().toISOString()
  });
});

// Serve client build if available
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Initialize SQLite tables before listening
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌾 AgriLink Server & Client running on http://localhost:${PORT}`);
      console.log(`🗄️ SQLite Database active at server/data/agrilink.db`);
    });
  })
  .catch(err => {
    console.error("Failed to initialize database:", err);
  });
