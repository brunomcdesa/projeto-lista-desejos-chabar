const fs = require('fs');
const path = require('path');

const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'db.json');
const guestsPath = path.join(dataDir, 'guests.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const SEED = [
  // Cozinha
  { name: 'Jogo de Panelas', description: 'Kit com 5 a 7 peças, antiaderente', category: 'Cozinha', purchased: false },
  { name: 'Panela de Pressão', description: '4,5 a 6 litros', category: 'Cozinha', purchased: false },
  { name: 'Frigideira Antiaderente', description: 'Tamanho grande (28–30cm)', category: 'Cozinha', purchased: false },
  { name: 'Chaleira Elétrica', description: 'Capacidade 1,7L', category: 'Cozinha', purchased: false },
  { name: 'Jogo de Facas', description: 'Kit com 4 a 6 peças + suporte', category: 'Cozinha', purchased: false },
  { name: 'Tábua de Corte', description: 'Kit com 2 peças (madeira ou plástico)', category: 'Cozinha', purchased: false },
  { name: 'Kit Utensílios de Cozinha', description: 'Concha, espátula, escumadeira, colher etc.', category: 'Cozinha', purchased: false },
  { name: 'Assadeira', description: 'Grande, antiaderente', category: 'Cozinha', purchased: false },
  { name: 'Forma de Bolo', description: 'Fundo removível ou antiaderente', category: 'Cozinha', purchased: false },
  { name: 'Escorredor de Macarrão', description: 'Aço inox ou plástico resistente', category: 'Cozinha', purchased: false },
  { name: 'Escorredor de Louça', description: 'Aço inox, com porta-talheres', category: 'Cozinha', purchased: false },
  { name: 'Potes Herméticos', description: 'Kit com 5 a 10 peças para mantimentos', category: 'Cozinha', purchased: false },
  { name: 'Ralador', description: 'Multiuso, 4 faces', category: 'Cozinha', purchased: false },
  { name: 'Abridor de Latas e Garrafas', description: 'Com saca-rolhas', category: 'Cozinha', purchased: false },
  { name: 'Kit Pano de Prato', description: 'Kit com 6 unidades', category: 'Cozinha', purchased: false },
  { name: 'Lixeira de Pia', description: 'Com tampa, 4 a 6L', category: 'Cozinha', purchased: false },
  // Mesa Posta
  { name: 'Aparelho de Jantar', description: 'Para 6 pessoas (prato fundo + raso + sobremesa)', category: 'Mesa Posta', purchased: false },
  { name: 'Jogo de Talheres', description: 'Para 6 pessoas (garfo, faca, colher, sobremesa)', category: 'Mesa Posta', purchased: false },
  { name: 'Jogo de Copos', description: 'Água e suco, 6 peças', category: 'Mesa Posta', purchased: false },
  { name: 'Taças de Vinho', description: 'Kit com 6 taças', category: 'Mesa Posta', purchased: false },
  { name: 'Jarra', description: 'Vidro, 1,5L', category: 'Mesa Posta', purchased: false },
  { name: 'Travessa Grande', description: 'Para servir carnes e saladas', category: 'Mesa Posta', purchased: false },
  { name: 'Saladeira', description: 'Com garfos de servir', category: 'Mesa Posta', purchased: false },
  { name: 'Jogo Americano', description: 'Kit com 6 unidades', category: 'Mesa Posta', purchased: false },
  { name: 'Toalha de Mesa', description: 'Para mesa de 6 lugares', category: 'Mesa Posta', purchased: false },
  { name: 'Petisqueira', description: 'Com divisórias', category: 'Mesa Posta', purchased: false },
  { name: 'Fruteira de Mesa', description: 'Aço ou cerâmica', category: 'Mesa Posta', purchased: false },
  { name: 'Boleira com Tampa', description: 'Vidro ou acrílico', category: 'Mesa Posta', purchased: false },
  // Banheiro
  { name: 'Jogo de Toalhas de Banho', description: '4 peças (banho + rosto)', category: 'Banheiro', purchased: false },
  { name: 'Toalhas de Rosto', description: 'Kit com 4 unidades', category: 'Banheiro', purchased: false },
  { name: 'Tapete de Banheiro', description: 'Antiderrapante, conjunto 2 peças', category: 'Banheiro', purchased: false },
  { name: 'Kit Acessórios de Bancada', description: 'Saboneteira, porta-escova e porta-algodão', category: 'Banheiro', purchased: false },
  { name: 'Escova Sanitária com Suporte', description: 'Design discreto', category: 'Banheiro', purchased: false },
  { name: 'Lixeira de Banheiro', description: 'Com tampa, 5L', category: 'Banheiro', purchased: false },
  // Quarto
  { name: 'Jogo de Cama Casal', description: 'Lençol + fronhas, algodão', category: 'Quarto', purchased: false },
  { name: 'Edredom Casal', description: 'Dupla face', category: 'Quarto', purchased: false },
  { name: 'Cobertor / Manta', description: 'Casal, material macio', category: 'Quarto', purchased: false },
  { name: 'Travesseiros', description: 'Kit com 2 unidades, antialérgico', category: 'Quarto', purchased: false },
  { name: 'Protetor de Colchão', description: 'Casal, impermeável', category: 'Quarto', purchased: false },
  { name: 'Almofadas Decorativas', description: 'Kit com 2 a 4 peças', category: 'Quarto', purchased: false },
  { name: 'Cortina', description: 'Para quarto, blackout', category: 'Quarto', purchased: false },
  // Lavanderia
  { name: 'Cesto de Roupa Suja', description: 'Com tampa, grande', category: 'Lavanderia', purchased: false },
  { name: 'Varal de Chão', description: 'Dobrável, aço', category: 'Lavanderia', purchased: false },
  { name: 'Kit Balde e Bacia', description: 'Plástico resistente', category: 'Lavanderia', purchased: false },
  { name: 'Vassoura, Rodo e Pá', description: 'Kit de limpeza completo', category: 'Lavanderia', purchased: false },
  { name: 'Mop / Esfregão', description: 'Com balde espremedor', category: 'Lavanderia', purchased: false },
  { name: 'Porta Sabão em Pó', description: 'Pote organizador com tampa', category: 'Lavanderia', purchased: false },
  { name: 'Prendedores de Roupa', description: 'Kit com 50 unidades', category: 'Lavanderia', purchased: false },
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
    if (item.quantityReceived === undefined) {
      patch.quantityReceived = item.purchased ? (item.quantity ?? 1) : 0;
      changed = true;
    }
    if (!Array.isArray(item.reservations)) {
      // Reservas antigas não têm dono conhecido — entram como anônimas (null)
      const received = patch.quantityReceived ?? item.quantityReceived ?? 0;
      patch.reservations = Array.from({ length: received }, () => null);
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
    ...item,
  }));
  save(items);
}

function toggle(id, guestKey) {
  const items = migrate(load());
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const item = items[idx];
  const qty = item.quantity ?? 1;

  const pos = item.reservations.indexOf(guestKey);
  if (pos !== -1) {
    // Já reservou este item: cancela a própria reserva
    item.reservations.splice(pos, 1);
  } else if (item.reservations.length < qty) {
    item.reservations.push(guestKey);
  } else {
    return { soldOut: true, item };
  }

  item.quantityReceived = item.reservations.length;
  item.purchased = item.quantityReceived >= qty;
  save(items);
  return { item };
}

function create(data) {
  const items = load();
  const maxId = items.reduce((max, i) => Math.max(max, i.id), 0);
  const item = {
    id: maxId + 1,
    name: data.name,
    description: data.description || '',
    category: data.category,
    quantity: data.quantity ?? 1,
    quantityReceived: 0,
    reservations: [],
    purchased: false,
  };
  items.push(item);
  save(items);
  return item;
}

function update(id, data) {
  const items = migrate(load());
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const fields = ['name', 'description', 'category', 'quantity', 'quantityReceived'];
  fields.forEach((f) => { if (data[f] !== undefined) items[idx][f] = data[f]; });

  // Ajuste manual do admin: remove reservas anônimas primeiro, preservando as dos convidados
  const target = Math.max(0, items[idx].quantityReceived ?? 0);
  const reservations = items[idx].reservations;
  while (reservations.length > target) {
    const anonIdx = reservations.indexOf(null);
    reservations.splice(anonIdx !== -1 ? anonIdx : reservations.length - 1, 1);
  }
  while (reservations.length < target) reservations.push(null);
  items[idx].quantityReceived = reservations.length;

  items[idx].purchased = (items[idx].quantityReceived ?? 0) >= (items[idx].quantity ?? 1);
  save(items);
  return items[idx];
}

// Migra reservas feitas com a chave aleatória antiga para a chave derivada do nome
function rekeyGuest(oldKey, newKey) {
  if (!oldKey || !newKey || oldKey === newKey) return;
  const items = migrate(load());
  let changed = false;
  for (const item of items) {
    item.reservations = item.reservations.map((k) => {
      if (k === oldKey) { changed = true; return newKey; }
      return k;
    });
  }
  if (changed) save(items);
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
  return migrateGuests(loadGuests());
}

function migrateGuests(guests) {
  let changed = false;
  const result = guests.map((g) => {
    if (g.compNames === undefined) { changed = true; return { ...g, compNames: [] }; }
    return g;
  });
  if (changed) saveGuests(result);
  return result;
}

const CONNECTIVES = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);

function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function hasSurname(name) {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter((w) => /\p{L}{2,}/u.test(w) && !CONNECTIVES.has(w.toLowerCase()));
  return words.length >= 2;
}

// Padroniza para formato t\u00edtulo: "bruno DA silva" -> "Bruno da Silva"
function formatName(name) {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((w) => (CONNECTIVES.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function addGuest(data) {
  const guests = loadGuests();
  const phone = data.phone?.trim() || '';
  if (phone) {
    const existing = guests.find((g) => g.phone === phone);
    if (existing) return { duplicate: true, guest: existing };
  }
  const sameName = guests.find((g) => normalizeName(g.name) === normalizeName(data.name));
  if (sameName) return { duplicate: true, guest: sameName };
  const maxId = guests.reduce((max, g) => Math.max(max, g.id), 0);
  const guest = {
    id: maxId + 1,
    name: formatName(data.name),
    phone,
    companions: Math.max(0, Number(data.companions) || 0),
    compNames: Array.isArray(data.compNames) ? data.compNames.filter(Boolean) : [],
    message: data.message?.trim() || '',
    confirmedAt: new Date().toISOString(),
  };
  guests.push(guest);
  saveGuests(guests);
  return { duplicate: false, guest };
}

module.exports = { init, getAll, toggle, create, update, remove, rekeyGuest, getAllGuests, addGuest, migrateGuests, hasSurname };
