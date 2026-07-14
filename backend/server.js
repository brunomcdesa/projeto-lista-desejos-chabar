const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

db.init();

app.use(cors());
app.use(express.json());

function adminAuth(req, res, next) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
}

// Nunca expõe a lista de reservas — apenas se o próprio convidado reservou
function publicItem(item, guestKey) {
  const { reservations, ...rest } = item;
  rest.reservedByMe = Boolean(guestKey) && (reservations || []).includes(guestKey);
  return rest;
}

app.get('/api/items', (req, res) => {
  const { category } = req.query;
  const guestKey = req.headers['x-guest-key'] || null;
  const legacyKey = req.headers['x-guest-key-legacy'];
  if (guestKey && legacyKey) db.rekeyGuest(legacyKey, guestKey);
  let items = db.getAll();
  if (category) items = items.filter((i) => i.category === category);
  res.json(items.map((i) => publicItem(i, guestKey)));
});

app.patch('/api/items/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const guestKey = req.headers['x-guest-key'];
  if (!guestKey) return res.status(400).json({ error: 'Identificação do convidado ausente' });
  const result = db.toggle(id, guestKey);
  if (!result) return res.status(404).json({ error: 'Item não encontrado' });
  if (result.soldOut) {
    return res.status(409).json({ error: 'Todos já reservados', item: publicItem(result.item, guestKey) });
  }
  res.json(publicItem(result.item, guestKey));
});

app.get('/api/admin/verify', adminAuth, (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/items', adminAuth, (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'name e category são obrigatórios' });
  const item = db.create(req.body);
  res.status(201).json(publicItem(item, null));
});

app.put('/api/items/:id', adminAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.update(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Item não encontrado' });
  res.json(publicItem(updated, null));
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
  if (!db.hasSurname(name)) return res.status(400).json({ error: 'Informe nome e sobrenome (ex.: Maria Silva).' });
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
