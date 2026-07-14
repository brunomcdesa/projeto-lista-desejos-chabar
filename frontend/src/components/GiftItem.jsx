import { useState } from 'react';

export default function GiftItem({ item, isMine, onToggle }) {
  const [loading, setLoading] = useState(false);

  const qty      = item.quantity ?? 1;
  const received = item.quantityReceived ?? (item.purchased ? qty : 0);
  const soldOut  = received >= qty && !isMine;
  const pct      = Math.min(1, received / qty);
  const available = Math.max(0, qty - received);
  const barColor = pct >= 1 ? 'var(--terra)' : 'var(--sage)';

  const handleClick = async () => {
    if (loading || (soldOut && !isMine)) return;
    setLoading(true);
    await onToggle(item.id);
    setLoading(false);
  };

  const availText = soldOut
    ? 'Todos reservados'
    : isMine
      ? `Você reservou · ${available} restante${available !== 1 ? 's' : ''}`
      : `${available} de ${qty} disponível${available !== 1 ? 'is' : ''}`;

  const btnLabel = isMine
    ? '✓ Vou dar este presente'
    : soldOut
      ? 'Esgotado'
      : 'Quero dar este presente';

  return (
    <div className={`gift-card${soldOut ? ' sold-out' : ''}${isMine ? ' by-me' : ''}`}>
      {soldOut && !isMine && <div className="stamp">Esgotado</div>}
      {isMine && <div className="mine-badge">✓ Meu</div>}

      <div>
        <div className="card-name">{item.name}</div>
        {item.description && <div className="card-desc" style={{ marginTop: 3 }}>{item.description}</div>}
      </div>

      {item.category && <span className="card-tag">{item.category}</span>}

      <div>
        <div className="avail-text">{availText}</div>
        <div className="progress-track">
          <div className="progress-bar-fill" style={{ width: `${pct * 100}%`, background: barColor }} />
        </div>
      </div>

      <button
        className={`card-btn${isMine ? ' active-res' : ''}`}
        onClick={handleClick}
        disabled={(soldOut && !isMine) || loading}
      >
        {loading ? '…' : btnLabel}
      </button>
    </div>
  );
}
