import { useState, useEffect } from 'react';

const CATEGORIES = ['Cozinha', 'Mesa Posta', 'Banheiro', 'Quarto', 'Lavanderia'];

const empty = {
  name: '',
  description: '',
  category: CATEGORIES[0],
  quantity: 1,
  purchaseLinks: [],
  imageUrl: '',
};

export default function ItemModal({ item, onSave, onClose, onFetchOgImage }) {
  const [form, setForm] = useState(empty);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        description: item.description || '',
        category: item.category,
        quantity: item.quantity ?? 1,
        purchaseLinks: item.purchaseLinks ? [...item.purchaseLinks] : [],
        imageUrl: item.imageUrl || '',
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

  const addLink  = () => setForm((f) => ({ ...f, purchaseLinks: [...f.purchaseLinks, ''] }));
  const removeLink = (idx) =>
    setForm((f) => ({ ...f, purchaseLinks: f.purchaseLinks.filter((_, i) => i !== idx) }));

  const handleLinkBlur = async (idx, value) => {
    if (idx !== 0 || !value.startsWith('http') || form.imageUrl) return;
    setImageLoading(true);
    const url = await onFetchOgImage?.(value);
    if (url) set('imageUrl', url);
    setImageLoading(false);
  };

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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal gold-top">
        <div className="modal-title">{isEditing ? 'Editar Presente' : 'Adicionar Presente'}</div>
        <div className="modal-sub">Preencha os dados do item abaixo.</div>

        <div className="modal-grid">
          <div>
            <label className="modal-label">Categoria *</label>
            <select
              className="modal-input"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              style={{ appearance: 'auto' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="modal-full">
            <label className="modal-label">Nome do presente *</label>
            <input
              className="modal-input"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Jogo de Panelas"
            />
          </div>
          <div className="modal-full">
            <label className="modal-label">Descrição curta</label>
            <input
              className="modal-input"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Marca, detalhes…"
            />
          </div>
          <div>
            <label className="modal-label">Quantidade desejada</label>
            <input
              className="modal-input"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => set('quantity', e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="modal-label">
            Links de compra <span style={{ color: 'var(--gray)', fontWeight: 400 }}>(opcional)</span>
          </label>
          {form.purchaseLinks.map((link, idx) => (
            <div key={idx} className="link-row" style={{ marginBottom: 8 }}>
              <input
                className="modal-input"
                value={link}
                onChange={(e) => setLink(idx, e.target.value)}
                onBlur={(e) => handleLinkBlur(idx, e.target.value)}
                placeholder="https://..."
                type="url"
              />
              <button className="btn-link-remove" onClick={() => removeLink(idx)}>✕</button>
            </div>
          ))}
          <button className="btn-link-add" onClick={addLink}>+ Adicionar link</button>
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="modal-label">
            Imagem do produto{' '}
            <span style={{ color: 'var(--gray)', fontWeight: 400 }}>(opcional — preenchida automaticamente)</span>
          </label>
          <input
            className="modal-input"
            value={form.imageUrl}
            onChange={(e) => set('imageUrl', e.target.value)}
            placeholder="https://... (deixe vazio para buscar automaticamente)"
            type="url"
          />
          {imageLoading && (
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--sage)' }}>Buscando imagem…</div>
          )}
          {form.imageUrl && !imageLoading && (
            <img
              src={form.imageUrl}
              alt="Preview"
              style={{ marginTop: 8, width: 80, height: 80, objectFit: 'cover', borderRadius: 8, display: 'block' }}
            />
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-modal-save" onClick={handleSave} disabled={!form.name.trim()}>
            {isEditing ? 'Salvar Alterações' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
