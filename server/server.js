// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDatabase, getDb } = require('./db');

const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// Simple logger middleware (coursework requirement)
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// Static middleware for lesson images (coursework requirement)
// Put files in: server/public/images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// --- API Routes ---
// Lessons endpoints (list, get by id, update spaces)
app.use('/api/lessons', require('./routes/lessons'));

// Orders endpoints (create orders)
app.use('/api/orders', require('./routes/orders'));

// Development-only route for seeding lessons
app.use('/dev', require('./routes/dev')); // remove or protect before deployment

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// --- Database Ping ---
app.get('/db-ping', async (req, res) => {
  try {
    const result = await getDb().command({ ping: 1 });
    res.json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Server Start ---
const PORT = process.env.PORT || 4000;
const DB_NAME = process.env.DB_NAME || 'after_school';

(async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI, DB_NAME);
    app.listen(PORT, () => {
      console.log(`✅ MongoDB connected and API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err.message);
    process.exit(1);
  }
})();
