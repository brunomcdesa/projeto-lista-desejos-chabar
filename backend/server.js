const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chabar2024';

db.init();

app.use(cors());
app.use(express.json());

function adminAuth(req, res, next) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
}

async function scrapeOgImage(url) {
  // Primária: microlink.io — suporta páginas JS-rendered (gratuito, sem API key)
  try {
    const mlRes = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (mlRes.ok) {
      const data = await mlRes.json();
      if (data.status === 'success' && data.data?.image?.url) return data.data.image.url;
    }
  } catch {}

  // Fallback: scraping direto com headers de navegador real
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ??
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (!match) return null;
    const raw = match[1];
    if (/^https?:\/\//i.test(raw)) return raw;
    try { return new URL(raw, url).href; } catch { return null; }
  } catch {
    return null;
  }
}

app.get('/api/items', (req, res) => {
  const { category } = req.query;
  let items = db.getAll();
  if (category) items = items.filter((i) => i.category === category);
  res.json(items);
});

app.patch('/api/items/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.toggle(id);
  if (!updated) return res.status(404).json({ error: 'Item não encontrado' });
  res.json(updated);
});

app.get('/api/admin/verify', adminAuth, (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/og-image', adminAuth, async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url é obrigatório' });
  const imageUrl = await scrapeOgImage(url);
  res.json({ imageUrl: imageUrl || null });
});

app.post('/api/items', adminAuth, async (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'name e category são obrigatórios' });
  const body = { ...req.body };
  if (!body.imageUrl && Array.isArray(body.purchaseLinks) && body.purchaseLinks[0]) {
    body.imageUrl = await scrapeOgImage(body.purchaseLinks[0]);
  }
  const item = db.create(body);
  res.status(201).json(item);
});

app.put('/api/items/:id', adminAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = { ...req.body };
  if (!body.imageUrl && Array.isArray(body.purchaseLinks) && body.purchaseLinks[0]) {
    body.imageUrl = await scrapeOgImage(body.purchaseLinks[0]);
  }
  const updated = db.update(id, body);
  if (!updated) return res.status(404).json({ error: 'Item não encontrado' });
  res.json(updated);
});

app.delete('/api/items/:id', adminAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const removed = db.remove(id);
  if (!removed) return res.status(404).json({ error: 'Item não encontrado' });
  res.json({ success: true });
});

app.post('/api/rsvp', (req, res) => {
  const { name, phone, companions, compNames, message } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nome é obrigatório' });
  const result = db.addGuest({ name, phone, companions, compNames, message });
  if (result.duplicate) return res.status(409).json({ duplicate: true, guest: result.guest });
  res.status(201).json(result.guest);
});

app.get('/api/rsvp', adminAuth, (_req, res) => {
  res.json(db.getAllGuests());
});

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
