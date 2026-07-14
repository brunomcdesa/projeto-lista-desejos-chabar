import { useState, useEffect, useMemo } from 'react';
import Hero from './components/Hero.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import GiftList from './components/GiftList.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import RsvpScreen from './components/RsvpScreen.jsx';

const CATEGORIES = ['Todos', 'Cozinha', 'Mesa Posta', 'Banheiro', 'Quarto', 'Lavanderia'];

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
  const [loading, setLoading]             = useState(true);
  const [byMe, setByMe]                   = useState(() => new Set());
  const [toast, setToast]                 = useState(null);

  useEffect(() => {
    if (isAdminRoute) return;
    if (view !== 'gifts') return;
    setLoading(true);
    fetch('/api/items')
      .then((r) => r.json())
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  }, [isAdminRoute, view]);

  const handleToggle = async (id) => {
    const wasReservedByMe = byMe.has(id);
    const res = await fetch(`/api/items/${id}/toggle`, { method: 'PATCH' });
    if (!res.ok) return;
    const updated = await res.json();
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    setByMe((prev) => {
      const next = new Set(prev);
      wasReservedByMe ? next.delete(id) : next.add(id);
      return next;
    });
    setToast(
      wasReservedByMe
        ? `Reserva de "${item?.name}" cancelada.`
        : `🎁 "${item?.name}" reservado!`
    );
  };

  const filtered = useMemo(
    () =>
      selectedCategory === 'Todos'
        ? items
        : items.filter((i) => i.category === selectedCategory),
    [items, selectedCategory]
  );

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
      <div className="gifts-wrap">
        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '3rem' }}>
            Carregando lista...
          </p>
        ) : (
          <GiftList items={filtered} byMe={byMe} onToggle={handleToggle} />
        )}
      </div>
      {toast && <Toast key={toast} msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
