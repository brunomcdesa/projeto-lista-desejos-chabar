import { useState, useEffect } from 'react';

const CATEGORIES = ['Cozinha', 'Mesa Posta', 'Banheiro', 'Quarto', 'Lavanderia'];

const empty = {
  name: '',
  description: '',
  category: CATEGORIES[0],
  quantity: 1,
};

export default function ItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        description: item.description || '',
        category: item.category,
        quantity: item.quantity ?? 1,
      });
    } else {
      setForm(empty);
    }
  }, [item]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.category) return;
    onSave({
      ...form,
      name: form.name.trim(),
      quantity: Number(form.quantity) || 1,
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
