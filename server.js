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

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.send('Bodyshop Engine is live 🚀');
});

app.get('/api/products', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'formulas.json');

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        ok: false,
        error: 'formulas.json not found'
      });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    res.json({
      ok: true,
      products: data.products,
      emm_process_data: data.emm_process_data
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/calculate', (req, res) => {
  try {
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