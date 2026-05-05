import { useState } from 'react';

const styles = {
  li: (full) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 0',
    borderBottom: '1px solid var(--border)',
    background: full ? 'var(--purchased-bg)' : 'transparent',
    borderRadius: full ? 8 : 0,
    paddingLeft: full ? '0.75rem' : 0,
    paddingRight: full ? '0.75rem' : 0,
    transition: 'all 0.2s ease',
    marginBottom: full ? '0.25rem' : 0,
  }),
  emoji: {
    fontSize: '1.6rem',
    flexShrink: 0,
    width: 36,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: (full) => ({
    fontSize: '0.95rem',
    fontWeight: 500,
    color: full ? 'var(--purchased-text)' : 'var(--text)',
    textDecoration: full ? 'line-through' : 'none',
    marginBottom: '0.15rem',
  }),
  desc: {
    fontSize: '0.8rem',
    color: 'var(--muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  partial: {
    fontSize: '0.75rem',
    color: 'var(--accent)',
    fontWeight: 500,
    marginTop: '0.2rem',
  },
  linksRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginTop: '0.4rem',
  },
  linkBtn: {
    fontSize: '0.75rem',
    color: 'var(--accent)',
    background: 'var(--accent-light)',
    border: 'none',
    borderRadius: 4,
    padding: '0.2rem 0.55rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: 'var(--font-sans)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--purchased-text)',
    background: 'transparent',
    border: 'none',
    padding: 0,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  btnReserve: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--accent)',
    background: 'transparent',
    border: '1px solid var(--accent)',
    borderRadius: 6,
    padding: '0.35rem 0.85rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
};

export default function GiftItem({ item, onToggle }) {
  const [loading, setLoading] = useState(false);

  const qty = item.quantity ?? 1;
  const received = item.quantityReceived ?? (item.purchased ? qty : 0);
  const isFull = received >= qty;
  const hasPartial = received > 0 && !isFull;

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    await onToggle(item.id);
    setLoading(false);
  };

  return (
    <li style={styles.li(isFull)}>
      <span style={styles.emoji}>{item.emoji}</span>
      <div style={styles.info}>
        <p style={styles.name(isFull)}>{item.name}</p>
        {item.description && <p style={styles.desc}>{item.description}</p>}
        {hasPartial && qty > 1 && (
          <p style={styles.partial}>{received} de {qty} já reservados — ainda disponível!</p>
        )}
        {!isFull && item.purchaseLinks?.length > 0 && (
          <div style={styles.linksRow}>
            {item.purchaseLinks.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.linkBtn}
              >
                🛒 Ver onde comprar{item.purchaseLinks.length > 1 ? ` (opção ${i + 1})` : ''}
              </a>
            ))}
          </div>
        )}
      </div>
      {isFull ? (
        <button
          style={styles.badge}
          onClick={handleClick}
          title="Clique para desmarcar"
          disabled={loading}
        >
          ✓ Reservado
        </button>
      ) : (
        <button
          style={styles.btnReserve}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? '...' : 'Quero dar'}
        </button>
      )}
    </li>
  );
}
