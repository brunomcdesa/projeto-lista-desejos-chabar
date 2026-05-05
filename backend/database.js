const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'db.json');
const guestsPath = path.join(dataDir, 'guests.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const SEED = [
  // Cozinha
  { name: 'Panela de Pressão', description: '4,5 a 6 litros', category: 'Cozinha', emoji: '🍲', purchased: false },
  { name: 'Frigideira Antiaderente', description: 'Tamanho grande (28–30cm)', category: 'Cozinha', emoji: '🍳', purchased: false },
  { name: 'Jogo de Panelas', description: 'Kit com 5 a 7 peças', category: 'Cozinha', emoji: '🥘', purchased: false },
  { name: 'Liquidificador', description: 'Potência mínima de 700W', category: 'Cozinha', emoji: '🫙', purchased: false },
  { name: 'Batedeira', description: 'Com tigela e acessórios', category: 'Cozinha', emoji: '🍰', purchased: false },
  { name: 'Torradeira', description: '2 fatias', category: 'Cozinha', emoji: '🍞', purchased: false },
  { name: 'Chaleira Elétrica', description: 'Capacidade 1,7L', category: 'Cozinha', emoji: '☕', purchased: false },
  { name: 'Air Fryer', description: 'Capacidade mínima de 4L', category: 'Cozinha', emoji: '🌡️', purchased: false },
  { name: 'Forma de Bolo', description: 'Fundo removível ou antiaderente', category: 'Cozinha', emoji: '🎂', purchased: false },
  { name: 'Assadeira', description: 'Grande, antiaderente', category: 'Cozinha', emoji: '🥧', purchased: false },
  { name: 'Escorredor de Macarrão', description: 'Aço inox ou plástico resistente', category: 'Cozinha', emoji: '🍝', purchased: false },
  { name: 'Tábua de Corte', description: 'Kit com 2 peças', category: 'Cozinha', emoji: '🔪', purchased: false },
  // Mesa Posta
  { name: 'Jogo de Pratos', description: 'Para 6 pessoas (fundo + raso + sobremesa)', category: 'Mesa Posta', emoji: '🍽️', purchased: false },
  { name: 'Jogo de Xícaras', description: 'Para chá/café, 6 peças', category: 'Mesa Posta', emoji: '☕', purchased: false },
  { name: 'Jogo de Copos', description: 'Água e suco, 6 peças', category: 'Mesa Posta', emoji: '🥤', purchased: false },
  { name: 'Taças de Vinho', description: 'Kit com 6 taças', category: 'Mesa Posta', emoji: '🍷', purchased: false },
  { name: 'Jogo de Talheres', description: 'Para 6 pessoas (garfo, faca, colher)', category: 'Mesa Posta', emoji: '🍴', purchased: false },
  { name: 'Travessa Grande', description: 'Para servir carnes e saladas', category: 'Mesa Posta', emoji: '🫕', purchased: false },
  { name: 'Saladeira', description: 'Com garfos de servir', category: 'Mesa Posta', emoji: '🥗', purchased: false },
  { name: 'Jarra', description: 'Vidro, 1,5L', category: 'Mesa Posta', emoji: '🫙', purchased: false },
  // Banheiro
  { name: 'Jogo de Toalhas de Banho', description: '4 peças (banho + rosto)', category: 'Banheiro', emoji: '🛁', purchased: false },
  { name: 'Toalhas de Rosto', description: 'Kit com 4 unidades', category: 'Banheiro', emoji: '🧖', purchased: false },
  { name: 'Tapete de Banheiro', description: 'Antiderrapante, conjunto 2 peças', category: 'Banheiro', emoji: '🛋️', purchased: false },
  { name: 'Porta-Toalha', description: 'De parede ou bancada', category: 'Banheiro', emoji: '🪝', purchased: false },
  { name: 'Saboneteira', description: 'Com porta-sabonete líquido', category: 'Banheiro', emoji: '🧴', purchased: false },
  { name: 'Suporte de Papel Higiênico', description: 'Cromado ou branco', category: 'Banheiro', emoji: '🧻', purchased: false },
  // Quarto
  { name: 'Jogo de Cama Casal', description: 'Lençol + fronhas + cobre-leito', category: 'Quarto', emoji: '🛏️', purchased: false },
  { name: 'Cobertor / Manta', description: 'Casal, material macio', category: 'Quarto', emoji: '🧣', purchased: false },
  { name: 'Almofadas Decorativas', description: 'Kit com 2 a 4 peças', category: 'Quarto', emoji: '🛋️', purchased: false },
  { name: 'Porta-Retratos', description: 'Kit com 3 molduras diferentes', category: 'Quarto', emoji: '🖼️', purchased: false },
  // Lavanderia
  { name: 'Cesto de Roupa Suja', description: 'Com tampa, grande', category: 'Lavanderia', emoji: '🧺', purchased: false },
  { name: 'Cabides', description: 'Kit com 20 unidades', category: 'Lavanderia', emoji: '🪢', purchased: false },
  { name: 'Ferro de Passar', description: 'A vapor', category: 'Lavanderia', emoji: '👔', purchased: false },
  { name: 'Tábua de Passar', description: 'Com regulagem de altura', category: 'Lavanderia', emoji: '🧺', purchased: false },
];

function load() {
  if (!fs.existsSync(dbPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch {
    return null;
  }
}

function save(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

function migrate(items) {
  let changed = false;
  const result = items.map((item) => {
    const patch = {};
    if (item.quantity === undefined) { patch.quantity = 1; changed = true; }
    if (item.purchaseLinks === undefined) { patch.purchaseLinks = []; changed = true; }
    if (item.quantityReceived === undefined) {
      patch.quantityReceived = item.purchased ? (item.quantity ?? 1) : 0;
      changed = true;
    }
    return { ...item, ...patch };
  });
  if (changed) save(result);
  return result;
}

function getAll() {
  return migrate(load());
}

function init() {
  if (load()) return;
  const items = SEED.map((item, i) => ({
    id: i + 1,
    quantity: 1,
    purchaseLinks: [],
    ...item,
  }));
  save(items);
}

function toggle(id) {
  const items = load();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const item = items[idx];
  const qty = item.quantity ?? 1;
  const current = item.quantityReceived ?? (item.purchased ? qty : 0);

  if (current >= qty) {
    items[idx].quantityReceived = Math.max(0, current - 1);
  } else {
    items[idx].quantityReceived = current + 1;
  }
  items[idx].purchased = items[idx].quantityReceived >= qty;
  save(items);
  return items[idx];
}

function create(data) {
  const items = load();
  const maxId = items.reduce((max, i) => Math.max(max, i.id), 0);
  const item = {
    id: maxId + 1,
    name: data.name,
    emoji: data.emoji || '🎁',
    description: data.description || '',
    category: data.category,
    quantity: data.quantity ?? 1,
    purchaseLinks: Array.isArray(data.purchaseLinks) ? data.purchaseLinks : [],
    quantityReceived: 0,
    purchased: false,
  };
  items.push(item);
  save(items);
  return item;
}

function update(id, data) {
  const items = load();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const fields = ['name', 'emoji', 'description', 'category', 'quantity', 'quantityReceived', 'purchaseLinks'];
  fields.forEach((f) => { if (data[f] !== undefined) items[idx][f] = data[f]; });
  items[idx].purchased = (items[idx].quantityReceived ?? 0) >= (items[idx].quantity ?? 1);
  save(items);
  return items[idx];
}

function remove(id) {
  const items = load();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  save(items);
  return true;
}

function loadGuests() {
  if (!fs.existsSync(guestsPath)) return [];
  try { return JSON.parse(fs.readFileSync(guestsPath, 'utf-8')); }
  catch { return []; }
}

function saveGuests(guests) {
  fs.writeFileSync(guestsPath, JSON.stringify(guests, null, 2), 'utf-8');
}

function getAllGuests() {
  return loadGuests();
}

function addGuest(data) {
  const guests = loadGuests();
  const phone = data.phone?.trim() || '';
  if (phone) {
    const existing = guests.find((g) => g.phone === phone);
    if (existing) return { duplicate: true, guest: existing };
  }
  const maxId = guests.reduce((max, g) => Math.max(max, g.id), 0);
  const guest = {
    id: maxId + 1,
    name: data.name.trim(),
    phone,
    companions: Math.max(0, Number(data.companions) || 0),
    message: data.message?.trim() || '',
    confirmedAt: new Date().toISOString(),
  };
  guests.push(guest);
  saveGuests(guests);
  return { duplicate: false, guest };
}

module.exports = { init, getAll, toggle, create, update, remove, getAllGuests, addGuest };
