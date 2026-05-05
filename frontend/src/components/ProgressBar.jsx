const styles = {
  wrapper: {
    maxWidth: 400,
    margin: '0 auto',
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--muted)',
    marginBottom: '0.5rem',
  },
  track: {
    height: 6,
    background: 'var(--border)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: 'var(--accent)',
    borderRadius: 99,
    transition: 'width 0.4s ease',
  }),
};

export default function ProgressBar({ total, purchased }) {
  const pct = total === 0 ? 0 : Math.round((purchased / total) * 100);
  return (
    <div style={styles.wrapper}>
      <div style={styles.label}>
        <span>{purchased} de {total} unidades reservadas</span>
        <span>{pct}%</span>
      </div>
      <div style={styles.track}>
        <div style={styles.fill(pct)} />
      </div>
    </div>
  );
}
