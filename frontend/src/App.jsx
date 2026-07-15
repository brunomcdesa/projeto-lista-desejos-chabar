import { useState, useEffect, useMemo } from 'react';
import Hero from './components/Hero.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import GiftList from './components/GiftList.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import RsvpScreen from './components/RsvpScreen.jsx';
import { resolveGuestKey } from './guestKey.js';

const CATEGORIES = ['Todos', 'Cozinha', 'Mesa Posta', 'Banheiro', 'Quarto', 'Lavanderia'];

const normalize = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function Toast({ msg, onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 1800);
    const t2 = setTimeout(onDone, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return <div className={`toast${out ? ' out' : ''}`}>{msg}</div>;
}

function useAdminMode() {
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    window.location.search.includes('admin')
  );
  const [adminPassword, setAdminPassword] = useState(() => {
    if (!window.location.search.includes('admin')) return null;
    return sessionStorage.getItem('adminPassword') || null;
  });

  const login = (pw) => setAdminPassword(pw);
  const exitAdmin = () => {
    window.history.replaceState({}, '', window.location.pathname);
    setIsAdminRoute(false);
  };
  const logout = () => {
    sessionStorage.removeItem('adminPassword');
    setAdminPassword(null);
    exitAdmin();
  };

  return { isAdminRoute, adminPassword, login, logout, exitAdmin };
}

function getStoredRsvp() {
  try {
    const raw = localStorage.getItem('chabar_rsvp');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}


export default function App() {
  const { isAdminRoute, adminPassword, login, logout, exitAdmin } = useAdminMode();

  const [view, setView]           = useState(() => (getStoredRsvp() ? 'gifts' : 'rsvp'));
  const [guestName, setGuestName] = useState(() => getStoredRsvp()?.name || '');

  const [items, setItems]                 = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery]     = useState('');
  const [loading, setLoading]             = useState(true);
  const [byMe, setByMe]                   = useState(() => new Set());
  const [toast, setToast]                 = useState(null);
  const [guestKey, setGuestKey]           = useState(null);

  useEffect(() => {
    if (isAdminRoute) return;
    if (view !== 'gifts') return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { key, legacy } = await resolveGuestKey();
      const headers = { 'x-guest-key': key };
      if (legacy) headers['x-guest-key-legacy'] = legacy;
      const res = await fetch('/api/items', { headers });
      const data = await res.json();
      if (cancelled) return;
      localStorage.setItem('chabar_guest_key', key);
      setGuestKey(key);
      setItems(data);
      setByMe(new Set(data.filter((i) => i.reservedByMe).map((i) => i.id)));
    })()
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isAdminRoute, view]);

  const applyItem = (updated) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setByMe((prev) => {
      const next = new Set(prev);
      updated.reservedByMe ? next.add(updated.id) : next.delete(updated.id);
      return next;
    });
  };

  const handleToggle = async (id) => {
    if (!guestKey) return;
    const wasReservedByMe = byMe.has(id);
    const itemName = items.find((i) => i.id === id)?.name;
    const res = await fetch(`/api/items/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'x-guest-key': guestKey },
    });
    const body = await res.json().catch(() => null);
    if (res.status === 409) {
      if (body?.item) applyItem(body.item);
      setToast(`Ops! "${itemName}" acabou de ser totalmente reservado.`);
      return;
    }
    if (!res.ok || !body) return;
    applyItem(body);
    setToast(
      wasReservedByMe
        ? `Reserva de "${itemName}" cancelada.`
        : `🎁 "${itemName}" reservado!`
    );
  };

  const filtered = useMemo(() => {
    let result =
      selectedCategory === 'Todos'
        ? items
        : items.filter((i) => i.category === selectedCategory);
    const q = normalize(searchQuery.trim());
    if (q) {
      result = result.filter((i) =>
        [i.name, i.description, i.category].some((f) => normalize(f).includes(q))
      );
    }
    return result;
  }, [items, selectedCategory, searchQuery]);

  const totalReceived = items.reduce((s, i) => s + (i.quantityReceived ?? 0), 0);
  const totalQuantity = items.reduce((s, i) => s + (i.quantity ?? 1), 0);

  const handleConfirmed = (name) => {
    setGuestName(name);
    setView('gifts');
  };

  if (isAdminRoute && !adminPassword) {
    return (
      <AdminLogin onLogin={login} onBack={exitAdmin} />
    );
  }

  if (isAdminRoute && adminPassword) {
    return <AdminPanel adminPassword={adminPassword} onLogout={logout} />;
  }

  if (view === 'rsvp') {
    return <RsvpScreen onConfirmed={handleConfirmed} />;
  }

  return (
    <div className="gifts-screen">
      <Hero total={totalQuantity} purchased={totalReceived} guestName={guestName} />
      <CategoryFilter
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <div className="search-wrap">
        <input
          type="search"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar presente..."
          aria-label="Buscar presente"
        />
      </div>
      <div className="gifts-wrap">
        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '3rem' }}>
            Carregando lista...
          </p>
        ) : (
          <GiftList
            items={filtered}
            byMe={byMe}
            onToggle={handleToggle}
            emptyMessage={
              searchQuery.trim()
                ? 'Nenhum presente encontrado para sua busca.'
                : 'Nenhum item nesta categoria.'
            }
          />
        )}
      </div>
      {toast && <Toast key={toast} msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
