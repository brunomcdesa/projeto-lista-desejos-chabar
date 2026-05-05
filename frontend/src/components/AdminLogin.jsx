import { useState } from 'react';

const s = {
  overlay: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: 360,
  },
  logo: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  eyebrow: {
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '0.4rem',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.6rem',
    color: 'var(--text)',
  },
  label: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 500,
    color: 'var(--text)',
    marginBottom: '0.4rem',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
    marginBottom: '1.25rem',
  },
  btn: {
    width: '100%',
    padding: '0.75rem',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  error: {
    color: '#dc2626',
    fontSize: '0.82rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  back: {
    display: 'block',
    textAlign: 'center',
    marginTop: '1.25rem',
    fontSize: '0.82rem',
    color: 'var(--muted)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    textDecoration: 'underline',
  },
};

export default function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        sessionStorage.setItem('adminPassword', password);
        onLogin(password);
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
    } catch {
      setError('Erro ao conectar. Verifique o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        <div style={s.logo}>
          <p style={s.eyebrow}>Área Administrativa</p>
          <h1 style={s.title}>Chá Bar</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label style={s.label} htmlFor="pw">Senha</label>
          <input
            id="pw"
            type="password"
            style={s.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha de admin"
            autoFocus
          />
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        <button style={s.back} onClick={onBack}>← Voltar para a lista</button>
      </div>
    </div>
  );
}
