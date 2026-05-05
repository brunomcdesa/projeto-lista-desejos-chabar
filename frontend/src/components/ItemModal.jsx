import { useState, useEffect } from 'react';

const CATEGORIES = ['Cozinha', 'Mesa Posta', 'Banheiro', 'Quarto', 'Lavanderia'];

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 1000,
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '2rem',
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.75rem',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.3rem',
    color: 'var(--text)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.4rem',
    color: 'var(--muted)',
    cursor: 'pointer',
    lineHeight: 1,
    padding: '0.25rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  group: {
    marginBottom: '1.1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.35rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.92rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.92rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
    appearance: 'none',
  },
  linkRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    alignItems: 'center',
  },
  linkInput: {
    flex: 1,
    padding: '0.55rem 0.75rem',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.88rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
  },
  removeLink: {
    background: 'none',
    border: '1px solid #fca5a5',
    borderRadius: 6,
    color: '#dc2626',
    fontSize: '0.8rem',
    padding: '0.35rem 0.6rem',
    cursor: 'pointer',
    flexShrink: 0,
  },
  addLink: {
    background: 'none',
    border: '1px dashed var(--border)',
    borderRadius: 8,
    color: 'var(--muted)',
    fontSize: '0.85rem',
    padding: '0.5rem 0.9rem',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    marginTop: '0.25rem',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '1.5rem 0',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  btnCancel: {
    padding: '0.65rem 1.25rem',
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.9rem',
    color: 'var(--muted)',
    cursor: 'pointer',
  },
  btnSave: {
    padding: '0.65rem 1.5rem',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
  },
};

const empty = {
  name: '',
  emoji: '🎁',
  description: '',
  category: CATEGORIES[0],
  quantity: 1,
  purchaseLinks: [],
};

export default function ItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        emoji: item.emoji || '🎁',
        description: item.description || '',
        category: item.category,
        quantity: item.quantity ?? 1,
        purchaseLinks: item.purchaseLinks ? [...item.purchaseLinks] : [],
      });
    } else {
      setForm(empty);
    }
  }, [item]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const setLink = (idx, value) =>
    setForm((f) => {
      const links = [...f.purchaseLinks];
      links[idx] = value;
      return { ...f, purchaseLinks: links };
    });

  const addLink = () => setForm((f) => ({ ...f, purchaseLinks: [...f.purchaseLinks, ''] }));

  const removeLink = (idx) =>
    setForm((f) => ({
      ...f,
      purchaseLinks: f.purchaseLinks.filter((_, i) => i !== idx),
    }));

  const handleSave = () => {
    if (!form.name.trim() || !form.category) return;
    onSave({
      ...form,
      name: form.name.trim(),
      quantity: Number(form.quantity) || 1,
      purchaseLinks: form.purchaseLinks.map((l) => l.trim()).filter(Boolean),
    });
  };

  const isEditing = Boolean(item);

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <h2 style={s.title}>{isEditing ? 'Editar Item' : 'Novo Item'}</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.row}>
          <div style={{ ...s.group, gridColumn: '1 / -1' }}>
            <label style={s.label}>Nome *</label>
            <input
              style={s.input}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Jogo de Panelas"
            />
          </div>
        </div>

        <div style={s.row}>
          <div style={s.group}>
            <label style={s.label}>Emoji</label>
            <input
              style={s.input}
              value={form.emoji}
              onChange={(e) => set('emoji', e.target.value)}
              placeholder="🎁"
              maxLength={4}
            />
          </div>
          <div style={s.group}>
            <label style={s.label}>Quantidade desejada</label>
            <input
              style={s.input}
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => set('quantity', e.target.value)}
            />
          </div>
        </div>

        <div style={s.group}>
          <label style={s.label}>Categoria *</label>
          <select
            style={s.select}
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={s.group}>
          <label style={s.label}>Descrição</label>
          <input
            style={s.input}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Ex: Kit com 5 a 7 peças"
          />
        </div>

        <hr style={s.divider} />

        <div style={s.group}>
          <label style={s.label}>Links de compra</label>
          {form.purchaseLinks.map((link, idx) => (
            <div key={idx} style={s.linkRow}>
              <input
                style={s.linkInput}
                value={link}
                onChange={(e) => setLink(idx, e.target.value)}
                placeholder="https://..."
                type="url"
              />
              <button style={s.removeLink} onClick={() => removeLink(idx)}>
                Remover
              </button>
            </div>
          ))}
          <button style={s.addLink} onClick={addLink}>+ Adicionar link</button>
        </div>

        <div style={s.actions}>
          <button style={s.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={s.btnSave} onClick={handleSave} disabled={!form.name.trim()}>
            {isEditing ? 'Salvar alterações' : 'Criar item'}
          </button>
        </div>
      </div>
    </div>
  );
}
