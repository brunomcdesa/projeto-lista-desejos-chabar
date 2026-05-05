import { useState, useEffect, useMemo } from 'react';
import Hero from './components/Hero.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import GiftList from './components/GiftList.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import RsvpScreen from './components/RsvpScreen.jsx';

const CATEGORIES = ['Todos', 'Cozinha', 'Mesa Posta', 'Banheiro', 'Quarto', 'Lavanderia'];

function useAdminMode() {
  const isAdminRoute = window.location.search.includes('admin');
  const [adminPassword, setAdminPassword] = useState(() => {
    if (!isAdminRoute) return null;
    return sessionStorage.getItem('adminPassword') || null;
  });

  const login = (pw) => setAdminPassword(pw);
  const logout = () => {
    sessionStorage.removeItem('adminPassword');
    setAdminPassword(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  return { isAdminRoute, adminPassword, login, logout };
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
  const { isAdminRoute, adminPassword, login, logout } = useAdminMode();

  const [view, setView] = useState(() => (getStoredRsvp() ? 'gifts' : 'rsvp'));
  const [guestName, setGuestName] = useState(() => getStoredRsvp()?.name || '');

  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

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
    const res = await fetch(`/api/items/${id}/toggle`, { method: 'PATCH' });
    if (!res.ok) return;
    const updated = await res.json();
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
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
      <AdminLogin
        onLogin={login}
        onBack={() => window.history.replaceState({}, '', window.location.pathname)}
      />
    );
  }

  if (isAdminRoute && adminPassword) {
    return <AdminPanel adminPassword={adminPassword} onLogout={logout} />;
  }

  if (view === 'rsvp') {
    return <RsvpScreen onConfirmed={handleConfirmed} />;
  }

  return (
    <>
      <Hero total={totalQuantity} purchased={totalReceived} guestName={guestName} />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.25rem 4rem' }}>
        <CategoryFilter
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '3rem' }}>
            Carregando lista...
          </p>
        ) : (
          <GiftList items={filtered} onToggle={handleToggle} />
        )}
      </main>
    </>
  );
}
