import ProgressBar from './ProgressBar.jsx';

// Edite aqui os dados do evento
const NOME1 = 'Bruno';
const NOME2 = 'Carol';
const DATA_EVENTO = 'DD de Mês de AAAA';
const MENSAGEM = 'Escolha um presente para nos ajudar a montar nosso lar. Obrigado por fazer parte desta data tão especial!';

const styles = {
  hero: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '3rem 1.25rem 2rem',
    textAlign: 'center',
  },
  eyebrow: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '0.75rem',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    fontWeight: 500,
    color: 'var(--text)',
    lineHeight: 1.15,
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--muted)',
    marginBottom: '1.25rem',
    letterSpacing: '0.05em',
  },
  message: {
    maxWidth: 480,
    margin: '0 auto 2rem',
    fontSize: '0.95rem',
    color: 'var(--muted)',
    lineHeight: 1.7,
  },
};

export default function Hero({ total, purchased, guestName }) {
  return (
    <header style={styles.hero}>
      <p style={styles.eyebrow}>Chá Bar · Lista de Presentes</p>
      <h1 style={styles.title}>
        {NOME1} &amp; {NOME2}
      </h1>
      <p style={styles.subtitle}>{DATA_EVENTO}</p>
      {guestName && (
        <p style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '0.75rem', fontWeight: 500 }}>
          Olá, {guestName}! 👋
        </p>
      )}
      <p style={styles.message}>{MENSAGEM}</p>
      <ProgressBar total={total} purchased={purchased} />
    </header>
  );
}
