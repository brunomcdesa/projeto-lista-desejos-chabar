import { useState, useEffect, useMemo } from 'react';
import ItemModal from './ItemModal.jsx';

const CATEGORIES = ['Todos', 'Cozinha', 'Mesa Posta', 'Banheiro', 'Quarto', 'Lavanderia'];

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  topbar: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  eyebrow: {
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '0.1rem',
  },
  topTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.15rem',
    color: 'var(--text)',
  },
  topbarRight: { display: 'flex', gap: '0.65rem', alignItems: 'center' },
  btnLogout: {
    padding: '0.5rem 1rem',
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.82rem',
    color: 'var(--muted)',
    cursor: 'pointer',
  },
  btnAdd: {
    padding: '0.5rem 1.1rem',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
  },
  main: { maxWidth: 900, margin: '0 auto', padding: '2rem 1.25rem 4rem' },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1rem 1.25rem',
    textAlign: 'center',
  },
  statNum: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2rem',
    color: 'var(--accent)',
    lineHeight: 1,
    marginBottom: '0.25rem',
  },
  statLabel: { fontSize: '0.78rem', color: 'var(--muted)' },
  filterRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
  },
  filterBtn: (active) => ({
    padding: '0.4rem 1rem',
    borderRadius: 99,
    fontSize: '0.82rem',
    fontWeight: active ? 600 : 400,
    background: active ? 'var(--accent)' : 'var(--surface)',
    color: active ? '#fff' : 'var(--muted)',
    border: active ? 'none' : '1px solid var(--border)',
    cursor: 'pointer',
  }),
  table: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  thead: {
    background: 'var(--bg)',
    borderBottom: '1px solid var(--border)',
  },
  th: {
    padding: '0.75rem 1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--muted)',
    textAlign: 'left',
  },
  tr: (even) => ({
    borderBottom: '1px solid var(--border)',
    background: even ? 'var(--bg)' : 'var(--surface)',
  }),
  td: {
    padding: '0.85rem 1rem',
    fontSize: '0.9rem',
    color: 'var(--text)',
    verticalAlign: 'middle',
  },
  tdMuted: {
    padding: '0.85rem 1rem',
    fontSize: '0.82rem',
    color: 'var(--muted)',
    verticalAlign: 'middle',
  },
  emoji: { fontSize: '1.4rem', lineHeight: 1 },
  statusFull: {
    display: 'inline-block',
    background: '#D1FAE5',
    color: '#065F46',
    borderRadius: 99,
    padding: '0.15rem 0.6rem',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  statusPartial: {
    display: 'inline-block',
    background: '#FEF3C7',
    color: '#92400E',
    borderRadius: 99,
    padding: '0.15rem 0.6rem',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  statusNone: {
    display: 'inline-block',
    background: 'var(--bg)',
    color: 'var(--muted)',
    borderRadius: 99,
    padding: '0.15rem 0.6rem',
    fontSize: '0.75rem',
    border: '1px solid var(--border)',
  },
  actionsCell: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  btnEdit: {
    padding: '0.4rem 0.85rem',
    background: 'var(--accent-light)',
    border: '1px solid var(--accent)',
    borderRadius: 6,
    fontSize: '0.8rem',
    color: 'var(--accent)',
    cursor: 'pointer',
    fontWeight: 500,
  },
  btnDelete: {
    padding: '0.4rem 0.85rem',
    background: 'none',
    border: '1px solid #fca5a5',
    borderRadius: 6,
    fontSize: '0.8rem',
    color: '#dc2626',
    cursor: 'pointer',
  },
  empty: {
    padding: '3rem',
    textAlign: 'center',
    color: 'var(--muted)',
    fontSize: '0.9rem',
  },
  linksBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.78rem',
    color: 'var(--accent)',
    background: 'var(--accent-light)',
    borderRadius: 99,
    padding: '0.15rem 0.55rem',
    fontWeight: 500,
  },
  noLinks: {
    fontSize: '0.78rem',
    color: 'var(--muted)',
  },
  confirmOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    padding: '1rem',
  },
  confirmBox: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '2rem',
    maxWidth: 360,
    width: '100%',
    textAlign: 'center',
  },
  confirmTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
    color: 'var(--text)',
    marginBottom: '0.75rem',
  },
  confirmText: {
    fontSize: '0.88rem',
    color: 'var(--muted)',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  confirmActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  tabsRow: {
    display: 'flex',
    gap: '0.25rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid var(--border)',
    paddingBottom: '0',
  },
  tabBtn: (active) => ({
    padding: '0.6rem 1.25rem',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    marginBottom: '-2px',
    fontSize: '0.9rem',
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--accent)' : 'var(--muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  }),
  guestTable: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  guestTh: {
    padding: '0.75rem 1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--muted)',
    textAlign: 'left',
  },
  guestTd: {
    padding: '0.85rem 1rem',
    fontSize: '0.9rem',
    color: 'var(--text)',
    verticalAlign: 'middle',
  },
  guestTdMuted: {
    padding: '0.85rem 1rem',
    fontSize: '0.82rem',
    color: 'var(--muted)',
    verticalAlign: 'middle',
  },
  messageBadge: {
    display: 'inline-block',
    maxWidth: 220,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '0.82rem',
    color: 'var(--muted)',
    fontStyle: 'italic',
  },
  btnConfirmCancel: {
    padding: '0.6rem 1.25rem',
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.9rem',
    color: 'var(--muted)',
    cursor: 'pointer',
  },
  btnConfirmDelete: {
    padding: '0.6rem 1.25rem',
    background: '#dc2626',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
  },
};

export default function AdminPanel({ adminPassword, onLogout }) {
  const [activeTab, setActiveTab] = useState('presentes');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState([]);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [modalItem, setModalItem] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const headers = {
    'Content-Type': 'application/json',
    'x-admin-password': adminPassword,
  };

  const loadItems = () => {
    setLoading(true);
    fetch('/api/items')
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  };

  const loadGuests = () => {
    setGuestsLoading(true);
    fetch('/api/rsvp', { headers: { 'x-admin-password': adminPassword } })
      .then((r) => r.json())
      .then(setGuests)
      .finally(() => setGuestsLoading(false));
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

  const totalPurchased = items.filter((i) => (i.quantityReceived ?? 0) >= (i.quantity ?? 1)).length;
  const totalPartial = items.filter((i) => {
    const r = i.quantityReceived ?? 0;
    return r > 0 && r < (i.quantity ?? 1);
  }).length;
  const totalLinks = items.reduce((acc, i) => acc + (i.purchaseLinks?.length || 0), 0);

  const openAdd = () => { setModalItem(undefined); setModalOpen(true); };
  const openEdit = (item) => { setModalItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalItem(undefined); };

  const handleSave = async (data) => {
    if (modalItem) {
      const res = await fetch(`/api/items/${modalItem.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      }
    } else {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        setItems((prev) => [...prev, created]);
      }
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const res = await fetch(`/api/items/${confirmDelete.id}`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== confirmDelete.id));
    }
    setConfirmDelete(null);
  };

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={s.topbarLeft}>
          <div>
            <p style={s.eyebrow}>Área Administrativa</p>
            <p style={s.topTitle}>Chá Bar · Bruno &amp; Carol</p>
          </div>
        </div>
        <div style={s.topbarRight}>
          <button style={s.btnAdd} onClick={openAdd}>+ Novo item</button>
          <button style={s.btnLogout} onClick={() => { loadItems(); loadGuests(); }}>↺ Atualizar</button>
          <button style={s.btnLogout} onClick={onLogout}>Sair</button>
        </div>
      </div>

      <main style={s.main}>
        {activeTab === 'presentes' ? (
          <>
            <div style={s.statsRow}>
              <div style={s.statCard}>
                <p style={s.statNum}>{items.length}</p>
                <p style={s.statLabel}>Total de itens</p>
              </div>
              <div style={s.statCard}>
                <p style={s.statNum}>{totalPurchased}</p>
                <p style={s.statLabel}>Totalmente reservados</p>
              </div>
              <div style={s.statCard}>
                <p style={s.statNum}>{totalPartial}</p>
                <p style={s.statLabel}>Parcialmente reservados</p>
              </div>
              <div style={s.statCard}>
                <p style={s.statNum}>{totalLinks}</p>
                <p style={s.statLabel}>Links cadastrados</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {(() => {
              const totalPessoas = guests.reduce((acc, g) => acc + 1 + (g.companions || 0), 0);
              const comMensagem = guests.filter((g) => g.message).length;
              return (
                <div style={s.statsRow}>
                  <div style={s.statCard}>
                    <p style={s.statNum}>{guests.length}</p>
                    <p style={s.statLabel}>Confirmações</p>
                  </div>
                  <div style={s.statCard}>
                    <p style={s.statNum}>{totalPessoas}</p>
                    <p style={s.statLabel}>Total de pessoas</p>
                  </div>
                  <div style={s.statCard}>
                    <p style={s.statNum}>{comMensagem}</p>
                    <p style={s.statLabel}>Com mensagem</p>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        <div style={s.tabsRow}>
          <button style={s.tabBtn(activeTab === 'presentes')} onClick={() => setActiveTab('presentes')}>
            Presentes
          </button>
          <button style={s.tabBtn(activeTab === 'convidados')} onClick={() => setActiveTab('convidados')}>
            Convidados {guests.length > 0 && `(${guests.length})`}
          </button>
        </div>

        {activeTab === 'presentes' ? (
          <>
            <div style={s.filterRow}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  style={s.filterBtn(selectedCategory === cat)}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: '3rem' }}>
                Carregando...
              </p>
            ) : (
              <div style={s.table}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={s.thead}>
                    <tr>
                      <th style={s.th}>Item</th>
                      <th style={s.th}>Categoria</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Qtd.</th>
                      <th style={s.th}>Status</th>
                      <th style={s.th}>Links</th>
                      <th style={s.th}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={s.empty}>Nenhum item nesta categoria.</td>
                      </tr>
                    ) : (
                      filtered.map((item, idx) => (
                        <tr key={item.id} style={s.tr(idx % 2 === 1)}>
                          <td style={s.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={s.emoji}>{item.emoji}</span>
                              <div>
                                <p style={{ fontWeight: 500, marginBottom: '0.1rem' }}>{item.name}</p>
                                {item.description && (
                                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={s.tdMuted}>{item.category}</td>
                          <td style={{ ...s.td, textAlign: 'center', fontWeight: 600 }}>
                            {item.quantity ?? 1}
                          </td>
                          <td style={s.td}>
                            {(() => {
                              const qty = item.quantity ?? 1;
                              const received = item.quantityReceived ?? 0;
                              if (received >= qty) return <span style={s.statusFull}>✓ Reservado</span>;
                              if (received > 0) return <span style={s.statusPartial}>{received}/{qty} reservados</span>;
                              return <span style={s.statusNone}>Disponível</span>;
                            })()}
                          </td>
                          <td style={s.td}>
                            {item.purchaseLinks?.length > 0 ? (
                              <span style={s.linksBadge}>
                                🔗 {item.purchaseLinks.length}
                              </span>
                            ) : (
                              <span style={s.noLinks}>—</span>
                            )}
                          </td>
                          <td style={s.td}>
                            <div style={s.actionsCell}>
                              <button style={s.btnEdit} onClick={() => openEdit(item)}>
                                Editar
                              </button>
                              <button style={s.btnDelete} onClick={() => setConfirmDelete(item)}>
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            {guestsLoading ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: '3rem' }}>
                Carregando...
              </p>
            ) : (
              <div style={s.guestTable}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={s.thead}>
                    <tr>
                      <th style={s.guestTh}>Nome</th>
                      <th style={s.guestTh}>WhatsApp</th>
                      <th style={{ ...s.guestTh, textAlign: 'center' }}>Acomp.</th>
                      <th style={s.guestTh}>Mensagem</th>
                      <th style={s.guestTh}>Confirmado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={s.empty}>Nenhuma confirmação ainda.</td>
                      </tr>
                    ) : (
                      guests.map((guest, idx) => (
                        <tr key={guest.id} style={s.tr(idx % 2 === 1)}>
                          <td style={{ ...s.guestTd, fontWeight: 500 }}>{guest.name}</td>
                          <td style={s.guestTdMuted}>{guest.phone || '—'}</td>
                          <td style={{ ...s.guestTd, textAlign: 'center' }}>
                            {guest.companions > 0 ? `+${guest.companions}` : '—'}
                          </td>
                          <td style={s.guestTd}>
                            {guest.message ? (
                              <span style={s.messageBadge} title={guest.message}>
                                "{guest.message}"
                              </span>
                            ) : (
                              <span style={s.noLinks}>—</span>
                            )}
                          </td>
                          <td style={s.guestTdMuted}>
                            {new Date(guest.confirmedAt).toLocaleString('pt-BR', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {modalOpen && (
        <ItemModal
          item={modalItem}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {confirmDelete && (
        <div style={s.confirmOverlay}>
          <div style={s.confirmBox}>
            <p style={s.confirmTitle}>Excluir item?</p>
            <p style={s.confirmText}>
              Tem certeza que deseja excluir <strong>{confirmDelete.name}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div style={s.confirmActions}>
              <button style={s.btnConfirmCancel} onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
              <button style={s.btnConfirmDelete} onClick={handleDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
