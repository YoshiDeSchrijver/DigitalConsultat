console.log("Starting Bodyshop Engine...");

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Load engine safely
let run;
try {
  run = require('./engine.js').run;
} catch (err) {
  console.error("Engine load error:", err.message);
}

// Cache formulas.json at startup
let formulasCache = null;
try {
  formulasCache = JSON.parse(fs.readFileSync(path.join(__dirname, 'formulas.json'), 'utf8'));
  console.log("formulas.json loaded into cache.");
} catch (err) {
  console.error("Failed to load formulas.json:", err.message);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Bodyshop Engine is live 🚀');
});

app.get('/api/products', (req, res) => {
  if (!formulasCache) {
    return res.status(500).json({ ok: false, error: 'formulas.json not available' });
  }
  res.json({
    ok: true,
    products: formulasCache.products,
    product_systems: formulasCache.product_systems,
    emm_process_data: formulasCache.emm_process_data
  });
});

app.post('/api/calculate', (req, res) => {
  try {
    const required = ['repairs_per_year', 'preparation_workers', 'spray_painters', 'amount_spraybooths'];
    const missing = required.filter(f => req.body[f] === undefined || req.body[f] === null);
    if (missing.length > 0) {
      return res.status(400).json({ ok: false, error: `Missing required fields: ${missing.join(', ')}` });
    }

    if (!run) {
      return res.status(500).json({
        ok: false,
        error: 'engine.js missing or broken'
      });
    }

    const result = run(req.body);
    res.json({ ok: true, data: result });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 🚀 CRITICAL FOR RAILWAY
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Bodyshop engine running on port ${port}`);
});