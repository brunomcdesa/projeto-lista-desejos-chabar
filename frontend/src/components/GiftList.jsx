import GiftItem from './GiftItem.jsx';

export default function GiftList({ items, byMe, onToggle }) {
  if (items.length === 0) {
    return (
      <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '3rem' }}>
        Nenhum item nesta categoria.
      </p>
    );
  }

  return (
    <div className="gifts-grid">
      {items.map((item) => (
        <GiftItem
          key={item.id}
          item={item}
          isMine={byMe.has(item.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
