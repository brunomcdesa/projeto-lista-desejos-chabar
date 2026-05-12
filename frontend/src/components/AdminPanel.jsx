import { useState, useEffect, useMemo } from 'react';
import ItemModal from './ItemModal.jsx';

const CATEGORIES = ['Todos', 'Cozinha', 'Mesa Posta', 'Banheiro', 'Quarto', 'Lavanderia'];

const getStatus = (item) => {
  const qty = item.quantity ?? 1;
  const received = item.quantityReceived ?? 0;
  if (received >= qty) return 'completo';
  if (received > 0) return 'parcial';
  return 'disponivel';
};

export default function AdminPanel({ adminPassword, onLogout }) {
  const [activeTab, setActiveTab]       = useState('presentes');
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [guests, setGuests]             = useState([]);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [modalItem, setModalItem]       = useState(undefined);
  const [modalOpen, setModalOpen]       = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': adminPassword };

  const fetchOgImage = async (url) => {
    try {
      const res = await fetch(`/api/og-image?url=${encodeURIComponent(url)}`, { headers });
      if (!res.ok) return null;
      const data = await res.json();
      return data.imageUrl;
    } catch { return null; }
  };

  const loadItems = () => {
    setLoading(true);
    fetch('/api/items').then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  };

  const loadGuests = () => {
    setGuestsLoading(true);
    fetch('/api/rsvp', { headers: { 'x-admin-password': adminPassword } })
      .then((r) => r.json()).then(setGuests).finally(() => setGuestsLoading(false));
  };

  useEffect(() => { loadItems(); loadGuests(); }, []);

  useEffect(() => {
    const onFocus = () => { loadItems(); loadGuests(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const filtered = useMemo(
    () => selectedCategory === 'Todos' ? items : items.filter((i) => i.category === selectedCategory),
    [items, selectedCategory]
  );

  const totalItems    = items.reduce((s, i) => s + (i.quantity ?? 1), 0);
  const totalReceived = items.reduce((s, i) => s + (i.quantityReceived ?? 0), 0);
  const overallPct    = totalItems > 0 ? totalReceived / totalItems : 0;

  const openAdd  = () => { setModalItem(undefined); setModalOpen(true); };
  const openEdit = (item) => { setModalItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalItem(undefined); };

  const handleSave = async (data) => {
    if (modalItem) {
      const res = await fetch(`/api/items/${modalItem.id}`, { method: 'PUT', headers, body: JSON.stringify(data) });
      if (res.ok) { const u = await res.json(); setItems((prev) => prev.map((i) => (i.id === u.id ? u : i))); }
    } else {
      const res = await fetch('/api/items', { method: 'POST', headers, body: JSON.stringify(data) });
      if (res.ok) { const c = await res.json(); setItems((prev) => [...prev, c]); }
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const res = await fetch(`/api/items/${confirmDelete.id}`, { method: 'DELETE', headers });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const totalPessoas = guests.reduce((acc, g) => acc + 1 + (g.companions || 0), 0);
  const comMensagem  = guests.filter((g) => g.message).length;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header gold-top">
        <div>
          <div className="dash-brand">
            Chá de Casa Nova · <span>Bruno &amp; Carol</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--brown-light)', marginTop: 2 }}>Área do Organizador</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="dash-logout" onClick={() => { loadItems(); loadGuests(); }}>↺ Atualizar</button>
          <button className="dash-logout" onClick={onLogout}>Sair</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        <button className={`tab-btn${activeTab === 'presentes' ? ' active' : ''}`} onClick={() => setActiveTab('presentes')}>
          🎁 Presentes
        </button>
        <button className={`tab-btn${activeTab === 'convidados' ? ' active' : ''}`} onClick={() => setActiveTab('convidados')}>
          👥 Convidados {guests.length > 0 && `(${guests.length})`}
        </button>
      </div>

      {/* Body */}
      <div className="dash-body">
        {activeTab === 'presentes' ? (
          <>
            <div className="tab-header">
              <h2 className="tab-title">Lista de Presentes</h2>
              <span style={{ fontSize: 13, color: 'var(--brown-light)' }}>{items.length} itens cadastrados</span>
            </div>

            {/* Overall progress */}
            <div className="progress-summary">
              <div className="progress-info">
                <span className="progress-info-label">Progresso geral das reservas</span>
                <span className="progress-info-val">
                  {totalReceived} de {totalItems} reservados ({Math.round(overallPct * 100)}%)
                </span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${overallPct * 100}%` }} />
              </div>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cat-pill${selectedCategory === cat ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: '3rem' }}>Carregando...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: '2rem' }}>
                Nenhum item nesta categoria.
              </p>
            ) : (
              filtered.map((item) => {
                const st  = getStatus(item);
                const qty = item.quantity ?? 1;
                const rec = item.quantityReceived ?? 0;
                const pct = qty > 0 ? rec / qty : 0;
                const barColor =
                  st === 'completo' ? 'var(--green)' :
                  st === 'parcial'  ? 'var(--yellow)' :
                  'var(--gray-light)';
                return (
                  <div key={item.id} className="gift-item">
                    {item.imageUrl && (
                      <img className="gift-item-img" src={item.imageUrl} alt={item.name} />
                    )}
                    <div className="gift-item-info">
                      <div className="gift-item-name">{item.name}</div>
                      {item.description && <div className="gift-item-desc">{item.description}</div>}
                      <div className="gift-item-meta">
                        <span className="gift-item-cat">{item.category}</span>
                        <span className={`status-badge status-${st}`}>
                          {st === 'completo' ? '🟢 Completo' : st === 'parcial' ? '🟡 Parcial' : '⚪ Disponível'}
                        </span>
                      </div>
                    </div>
                    <div className="item-progress-wrap">
                      <div className="item-prog-label">{rec}/{qty} reservados</div>
                      <div className="item-prog-track">
                        <div className="item-prog-bar" style={{ width: `${pct * 100}%`, background: barColor }} />
                      </div>
                    </div>
                    <div className="gift-actions">
                      <button className="btn-icon edit" title="Editar" onClick={() => openEdit(item)}>✏️</button>
                      <button className="btn-icon del"  title="Excluir" onClick={() => setConfirmDelete(item)}>🗑️</button>
                    </div>
                  </div>
                );
              })
            )}

            {/* FAB */}
            <button className="fab" onClick={openAdd}>+ Adicionar Presente</button>
          </>
        ) : (
          <>
            <div className="tab-header" style={{ marginBottom: 14 }}>
              <h2 className="tab-title">Convidados</h2>
            </div>

            <div className="guests-counter">
              <div className="counter-item">
                <span className="counter-val">{guests.length}</span>
                <span className="counter-label">confirmações</span>
              </div>
              <div className="counter-item">
                <span className="counter-val">{totalPessoas}</span>
                <span className="counter-label">pessoas no total</span>
              </div>
              <div className="counter-item">
                <span className="counter-val">{comMensagem}</span>
                <span className="counter-label">com mensagem</span>
              </div>
            </div>

            {guestsLoading ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: '3rem' }}>Carregando...</p>
            ) : guests.length === 0 ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: '2rem' }}>
                Nenhuma confirmação ainda.
              </p>
            ) : (
              guests.map((guest) => (
                <div key={guest.id} className="guest-item">
                  <div className="guest-avatar">{guest.name.charAt(0).toUpperCase()}</div>
                  <div className="guest-info">
                    <div className="guest-name">{guest.name}</div>
                    {guest.compNames?.length > 0 && (
                      <div className="comp-chips">
                        <span className="comp-chips-label">com</span>
                        {guest.compNames.map((cn, i) => (
                          <span key={i} className="comp-chip">{cn}</span>
                        ))}
                      </div>
                    )}
                    {guest.message && <div className="guest-msg">"{guest.message}"</div>}
                    <div className="guest-meta">
                      <span>🕒 {new Date(guest.confirmedAt).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}</span>
                      {guest.phone && <span>📱 {guest.phone}</span>}
                    </div>
                  </div>
                  <div className="guest-badge">
                    👥 {1 + (guest.companions || 0)} {1 + (guest.companions || 0) === 1 ? 'pessoa' : 'pessoas'}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Item modal */}
      {modalOpen && (
        <ItemModal item={modalItem} onSave={handleSave} onClose={closeModal} onFetchOgImage={fetchOgImage} />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="modal confirm-modal gold-top">
            <div className="confirm-icon">🗑️</div>
            <div className="modal-title" style={{ marginBottom: 8 }}>Excluir presente?</div>
            <div className="confirm-text">
              Isso vai remover <strong>"{confirmDelete.name}"</strong> da lista permanentemente.
              Esta ação não pode ser desfeita.
            </div>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-del-confirm" onClick={handleDelete}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
