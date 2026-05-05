const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;
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

app.post('/api/items', adminAuth, (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'name e category são obrigatórios' });
  const item = db.create(req.body);
  res.status(201).json(item);
});

app.put('/api/items/:id', adminAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.update(id, req.body);
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
  const { name, phone, companions, message } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Nome é obrigatório' });
  const result = db.addGuest({ name, phone, companions, message });
  if (result.duplicate) return res.status(409).json({ duplicate: true, guest: result.guest });
  res.status(201).json(result.guest);
});

app.get('/api/rsvp', adminAuth, (_req, res) => {
  res.json(db.getAllGuests());
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
