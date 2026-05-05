import GiftItem from './GiftItem.jsx';

export default function GiftList({ items, onToggle }) {
  if (items.length === 0) {
    return (
      <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '3rem' }}>
        Nenhum item nesta categoria.
      </p>
    );
  }

  return (
    <ul style={{ listStyle: 'none' }}>
      {items.map((item) => (
        <GiftItem key={item.id} item={item} onToggle={onToggle} />
      ))}
    </ul>
  );
}
