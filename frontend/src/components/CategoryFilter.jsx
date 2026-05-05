const styles = {
  wrapper: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    padding: '1.75rem 0 1.25rem',
    borderBottom: '1px solid var(--border)',
    marginBottom: '0.25rem',
  },
  btn: (active) => ({
    padding: '0.4rem 1rem',
    fontSize: '0.82rem',
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--accent)' : 'var(--muted)',
    background: active ? 'var(--accent-light)' : 'transparent',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 99,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    letterSpacing: '0.02em',
  }),
};

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <nav style={styles.wrapper} aria-label="Filtrar por categoria">
      {categories.map((cat) => (
        <button
          key={cat}
          style={styles.btn(selected === cat)}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
