const express = require('express');
const path    = require('path');
const fs      = require('fs');
const app     = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.send('Bodyshop Engine is live 🚀');
});

app.get('/api/products', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('./formulas.json', 'utf8'));
    res.json({ ok: true, products: data.products, emm_process_data: data.emm_process_data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/calculate', (req, res) => {
  try {
    const { run } = require('./engine.js');
    const result  = run(req.body);
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Bodyshop engine running on port ${port}`);
});