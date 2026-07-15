import GiftItem from './GiftItem.jsx';

export default function GiftList({ items, byMe, onToggle, emptyMessage = 'Nenhum item nesta categoria.' }) {
  if (items.length === 0) {
    return (
      <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '3rem' }}>
        {emptyMessage}
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
