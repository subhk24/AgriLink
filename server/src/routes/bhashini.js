import express from 'express';
import { supportedDialects, parseVoiceQuery } from '../services/bhashini.js';

const router = express.Router();

// Supported dialects list
router.get('/dialects', (req, res) => {
  return res.json({
    total: supportedDialects.length,
    dialects: supportedDialects
  });
});

// Parse spoken voice query
router.post('/query', (req, res) => {
  const { spokenText, dialectCode, context } = req.body;
  const result = parseVoiceQuery(spokenText, dialectCode || "hi", context || {});
  return res.json({
    success: true,
    dialect: dialectCode || "hi",
    inputQuery: spokenText,
    result
  });
});

export default router;
